import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, AlertCircle, CheckCircle } from 'lucide-react-native';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const InventoryCard = ({ inventory, onPress, compact = false }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(inventory);
    } else {
      router.push(`/inventory/${inventory.productId?._id}`);
    }
  };

  const getStockStatus = () => {
    const quantity = inventory.quantity || 0;
    const reorderPoint = inventory.reorderPoint || 5;

    if (quantity === 0) {
      return { label: 'Out of Stock', variant: 'error', icon: AlertCircle };
    } else if (quantity <= reorderPoint) {
      return { label: 'Low Stock', variant: 'warning', icon: AlertCircle };
    } else {
      return { label: 'In Stock', variant: 'success', icon: CheckCircle };
    }
  };

  const status = getStockStatus();
  const StatusIcon = status.icon;

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactCard, styles.card]} onPress={handlePress}>
        <View style={styles.compactRow}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactName}>{inventory.productId?.name || 'Unknown Product'}</Text>
            <Text style={styles.compactSku}>SKU: {inventory.productId?.sku || 'N/A'}</Text>
          </View>
          <Text style={styles.compactQuantity}>{inventory.quantity || 0}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const available = (inventory.quantity || 0) - (inventory.reservedQuantity || 0);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Package size={20} color={Colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{inventory.productId?.name || 'Unknown Product'}</Text>
          <Text style={styles.sku}>SKU: {inventory.productId?.sku || 'N/A'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.variant === 'error' ? Colors.error + '20' : status.variant === 'warning' ? Colors.warning + '20' : Colors.success + '20' }]}>
          <StatusIcon size={12} color={status.variant === 'error' ? Colors.error : status.variant === 'warning' ? Colors.warning : Colors.success} />
          <Text style={[styles.statusText, { color: status.variant === 'error' ? Colors.error : status.variant === 'warning' ? Colors.warning : Colors.success }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity</Text>
          <Text style={styles.detailValue}>{inventory.quantity || 0}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reserved</Text>
          <Text style={styles.detailValue}>{inventory.reservedQuantity || 0}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Available</Text>
          <Text style={[styles.detailValue, styles.availableValue]}>{available}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reorder Point</Text>
          <Text style={styles.detailValue}>{inventory.reorderPoint || 5}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.locationText}>
          📍 {inventory.warehouseLocation?.aisle || 'N/A'} - {inventory.warehouseLocation?.shelf || 'N/A'} - {inventory.warehouseLocation?.bin || 'N/A'}
        </Text>
        <Text style={styles.priceText}>{formatCurrency(inventory.productId?.unitPrice || 0)}</Text>
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
  sku: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: '500',
  },
  details: {
    gap: Spacing.xs,
    marginLeft: Spacing['2xl'],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  availableValue: {
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  locationText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  priceText: {
    fontSize: Typography.sm,
    fontWeight: 'bold',
    color: Colors.primary,
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
  compactSku: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  compactQuantity: {
    fontSize: Typography.md,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
});

export default InventoryCard;