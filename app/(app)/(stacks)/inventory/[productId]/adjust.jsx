// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Package, Minus, Plus, ArrowLeft } from 'lucide-react-native';
// import InventoryService from '../../../../../services/inventoryService';
// import ProductService from '../../../../../services/productService';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';

// export default function InventoryAdjust() {
//   const { productId } = useLocalSearchParams();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [product, setProduct] = useState(null);
//   const [inventory, setInventory] = useState(null);
//   const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
//   const [adjustmentReason, setAdjustmentReason] = useState('');

//   useEffect(() => {
//     fetchData();
//   }, [productId]);

//   const fetchData = async () => {
//     try {
//       const [prod, inv] = await Promise.all([
//         ProductService.getProduct(productId),
//         InventoryService.getInventoryByProduct(productId),
//       ]);
//       setProduct(prod);
//       setInventory(inv);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load product data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdjust = async () => {
//     if (adjustmentQuantity === 0) {
//       Alert.alert('Error', 'Please enter a quantity');
//       return;
//     }
//     if (!adjustmentReason.trim()) {
//       Alert.alert('Error', 'Please enter a reason');
//       return;
//     }

//     setSaving(true);
//     try {
//       const result = await InventoryService.adjustStock(
//         productId,
//         adjustmentQuantity,
//         adjustmentReason.trim()
//       );

//       Alert.alert(
//         'Success',
//         `Stock adjusted from ${result.previousQuantity} to ${result.newQuantity}`,
//         [{ text: 'OK', onPress: () => router.back() }]
//       );
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to adjust stock');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   if (!product || !inventory) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Product not found</Text>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <Text style={styles.backButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.productCard}>
//         <View style={styles.productHeader}>
//           <Package size={24} color={Colors.primary} />
//           <Text style={styles.productName}>{product.name}</Text>
//         </View>
//         <Text style={styles.productSku}>SKU: {product.sku}</Text>
//         <Text style={styles.productCategory}>{product.category}</Text>
//       </View>

//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <Text style={styles.statLabel}>Current Stock</Text>
//           <Text style={styles.statValue}>{inventory.quantity || 0}</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statLabel}>Reserved</Text>
//           <Text style={styles.statValue}>{inventory.reservedQuantity || 0}</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statLabel}>Available</Text>
//           <Text style={[styles.statValue, styles.availableValue]}>
//             {(inventory.quantity || 0) - (inventory.reservedQuantity || 0)}
//           </Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statLabel}>Reorder Point</Text>
//           <Text style={styles.statValue}>{inventory.reorderPoint || 5}</Text>
//         </View>
//       </View>

//       <View style={styles.adjustCard}>
//         <Text style={styles.sectionTitle}>Adjustment Details</Text>

//         <View style={styles.field}>
//           <Text style={styles.label}>Adjustment Quantity</Text>
//           <View style={styles.quantityRow}>
//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() => setAdjustmentQuantity(prev => prev - 1)}
//             >
//               <Minus size={20} color={Colors.gray500} />
//             </TouchableOpacity>
//             <TextInput
//               style={styles.quantityInput}
//               keyboardType="numeric"
//               value={String(adjustmentQuantity)}
//               onChangeText={(text) => setAdjustmentQuantity(parseInt(text) || 0)}
//             />
//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() => setAdjustmentQuantity(prev => prev + 1)}
//             >
//               <Plus size={20} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.helperText}>Positive to add, negative to remove</Text>
//         </View>

//         <View style={styles.field}>
//           <Text style={styles.label}>Reason <Text style={styles.required}>*</Text></Text>
//           <TextInput
//             style={styles.reasonInput}
//             placeholder="Enter reason for adjustment (e.g., Stock count, Damaged, Return)"
//             value={adjustmentReason}
//             onChangeText={setAdjustmentReason}
//             multiline
//             numberOfLines={3}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.cancelButton]}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.submitButton, saving && styles.buttonDisabled]}
//             onPress={handleAdjust}
//             disabled={saving}
//           >
//             {saving ? (
//               <ActivityIndicator color={Colors.white} size="small" />
//             ) : (
//               <Text style={styles.submitButtonText}>Adjust Stock</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   content: { padding: Spacing.md, paddingBottom: Spacing['3xl'] },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { color: Colors.gray500 },
//   productCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   productHeader: { flexDirection: 'row', alignItems: 'center' },
//   productName: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900, marginLeft: Spacing.sm },
//   productSku: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
//   productCategory: { fontSize: Typography.sm, color: Colors.gray500 },
//   statsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
//   statCard: {
//     width: '48%',
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     alignItems: 'center',
//     ...Shadows.sm,
//   },
//   statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
//   statValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: Spacing.xs },
//   availableValue: { color: Colors.primary },
//   adjustCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
//   field: { marginBottom: Spacing.md },
//   label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
//   required: { color: Colors.error },
//   quantityRow: { flexDirection: 'row', alignItems: 'center' },
//   quantityButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   quantityInput: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.gray300,
//     paddingVertical: Spacing.sm,
//     marginHorizontal: Spacing.md,
//   },
//   helperText: { fontSize: Typography.xs, color: Colors.gray500, marginTop: Spacing.xs },
//   reasonInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
//   button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
//   cancelButton: { backgroundColor: Colors.gray200 },
//   cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
//   submitButton: { backgroundColor: Colors.primary },
//   submitButtonText: { fontWeight: '600', color: Colors.white },
//   buttonDisabled: { opacity: 0.7 },
//   backButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing['2xl'], borderRadius: BorderRadius.lg, marginTop: Spacing.md },
//   backButtonText: { color: Colors.white, fontWeight: '600' },
// });





























