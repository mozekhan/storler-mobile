import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Package, Minus, Plus, ArrowLeft } from 'lucide-react-native';
import InventoryService from '../../../../../services/inventoryService';
import ProductService from '../../../../../services/productService';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';

export default function InventoryAdjust() {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const [prod, inv] = await Promise.all([
        ProductService.getProduct(productId),
        InventoryService.getInventoryByProduct(productId),
      ]);
      setProduct(prod);
      setInventory(inv);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
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
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!product || !inventory) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <Package size={24} color={Colors.primary} />
          <Text style={styles.productName}>{product.name}</Text>
        </View>
        <Text style={styles.productSku}>SKU: {product.sku}</Text>
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

      <View style={styles.adjustCard}>
        <Text style={styles.sectionTitle}>Adjustment Details</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Adjustment Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setAdjustmentQuantity(prev => prev - 1)}
            >
              <Minus size={20} color={Colors.gray500} />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={String(adjustmentQuantity)}
              onChangeText={(text) => setAdjustmentQuantity(parseInt(text) || 0)}
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setAdjustmentQuantity(prev => prev + 1)}
            >
              <Plus size={20} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Positive to add, negative to remove</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Enter reason for adjustment (e.g., Stock count, Damaged, Return)"
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
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, saving && styles.buttonDisabled]}
            onPress={handleAdjust}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Adjust Stock</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingBottom: Spacing['3xl'] },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.gray500 },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  productHeader: { flexDirection: 'row', alignItems: 'center' },
  productName: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900, marginLeft: Spacing.sm },
  productSku: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
  productCategory: { fontSize: Typography.sm, color: Colors.gray500 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
  statCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: Spacing.xs },
  availableValue: { color: Colors.primary },
  adjustCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  field: { marginBottom: Spacing.md },
  label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
  required: { color: Colors.error },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.xl,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  helperText: { fontSize: Typography.xs, color: Colors.gray500, marginTop: Spacing.xs },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
  backButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing['2xl'], borderRadius: BorderRadius.lg, marginTop: Spacing.md },
  backButtonText: { color: Colors.white, fontWeight: '600' },
});