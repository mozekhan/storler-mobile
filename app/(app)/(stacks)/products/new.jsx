// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Save, X, Package, Info } from 'lucide-react-native';
// import ProductService from '../../../../services/productService';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';
// import CustomHeader from '../../../../components/ui/CustomHeader';

// export default function NewProduct() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     sku: '',
//     description: '',
//     category: '',
//     subCategory: '',
//     brand: '',
//     unitPrice: '',
//     costPrice: '',
//     taxRate: '0',
//     minStockLevel: '5',
//     maxStockLevel: '100',
//     unitOfMeasure: 'each',
//     initialQuantity: '0',
//   });

//   const handleSave = async () => {
//     if (!formData.name || !formData.sku || !formData.category || !formData.unitPrice) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     if (parseFloat(formData.unitPrice) <= 0) {
//       Alert.alert('Error', 'Unit price must be greater than 0');
//       return;
//     }

//     const initialQty = parseInt(formData.initialQuantity) || 0;
//     if (initialQty < 0) {
//       Alert.alert('Error', 'Initial quantity cannot be negative');
//       return;
//     }

//     setLoading(true);
//     try {
//       await ProductService.createProduct({
//         ...formData,
//         unitPrice: parseFloat(formData.unitPrice),
//         costPrice: parseFloat(formData.costPrice) || 0,
//         taxRate: parseFloat(formData.taxRate) || 0,
//         minStockLevel: parseInt(formData.minStockLevel) || 5,
//         maxStockLevel: parseInt(formData.maxStockLevel) || 100,
//         initialQuantity: initialQty,
//       });

//       Alert.alert(
//         'Success',
//         `✅ Product "${formData.name}" created successfully!\n\n📦 Initial Stock: ${initialQty} units\n💰 Unit Price: $${parseFloat(formData.unitPrice).toFixed(2)}`,
//         [{ text: 'OK', onPress: () => router.back() }]
//       );
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to create product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateField = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <CustomHeader title="New Product" />
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <Package size={24} color={Colors.primary} />
//           <Text style={styles.title}>Add New Product</Text>
//         </View>

//         <Text style={styles.sectionTitle}>📋 Product Information</Text>

//         <View style={styles.field}>
//           <Text style={styles.label}>Product Name <Text style={styles.required}>*</Text></Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter product name"
//             value={formData.name}
//             onChangeText={(text) => updateField('name', text)}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>

//         <View style={styles.field}>
//           <Text style={styles.label}>SKU <Text style={styles.required}>*</Text></Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter SKU (e.g., PRD-001)"
//             value={formData.sku}
//             onChangeText={(text) => updateField('sku', text.toUpperCase())}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>

//         <View style={styles.field}>
//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Enter product description"
//             value={formData.description}
//             onChangeText={(text) => updateField('description', text)}
//             multiline
//             numberOfLines={3}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>

//         <View style={styles.row}>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Electronics"
//               value={formData.category}
//               onChangeText={(text) => updateField('category', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Sub Category</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Smartphones"
//               value={formData.subCategory}
//               onChangeText={(text) => updateField('subCategory', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>
//         </View>

//         <View style={styles.field}>
//           <Text style={styles.label}>Brand</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter brand name"
//             value={formData.brand}
//             onChangeText={(text) => updateField('brand', text)}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>

//         <Text style={styles.sectionTitle}>💰 Pricing & Tax</Text>

//         <View style={styles.row}>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Unit Price <Text style={styles.required}>*</Text></Text>
//             <TextInput
//               style={styles.input}
//               placeholder="0.00"
//               keyboardType="decimal-pad"
//               value={formData.unitPrice}
//               onChangeText={(text) => updateField('unitPrice', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Cost Price</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="0.00"
//               keyboardType="decimal-pad"
//               value={formData.costPrice}
//               onChangeText={(text) => updateField('costPrice', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>
//         </View>

//         <View style={styles.row}>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Tax Rate %</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="0"
//               keyboardType="numeric"
//               value={formData.taxRate}
//               onChangeText={(text) => updateField('taxRate', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Unit of Measure</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="each, kg, box, etc."
//               value={formData.unitOfMeasure}
//               onChangeText={(text) => updateField('unitOfMeasure', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>
//         </View>

