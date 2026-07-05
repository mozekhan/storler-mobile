import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { User, Mail, Phone, Calendar, Shield, Store } from 'lucide-react-native';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { RoleColors } from '../../constants/roles';

const UserDetailView = ({ user }) => {
  const getRoleColor = (role) => {
    return RoleColors[role] || Colors.gray500;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Avatar firstName={user.firstName} lastName={user.lastName} size="xl" />
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={[styles.roleBadgeText, { color: getRoleColor(user.role) }]}>
                {user.role?.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Badge variant={user.isActive !== false ? 'success' : 'error'}>
            {user.isActive !== false ? 'Active' : 'Inactive'}
          </Badge>
          <Text style={styles.memberSince}>Member since {formatDate(user.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Mail size={16} color={Colors.gray500} />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Phone size={16} color={Colors.gray500} />
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user.phone || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Shield size={16} color={Colors.gray500} />
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={[styles.infoValue, { color: getRoleColor(user.role) }]}>
            {user.role?.replace('_', ' ')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Store size={16} color={Colors.gray500} />
          <Text style={styles.infoLabel}>Store</Text>
          <Text style={styles.infoValue}>{user.storeId?.name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.gray500} />
          <Text style={styles.infoLabel}>Last Login</Text>
          <Text style={styles.infoValue}>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.gray500} />
          <Text style={styles.infoLabel}>Joined</Text>
          <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
        </View>
      </View>

      {user.permissions && user.permissions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          <View style={styles.permissionsContainer}>
            {user.permissions.map((permission, index) => (
              <View key={index} style={styles.permissionItem}>
                <Text style={styles.permissionText}>{permission.replace(':', ' ')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {user.assignedStores && user.assignedStores.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Stores</Text>
          {user.assignedStores.map((store, index) => (
            <View key={index} style={styles.assignedStoreItem}>
              <Store size={14} color={Colors.primary} />
              <Text style={styles.assignedStoreText}>{store.name}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerInfo: { flex: 1, marginLeft: Spacing.md },
  userName: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  userEmail: { fontSize: Typography.sm, color: Colors.gray500 },
  roleBadge: { marginTop: 2 },
  roleBadgeText: { fontSize: Typography.sm, fontWeight: '500' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  memberSince: { fontSize: Typography.xs, color: Colors.gray500, marginLeft: Spacing.md },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  infoLabel: { fontSize: Typography.sm, color: Colors.gray500, marginLeft: Spacing.sm, flex: 1 },
  infoValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  permissionsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  permissionItem: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: 2,
  },
  permissionText: { fontSize: Typography.xs, color: Colors.primary },
  assignedStoreItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  assignedStoreText: { fontSize: Typography.sm, color: Colors.gray700, marginLeft: Spacing.sm },
});

export default UserDetailView;