// app/(stacks)/inventory/adjust.jsx
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
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Package, Minus, Plus, ArrowLeft, Store, CheckCircle, X } from 'lucide-react-native';
import InventoryService from '../../../../../services/inventoryService';
import ProductService from '../../../../../services/productService';
import StoreService from '../../../../../services/storeService';
import AuthService from '../../../../../services/authService';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';

export default function InventoryAdjust() {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    loadUserAndStores();
  }, []);

  useEffect(() => {
    if (user && (selectedStoreId || !isSuperAdmin)) {
      fetchData();
    }
  }, [productId, selectedStoreId]);

  const loadUserAndStores = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser.role === 'SUPER_ADMIN') {
        const storesData = await StoreService.getStoreOptions();
        setStores(storesData);
        
        // Auto-select first store or use currentStoreId
        const currentStoreId = currentUser.currentStoreId?._id || currentUser.currentStoreId;
        if (currentStoreId) {
          setSelectedStoreId(currentStoreId);
        } else if (storesData.length === 1) {
          setSelectedStoreId(storesData[0].value);
        }
      } else {
        // Regular user - use their assigned store
        const storeId = currentUser.storeId?._id || currentUser.storeId;
        setSelectedStoreId(storeId);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load user/stores:', error);
      Alert.alert('Error', 'Failed to load user data');
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [prod, inv] = await Promise.all([
        ProductService.getProduct(productId),
        InventoryService.getInventoryByProduct(productId, isSuperAdmin ? selectedStoreId : null),
      ]);
      setProduct(prod);
      setInventory(inv);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load product data');
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
    if (isSuperAdmin && !selectedStoreId) {
      Alert.alert('Error', 'Please select a store');
      return;
    }

    setSaving(true);
    try {
      const result = await InventoryService.adjustStock(
        productId,
        adjustmentQuantity,
        adjustmentReason.trim(),
        isSuperAdmin ? selectedStoreId : null
      );

      Alert.alert(
        'Success',
        `Stock adjusted from ${result.previousQuantity} to ${result.newQuantity}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to adjust stock');
    } finally {
      setSaving(false);
    }
  };

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.value === storeId);
    return store ? store.label : 'Select a store';
  };

  const renderStoreModal = () => (
    <Modal
      visible={showStoreModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowStoreModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Store</Text>
            <TouchableOpacity onPress={() => setShowStoreModal(false)}>
              <X size={24} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={stores}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.storeItem,
                  selectedStoreId === item.value && styles.storeItemSelected,
                ]}
                onPress={() => {
                  setSelectedStoreId(item.value);
                  setShowStoreModal(false);
                }}
              >
                <Store size={20} color={selectedStoreId === item.value ? Colors.white : Colors.gray500} />
                <Text
                  style={[
                    styles.storeItemText,
                    selectedStoreId === item.value && styles.storeItemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {selectedStoreId === item.value && (
                  <CheckCircle size={16} color={Colors.white} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No stores available</Text>
            )}
          />
        </View>
      </View>
    </Modal>
  );

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
        {isSuperAdmin && selectedStoreId && (
          <View style={styles.productStoreInfo}>
            <Store size={14} color={Colors.gray500} />
            <Text style={styles.productStoreText}>
              Store: {getStoreName(selectedStoreId)}
            </Text>
          </View>
        )}
      </View>

      {isSuperAdmin && (
        <View style={styles.storeSelectorContainer}>
          <Text style={styles.label}>Select Store *</Text>
          <TouchableOpacity
            style={styles.storeSelector}
            onPress={() => setShowStoreModal(true)}
          >
            <View style={styles.storeSelectorLeft}>
              <Store size={20} color={Colors.primary} />
              <Text style={styles.storeSelectorText}>
                {getStoreName(selectedStoreId)}
              </Text>
            </View>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
          {!selectedStoreId && (
            <Text style={styles.warningText}>⚠️ Please select a store</Text>
          )}
        </View>
      )}

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
            style={[styles.button, styles.submitButton, (saving || (isSuperAdmin && !selectedStoreId)) && styles.buttonDisabled]}
            onPress={handleAdjust}
            disabled={saving || (isSuperAdmin && !selectedStoreId)}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Adjust Stock</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {renderStoreModal()}
    </ScrollView>
  );
}

// Styles remain the same with addition of store selector styles
const styles = StyleSheet.create({
  // ... existing styles ...
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
  productStoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  productStoreText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
  },
  storeSelectorContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  storeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    backgroundColor: Colors.gray50,
  },
  storeSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeSelectorText: {
    fontSize: Typography.md,
    color: Colors.gray900,
    marginLeft: Spacing.sm,
  },
  chevron: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  warningText: {
    color: Colors.error,
    fontSize: Typography.xs,
    marginTop: Spacing.xs,
  },
  // ... rest of existing styles ...
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    padding: Spacing['2xl'],
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.gray900,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    gap: Spacing.md,
  },
  storeItemSelected: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  storeItemText: {
    fontSize: Typography.md,
    color: Colors.gray900,
    flex: 1,
  },
  storeItemTextSelected: {
    color: Colors.white,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray500,
    padding: Spacing['2xl'],
  },
});