// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Modal,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   Save,
//   X,
//   Package,
//   Edit,
//   Trash2,
//   Plus,
//   Minus,
//   AlertCircle,
//   Info,
// } from "lucide-react-native";
// import ProductService from "../../../../../services/productService";
// import InventoryService from "../../../../../services/inventoryService";
// import { formatCurrency, formatDate } from "../../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../../constants/theme";

// export default function ProductDetail() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [product, setProduct] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     sku: "",
//     description: "",
//     category: "",
//     subCategory: "",
//     brand: "",
//     unitPrice: "",
//     costPrice: "",
//     taxRate: "",
//     minStockLevel: "",
//     maxStockLevel: "",
//     unitOfMeasure: "",
//   });
//   const [showAdjustModal, setShowAdjustModal] = useState(false);
//   const [adjustQuantity, setAdjustQuantity] = useState(0);
//   const [adjustReason, setAdjustReason] = useState("");

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const data = await ProductService.getProduct(id);
//       setProduct(data);
//       setFormData({
//         name: data.name,
//         sku: data.sku,
//         description: data.description || "",
//         category: data.category,
//         subCategory: data.subCategory || "",
//         brand: data.brand || "",
//         unitPrice: String(data.unitPrice),
//         costPrice: String(data.costPrice || 0),
//         taxRate: String(data.taxRate || 0),
//         minStockLevel: String(data.minStockLevel || 5),
//         maxStockLevel: String(data.maxStockLevel || 100),
//         unitOfMeasure: data.unitOfMeasure || "each",
//       });
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to load product",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await ProductService.updateProduct(id, {
//         ...formData,
//         unitPrice: parseFloat(formData.unitPrice),
//         costPrice: parseFloat(formData.costPrice) || 0,
//         taxRate: parseFloat(formData.taxRate) || 0,
//         minStockLevel: parseInt(formData.minStockLevel) || 5,
//         maxStockLevel: parseInt(formData.maxStockLevel) || 100,
//       });
//       Alert.alert("Success", "Product updated successfully");
//       setIsEditing(false);
//       fetchProduct();
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to update product",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     Alert.alert(
//       "Delete Product",
//       "Are you sure you want to delete this product?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await ProductService.deleteProduct(id);
//               Alert.alert("Success", "Product deleted");
//               router.back();
//             } catch (error) {
//               Alert.alert(
//                 "Error",
//                 error.response?.data?.message || "Failed to delete product",
//               );
//             }
//           },
//         },
//       ],
//     );
//   };

//   const handleAdjustStock = async () => {
//     if (adjustQuantity === 0) {
//       Alert.alert("Error", "Please enter a quantity");
//       return;
//     }
//     if (!adjustReason.trim()) {
//       Alert.alert("Error", "Please enter a reason");
//       return;
//     }

//     setSaving(true);
//     try {
//       const result = await InventoryService.adjustStock(
//         id,
//         adjustQuantity,
//         adjustReason.trim(),
//       );
//       Alert.alert(
//         "Success",
//         `Stock adjusted from ${result.previousQuantity} to ${result.newQuantity}`,
//         [
//           {
//             text: "OK",
//             onPress: () => {
//               setShowAdjustModal(false);
//               setAdjustQuantity(0);
//               setAdjustReason("");
//               fetchProduct();
//             },
//           },
//         ],
//       );
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to adjust stock",
//       );
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

