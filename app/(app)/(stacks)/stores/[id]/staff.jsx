import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Users, Mail, Phone } from 'lucide-react-native';
import UserService from '../../../../../services/userService';
import { Colors, Spacing, Typography, BorderRadius } from '../../../../../constants/theme';
import { RoleColors } from '../../../../../constants/roles';

export default function StoreStaff() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      const result = await UserService.getUsers({ storeId: id, limit: 50 });
      setStaff(result.users || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    return RoleColors[role] || Colors.gray500;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={staff}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.staffItem}
          onPress={() => router.push(`/users/${item._id}`)}
        >
          <View style={styles.staffHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{item.firstName?.[0]}{item.lastName?.[0]}</Text>
            </View>
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.staffRole}>{item.role?.replace('_', ' ')}</Text>
            </View>
            <View style={[styles.statusBadge, item.isActive !== false ? styles.statusActive : styles.statusInactive]}>
              <Text style={[styles.statusText, item.isActive !== false ? styles.statusActiveText : styles.statusInactiveText]}>
                {item.isActive !== false ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <View style={styles.staffDetails}>
            <View style={styles.detailRow}>
              <Mail size={14} color={Colors.gray400} />
              <Text style={styles.detailText}>{item.email}</Text>
            </View>
            {item.phone && (
              <View style={styles.detailRow}>
                <Phone size={14} color={Colors.gray400} />
                <Text style={styles.detailText}>{item.phone}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Users size={48} color={Colors.gray300} />
          <Text style={styles.emptyText}>No staff members found</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  staffItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  staffHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
  staffInfo: { flex: 1, marginLeft: Spacing.md },
  staffName: { fontSize: Typography.md, fontWeight: '500', color: Colors.gray900 },
  staffRole: { fontSize: Typography.xs, color: Colors.gray500 },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  statusActive: { backgroundColor: Colors.success + '20' },
  statusActiveText: { color: Colors.success },
  statusInactive: { backgroundColor: Colors.error + '20' },
  statusInactiveText: { color: Colors.error },
  staffDetails: { marginTop: Spacing.sm, marginLeft: Spacing['2xl'] },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  detailText: { fontSize: Typography.sm, color: Colors.gray500, marginLeft: Spacing.sm },
  emptyContainer: { paddingVertical: Spacing['4xl'], alignItems: 'center' },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
});