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
// import ProductService from '../../../services/productService';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';

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
//     initialQuantity: '0',  // ← NEW: Initial inventory quantity
//   });

//   const handleSave = async () => {
//     // Validate required fields
//     if (!formData.name || !formData.sku || !formData.category || !formData.unitPrice) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     // Validate price
//     if (parseFloat(formData.unitPrice) <= 0) {
//       Alert.alert('Error', 'Unit price must be greater than 0');
//       return;
//     }

//     // Validate initial quantity
//     const initialQty = parseInt(formData.initialQuantity) || 0;
//     if (initialQty < 0) {
//       Alert.alert('Error', 'Initial quantity cannot be negative');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Create product with initial inventory
//       const result = await ProductService.createProduct({
//         ...formData,
//         unitPrice: parseFloat(formData.unitPrice),
//         costPrice: parseFloat(formData.costPrice) || 0,
//         taxRate: parseFloat(formData.taxRate) || 0,
//         minStockLevel: parseInt(formData.minStockLevel) || 5,
//         maxStockLevel: parseInt(formData.maxStockLevel) || 100,
//         initialQuantity: initialQty,  // ← NEW: Send initial quantity
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
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <Package size={24} color={Colors.primary} />
//           <Text style={styles.title}>Add New Product</Text>
//         </View>

//         {/* Product Information */}
//         <Text style={styles.sectionTitle}>📋 Product Information</Text>

//         <View style={styles.field}>
//           <Text style={styles.label}>
//             Product Name <Text style={styles.required}>*</Text>
//           </Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter product name"
//             value={formData.name}
//             onChangeText={(text) => updateField('name', text)}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>

//         <View style={styles.field}>
//           <Text style={styles.label}>
//             SKU <Text style={styles.required}>*</Text>
//           </Text>
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
//             <Text style={styles.label}>
//               Category <Text style={styles.required}>*</Text>
//             </Text>
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

//         {/* Pricing Section */}
//         <Text style={styles.sectionTitle}>💰 Pricing & Tax</Text>

//         <View style={styles.row}>
//           <View style={[styles.field, styles.halfField]}>
//             <Text style={styles.label}>
//               Unit Price <Text style={styles.required}>*</Text>
//             </Text>
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

//         {/* Stock Management */}
//         <Text style={styles.sectionTitle}>📦 Stock Management</Text>

//         <View style={[styles.field, styles.initialStockField]}>
//           <View style={styles.initialStockHeader}>
//             <Text style={styles.label}>
//               Initial Stock Quantity <Text style={styles.required}>*</Text>
//             </Text>
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
//           <Text style={styles.helperText}>
//             📌 This will be the starting stock quantity in inventory
//           </Text>
//           <Text style={styles.helperTextHighlight}>
//             💡 Set to 0 if you want to add stock later via inventory adjustment
//           </Text>
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
//             <Text style={styles.helperText}>
//               ⚠️ Low stock alert threshold
//             </Text>
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
//             <Text style={styles.helperText}>
//               📈 Maximum stock capacity (optional)
//             </Text>
//           </View>
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.cancelButton]}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
//             onPress={handleSave}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color={Colors.white} size="small" />
//             ) : (
//               <Text style={styles.submitButtonText}>Create Product</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   content: {
//     padding: Spacing.md,
//   },
//   card: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing['2xl'],
//     ...Shadows.sm,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing['2xl'],
//   },
//   title: {
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//     marginLeft: Spacing.sm,
//   },
//   sectionTitle: {
//     fontSize: Typography.md,
//     fontWeight: '600',
//     color: Colors.gray700,
//     marginTop: Spacing.md,
//     marginBottom: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//     paddingBottom: Spacing.sm,
//   },
//   field: {
//     marginBottom: Spacing.md,
//   },
//   halfField: {
//     flex: 1,
//   },
//   row: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   label: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray700,
//     marginBottom: Spacing.xs,
//   },
//   required: {
//     color: Colors.error,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     backgroundColor: Colors.white,
//   },
//   textArea: {
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   initialStockField: {
//     backgroundColor: Colors.primary + '05',
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     borderWidth: 1,
//     borderColor: Colors.primary + '20',
//   },
//   initialStockHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   initialStockInput: {
//     borderColor: Colors.primary + '30',
//     backgroundColor: Colors.white,
//   },
//   infoBadge: {
//     marginLeft: Spacing.xs,
//     padding: 2,
//   },
//   helperText: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: 2,
//   },
//   helperTextHighlight: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     marginTop: 2,
//     fontWeight: '500',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//     marginTop: Spacing.md,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: Colors.gray200,
//   },
//   cancelButtonText: {
//     fontWeight: '600',
//     color: Colors.gray700,
//   },
//   submitButton: {
//     backgroundColor: Colors.primary,
//   },
//   submitButtonText: {
//     fontWeight: '600',
//     color: Colors.white,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
// });



























import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Save, X, Package, Info } from 'lucide-react-native';
import ProductService from '../../../../services/productService';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';
import CustomHeader from '../../../../components/ui/CustomHeader';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

  const handleSave = async () => {
    if (!formData.name || !formData.sku || !formData.category || !formData.unitPrice) {
      Alert.alert('Error', 'Please fill in all required fields');
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
      await ProductService.createProduct({
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        costPrice: parseFloat(formData.costPrice) || 0,
        taxRate: parseFloat(formData.taxRate) || 0,
        minStockLevel: parseInt(formData.minStockLevel) || 5,
        maxStockLevel: parseInt(formData.maxStockLevel) || 100,
        initialQuantity: initialQty,
      });

      Alert.alert(
        'Success',
        `✅ Product "${formData.name}" created successfully!\n\n📦 Initial Stock: ${initialQty} units\n💰 Unit Price: $${parseFloat(formData.unitPrice).toFixed(2)}`,
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomHeader title="New Product" />
      <View style={styles.card}>
        <View style={styles.header}>
          <Package size={24} color={Colors.primary} />
          <Text style={styles.title}>Add New Product</Text>
        </View>

        <Text style={styles.sectionTitle}>📋 Product Information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Product Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>SKU <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter SKU (e.g., PRD-001)"
            value={formData.sku}
            onChangeText={(text) => updateField('sku', text.toUpperCase())}
            placeholderTextColor={Colors.gray400}
          />
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
            <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.label}>Unit Price <Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.label}>Initial Stock Quantity <Text style={styles.required}>*</Text></Text>
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
          <Text style={styles.helperText}>📌 This will be the starting stock quantity in inventory</Text>
          <Text style={styles.helperTextHighlight}>💡 Set to 0 if you want to add stock later via inventory adjustment</Text>
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
            <Text style={styles.helperText}>⚠️ Low stock alert threshold</Text>
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
            <Text style={styles.helperText}>📈 Maximum stock capacity (optional)</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.submitButtonText}>Create Product</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing['2xl'], ...Shadows.sm },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['2xl'] },
  title: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginLeft: Spacing.sm },
  sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray700, marginTop: Spacing.md, marginBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.gray200, paddingBottom: Spacing.sm },
  field: { marginBottom: Spacing.md },
  halfField: { flex: 1 },
  row: { flexDirection: 'row', gap: Spacing.sm },
  label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
  required: { color: Colors.error },
  input: { borderWidth: 1, borderColor: Colors.gray300, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: Typography.md, backgroundColor: Colors.white },
  textArea: { height: 80, textAlignVertical: 'top' },
  initialStockField: { backgroundColor: Colors.primary + '05', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '20' },
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