//   if (!product) {
//     return (
//       <View style={styles.errorContainer}>
//         <AlertCircle size={48} color={Colors.gray300} />
//         <Text style={styles.errorText}>Product not found</Text>
//         <TouchableOpacity
//           style={styles.errorButton}
//           onPress={() => router.back()}
//         >
//           <Text style={styles.errorButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <View style={styles.iconContainer}>
//               <Package size={24} color={Colors.primary} />
//             </View>
//             <View style={styles.headerInfo}>
//               <Text style={styles.productName}>{product.name}</Text>
//               <Text style={styles.productSku}>SKU: {product.sku}</Text>
//             </View>
//           </View>
//           <View style={styles.headerActions}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => setIsEditing(!isEditing)}
//             >
//               <Edit
//                 size={20}
//                 color={isEditing ? Colors.primary : Colors.gray500}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={handleDelete}
//             >
//               <Trash2 size={20} color={Colors.error} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.inventoryCard}>
//           <View style={styles.inventoryItem}>
//             <Text style={styles.inventoryLabel}>Current Stock</Text>
//             <Text style={styles.inventoryValue}>
//               {product.inventory?.quantity || 0}
//             </Text>
//           </View>
//           <View style={styles.inventoryItem}>
//             <Text style={styles.inventoryLabel}>Reserved</Text>
//             <Text style={styles.inventoryValue}>
//               {product.inventory?.reservedQuantity || 0}
//             </Text>
//           </View>
//           <View style={styles.inventoryItem}>
//             <Text style={styles.inventoryLabel}>Available</Text>
//             <Text style={styles.inventoryValue}>
//               {(product.inventory?.quantity || 0) -
//                 (product.inventory?.reservedQuantity || 0)}
//             </Text>
//           </View>
//           <View style={styles.inventoryItem}>
//             <Text style={styles.inventoryLabel}>Unit Price</Text>
//             <Text style={[styles.inventoryValue, styles.priceValue]}>
//               {formatCurrency(product.unitPrice)}
//             </Text>
//           </View>
//         </View>

//         {product.inventory && (
//           <View style={styles.initialStockInfo}>
//             <Info size={16} color={Colors.primary} />
//             <Text style={styles.initialStockText}>
//               Initial Stock: {product.inventory.quantity || 0} units
//               {product.inventory.lastCounted &&
//                 ` • Last Counted: ${formatDate(product.inventory.lastCounted)}`}
//             </Text>
//           </View>
//         )}

//         <TouchableOpacity
//           style={styles.adjustButton}
//           onPress={() => setShowAdjustModal(true)}
//         >
//           <Text style={styles.adjustButtonText}>Adjust Stock</Text>
//         </TouchableOpacity>

//         {isEditing ? (
//           <View style={styles.editForm}>
//             <View style={styles.field}>
//               <Text style={styles.label}>Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.name}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, name: text })
//                 }
//               />
//             </View>
//             <View style={styles.field}>
//               <Text style={styles.label}>SKU *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.sku}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, sku: text.toUpperCase() })
//                 }
//               />
//             </View>
//             <View style={styles.field}>
//               <Text style={styles.label}>Description</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 value={formData.description}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, description: text })
//                 }
//                 multiline
//                 numberOfLines={3}
//               />
//             </View>
//             <View style={styles.row}>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Category *</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.category}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, category: text })
//                   }
//                 />
//               </View>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Sub Category</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.subCategory}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, subCategory: text })
//                   }
//                 />
//               </View>
//             </View>
//             <View style={styles.field}>
//               <Text style={styles.label}>Brand</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.brand}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, brand: text })
//                 }
//               />
//             </View>
//             <View style={styles.row}>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Unit Price *</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.unitPrice}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, unitPrice: text })
//                   }
//                   keyboardType="decimal-pad"
//                 />
//               </View>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Cost Price</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.costPrice}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, costPrice: text })
//                   }
//                   keyboardType="decimal-pad"
//                 />
//               </View>
//             </View>
//             <View style={styles.row}>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Tax Rate %</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.taxRate}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, taxRate: text })
//                   }
//                   keyboardType="numeric"
//                 />
//               </View>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Min Stock Level</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.minStockLevel}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, minStockLevel: text })
//                   }
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>
//             <View style={styles.row}>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Max Stock Level</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.maxStockLevel}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, maxStockLevel: text })
//                   }
//                   keyboardType="numeric"
//                 />
//               </View>
//               <View style={[styles.field, styles.halfField]}>
//                 <Text style={styles.label}>Unit of Measure</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.unitOfMeasure}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, unitOfMeasure: text })
//                   }
//                 />
//               </View>
//             </View>
//             <View style={styles.buttonRow}>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={() => {
//                   setIsEditing(false);
//                   fetchProduct();
//                 }}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.button,
//                   styles.submitButton,
//                   saving && styles.buttonDisabled,
//                 ]}
//                 onPress={handleSave}
//                 disabled={saving}
//               >
//                 <Text style={styles.submitButtonText}>
//                   {saving ? "Saving..." : "Save"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.detailsContainer}>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Description</Text>
//               <Text style={styles.detailValue}>
//                 {product.description || "No description"}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Category</Text>
//               <Text style={styles.detailValue}>{product.category}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Sub Category</Text>
//               <Text style={styles.detailValue}>
//                 {product.subCategory || "N/A"}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Brand</Text>
//               <Text style={styles.detailValue}>{product.brand || "N/A"}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Cost Price</Text>
//               <Text style={styles.detailValue}>
//                 {product.costPrice ? formatCurrency(product.costPrice) : "N/A"}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Tax Rate</Text>
//               <Text style={styles.detailValue}>{product.taxRate || 0}%</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Unit of Measure</Text>
//               <Text style={styles.detailValue}>
//                 {product.unitOfMeasure || "each"}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Min Stock Level</Text>
//               <Text style={styles.detailValue}>
//                 {product.minStockLevel || 5}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Max Stock Level</Text>
//               <Text style={styles.detailValue}>
//                 {product.maxStockLevel || "N/A"}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Created</Text>
//               <Text style={styles.detailValue}>
//                 {formatDate(product.createdAt)}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Status</Text>
//               <Text
//                 style={[
//                   styles.detailValue,
//                   product.isActive ? styles.activeText : styles.inactiveText,
//                 ]}
//               >
//                 {product.isActive ? "Active" : "Inactive"}
//               </Text>
//             </View>
//           </View>
//         )}
//       </View>

