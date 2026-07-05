import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, DollarSign, Box } from 'lucide-react-native';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const ProductCard = ({ product, onPress, compact = false }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    } else {
      router.push(`/products/${product._id}`);
    }
  };

  const getStockStatus = () => {
    const quantity = product.inventory?.quantity || 0;
    const minStock = product.minStockLevel || 5;

    if (quantity === 0) return { label: 'Out of Stock', variant: 'error' };
    if (quantity <= minStock) return { label: 'Low Stock', variant: 'warning' };
    return { label: 'In Stock', variant: 'success' };
  };

  const stockStatus = getStockStatus();

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactCard, styles.card]} onPress={handlePress}>
        <View style={styles.compactRow}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactName}>{product.name}</Text>
            <Text style={styles.compactSku}>SKU: {product.sku}</Text>
          </View>
          <Text style={styles.compactPrice}>{formatCurrency(product.unitPrice)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Package size={20} color={Colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.sku}>SKU: {product.sku}</Text>
        </View>
        <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <DollarSign size={16} color={Colors.gray400} />
          <Text style={styles.detailText}>Unit Price: {formatCurrency(product.unitPrice)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Box size={16} color={Colors.gray400} />
          <Text style={styles.detailText}>
            Stock: {product.inventory?.quantity || 0}
            {product.inventory?.reservedQuantity > 0 && ` (Reserved: ${product.inventory.reservedQuantity})`}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.categoryText}>{product.category}</Text>
          {product.brand && <Text style={styles.brandText}>• {product.brand}</Text>}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.locationText}>
          📍 {product.warehouseLocation?.aisle || 'N/A'} - {product.warehouseLocation?.shelf || 'N/A'} - {product.warehouseLocation?.bin || 'N/A'}
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
  },
  categoryText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginLeft: Spacing.sm,
  },
  brandText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  footer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  locationText: {
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
  compactSku: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  compactPrice: {
    fontSize: Typography.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default ProductCard;