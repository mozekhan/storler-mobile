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
import { ArrowLeft, Package, Edit, Trash2, Plus, Minus, MapPin, DollarSign, AlertCircle } from 'lucide-react-native';
import InventoryService from '../../../../../services/inventoryService';
import ProductService from '../../../../../services/productService';
import { formatCurrency, formatDate } from '../../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';

export default function InventoryDetail() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inventory, setInventory] = useState(null);
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const [inv, prod, moves] = await Promise.all([
        InventoryService.getInventoryByProduct(productId),
        ProductService.getProduct(productId),
        InventoryService.getInventoryByProduct(productId), // This would need to be a separate endpoint for movements
      ]);
      setInventory(inv);
      setProduct(prod);
      setMovements(moves?.movements || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load inventory details');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async () => {
    if (adjustmentQuantity === 0) {
      Alert.alert('Error', 'Please enter a quantity');
      return;
    }
    if (!adjustmentReason.trim()) {
      Alert.alert('Error', 'Please enter a reason');
      return;
    }

    setSaving(true);
    try {
      const result = await InventoryService.adjustStock(
        productId,
        adjustmentQuantity,
        adjustmentReason.trim()
      );
      Alert.alert(
        'Success',
        `Stock adjusted from ${result.previousQuantity} to ${result.newQuantity}`,
        [{ text: 'OK', onPress: () => { setShowAdjustModal(false); setAdjustmentQuantity(0); setAdjustmentReason(''); fetchData(); } }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSaving(false);
    }
  };

  const getStockStatus = () => {
    const quantity = inventory?.quantity || 0;
    const reorderPoint = inventory?.reorderPoint || 5;

    if (quantity === 0) {
      return { label: 'Out of Stock', color: Colors.error, icon: AlertCircle };
    } else if (quantity <= reorderPoint) {
      return { label: 'Low Stock', color: Colors.warning, icon: AlertCircle };
    } else {
      return { label: 'In Stock', color: Colors.success, icon: Package };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!inventory || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Inventory not found</Text>
      </View>
    );
  }

  const status = getStockStatus();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Package size={24} color={Colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productSku}>SKU: {product.sku}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.productCategory}>{product.category}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current Stock</Text>
          <Text style={styles.statValue}>{inventory.quantity || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Reserved</Text>
          <Text style={styles.statValue}>{inventory.reservedQuantity || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Available</Text>
          <Text style={[styles.statValue, styles.availableValue]}>
            {(inventory.quantity || 0) - (inventory.reservedQuantity || 0)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Reorder Point</Text>
          <Text style={styles.statValue}>{inventory.reorderPoint || 5}</Text>
        </View>
      </View>

      <View style={styles.locationCard}>
        <Text style={styles.sectionTitle}>Warehouse Location</Text>
        <View style={styles.locationGrid}>
          <View style={styles.locationItem}>
            <MapPin size={16} color={Colors.gray500} />
            <Text style={styles.locationLabel}>Aisle</Text>
            <Text style={styles.locationValue}>{inventory.warehouseLocation?.aisle || 'N/A'}</Text>
          </View>
          <View style={styles.locationItem}>
            <MapPin size={16} color={Colors.gray500} />
            <Text style={styles.locationLabel}>Shelf</Text>
            <Text style={styles.locationValue}>{inventory.warehouseLocation?.shelf || 'N/A'}</Text>
          </View>
          <View style={styles.locationItem}>
            <MapPin size={16} color={Colors.gray500} />
            <Text style={styles.locationLabel}>Bin</Text>
            <Text style={styles.locationValue}>{inventory.warehouseLocation?.bin || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.priceGrid}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Unit Price</Text>
            <Text style={styles.priceValue}>{formatCurrency(product.unitPrice)}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Cost Price</Text>
            <Text style={styles.priceValue}>{product.costPrice ? formatCurrency(product.costPrice) : 'N/A'}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Tax Rate</Text>
            <Text style={styles.priceValue}>{product.taxRate || 0}%</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Total Value</Text>
            <Text style={[styles.priceValue, styles.totalValue]}>
              {formatCurrency((inventory.quantity || 0) * (product.unitPrice || 0))}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.adjustButton} onPress={() => setShowAdjustModal(true)}>
        <Text style={styles.adjustButtonText}>Adjust Stock</Text>
      </TouchableOpacity>

      {movements.length > 0 && (
        <View style={styles.movementsCard}>
          <Text style={styles.sectionTitle}>Recent Movements</Text>
          {movements.slice(0, 5).map((movement, index) => (
            <View key={index} style={styles.movementRow}>
              <View style={styles.movementInfo}>
                <Text style={styles.movementAction}>{movement.action}</Text>
                <Text style={styles.movementUser}>
                  {movement.actorId?.firstName} {movement.actorId?.lastName}
                </Text>
              </View>
              <View style={styles.movementDetails}>
                <Text style={styles.movementQuantity}>
                  {movement.details?.after?.quantity !== undefined &&
                    `${movement.details?.before?.quantity || 0} → ${movement.details?.after?.quantity}`}
                </Text>
                <Text style={styles.movementTime}>{formatDate(movement.timestamp)}</Text>
              </View>
            </View>
          ))}
          {movements.length > 5 && (
            <Text style={styles.viewMore}>+ {movements.length - 5} more</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color={Colors.gray700} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Adjust Stock Modal */}
      <Modal visible={showAdjustModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Stock</Text>
              <TouchableOpacity onPress={() => { setShowAdjustModal(false); setAdjustmentQuantity(0); setAdjustmentReason(''); }}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.productInfoCard}>
                <Text style={styles.productInfoName}>{product.name}</Text>
                <Text style={styles.productInfoSku}>SKU: {product.sku}</Text>
                <View style={styles.productInfoStats}>
                  <View style={styles.productInfoStat}>
                    <Text style={styles.productInfoStatLabel}>Current Stock</Text>
                    <Text style={styles.productInfoStatValue}>{inventory.quantity || 0}</Text>
                  </View>
                  <View style={styles.productInfoStat}>
                    <Text style={styles.productInfoStatLabel}>Reserved</Text>
                    <Text style={styles.productInfoStatValue}>{inventory.reservedQuantity || 0}</Text>
                  </View>
                  <View style={styles.productInfoStat}>
                    <Text style={styles.productInfoStatLabel}>Available</Text>
                    <Text style={[styles.productInfoStatValue, styles.availableValue]}>
                      {(inventory.quantity || 0) - (inventory.reservedQuantity || 0)}
                    </Text>
                  </View>
                  <View style={styles.productInfoStat}>
                    <Text style={styles.productInfoStatLabel}>Reorder Point</Text>
                    <Text style={styles.productInfoStatValue}>{inventory.reorderPoint || 5}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Adjustment Quantity</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => setAdjustmentQuantity(prev => prev - 1)}>
                    <Minus size={20} color={Colors.gray500} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    value={String(adjustmentQuantity)}
                    onChangeText={(text) => setAdjustmentQuantity(parseInt(text) || 0)}
                  />
                  <TouchableOpacity style={styles.quantityButton} onPress={() => setAdjustmentQuantity(prev => prev + 1)}>
                    <Plus size={20} color={Colors.gray500} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>Positive to add, negative to remove</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Reason</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Enter reason for adjustment"
                  value={adjustmentReason}
                  onChangeText={setAdjustmentReason}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={Colors.gray400}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => { setShowAdjustModal(false); setAdjustmentQuantity(0); setAdjustmentReason(''); }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton, saving && styles.buttonDisabled]}
                  onPress={handleAdjustStock}
                  disabled={saving}
                >
                  <Text style={styles.submitButtonText}>{saving ? 'Adjusting...' : 'Adjust Stock'}</Text>
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
  iconContainer: { width: 48, height: 48, backgroundColor: Colors.primary + '10', borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, marginLeft: Spacing.md },
  productName: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  productSku: { fontSize: Typography.sm, color: Colors.gray500 },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  productCategory: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.xs },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
  statCard: { width: '48%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm, alignItems: 'center' },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: Spacing.xs },
  availableValue: { color: Colors.primary },
  locationCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  locationGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  locationItem: { alignItems: 'center' },
  locationLabel: { fontSize: Typography.xs, color: Colors.gray500, marginTop: 2 },
  locationValue: { fontSize: Typography.md, fontWeight: '500', color: Colors.gray900 },
  priceCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  priceGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  priceItem: { width: '50%', paddingVertical: Spacing.sm },
  priceLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  priceValue: { fontSize: Typography.md, fontWeight: '500', color: Colors.gray900 },
  totalValue: { color: Colors.primary },
  adjustButton: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, alignItems: 'center', marginBottom: Spacing.md },
  adjustButtonText: { color: Colors.white, fontWeight: '600' },
  movementsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  movementRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  movementInfo: { flex: 1 },
  movementAction: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  movementUser: { fontSize: Typography.xs, color: Colors.gray500 },
  movementDetails: { alignItems: 'flex-end' },
  movementQuantity: { fontSize: Typography.sm, color: Colors.gray700 },
  movementTime: { fontSize: Typography.xs, color: Colors.gray400 },
  viewMore: { fontSize: Typography.sm, color: Colors.primary, marginTop: Spacing.sm, textAlign: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, backgroundColor: Colors.gray200, borderRadius: BorderRadius.lg, marginTop: Spacing.sm },
  backButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: BorderRadius['3xl'], borderTopRightRadius: BorderRadius['3xl'], padding: Spacing['2xl'], maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  modalClose: { fontSize: Typography.xl, color: Colors.gray500, padding: Spacing.sm },
  modalBody: { gap: Spacing.md },
  productInfoCard: { backgroundColor: Colors.gray50, borderRadius: BorderRadius.lg, padding: Spacing.md },
  productInfoName: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  productInfoSku: { fontSize: Typography.sm, color: Colors.gray500 },
  productInfoStats: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm },
  productInfoStat: { width: '50%', paddingVertical: 2 },
  productInfoStatLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  productInfoStatValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  field: { marginBottom: Spacing.md },
  label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { width: 44, height: 44, backgroundColor: Colors.gray100, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  quantityInput: { flex: 1, textAlign: 'center', fontSize: Typography.xl, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: Colors.gray300, paddingVertical: Spacing.sm, marginHorizontal: Spacing.md },
  helperText: { fontSize: Typography.xs, color: Colors.gray500, marginTop: Spacing.xs },
  reasonInput: { borderWidth: 1, borderColor: Colors.gray300, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: Typography.md, minHeight: 60, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});