//       {/* Stock Adjustment Modal */}
//       <Modal visible={showAdjustModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Adjust Stock</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAdjustModal(false);
//                   setAdjustQuantity(0);
//                   setAdjustReason("");
//                 }}
//               >
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalBody}>
//               <View style={styles.modalProductInfo}>
//                 <Text style={styles.modalProductName}>{product?.name}</Text>
//                 <Text style={styles.modalProductSku}>SKU: {product?.sku}</Text>
//                 <View style={styles.modalStockInfo}>
//                   <Text style={styles.modalStockLabel}>Current Stock:</Text>
//                   <Text style={styles.modalStockValue}>
//                     {product?.inventory?.quantity || 0}
//                   </Text>
//                 </View>
//                 <View style={styles.modalStockInfo}>
//                   <Text style={styles.modalStockLabel}>Reserved:</Text>
//                   <Text style={styles.modalStockValue}>
//                     {product?.inventory?.reservedQuantity || 0}
//                   </Text>
//                 </View>
//                 <View style={styles.modalStockInfo}>
//                   <Text style={styles.modalStockLabel}>Available:</Text>
//                   <Text
//                     style={[styles.modalStockValue, styles.modalStockAvailable]}
//                   >
//                     {(product?.inventory?.quantity || 0) -
//                       (product?.inventory?.reservedQuantity || 0)}
//                   </Text>
//                 </View>
//                 <View style={styles.modalStockInfo}>
//                   <Text style={styles.modalStockLabel}>Reorder Point:</Text>
//                   <Text style={styles.modalStockValue}>
//                     {product?.minStockLevel || 5}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.field}>
//                 <Text style={styles.label}>Adjustment Quantity</Text>
//                 <View style={styles.quantityRow}>
//                   <TouchableOpacity
//                     style={styles.quantityButton}
//                     onPress={() => setAdjustQuantity((prev) => prev - 1)}
//                   >
//                     <Minus size={20} color={Colors.gray500} />
//                   </TouchableOpacity>
//                   <TextInput
//                     style={styles.quantityInput}
//                     keyboardType="numeric"
//                     value={String(adjustQuantity)}
//                     onChangeText={(text) =>
//                       setAdjustQuantity(parseInt(text) || 0)
//                     }
//                   />
//                   <TouchableOpacity
//                     style={styles.quantityButton}
//                     onPress={() => setAdjustQuantity((prev) => prev + 1)}
//                   >
//                     <Plus size={20} color={Colors.gray500} />
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={styles.helperText}>
//                   ➕ Positive to add, ➖ negative to remove
//                 </Text>
//               </View>

