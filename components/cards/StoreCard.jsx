import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Store, MapPin, Phone, Mail } from 'lucide-react-native';
import Badge from '../ui/Badge';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const StoreCard = ({ store, onPress, compact = false }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(store);
    } else {
      router.push(`/stores/${store._id}`);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactCard, styles.card]} onPress={handlePress}>
        <View style={styles.compactRow}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactName}>{store.name}</Text>
            <Text style={styles.compactCode}>Code: {store.code}</Text>
          </View>
          <Badge variant={store.isActive !== false ? 'success' : 'error'}>
            {store.isActive !== false ? 'Active' : 'Inactive'}
          </Badge>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Store size={20} color={Colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{store.name}</Text>
          <Text style={styles.code}>Code: {store.code}</Text>
        </View>
        <Badge variant={store.isActive !== false ? 'success' : 'error'}>
          {store.isActive !== false ? 'Active' : 'Inactive'}
        </Badge>
      </View>

      <View style={styles.details}>
        {store.address && (store.address.street || store.address.city) && (
          <View style={styles.detailRow}>
            <MapPin size={16} color={Colors.gray400} />
            <Text style={styles.detailText}>
              {[store.address.street, store.address.city, store.address.state].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
        {store.phone && (
          <View style={styles.detailRow}>
            <Phone size={16} color={Colors.gray400} />
            <Text style={styles.detailText}>{store.phone}</Text>
          </View>
        )}
        {store.email && (
          <View style={styles.detailRow}>
            <Mail size={16} color={Colors.gray400} />
            <Text style={styles.detailText}>{store.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.metaText}>Tax: {store.taxRate || 0}% • Currency: {store.currency || 'USD'}</Text>
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
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: { flex: 1 },
  name: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
  },
  code: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  details: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginLeft: Spacing.sm,
    flex: 1,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactInfo: { flex: 1 },
  compactName: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  compactCode: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
});

export default StoreCard;