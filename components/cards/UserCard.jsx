import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Phone } from 'lucide-react-native';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { RoleColors } from '../../constants/roles';

const UserCard = ({ user, onPress, compact = false }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(user);
    } else {
      router.push(`/users/${user._id}`);
    }
  };

  const getRoleColor = (role) => {
    return RoleColors[role] || Colors.gray500;
  };

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactCard, styles.card]} onPress={handlePress}>
        <View style={styles.compactRow}>
          <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
          <View style={styles.compactInfo}>
            <Text style={styles.compactName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.compactEmail}>{user.email}</Text>
          </View>
          <Badge variant={user.isActive !== false ? 'success' : 'error'}>
            {user.isActive !== false ? 'Active' : 'Inactive'}
          </Badge>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Avatar firstName={user.firstName} lastName={user.lastName} size="md" />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <Badge variant={user.isActive !== false ? 'success' : 'error'}>
          {user.isActive !== false ? 'Active' : 'Inactive'}
        </Badge>
      </View>

      <View style={styles.details}>
        {user.phone && (
          <View style={styles.detailRow}>
            <Phone size={16} color={Colors.gray400} />
            <Text style={styles.detailText}>{user.phone}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <User size={16} color={Colors.gray400} />
          <Text style={[styles.detailText, { color: getRoleColor(user.role) }]}>
            {user.role?.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.metaText}>
          {user.storeId?.name || 'No Store'} • Joined {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  compactCard: {
    padding: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerInfo: { flex: 1, marginLeft: Spacing.md },
  name: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
  },
  email: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  details: {
    gap: Spacing.xs,
    marginLeft: Spacing['2xl'],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginLeft: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  metaText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  compactName: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  compactEmail: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
});

export default UserCard;