//               <View style={styles.field}>
//                 <Text style={styles.label}>
//                   Reason <Text style={styles.required}>*</Text>
//                 </Text>
//                 <TextInput
//                   style={styles.reasonInput}
//                   placeholder="Enter reason for adjustment"
//                   value={adjustReason}
//                   onChangeText={setAdjustReason}
//                   multiline
//                   numberOfLines={3}
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.buttonRow}>
//                 <TouchableOpacity
//                   style={[styles.button, styles.cancelButton]}
//                   onPress={() => {
//                     setShowAdjustModal(false);
//                     setAdjustQuantity(0);
//                     setAdjustReason("");
//                   }}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.button,
//                     styles.submitButton,
//                     saving && styles.buttonDisabled,
//                   ]}
//                   onPress={handleAdjustStock}
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <ActivityIndicator color={Colors.white} size="small" />
//                   ) : (
//                     <Text style={styles.submitButtonText}>Adjust Stock</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   content: { padding: Spacing.md },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: Spacing["2xl"],
//   },
//   errorText: {
//     fontSize: Typography.lg,
//     color: Colors.gray500,
//     marginTop: Spacing.md,
//   },
//   errorButton: {
//     marginTop: Spacing.md,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//   },
//   errorButtonText: { color: Colors.white, fontWeight: "600" },
//   card: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing["2xl"],
//     ...Shadows.sm,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.md,
//   },
//   headerLeft: { flexDirection: "row", alignItems: "center" },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     backgroundColor: Colors.primary + "10",
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerInfo: { marginLeft: Spacing.md },
//   productName: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   productSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   headerActions: { flexDirection: "row" },
//   actionButton: { padding: Spacing.sm },
//   inventoryCard: {
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   inventoryItem: { width: "50%", paddingVertical: Spacing.xs },
//   inventoryLabel: { fontSize: Typography.xs, color: Colors.gray500 },
//   inventoryValue: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   priceValue: { color: Colors.primary },
//   initialStockInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "10",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     marginBottom: Spacing.md,
//   },
//   initialStockText: {
//     fontSize: Typography.sm,
//     color: Colors.primary,
//     marginLeft: Spacing.sm,
//     flex: 1,
//   },
//   adjustButton: {
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//     paddingVertical: Spacing.sm,
//     alignItems: "center",
//     marginBottom: Spacing.md,
//   },
//   adjustButtonText: { color: Colors.white, fontWeight: "600" },
//   editForm: { gap: Spacing.md },
//   field: { marginBottom: Spacing.sm },
//   halfField: { flex: 1 },
//   row: { flexDirection: "row", gap: Spacing.sm },
//   label: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray700,
//     marginBottom: Spacing.xs,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   textArea: { height: 80, textAlignVertical: "top" },
//   buttonRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
//   button: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelButton: { backgroundColor: Colors.gray200 },
//   cancelButtonText: { fontWeight: "600", color: Colors.gray700 },
//   submitButton: { backgroundColor: Colors.primary },
//   submitButtonText: { fontWeight: "600", color: Colors.white },
//   buttonDisabled: { opacity: 0.7 },
//   detailsContainer: { gap: Spacing.sm },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: Spacing.xs,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   detailLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   detailValue: {
//     fontSize: Typography.sm,
//     color: Colors.gray900,
//     flex: 1,
//     textAlign: "right",
//   },
//   activeText: { color: Colors.success },
//   inactiveText: { color: Colors.error },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius["3xl"],
//     borderTopRightRadius: BorderRadius["3xl"],
//     padding: Spacing["2xl"],
//     maxHeight: "85%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.md,
//   },
//   modalTitle: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   modalBody: { gap: Spacing.md },
//   modalProductInfo: {
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//   },
//   modalProductName: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   modalProductSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   modalStockInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 2,
//   },
//   modalStockLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   modalStockValue: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   modalStockAvailable: { color: Colors.primary },
//   quantityRow: { flexDirection: "row", alignItems: "center" },
//   quantityButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantityInput: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.gray300,
//     paddingVertical: Spacing.sm,
//     marginHorizontal: Spacing.md,
//   },
//   helperText: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   reasonInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     minHeight: 60,
//     textAlignVertical: "top",
//   },
//   required: { color: Colors.error },
// });
























