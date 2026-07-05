import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Package, AlertCircle, CheckCircle, MapPin, DollarSign } from 'lucide-react-native';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const InventoryDetailView = ({ inventory, product }) => {
  const getStockStatus = () => {
    const quantity = inventory?.quantity || 0;
    const reorderPoint = inventory?.reorderPoint || 5;

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
  const available = (inventory?.quantity || 0) - (inventory?.reservedQuantity || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Package size={24} color={Colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.productName}>{product?.name || 'Unknown Product'}</Text>
            <Text style={styles.productSku}>SKU: {product?.sku || 'N/A'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.variant === 'error' ? Colors.error + '20' : status.variant === 'warning' ? Colors.warning + '20' : Colors.success + '20' }]}>
            <StatusIcon size={12} color={status.variant === 'error' ? Colors.error : status.variant === 'warning' ? Colors.warning : Colors.success} />
            <Text style={[styles.statusText, { color: status.variant === 'error' ? Colors.error : status.variant === 'warning' ? Colors.warning : Colors.success }]}>
              {status.label}
            </Text>
          </View>
        </View>
        <Text style={styles.productCategory}>{product?.category}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current Stock</Text>
          <Text style={styles.statValue}>{inventory?.quantity || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Reserved</Text>
          <Text style={styles.statValue}>{inventory?.reservedQuantity || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Available</Text>
          <Text style={[styles.statValue, styles.availableValue]}>{available}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Reorder Point</Text>
          <Text style={styles.statValue}>{inventory?.reorderPoint || 5}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Warehouse Location</Text>
        <View style={styles.locationGrid}>
          <View style={styles.locationItem}>
            <MapPin size={16} color={Colors.gray500} />
            <Text style={styles.locationLabel}>Aisle</Text>
            <Text style={styles.locationValue}>{inventory?.warehouseLocation?.aisle || 'N/A'}</Text>
          </View>
          <View style={styles.locationItem}>
            <MapPin size={16} color={Colors.gray500} />
            <Text style={styles.locationLabel}>Shelf</Text>
            <Text style={styles.locationValue}>{inventory?.warehouseLocation?.shelf || 'N/A'}</Text>
          </View>
          <View style={styles.locationItem}>
            <MapPin size={16} color={Colors.gray500} />
            <Text style={styles.locationLabel}>Bin</Text>
            <Text style={styles.locationValue}>{inventory?.warehouseLocation?.bin || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.priceGrid}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Unit Price</Text>
            <Text style={styles.priceValue}>{formatCurrency(product?.unitPrice || 0)}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Cost Price</Text>
            <Text style={styles.priceValue}>{product?.costPrice ? formatCurrency(product.costPrice) : 'N/A'}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Tax Rate</Text>
            <Text style={styles.priceValue}>{product?.taxRate || 0}%</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Total Value</Text>
            <Text style={[styles.priceValue, styles.totalValue]}>
              {formatCurrency((inventory?.quantity || 0) * (product?.unitPrice || 0))}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Counted</Text>
          <Text style={styles.detailValue}>{inventory?.lastCounted ? formatDate(inventory.lastCounted) : 'Never'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reorder Point</Text>
          <Text style={styles.detailValue}>{inventory?.reorderPoint || 5}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Store</Text>
          <Text style={styles.detailValue}>{inventory?.storeId?.name || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created</Text>
          <Text style={styles.detailValue}>{inventory?.createdAt ? formatDate(inventory.createdAt) : 'N/A'}</Text>
        </View>
      </View>
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
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: { flex: 1 },
  productName: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  productSku: { fontSize: Typography.sm, color: Colors.gray500 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm, gap: 4 },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  productCategory: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.xs },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
  statCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: Spacing.xs },
  availableValue: { color: Colors.primary },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.sm },
  locationGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  locationItem: { alignItems: 'center' },
  locationLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  locationValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  priceGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  priceItem: { width: '50%', paddingVertical: Spacing.xs },
  priceLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  priceValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  totalValue: { color: Colors.primary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
});

export default InventoryDetailView;