//         <Text style={styles.sectionTitle}>📦 Stock Management</Text>

//         <View style={[styles.field, styles.initialStockField]}>
//           <View style={styles.initialStockHeader}>
//             <Text style={styles.label}>Initial Stock Quantity <Text style={styles.required}>*</Text></Text>
//             <View style={styles.infoBadge}>
//               <Info size={14} color={Colors.primary} />
//             </View>
//           </View>
//           <TextInput
//             style={[styles.input, styles.initialStockInput]}
//             placeholder="0"
//             keyboardType="numeric"
//             value={formData.initialQuantity}
//             onChangeText={(text) => updateField('initialQuantity', text)}
//             placeholderTextColor={Colors.gray400}
//           />
//           <Text style={styles.helperText}>📌 This will be the starting stock quantity in inventory</Text>
//           <Text style={styles.helperTextHighlight}>💡 Set to 0 if you want to add stock later via inventory adjustment</Text>
//         </View>

//         <View style={styles.row}>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Min Stock Level</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="5"
//               keyboardType="numeric"
//               value={formData.minStockLevel}
//               onChangeText={(text) => updateField('minStockLevel', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//             <Text style={styles.helperText}>⚠️ Low stock alert threshold</Text>
//           </View>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>Max Stock Level</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="100"
//               keyboardType="numeric"
//               value={formData.maxStockLevel}
//               onChangeText={(text) => updateField('maxStockLevel', text)}
//               placeholderTextColor={Colors.gray400}
//             />
//             <Text style={styles.helperText}>📈 Maximum stock capacity (optional)</Text>
//           </View>
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
//             {loading ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.submitButtonText}>Create Product</Text>}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   content: { padding: Spacing.md },
//   card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing['2xl'], ...Shadows.sm },
//   header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['2xl'] },
//   title: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginLeft: Spacing.sm },
//   sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray700, marginTop: Spacing.md, marginBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.gray200, paddingBottom: Spacing.sm },
//   field: { marginBottom: Spacing.md },
//   halfField: { flex: 1 },
//   row: { flexDirection: 'row', gap: Spacing.sm },
//   label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
//   required: { color: Colors.error },
//   input: { borderWidth: 1, borderColor: Colors.gray300, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: Typography.md, backgroundColor: Colors.white },
//   textArea: { height: 80, textAlignVertical: 'top' },
//   initialStockField: { backgroundColor: Colors.primary + '05', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '20' },
//   initialStockHeader: { flexDirection: 'row', alignItems: 'center' },
//   initialStockInput: { borderColor: Colors.primary + '30', backgroundColor: Colors.white },
//   infoBadge: { marginLeft: Spacing.xs, padding: 2 },
//   helperText: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 2 },
//   helperTextHighlight: { fontSize: Typography.xs, color: Colors.primary, marginTop: 2, fontWeight: '500' },
//   buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
//   button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
//   cancelButton: { backgroundColor: Colors.gray200 },
//   cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
//   submitButton: { backgroundColor: Colors.primary },
//   submitButtonText: { fontWeight: '600', color: Colors.white },
//   buttonDisabled: { opacity: 0.7 },
// });


