// app/(stacks)/products/[id]/detail.jsx
import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import {
  Save,
  X,
  Package,
  Edit,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  Info,
  ArrowRight,
  History,
} from "lucide-react-native";
import ProductService from "../../../../../services/productService";
import InventoryService from "../../../../../services/inventoryService";
import { formatCurrency, formatDate } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

export default function ProductDetail() {
  // const router = useRouter();
  // const { id } = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const { id } = params; // Make sure this matches the route parameter name
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    unitPrice: "",
    costPrice: "",
    taxRate: "",
    minStockLevel: "",
    maxStockLevel: "",
    unitOfMeasure: "",
  });
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await ProductService.getProduct(id);
      setProduct(data);
      setFormData({
        name: data.name,
        sku: data.sku,
        description: data.description || "",
        category: data.category,
        subCategory: data.subCategory || "",
        brand: data.brand || "",
        unitPrice: String(data.unitPrice),
        costPrice: String(data.costPrice || 0),
        taxRate: String(data.taxRate || 0),
        minStockLevel: String(data.minStockLevel || 5),
        maxStockLevel: String(data.maxStockLevel || 100),
        unitOfMeasure: data.unitOfMeasure || "each",
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load product",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await ProductService.updateProduct(id, {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        costPrice: parseFloat(formData.costPrice) || 0,
        taxRate: parseFloat(formData.taxRate) || 0,
        minStockLevel: parseInt(formData.minStockLevel) || 5,
        maxStockLevel: parseInt(formData.maxStockLevel) || 100,
      });
      Alert.alert("Success", "Product updated successfully");
      setIsEditing(false);
      fetchProduct();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update product",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await ProductService.deleteProduct(id);
              Alert.alert("Success", "Product deleted");
              router.back();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to delete product",
              );
            }
          },
        },
      ],
    );
  };

  const handleAdjustStock = async () => {
    if (adjustQuantity === 0) {
      Alert.alert("Error", "Please enter a quantity");
      return;
    }
    if (!adjustReason.trim()) {
      Alert.alert("Error", "Please enter a reason");
      return;
    }

    setSaving(true);
    try {
      const result = await InventoryService.adjustStock(
        id,
        adjustQuantity,
        adjustReason.trim(),
      );
      Alert.alert(
        "Success",
        `Stock adjusted from ${result.previousQuantity} to ${result.newQuantity}`,
        [
          {
            text: "OK",
            onPress: () => {
              setShowAdjustModal(false);
              setAdjustQuantity(0);
              setAdjustReason("");
              fetchProduct();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to adjust stock",
      );
    } finally {
      setSaving(false);
    }
  };

  // Navigation handlers
  const navigateToInventory = () => {
    router.push(`/products/${id}/inventory`);
  };

  const navigateToMovements = () => {
    router.push(`/products/${id}/movements`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color={Colors.gray300} />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomHeader title="Product Details" />
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Package size={24} color={Colors.primary} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSku}>SKU: {product.sku}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit
                size={20}
                color={isEditing ? Colors.primary : Colors.gray500}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Navigation Links */}
        <View style={styles.quickNavContainer}>
          <TouchableOpacity
            style={styles.quickNavButton}
            onPress={navigateToInventory}
          >
            <Package size={20} color={Colors.primary} />
            <Text style={styles.quickNavText}>Inventory</Text>
            <ArrowRight size={16} color={Colors.gray400} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickNavButton}
            onPress={navigateToMovements}
          >
            <History size={20} color={Colors.primary} />
            <Text style={styles.quickNavText}>Movements</Text>
            <ArrowRight size={16} color={Colors.gray400} />
          </TouchableOpacity>
        </View>

        <View style={styles.inventoryCard}>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Current Stock</Text>
            <Text style={styles.inventoryValue}>
              {product.inventory?.quantity || 0}
            </Text>
          </View>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Reserved</Text>
            <Text style={styles.inventoryValue}>
              {product.inventory?.reservedQuantity || 0}
            </Text>
          </View>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Available</Text>
            <Text style={styles.inventoryValue}>
              {(product.inventory?.quantity || 0) -
                (product.inventory?.reservedQuantity || 0)}
            </Text>
          </View>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Unit Price</Text>
            <Text style={[styles.inventoryValue, styles.priceValue]}>
              {formatCurrency(product.unitPrice)}
            </Text>
          </View>
        </View>

        {product.inventory && (
          <View style={styles.initialStockInfo}>
            <Info size={16} color={Colors.primary} />
            <Text style={styles.initialStockText}>
              Initial Stock: {product.inventory.quantity || 0} units
              {product.inventory.lastCounted &&
                ` • Last Counted: ${formatDate(product.inventory.lastCounted)}`}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => setShowAdjustModal(true)}
        >
          <Text style={styles.adjustButtonText}>Adjust Stock</Text>
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.field}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>SKU *</Text>
              <TextInput
                style={styles.input}
                value={formData.sku}
                onChangeText={(text) =>
                  setFormData({ ...formData, sku: text.toUpperCase() })
                }
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Category *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.category}
                  onChangeText={(text) =>
                    setFormData({ ...formData, category: text })
                  }
                />
              </View>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Sub Category</Text>
                <TextInput
                  style={styles.input}
                  value={formData.subCategory}
                  onChangeText={(text) =>
                    setFormData({ ...formData, subCategory: text })
                  }
                />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Brand</Text>
              <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(text) =>
                  setFormData({ ...formData, brand: text })
                }
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Unit Price *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.unitPrice}
                  onChangeText={(text) =>
                    setFormData({ ...formData, unitPrice: text })
                  }
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Cost Price</Text>
                <TextInput
                  style={styles.input}
                  value={formData.costPrice}
                  onChangeText={(text) =>
                    setFormData({ ...formData, costPrice: text })
                  }
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Tax Rate %</Text>
                <TextInput
                  style={styles.input}
                  value={formData.taxRate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, taxRate: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Min Stock Level</Text>
                <TextInput
                  style={styles.input}
                  value={formData.minStockLevel}
                  onChangeText={(text) =>
                    setFormData({ ...formData, minStockLevel: text })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Max Stock Level</Text>
                <TextInput
                  style={styles.input}
                  value={formData.maxStockLevel}
                  onChangeText={(text) =>
                    setFormData({ ...formData, maxStockLevel: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Unit of Measure</Text>
                <TextInput
                  style={styles.input}
                  value={formData.unitOfMeasure}
                  onChangeText={(text) =>
                    setFormData({ ...formData, unitOfMeasure: text })
                  }
                />
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  fetchProduct();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  saving && styles.buttonDisabled,
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.submitButtonText}>
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>
                {product.description || "No description"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sub Category</Text>
              <Text style={styles.detailValue}>
                {product.subCategory || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{product.brand || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cost Price</Text>
              <Text style={styles.detailValue}>
                {product.costPrice ? formatCurrency(product.costPrice) : "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tax Rate</Text>
              <Text style={styles.detailValue}>{product.taxRate || 0}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Unit of Measure</Text>
              <Text style={styles.detailValue}>
                {product.unitOfMeasure || "each"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Min Stock Level</Text>
              <Text style={styles.detailValue}>
                {product.minStockLevel || 5}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Max Stock Level</Text>
              <Text style={styles.detailValue}>
                {product.maxStockLevel || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>
                {formatDate(product.createdAt)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text
                style={[
                  styles.detailValue,
                  product.isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {product.isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Stock Adjustment Modal */}
      <Modal visible={showAdjustModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Stock</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAdjustModal(false);
                  setAdjustQuantity(0);
                  setAdjustReason("");
                }}
              >
                <X size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalProductInfo}>
                <Text style={styles.modalProductName}>{product?.name}</Text>
                <Text style={styles.modalProductSku}>SKU: {product?.sku}</Text>
                <View style={styles.modalStockInfo}>
                  <Text style={styles.modalStockLabel}>Current Stock:</Text>
                  <Text style={styles.modalStockValue}>
                    {product?.inventory?.quantity || 0}
                  </Text>
                </View>
                <View style={styles.modalStockInfo}>
                  <Text style={styles.modalStockLabel}>Reserved:</Text>
                  <Text style={styles.modalStockValue}>
                    {product?.inventory?.reservedQuantity || 0}
                  </Text>
                </View>
                <View style={styles.modalStockInfo}>
                  <Text style={styles.modalStockLabel}>Available:</Text>
                  <Text
                    style={[styles.modalStockValue, styles.modalStockAvailable]}
                  >
                    {(product?.inventory?.quantity || 0) -
                      (product?.inventory?.reservedQuantity || 0)}
                  </Text>
                </View>
                <View style={styles.modalStockInfo}>
                  <Text style={styles.modalStockLabel}>Reorder Point:</Text>
                  <Text style={styles.modalStockValue}>
                    {product?.minStockLevel || 5}
                  </Text>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Adjustment Quantity</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setAdjustQuantity((prev) => prev - 1)}
                  >
                    <Minus size={20} color={Colors.gray500} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    value={String(adjustQuantity)}
                    onChangeText={(text) =>
                      setAdjustQuantity(parseInt(text) || 0)
                    }
                  />
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setAdjustQuantity((prev) => prev + 1)}
                  >
                    <Plus size={20} color={Colors.gray500} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>
                  ➕ Positive to add, ➖ negative to remove
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  Reason <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Enter reason for adjustment"
                  value={adjustReason}
                  onChangeText={setAdjustReason}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={Colors.gray400}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setShowAdjustModal(false);
                    setAdjustQuantity(0);
                    setAdjustReason("");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.submitButton,
                    saving && styles.buttonDisabled,
                  ]}
                  onPress={handleAdjustStock}
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
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  errorText: {
    fontSize: Typography.lg,
    color: Colors.gray500,
    marginTop: Spacing.md,
  },
  errorButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  errorButtonText: { color: Colors.white, fontWeight: "600" },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    ...Shadows.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary + "10",
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { marginLeft: Spacing.md },
  productName: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  productSku: { fontSize: Typography.sm, color: Colors.gray500 },
  headerActions: { flexDirection: "row" },
  actionButton: { padding: Spacing.sm },
  quickNavContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  quickNavButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.gray50,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  quickNavText: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  inventoryCard: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  inventoryItem: { width: "50%", paddingVertical: Spacing.xs },
  inventoryLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  inventoryValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  priceValue: { color: Colors.primary },
  initialStockInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  initialStockText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  adjustButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  adjustButtonText: { color: Colors.white, fontWeight: "600" },
  editForm: { gap: Spacing.md },
  field: { marginBottom: Spacing.sm },
  halfField: { flex: 1 },
  row: { flexDirection: "row", gap: Spacing.sm },
  label: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.md,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  buttonRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: "600", color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
  detailsContainer: { gap: Spacing.sm },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  detailValue: {
    fontSize: Typography.sm,
    color: Colors.gray900,
    flex: 1,
    textAlign: "right",
  },
  activeText: { color: Colors.success },
  inactiveText: { color: Colors.error },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["3xl"],
    borderTopRightRadius: BorderRadius["3xl"],
    padding: Spacing["2xl"],
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalBody: { gap: Spacing.md },
  modalProductInfo: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  modalProductName: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalProductSku: { fontSize: Typography.sm, color: Colors.gray500 },
  modalStockInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  modalStockLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  modalStockValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  modalStockAvailable: { color: Colors.primary },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.xl,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  helperText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 60,
    textAlignVertical: "top",
  },
  required: { color: Colors.error },
});