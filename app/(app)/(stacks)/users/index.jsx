import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, Edit, Trash2, Phone, UserPlus, X, Mail } from 'lucide-react-native';
import UserService from '../../../../services/userService';
import StoreService from '../../../../services/storeService';
import { formatDate } from '../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';
import { Roles } from '../../../../constants/roles';

export default function StaffManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [staff, setStaff] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: Roles.SALES_ATTENDANT,
    storeId: '',
  });

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      const [usersResult, storesResult] = await Promise.all([
        UserService.getUsers({ search: searchTerm }),
        StoreService.getStoreOptions(),
      ]);
      setStaff(usersResult.users || []);
      setStores(storesResult || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.storeId && stores.length > 1) {
      Alert.alert('Error', 'Please select a store for this user');
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        await UserService.updateUser(editingUser._id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
          storeId: formData.storeId,
        });
        Alert.alert('Success', 'Staff updated successfully');
      } else {
        if (!formData.password) {
          Alert.alert('Error', 'Password is required for new users');
          setSubmitting(false);
          return;
        }
        await UserService.createUser(formData);
        Alert.alert('Success', 'Staff created successfully');
      }
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      fetchData();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save staff');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: Roles.SALES_ATTENDANT,
      storeId: stores.length > 0 ? stores[0].value : '',
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.role,
      storeId: user.storeId?._id || user.storeId || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Deactivate Staff',
      'Are you sure you want to deactivate this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(id);
              Alert.alert('Success', 'Staff deactivated');
              fetchData();
            } catch (error) {
              Alert.alert('Error', 'Failed to deactivate staff');
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role) => {
    const colors = {
      SUPER_ADMIN: styles.roleSuperAdmin,
      ADMIN: styles.roleAdmin,
      SALES_MANAGER: styles.roleSalesManager,
      SALES_ATTENDANT: styles.roleSalesAttendant,
      FINANCE_MANAGER: styles.roleFinanceManager,
      FINANCE_CASHIER: styles.roleFinanceCashier,
      WAREHOUSE_MANAGER: styles.roleWarehouseManager,
      WAREHOUSE_STAFF: styles.roleWarehouseStaff,
    };
    return colors[role] || styles.roleDefault;
  };

  const getRoleTextColor = (role) => {
    const colors = {
      SUPER_ADMIN: styles.roleSuperAdminText,
      ADMIN: styles.roleAdminText,
      SALES_MANAGER: styles.roleSalesManagerText,
      SALES_ATTENDANT: styles.roleSalesAttendantText,
      FINANCE_MANAGER: styles.roleFinanceManagerText,
      FINANCE_CASHIER: styles.roleFinanceCashierText,
      WAREHOUSE_MANAGER: styles.roleWarehouseManagerText,
      WAREHOUSE_STAFF: styles.roleWarehouseStaffText,
    };
    return colors[role] || styles.roleDefaultText;
  };

  const renderStaff = ({ item }) => {
    const roleStyle = getRoleColor(item.role);
    const roleTextStyle = getRoleTextColor(item.role);
    const isActive = item.isActive !== false;

    return (
      <TouchableOpacity style={styles.staffItem} onPress={() => router.push(`/users/${item._id}`)}>
        <View style={styles.staffItemRow}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.firstName?.[0]}{item.lastName?.[0]}</Text>
          </View>
          <View style={styles.staffItemInfo}>
            <Text style={styles.staffItemName}>{item.firstName} {item.lastName}</Text>
            <View style={styles.staffItemDetails}>
              <Mail size={14} color={Colors.gray400} />
              <Text style={styles.staffItemEmail}>{item.email}</Text>
            </View>
            <View style={styles.staffItemDetails}>
              <Phone size={14} color={Colors.gray400} />
              <Text style={styles.staffItemPhone}>{item.phone || 'No phone'}</Text>
            </View>
          </View>
          <View style={styles.staffItemRight}>
            <View style={[styles.roleBadge, roleStyle]}>
              <Text style={[styles.roleBadgeText, roleTextStyle]}>{item.role.replace('_', ' ')}</Text>
            </View>
            <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
              <Text style={[styles.statusText, isActive ? styles.statusActiveText : styles.statusInactiveText]}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.staffItemFooter}>
          <Text style={styles.staffItemStore}>{item.storeId?.name || 'No Store'}</Text>
          <View style={styles.staffItemActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
              <Edit size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item._id)}>
              <Trash2 size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search staff..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setEditingUser(null);
            setShowModal(true);
          }}
        >
          <UserPlus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={staff}
        keyExtractor={(item) => item._id}
        renderItem={renderStaff}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No staff members found</Text>
          </View>
        )}
      />

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingUser ? 'Edit Staff' : 'Add Staff'}</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setEditingUser(null); resetForm(); }}>
                <X size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} contentContainerStyle={styles.modalFormContent}>
              <View style={styles.formRow}>
                <View style={[styles.formField, styles.halfField]}>
                  <Text style={styles.formLabel}>First Name *</Text>
                  <TextInput style={styles.formInput} value={formData.firstName} onChangeText={(text) => setFormData({ ...formData, firstName: text })} placeholderTextColor={Colors.gray400} />
                </View>
                <View style={[styles.formField, styles.halfField]}>
                  <Text style={styles.formLabel}>Last Name *</Text>
                  <TextInput style={styles.formInput} value={formData.lastName} onChangeText={(text) => setFormData({ ...formData, lastName: text })} placeholderTextColor={Colors.gray400} />
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="email@example.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase() })}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.gray400}
                />
              </View>
              {!editingUser && (
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Password *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                    placeholderTextColor={Colors.gray400}
                  />
                </View>
              )}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Phone number"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholderTextColor={Colors.gray400}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Role *</Text>
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
                <Text style={styles.formLabel}>Store {stores.length > 1 ? '*' : ''}</Text>
                {stores.length === 0 ? (
                  <Text style={styles.noStoreText}>No stores available. Please create a store first.</Text>
                ) : stores.length === 1 ? (
                  <Text style={styles.singleStoreText}>{stores[0].label} (Auto-assigned)</Text>
                ) : (
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
                )}
              </View>
              <View style={styles.formButtons}>
                <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={() => { setShowModal(false); setEditingUser(null); resetForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formButton, styles.submitButton, submitting && styles.buttonDisabled]} onPress={handleSave} disabled={submitting}>
                  {submitting ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.submitButtonText}>{editingUser ? 'Update' : 'Create'}</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: Colors.white, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', ...Shadows.sm },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray100, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md },
  searchInput: { flex: 1, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, fontSize: Typography.md },
  addButton: { marginLeft: Spacing.sm, backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: BorderRadius.lg },
  list: { flex: 1 },
  listContent: { padding: Spacing.md },
  staffItem: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  staffItemRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: 48, height: 48, borderRadius: BorderRadius.full, backgroundColor: Colors.primary + '10', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.primary, fontWeight: 'bold', fontSize: Typography.lg },
  staffItemInfo: { flex: 1, marginLeft: Spacing.md },
  staffItemName: { fontSize: Typography.md, fontWeight: '500', color: Colors.gray900 },
  staffItemDetails: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  staffItemEmail: { fontSize: Typography.xs, color: Colors.gray500, marginLeft: 4 },
  staffItemPhone: { fontSize: Typography.xs, color: Colors.gray500, marginLeft: 4 },
  staffItemRight: { alignItems: 'flex-end' },
  roleBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
  roleBadgeText: { fontSize: Typography.xs, fontWeight: '500' },
  roleSuperAdmin: { backgroundColor: '#8B5CF6' + '20' },
  roleSuperAdminText: { color: '#8B5CF6' },
  roleAdmin: { backgroundColor: Colors.primary + '20' },
  roleAdminText: { color: Colors.primary },
  roleSalesManager: { backgroundColor: Colors.success + '20' },
  roleSalesManagerText: { color: Colors.success },
  roleSalesAttendant: { backgroundColor: '#14B8A6' + '20' },
  roleSalesAttendantText: { color: '#14B8A6' },
  roleFinanceManager: { backgroundColor: '#8B5CF6' + '20' },
  roleFinanceManagerText: { color: '#8B5CF6' },
  roleFinanceCashier: { backgroundColor: '#06B6D4' + '20' },
  roleFinanceCashierText: { color: '#06B6D4' },
  roleWarehouseManager: { backgroundColor: '#F59E0B' + '20' },
  roleWarehouseManagerText: { color: '#F59E0B' },
  roleWarehouseStaff: { backgroundColor: '#FCD34D' + '20' },
  roleWarehouseStaffText: { color: '#92400E' },
  roleDefault: { backgroundColor: Colors.gray200 },
  roleDefaultText: { color: Colors.gray700 },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm, marginTop: 4 },
  statusActive: { backgroundColor: Colors.success + '20' },
  statusActiveText: { color: Colors.success },
  statusInactive: { backgroundColor: Colors.error + '20' },
  statusInactiveText: { color: Colors.error },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  staffItemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  staffItemStore: { fontSize: Typography.xs, color: Colors.gray500 },
  staffItemActions: { flexDirection: 'row' },
  actionButton: { padding: Spacing.sm },
  emptyContainer: { paddingVertical: Spacing['4xl'], alignItems: 'center' },
  emptyText: { color: Colors.gray500 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { flex: 1, marginTop: 60, backgroundColor: Colors.white, borderTopLeftRadius: BorderRadius['3xl'], borderTopRightRadius: BorderRadius['3xl'] },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  modalTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900 },
  modalForm: { flex: 1 },
  modalFormContent: { padding: Spacing.md, paddingBottom: Spacing['3xl'] },
  formRow: { flexDirection: 'row', gap: Spacing.sm },
  formField: { marginBottom: Spacing.md },
  halfField: { flex: 1 },
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
  noStoreText: { fontSize: Typography.sm, color: Colors.error },
  singleStoreText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: '500' },
  formButtons: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  formButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});