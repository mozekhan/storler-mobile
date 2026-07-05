import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Roles } from '../../constants/roles';

const UserForm = ({
  initialData = {},
  stores = [],
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
}) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    password: '',
    phone: initialData.phone || '',
    role: initialData.role || Roles.SALES_ATTENDANT,
    storeId: initialData.storeId?._id || initialData.storeId || (stores.length > 0 ? stores[0].value : ''),
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{mode === 'create' ? 'Add New User' : 'Edit User'}</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} value={formData.firstName} onChangeText={(text) => updateField('firstName', text)} placeholderTextColor={Colors.gray400} />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} value={formData.lastName} onChangeText={(text) => updateField('lastName', text)} placeholderTextColor={Colors.gray400} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} placeholder="email@example.com" value={formData.email} onChangeText={(text) => updateField('email', text.toLowerCase())} autoCapitalize="none" placeholderTextColor={Colors.gray400} />
        </View>

        {mode === 'create' && (
          <View style={styles.field}>
            <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Min 8 characters" value={formData.password} onChangeText={(text) => updateField('password', text)} secureTextEntry placeholderTextColor={Colors.gray400} />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} placeholder="Phone number" value={formData.phone} onChangeText={(text) => updateField('phone', text)} placeholderTextColor={Colors.gray400} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Role <Text style={styles.required}>*</Text></Text>
          <View style={styles.rolePicker}>
            {Object.values(Roles).map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.roleOption, formData.role === role && styles.roleOptionActive]}
                onPress={() => updateField('role', role)}
              >
                <Text style={[styles.roleOptionText, formData.role === role && styles.roleOptionTextActive]}>
                  {role.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Store {stores.length > 1 ? '*' : ''}</Text>
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
                  onPress={() => updateField('storeId', store.value)}
                >
                  <Text style={[styles.storeOptionText, formData.storeId === store.value && styles.storeOptionTextActive]}>
                    {store.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.submitButtonText}>{mode === 'create' ? 'Create' : 'Update'}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  closeButton: { padding: Spacing.sm },
  form: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing['2xl'], ...Shadows.sm },
  field: { marginBottom: Spacing.md },
  halfField: { flex: 1 },
  row: { flexDirection: 'row', gap: Spacing.sm },
  label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
  required: { color: Colors.error },
  input: { borderWidth: 1, borderColor: Colors.gray300, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: Typography.md, backgroundColor: Colors.white },
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
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});

export default UserForm;