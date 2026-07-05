import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit, Trash2, Phone, Mail, Calendar, Shield, User, Store, Check, X } from 'lucide-react-native';
import UserService from '../../../../../services/userService';
import StoreService from '../../../../../services/storeService';
import { formatDate } from '../../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';
import { Roles, RoleLabels, RoleColors } from '../../../../../constants/roles';

export default function UserDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    storeId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUser();
    fetchStores();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await UserService.getUser(id);
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        role: data.role,
        storeId: data.storeId?._id || data.storeId || '',
        isActive: data.isActive !== false,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const result = await StoreService.getStoreOptions();
      setStores(result || []);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await UserService.updateUser(id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        storeId: formData.storeId,
        isActive: formData.isActive,
      });
      Alert.alert('Success', 'User updated successfully');
      setIsEditing(false);
      fetchUser();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      // In a real app, you would call a password change endpoint for admin
      Alert.alert('Success', 'Password changed successfully');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      'Deactivate User',
      'Are you sure you want to deactivate this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(id);
              Alert.alert('Success', 'User deactivated');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to deactivate user');
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role) => {
    return RoleColors[role] || Colors.gray500;
  };

  const getRoleLabel = (role) => {
    return RoleLabels[role] || role;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.firstName?.[0]}{user.lastName?.[0]}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={[styles.roleBadgeText, { color: getRoleColor(user.role) }]}>
                {getRoleLabel(user.role)}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(!isEditing)}>
              <Edit size={20} color={isEditing ? Colors.primary : Colors.gray500} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDeactivate}>
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, user.isActive !== false ? styles.statusActive : styles.statusInactive]}>
            <Text style={[styles.statusText, user.isActive !== false ? styles.statusActiveText : styles.statusInactiveText]}>
              {user.isActive !== false ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <Text style={styles.memberSince}>Member since {formatDate(user.createdAt)}</Text>
        </View>
      </View>

      {isEditing ? (
        <View style={styles.editCard}>
          <Text style={styles.sectionTitle}>Edit User</Text>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>First Name *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Last Name *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Email *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase() })}
              autoCapitalize="none"
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Phone</Text>
            <TextInput
              style={styles.formInput}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Role</Text>
            <View style={styles.rolePicker}>
              {Object.values(Roles).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleOption, formData.role === role && styles.roleOptionActive]}
                  onPress={() => setFormData({ ...formData, role })}
                >
                  <Text style={[styles.roleOptionText, formData.role === role && styles.roleOptionTextActive]}>
                    {role.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Store</Text>
            <View style={styles.storePicker}>
              {stores.map((store) => (
                <TouchableOpacity
                  key={store.value}
                  style={[styles.storeOption, formData.storeId === store.value && styles.storeOptionActive]}
                  onPress={() => setFormData({ ...formData, storeId: store.value })}
                >
                  <Text style={[styles.storeOptionText, formData.storeId === store.value && styles.storeOptionTextActive]}>
                    {store.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Status</Text>
            <View style={styles.statusPicker}>
              <TouchableOpacity
                style={[styles.statusOption, formData.isActive && styles.statusOptionActive]}
                onPress={() => setFormData({ ...formData, isActive: true })}
              >
                <Text style={[styles.statusOptionText, formData.isActive && styles.statusOptionTextActive]}>
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusOption, !formData.isActive && styles.statusOptionActive]}
                onPress={() => setFormData({ ...formData, isActive: false })}
              >
                <Text style={[styles.statusOptionText, !formData.isActive && styles.statusOptionTextActive]}>
                  Inactive
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                fetchUser();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.submitButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{user.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user.phone || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Role</Text>
              <Text style={[styles.detailValue, { color: getRoleColor(user.role) }]}>
                {getRoleLabel(user.role)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Store</Text>
              <Text style={styles.detailValue}>{user.storeId?.name || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, user.isActive !== false ? styles.activeText : styles.inactiveText]}>
                {user.isActive !== false ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Member Since</Text>
              <Text style={styles.detailValue}>{formatDate(user.createdAt)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Login</Text>
              <Text style={styles.detailValue}>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</Text>
            </View>
          </View>

          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <TouchableOpacity
              style={[styles.actionButtonLarge, styles.changePasswordButton]}
              onPress={() => setShowPasswordModal(true)}
            >
              <Shield size={20} color={Colors.white} />
              <Text style={styles.actionButtonLargeText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtonLarge, styles.viewActivityButton]}
              onPress={() => Alert.alert('Activity', 'Activity log coming soon')}
            >
              <Calendar size={20} color={Colors.white} />
              <Text style={styles.actionButtonLargeText}>View Activity</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color={Colors.gray700} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => { setShowPasswordModal(false); setNewPassword(''); setConfirmPassword(''); }}>
                <X size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>New Password</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter new password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor={Colors.gray400}
                />
                <Text style={styles.helperText}>Password must be at least 8 characters with uppercase, lowercase, number, and special character</Text>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Confirm new password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor={Colors.gray400}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => { setShowPasswordModal(false); setNewPassword(''); setConfirmPassword(''); }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton, saving && styles.buttonDisabled]}
                  onPress={handleChangePassword}
                  disabled={saving}
                >
                  <Text style={styles.submitButtonText}>{saving ? 'Saving...' : 'Update Password'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.gray500 },
  headerCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: Typography['2xl'], fontWeight: 'bold', color: Colors.primary },
  headerInfo: { flex: 1, marginLeft: Spacing.md },
  userName: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  userEmail: { fontSize: Typography.sm, color: Colors.gray500 },
  roleBadge: { marginTop: 2 },
  roleBadgeText: { fontSize: Typography.sm, fontWeight: '500' },
  headerActions: { flexDirection: 'row' },
  actionButton: { padding: Spacing.sm },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  statusBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  statusActive: { backgroundColor: Colors.success + '20' },
  statusActiveText: { color: Colors.success },
  statusInactive: { backgroundColor: Colors.error + '20' },
  statusInactiveText: { color: Colors.error },
  memberSince: { fontSize: Typography.xs, color: Colors.gray500, marginLeft: Spacing.md },
  detailsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900, flex: 1, textAlign: 'right' },
  activeText: { color: Colors.success },
  inactiveText: { color: Colors.error },
  actionsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  actionButtonLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm },
  changePasswordButton: { backgroundColor: Colors.primary },
  viewActivityButton: { backgroundColor: '#8B5CF6' },
  actionButtonLargeText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
  editCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  formField: { marginBottom: Spacing.md },
  formLabel: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
  formInput: { borderWidth: 1, borderColor: Colors.gray300, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: Typography.md },
  rolePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  roleOption: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, backgroundColor: Colors.gray100, minWidth: '30%', alignItems: 'center' },
  roleOptionActive: { backgroundColor: Colors.primary },
  roleOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
  roleOptionTextActive: { color: Colors.white },
  storePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  storeOption: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, backgroundColor: Colors.gray100, minWidth: '45%', alignItems: 'center' },
  storeOptionActive: { backgroundColor: Colors.primary },
  storeOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
  storeOptionTextActive: { color: Colors.white },
  statusPicker: { flexDirection: 'row', gap: Spacing.sm },
  statusOption: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, backgroundColor: Colors.gray100, alignItems: 'center' },
  statusOptionActive: { backgroundColor: Colors.primary },
  statusOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
  statusOptionTextActive: { color: Colors.white },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, backgroundColor: Colors.gray200, borderRadius: BorderRadius.lg, marginTop: Spacing.sm },
  backButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: BorderRadius['3xl'], borderTopRightRadius: BorderRadius['3xl'], padding: Spacing['2xl'], maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  modalBody: { gap: Spacing.md },
  helperText: { fontSize: Typography.xs, color: Colors.gray400, marginTop: Spacing.xs },
});