// app/(stacks)/products/new.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Save, X, Package, Info, Store, ChevronDown, Check } from 'lucide-react-native';
import ProductService from '../../../../services/productService';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';
import CustomHeader from '../../../../components/ui/CustomHeader';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);
  const [stores, setStores] = useState([]);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    unitPrice: '',
    costPrice: '',
    taxRate: '0',
    minStockLevel: '5',
    maxStockLevel: '100',
    unitOfMeasure: 'each',
    initialQuantity: '0',
    storeId: '', // ← Store ID for product assignment
  });

  useEffect(() => {
    fetchUserStores();
  }, []);

  const fetchUserStores = async () => {
    try {
      const storesData = await ProductService.getUserStores();
      setStores(storesData);
      
      // Auto-select first store if only one available
      if (storesData.length === 1) {
        const store = storesData[0];
        setSelectedStore(store);
        setFormData(prev => ({ ...prev, storeId: store._id }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load stores');
    } finally {
      setLoadingStores(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name || !formData.sku || !formData.category || !formData.unitPrice) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.storeId) {
      Alert.alert('Error', 'Please select a store for this product');
      return;
    }

    if (parseFloat(formData.unitPrice) <= 0) {
      Alert.alert('Error', 'Unit price must be greater than 0');
      return;
    }

    const initialQty = parseInt(formData.initialQuantity) || 0;
    if (initialQty < 0) {
      Alert.alert('Error', 'Initial quantity cannot be negative');
      return;
    }

    setLoading(true);
    try {
      const result = await ProductService.createProduct({
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        costPrice: parseFloat(formData.costPrice) || 0,
        taxRate: parseFloat(formData.taxRate) || 0,
        minStockLevel: parseInt(formData.minStockLevel) || 5,
        maxStockLevel: parseInt(formData.maxStockLevel) || 100,
        initialQuantity: initialQty,
        storeId: formData.storeId,
      });
      
      Alert.alert(
        'Success', 
        `✅ Product "${formData.name}" created successfully!\n\n🏪 Store: ${selectedStore?.name || 'N/A'}\n📦 Initial Stock: ${initialQty} units\n💰 Unit Price: $${parseFloat(formData.unitPrice).toFixed(2)}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const selectStore = (store) => {
    setSelectedStore(store);
    setFormData(prev => ({ ...prev, storeId: store._id }));
    setShowStoreModal(false);
  };

  const renderStoreModal = () => (
    <Modal
      visible={showStoreModal}
      animationType="slide"
      transparent={true}
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
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.storeItem,
                  selectedStore?._id === item._id && styles.storeItemSelected,
                ]}
                onPress={() => selectStore(item)}
              >
                <View style={styles.storeItemLeft}>
                  <Store size={20} color={Colors.primary} />
                  <View style={styles.storeItemInfo}>
                    <Text style={styles.storeItemName}>{item.name}</Text>
                    <Text style={styles.storeItemCode}>Code: {item.code}</Text>
                  </View>
                </View>
                {selectedStore?._id === item._id && (
                  <Check size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyStoresContainer}>
                <Text style={styles.emptyStoresText}>No stores available</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  if (loadingStores) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomHeader title="New Product" />
      <View style={styles.card}>
        <View style={styles.header}>
          <Package size={24} color={Colors.primary} />
          <Text style={styles.title}>Add New Product</Text>
        </View>

        {/* Store Selection - NEW */}
        <View style={styles.storeSelectionSection}>
          <Text style={styles.sectionTitle}>🏪 Store Assignment</Text>
          <TouchableOpacity
            style={styles.storeSelector}
            onPress={() => setShowStoreModal(true)}
            disabled={stores.length === 0}
          >
            <View style={styles.storeSelectorLeft}>
              <Store size={20} color={Colors.primary} />
              <Text style={styles.storeSelectorText}>
                {selectedStore ? selectedStore.name : 'Select a store...'}
              </Text>
            </View>
            <ChevronDown size={20} color={Colors.gray400} />
          </TouchableOpacity>
          {!selectedStore && (
            <Text style={styles.storeWarning}>
              ⚠️ Please select a store for this product
            </Text>
          )}
          {selectedStore && (
            <Text style={styles.storeInfo}>
              ✅ Product will be assigned to: {selectedStore.name} ({selectedStore.code})
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>📋 Product Information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Product Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            SKU <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter SKU (e.g., PRD-001)"
            value={formData.sku}
            onChangeText={(text) => updateField('sku', text.toUpperCase())}
            placeholderTextColor={Colors.gray400}
          />
          <Text style={styles.helperText}>
            ℹ️ SKU must be unique within the selected store
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter product description"
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Electronics"
              value={formData.category}
              onChangeText={(text) => updateField('category', text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Sub Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Smartphones"
              value={formData.subCategory}
              onChangeText={(text) => updateField('subCategory', text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter brand name"
            value={formData.brand}
            onChangeText={(text) => updateField('brand', text)}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <Text style={styles.sectionTitle}>💰 Pricing & Tax</Text>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              Unit Price <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={formData.unitPrice}
              onChangeText={(text) => updateField('unitPrice', text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Cost Price</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={formData.costPrice}
              onChangeText={(text) => updateField('costPrice', text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Tax Rate %</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={formData.taxRate}
              onChangeText={(text) => updateField('taxRate', text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Unit of Measure</Text>
            <TextInput
              style={styles.input}
              placeholder="each, kg, box, etc."
              value={formData.unitOfMeasure}
              onChangeText={(text) => updateField('unitOfMeasure', text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>📦 Stock Management</Text>

        <View style={[styles.field, styles.initialStockField]}>
          <View style={styles.initialStockHeader}>
            <Text style={styles.label}>
              Initial Stock Quantity <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.infoBadge}>
              <Info size={14} color={Colors.primary} />
            </View>
          </View>
          <TextInput
            style={[styles.input, styles.initialStockInput]}
            placeholder="0"
            keyboardType="numeric"
            value={formData.initialQuantity}
            onChangeText={(text) => updateField('initialQuantity', text)}
            placeholderTextColor={Colors.gray400}
          />
          <Text style={styles.helperText}>
            📌 This will be the starting stock quantity in inventory
          </Text>
          <Text style={styles.helperTextHighlight}>
            💡 Set to 0 if you want to add stock later via inventory adjustment
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Min Stock Level</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              keyboardType="numeric"
              value={formData.minStockLevel}
              onChangeText={(text) => updateField('minStockLevel', text)}
              placeholderTextColor={Colors.gray400}
            />
            <Text style={styles.helperText}>
              ⚠️ Low stock alert threshold
            </Text>
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Max Stock Level</Text>
            <TextInput
              style={styles.input}
              placeholder="100"
              keyboardType="numeric"
              value={formData.maxStockLevel}
              onChangeText={(text) => updateField('maxStockLevel', text)}
              placeholderTextColor={Colors.gray400}
            />
            <Text style={styles.helperText}>
              📈 Maximum stock capacity (optional)
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Create Product</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {renderStoreModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    ...Shadows.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['2xl'] },
  title: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginLeft: Spacing.sm },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray700,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingBottom: Spacing.sm,
  },
  // Store Selection Styles
  storeSelectionSection: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary + '05',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  storeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  storeSelectorLeft: { flexDirection: 'row', alignItems: 'center' },
  storeSelectorText: {
    fontSize: Typography.md,
    color: Colors.gray900,
    marginLeft: Spacing.sm,
  },
  storeWarning: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  storeInfo: {
    fontSize: Typography.sm,
    color: Colors.success,
    marginTop: Spacing.xs,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    maxHeight: '70%',
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.gray900,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  storeItemSelected: {
    backgroundColor: Colors.primary + '10',
  },
  storeItemLeft: { flexDirection: 'row', alignItems: 'center' },
  storeItemInfo: { marginLeft: Spacing.md },
  storeItemName: { fontSize: Typography.md, fontWeight: '500', color: Colors.gray900 },
  storeItemCode: { fontSize: Typography.sm, color: Colors.gray500 },
  emptyStoresContainer: { paddingVertical: Spacing['2xl'], alignItems: 'center' },
  emptyStoresText: { color: Colors.gray500 },
  // ... rest of existing styles remain the same
  field: { marginBottom: Spacing.md },
  halfField: { flex: 1 },
  row: { flexDirection: 'row', gap: Spacing.sm },
  label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
  required: { color: Colors.error },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    backgroundColor: Colors.white,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  initialStockField: {
    backgroundColor: Colors.primary + '05',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  initialStockHeader: { flexDirection: 'row', alignItems: 'center' },
  initialStockInput: { borderColor: Colors.primary + '30', backgroundColor: Colors.white },
  infoBadge: { marginLeft: Spacing.xs, padding: 2 },
  helperText: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 2 },
  helperTextHighlight: { fontSize: Typography.xs, color: Colors.primary, marginTop: 2, fontWeight: '500' },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});