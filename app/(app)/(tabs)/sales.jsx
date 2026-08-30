// // app/(app)/(tabs)/sales.jsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Modal,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { useAuth } from "../../../hooks/useAuth";
// import TransactionService from "../../../services/transactionService";
// import ProductService from "../../../services/productService";
// import {
//   Plus,
//   Minus,
//   Trash2,
//   ShoppingCart,
//   Search,
//   X,
//   XCircle,
//   QrCode,
//   RefreshCw,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   Send,
// } from "lucide-react-native";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";
// import { formatCurrency } from "../../../utils/formatters";

// // Custom Alert Modal Component
// const CustomAlertModal = ({ visible, title, message, buttons, onClose }) => {
//   return (
//     <Modal visible={visible} transparent={true} animationType="fade">
//       <View style={styles.alertOverlay}>
//         <View style={styles.alertContainer}>
//           <View style={styles.alertHeader}>
//             <Text style={styles.alertTitle}>{title}</Text>
//             <TouchableOpacity onPress={onClose} style={styles.alertCloseButton}>
//               <XCircle size={20} color={Colors.gray400} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.alertBody}>
//             <Text style={styles.alertMessage}>{message}</Text>
//           </View>
//           <View style={styles.alertFooter}>
//             {buttons && buttons.map((btn, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.alertButton,
//                   btn.style === 'cancel' ? styles.alertCancelButton : styles.alertPrimaryButton,
//                   index > 0 && styles.alertButtonMargin
//                 ]}
//                 onPress={() => {
//                   if (btn.onPress) btn.onPress();
//                   onClose();
//                 }}
//               >
//                 <Text style={btn.style === 'cancel' ? styles.alertCancelText : styles.alertPrimaryText}>
//                   {btn.text}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default function Sales() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [searchModal, setSearchModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [submitting, setSubmitting] = useState(false);
//   const [transactionResult, setTransactionResult] = useState(null);

//   // Alert Modal State
//   const [alertModal, setAlertModal] = useState({
//     visible: false,
//     title: "",
//     message: "",
//     buttons: [],
//     onClose: null,
//   });

//   const showAlert = (title, message, buttons = [{ text: "OK" }]) => {
//     return new Promise((resolve) => {
//       const wrappedButtons = buttons.map(btn => ({
//         ...btn,
//         onPress: () => {
//           if (btn.onPress) btn.onPress();
//           resolve();
//         }
//       }));
//       setAlertModal({
//         visible: true,
//         title,
//         message,
//         buttons: wrappedButtons,
//         onClose: resolve,
//       });
//     });
//   };

//   const closeAlert = () => {
//     setAlertModal(prev => ({ ...prev, visible: false }));
//     if (alertModal.onClose) alertModal.onClose();
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const result = await ProductService.getProducts({
//         limit: 100,
//         sortBy: "name",
//         sortOrder: "asc",
//       });
//       setProducts(result.products || []);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchProducts();
//     setRefreshing(false);
//   };

//   const searchProducts = () => {
//     if (!searchTerm.trim()) return products;
//     return products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   };

//   const addToLocalCart = (product, qty) => {
//     const existingIndex = cartItems.findIndex(
//       (item) => item.productId === product._id,
//     );

//     if (existingIndex >= 0) {
//       const updated = [...cartItems];
//       updated[existingIndex] = {
//         ...updated[existingIndex],
//         quantity: updated[existingIndex].quantity + qty,
//       };
//       setCartItems(updated);
//     } else {
//       setCartItems([
//         ...cartItems,
//         {
//           productId: product._id,
//           name: product.name,
//           sku: product.sku,
//           unitPrice: product.unitPrice,
//           quantity: qty,
//           taxRate: product.taxRate || 0,
//           product: product,
//         },
//       ]);
//     }
//   };

//   const removeFromLocalCart = (productId) => {
//     setCartItems(cartItems.filter((item) => item.productId !== productId));
//   };

//   const updateLocalQuantity = (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromLocalCart(productId);
//       return;
//     }
//     setCartItems(
//       cartItems.map((item) =>
//         item.productId === productId
//           ? { ...item, quantity: newQuantity }
//           : item,
//       ),
//     );
//   };

//   const clearLocalCart = () => {
//     if (cartItems.length === 0) return;
//     showAlert("Clear Cart", "Are you sure you want to remove all items?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Clear All",
//         style: "destructive",
//         onPress: () => setCartItems([]),
//       },
//     ]);
//   };

//   const submitTransaction = async () => {
//     if (cartItems.length === 0) {
//       await showAlert("Error", "Cart is empty. Please add items first.");
//       return;
//     }

//     const lowStockItems = cartItems.filter((item) => {
//       const inventory = item.product?.inventory;
//       return inventory && inventory.quantity < item.quantity;
//     });

//     if (lowStockItems.length > 0) {
//       await showAlert(
//         "Low Stock Warning",
//         `Some items have insufficient stock:\n${lowStockItems
//           .map(
//             (i) =>
//               `- ${i.name}: ${i.quantity} ordered, ${i.product?.inventory?.quantity || 0} available`,
//           )
//           .join("\n")}\n\nDo you want to continue?`,
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Continue", onPress: () => proceedWithSubmission() },
//         ]
//       );
//       return;
//     }

//     proceedWithSubmission();
//   };

//   const proceedWithSubmission = async () => {
//     setSubmitting(true);
//     try {
//       const items = cartItems.map((item) => ({
//         productId: item.productId,
//         quantity: item.quantity,
//       }));

//       const transaction = await TransactionService.createTransactionWithItems(items);
//       setTransactionResult({ transaction, success: true });

//       await showAlert(
//         "✅ Transaction Created!",
//         `Transaction: ${transaction.transactionNumber}\nItems: ${transaction.items?.length || 0}\nTotal: ${formatCurrency(transaction.totalAmount)}\n\nSales QR has been generated.`,
//         [
//           {
//             text: "View Receipt",
//             onPress: () =>
//               router.push({
//                 pathname: "/(app)/(modals)/receipt-preview",
//                 params: {
//                   transactionId: transaction._id,
//                   qrData: transaction.salesQR,
//                   qrType: "SALES",
//                   transactionNumber: transaction.transactionNumber,
//                   mode: "sales",
//                 },
//               }),
//           },
//           {
//             text: "Done",
//             style: "cancel",
//             onPress: () => {
//               setCartItems([]);
//               setTransactionResult(null);
//             },
//           },
//         ]
//       );
//     } catch (error) {
//       console.error("Submission error:", error);
//       await showAlert(
//         "Error",
//         error.response?.data?.message || "Failed to create transaction. Please try again."
//       );
//       setTransactionResult({ success: false, error: error.message });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getItemTotal = (item) => {
//     return (item.unitPrice || 0) * (item.quantity || 0);
//   };

//   const CartItem = ({ item }) => {
//     const total = getItemTotal(item);
//     const inventory = item.product?.inventory;
//     const isLowStock = inventory && inventory.quantity < item.quantity;
//     const isOutOfStock = inventory && inventory.quantity <= 0;

//     return (
//       <View
//         style={[styles.cartItem, isOutOfStock && styles.cartItemOutOfStock]}
//       >
//         <View style={styles.cartItemRow}>
//           <View style={styles.cartItemInfo}>
//             <View style={styles.cartItemHeader}>
//               <Text style={styles.cartItemName} numberOfLines={1}>
//                 {item.name}
//               </Text>
//               {isLowStock && (
//                 <View style={styles.lowStockBadge}>
//                   <AlertCircle size={12} color={Colors.error} />
//                   <Text style={styles.lowStockText}>Low Stock</Text>
//                 </View>
//               )}
//               {isOutOfStock && (
//                 <View style={styles.outOfStockBadge}>
//                   <AlertCircle size={12} color={Colors.error} />
//                   <Text style={styles.outOfStockBadgeText}>Out of Stock</Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.cartItemMeta}>
//               <View style={styles.cartItemTag}>
//                 <Text style={styles.cartItemTagText}>
//                   SKU: {item.sku || "N/A"}
//                 </Text>
//               </View>
//               {item.product?.brand && (
//                 <View style={styles.cartItemTag}>
//                   <Text style={styles.cartItemTagText}>
//                     {item.product.brand}
//                   </Text>
//                 </View>
//               )}
//               {item.product?.category && (
//                 <View style={styles.cartItemTag}>
//                   <Text style={styles.cartItemTagText}>
//                     {item.product.category}
//                   </Text>
//                 </View>
//               )}
//             </View>

//             {item.product?.description && (
//               <Text style={styles.cartItemDescription} numberOfLines={1}>
//                 {item.product.description}
//               </Text>
//             )}

//             <View style={styles.cartItemDetails}>
//               <View style={styles.cartItemStockInfo}>
//                 <View
//                   style={[
//                     styles.cartStockIndicator,
//                     inventory?.quantity > 10
//                       ? styles.stockHigh
//                       : inventory?.quantity > 0
//                         ? styles.stockMedium
//                         : styles.stockLow,
//                   ]}
//                 />
//                 <Text
//                   style={[
//                     styles.cartItemStock,
//                     inventory?.quantity === 0 && styles.stockOutText,
//                   ]}
//                 >
//                   {inventory?.quantity > 0
//                     ? `${inventory.quantity} available`
//                     : "Out of stock"}
//                 </Text>
//               </View>
//               <View style={styles.cartItemPriceContainer}>
//                 <Text style={styles.cartItemUnitPrice}>
//                   {formatCurrency(item.unitPrice)} each
//                 </Text>
//                 <Text style={styles.cartItemTotalPrice}>
//                   {formatCurrency(total)}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.cartItemActions}>
//             <View style={styles.cartQuantityControls}>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() =>
//                   updateLocalQuantity(item.productId, item.quantity - 1)
//                 }
//                 disabled={submitting || isOutOfStock}
//               >
//                 <Minus size={16} color={Colors.gray500} />
//               </TouchableOpacity>
//               <View style={styles.quantityDisplay}>
//                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                 {item.quantity > 1 && (
//                   <Text style={styles.quantitySubtext}>
//                     × {formatCurrency(item.unitPrice)}
//                   </Text>
//                 )}
//               </View>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() =>
//                   updateLocalQuantity(item.productId, item.quantity + 1)
//                 }
//                 disabled={submitting || isOutOfStock}
//               >
//                 <Plus size={16} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//               style={styles.removeButton}
//               onPress={() => removeFromLocalCart(item.productId)}
//               disabled={submitting}
//             >
//               <Trash2 size={20} color={Colors.error} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const getTotal = () => {
//     return cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
//   };

//   const getTaxTotal = () => {
//     return cartItems.reduce((sum, item) => {
//       const taxRate = item.taxRate || 0;
//       return sum + (getItemTotal(item) * taxRate) / 100;
//     }, 0);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={100}
//       >
//         <View style={styles.content}>
//           <View style={styles.header}>
//             <View style={styles.headerLeft}>
//               <Text style={styles.headerTitle}>Sales</Text>
//               {cartItems.length > 0 && (
//                 <View style={styles.cartBadge}>
//                   <Package size={14} color={Colors.primary} />
//                   <Text style={styles.cartBadgeText}>
//                     {cartItems.length} items
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <View style={styles.headerRight}>
//               {cartItems.length > 0 && (
//                 <TouchableOpacity
//                   style={styles.clearHeaderButton}
//                   onPress={clearLocalCart}
//                   disabled={submitting}
//                 >
//                   <Trash2 size={18} color={Colors.error} />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           <View style={styles.cartContainer}>
//             {cartItems.length === 0 ? (
//               <View style={styles.emptyCart}>
//                 <ShoppingCart size={80} color={Colors.gray300} />
//                 <Text style={styles.emptyCartTitle}>Cart is Empty</Text>
//                 <Text style={styles.emptyCartSubtitle}>
//                   Search and add products to create a transaction
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.emptyCartButton}
//                   onPress={() => setSearchModal(true)}
//                 >
//                   <Plus size={20} color={Colors.white} />
//                   <Text style={styles.emptyCartButtonText}>Add Items</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <>
//                 <View style={styles.cartHeader}>
//                   <View style={styles.cartHeaderLeft}>
//                     <Text style={styles.cartItemCount}>
//                       {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
//                     </Text>
//                     <View style={styles.cartHeaderBadge}>
//                       <Text style={styles.cartHeaderBadgeText}>
//                         {cartItems.reduce(
//                           (sum, item) => sum + item.quantity,
//                           0,
//                         )}{" "}
//                         units
//                       </Text>
//                     </View>
//                   </View>
//                   <Text style={styles.cartTotal}>
//                     Total: {formatCurrency(getTotal() + getTaxTotal())}
//                   </Text>
//                 </View>

//                 <ScrollView
//                   style={styles.cartList}
//                   showsVerticalScrollIndicator={false}
//                 >
//                   {cartItems.map((item, index) => (
//                     <CartItem key={item.productId || index} item={item} />
//                   ))}
//                 </ScrollView>

//                 <View style={styles.footer}>
//                   <View style={styles.footerSummary}>
//                     <View style={styles.footerRow}>
//                       <Text style={styles.footerLabel}>Items</Text>
//                       <Text style={styles.footerValue}>{cartItems.length}</Text>
//                     </View>
//                     <View style={styles.footerRow}>
//                       <Text style={styles.footerLabel}>Subtotal</Text>
//                       <Text style={styles.footerValue}>
//                         {formatCurrency(getTotal())}
//                       </Text>
//                     </View>
//                     <View style={styles.footerRow}>
//                       <Text style={styles.footerLabel}>Tax</Text>
//                       <Text style={styles.footerValue}>
//                         {formatCurrency(getTaxTotal())}
//                       </Text>
//                     </View>
//                     <View style={[styles.footerRow, styles.footerTotal]}>
//                       <Text style={styles.footerTotalLabel}>Total</Text>
//                       <Text style={styles.footerTotalValue}>
//                         {formatCurrency(getTotal() + getTaxTotal())}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={styles.footerButtons}>
//                     <TouchableOpacity
//                       style={[styles.footerButton, styles.addButton]}
//                       onPress={() => setSearchModal(true)}
//                       disabled={submitting}
//                     >
//                       <Plus size={18} color={Colors.gray700} />
//                       <Text style={styles.addButtonText}>Add Item</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={[
//                         styles.footerButton,
//                         styles.submitButton,
//                         (cartItems.length === 0 || submitting) &&
//                           styles.buttonDisabled,
//                       ]}
//                       onPress={submitTransaction}
//                       disabled={cartItems.length === 0 || submitting}
//                     >
//                       {submitting ? (
//                         <ActivityIndicator color={Colors.white} size="small" />
//                       ) : (
//                         <>
//                           <Send size={18} color={Colors.white} />
//                           <Text style={styles.submitButtonText}>Submit</Text>
//                         </>
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Search Modal */}
//       <Modal visible={searchModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <View style={styles.modalHeaderLeft}>
//                 <Text style={styles.modalTitle}>Add Products</Text>
//                 <View style={styles.modalHeaderBadge}>
//                   <Text style={styles.modalHeaderBadgeText}>
//                     {cartItems.length} in cart
//                   </Text>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={() => setSearchModal(false)}>
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalSearch}>
//               <View style={styles.modalSearchContainer}>
//                 <Search size={20} color={Colors.gray400} />
//                 <TextInput
//                   style={styles.modalSearchInput}
//                   placeholder="Search by name, SKU, or brand..."
//                   value={searchTerm}
//                   onChangeText={setSearchTerm}
//                   placeholderTextColor={Colors.gray400}
//                   autoFocus
//                 />
//                 {searchTerm.length > 0 && (
//                   <TouchableOpacity onPress={() => setSearchTerm("")}>
//                     <X size={18} color={Colors.gray400} />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>

//             <FlatList
//               style={styles.productList}
//               contentContainerStyle={styles.productListContent}
//               data={searchProducts()}
//               keyExtractor={(item) => item._id}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//               renderItem={({ item }) => {
//                 const inCart = cartItems.some((c) => c.productId === item._id);
//                 const inventory = item.inventory;
//                 const isOutOfStock = inventory && inventory.quantity <= 0;
//                 const cartQuantity =
//                   cartItems.find((c) => c.productId === item._id)?.quantity ||
//                   0;

//                 return (
//                   <TouchableOpacity
//                     style={[
//                       styles.productItem,
//                       inCart && styles.productItemInCart,
//                       isOutOfStock && styles.productItemOutOfStock,
//                     ]}
//                     onPress={() => {
//                       if (isOutOfStock) {
//                         showAlert(
//                           "Out of Stock",
//                           "This item is currently out of stock."
//                         );
//                         return;
//                       }
//                       setSelectedProduct(item);
//                       const maxQty = inventory?.quantity || 99;
//                       setQuantity(Math.min(1, maxQty));
//                     }}
//                     disabled={isOutOfStock}
//                   >
//                     <View style={styles.productItemContainer}>
//                       <View style={styles.productItemContent}>
//                         <View style={styles.productItemHeader}>
//                           <Text
//                             style={styles.productItemName}
//                             numberOfLines={1}
//                           >
//                             {item.name}
//                           </Text>
//                           {inCart && (
//                             <View style={styles.inCartBadge}>
//                               <CheckCircle size={12} color={Colors.success} />
//                               <Text style={styles.inCartText}>
//                                 {cartQuantity} in cart
//                               </Text>
//                             </View>
//                           )}
//                         </View>

//                         <View style={styles.productItemMeta}>
//                           <View style={styles.productItemTag}>
//                             <Text style={styles.productItemTagText}>
//                               SKU: {item.sku}
//                             </Text>
//                           </View>
//                           {item.brand && (
//                             <View style={styles.productItemTag}>
//                               <Text style={styles.productItemTagText}>
//                                 {item.brand}
//                               </Text>
//                             </View>
//                           )}
//                           {item.category && (
//                             <View style={styles.productItemTag}>
//                               <Text style={styles.productItemTagText}>
//                                 {item.category}
//                               </Text>
//                             </View>
//                           )}
//                         </View>

//                         {item.description && (
//                           <Text
//                             style={styles.productItemDescription}
//                             numberOfLines={2}
//                           >
//                             {item.description}
//                           </Text>
//                         )}

//                         <View style={styles.productItemFooter}>
//                           <View style={styles.productItemStockInfo}>
//                             <View
//                               style={[
//                                 styles.stockIndicator,
//                                 inventory?.quantity > 10
//                                   ? styles.stockHigh
//                                   : inventory?.quantity > 0
//                                     ? styles.stockMedium
//                                     : styles.stockLow,
//                               ]}
//                             />
//                             <Text
//                               style={[
//                                 styles.productItemStock,
//                                 inventory?.quantity === 0 &&
//                                   styles.stockOutText,
//                               ]}
//                             >
//                               {inventory?.quantity > 0
//                                 ? `${inventory.quantity} in stock`
//                                 : "Out of stock"}
//                             </Text>
//                           </View>
//                           <Text style={styles.productItemPrice}>
//                             {formatCurrency(item.unitPrice || 0)}
//                           </Text>
//                         </View>

//                         {isOutOfStock && (
//                           <View style={styles.outOfStockOverlay}>
//                             <Text style={styles.outOfStockText}>
//                               Out of Stock
//                             </Text>
//                           </View>
//                         )}
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 );
//               }}
//               ListEmptyComponent={() => (
//                 <View style={styles.noProductsContainer}>
//                   <Package size={48} color={Colors.gray300} />
//                   <Text style={styles.noProductsTitle}>
//                     {searchTerm.length >= 2
//                       ? "No products found"
//                       : "Start typing to search"}
//                   </Text>
//                   <Text style={styles.noProductsSubtitle}>
//                     {searchTerm.length >= 2
//                       ? "Try adjusting your search terms"
//                       : "Search by name, SKU, or brand"}
//                   </Text>
//                 </View>
//               )}
//             />

//             <View style={styles.modalFooter}>
//               <TouchableOpacity
//                 style={styles.modalDoneButton}
//                 onPress={() => {
//                   setSearchModal(false);
//                   setSearchTerm("");
//                 }}
//               >
//                 <CheckCircle size={20} color={Colors.white} />
//                 <Text style={styles.modalDoneButtonText}>
//                   Done ({cartItems.length} items)
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Quantity Modal */}
//       <Modal
//         visible={!!selectedProduct}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.quantityModalOverlay}>
//           <View style={styles.quantityModalContent}>
//             <Text style={styles.quantityModalTitle}>
//               {selectedProduct?.name}
//             </Text>
//             <Text style={styles.quantityModalPrice}>
//               {formatCurrency(selectedProduct?.unitPrice || 0)} each
//             </Text>
//             <Text style={styles.quantityModalStock}>
//               Available: {selectedProduct?.inventory?.quantity || 0}
//             </Text>

//             <View style={styles.quantitySelector}>
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Minus size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.quantitySelectorInput}
//                 keyboardType="numeric"
//                 value={String(quantity)}
//                 onChangeText={(text) => {
//                   const num = parseInt(text) || 0;
//                   const max = selectedProduct?.inventory?.quantity || 999;
//                   setQuantity(Math.min(Math.max(1, num), max));
//                 }}
//               />
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => {
//                   const max = selectedProduct?.inventory?.quantity || 999;
//                   setQuantity(Math.min(quantity + 1, max));
//                 }}
//               >
//                 <Plus size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.quantityModalButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.quantityModalButton,
//                   styles.quantityCancelButton,
//                 ]}
//                 onPress={() => {
//                   setSelectedProduct(null);
//                   setQuantity(1);
//                 }}
//               >
//                 <Text style={styles.quantityCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.quantityModalButton,
//                   styles.quantityAddButton,
//                   loading && styles.buttonDisabled,
//                 ]}
//                 onPress={() => {
//                   if (selectedProduct) {
//                     addToLocalCart(selectedProduct, quantity);
//                     setSelectedProduct(null);
//                     setQuantity(1);
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={Colors.white} size="small" />
//                 ) : (
//                   <Text style={styles.quantityAddText}>
//                     Add {quantity > 1 ? `${quantity}x ` : ""}to Cart
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Custom Alert Modal */}
//       <CustomAlertModal
//         visible={alertModal.visible}
//         title={alertModal.title}
//         message={alertModal.message}
//         buttons={alertModal.buttons}
//         onClose={closeAlert}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: Spacing.md,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray500,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.md,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   headerTitle: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   headerRight: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   clearHeaderButton: {
//     padding: Spacing.sm,
//   },
//   cartBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 4,
//   },
//   cartBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "600",
//   },
//   cartContainer: {
//     flex: 1,
//   },
//   emptyCart: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: Spacing["2xl"],
//   },
//   emptyCartTitle: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     marginTop: Spacing.md,
//   },
//   emptyCartSubtitle: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//     textAlign: "center",
//   },
//   emptyCartButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: Spacing["2xl"],
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.sm,
//   },
//   emptyCartButtonText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.md,
//   },
//   cartHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: 4,
//     marginBottom: Spacing.xs,
//   },
//   cartHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   cartItemCount: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "500",
//   },
//   cartHeaderBadge: {
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.full,
//   },
//   cartHeaderBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "600",
//   },
//   cartTotal: {
//     fontSize: Typography.sm,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   cartList: {
//     flex: 1,
//     marginBottom: Spacing.sm,
//   },
//   cartItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.gray100,
//   },
//   cartItemOutOfStock: {
//     opacity: 0.6,
//     borderColor: Colors.error + "40",
//   },
//   cartItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   cartItemInfo: {
//     flex: 1,
//     marginRight: Spacing.sm,
//   },
//   cartItemHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//     marginBottom: Spacing.xs,
//   },
//   cartItemName: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//     flex: 1,
//   },
//   cartItemMeta: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 4,
//     marginBottom: Spacing.xs,
//   },
//   cartItemTag: {
//     backgroundColor: Colors.gray100,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   cartItemTagText: {
//     fontSize: Typography.xs,
//     color: Colors.gray600,
//   },
//   cartItemDescription: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginBottom: Spacing.xs,
//     lineHeight: 18,
//   },
//   cartItemDetails: {
//     marginTop: Spacing.xs,
//   },
//   cartItemStockInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 2,
//   },
//   cartStockIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: BorderRadius.full,
//   },
//   cartItemStock: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   cartItemPriceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 2,
//   },
//   cartItemUnitPrice: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   cartItemTotalPrice: {
//     fontSize: Typography.md,
//     fontWeight: "700",
//     color: Colors.gray900,
//   },
//   cartItemActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.xs,
//   },
//   lowStockBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.error + "20",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 2,
//   },
//   lowStockText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//     fontWeight: "500",
//   },
//   outOfStockBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.error + "30",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 2,
//   },
//   outOfStockBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//     fontWeight: "600",
//   },
//   cartQuantityControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.lg,
//     padding: 2,
//   },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//     ...Shadows.xs,
//   },
//   quantityDisplay: {
//     alignItems: "center",
//     paddingHorizontal: 8,
//     minWidth: 32,
//   },
//   quantityText: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//     textAlign: "center",
//   },
//   quantitySubtext: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   removeButton: {
//     padding: Spacing.sm,
//     marginLeft: 2,
//     backgroundColor: Colors.error + "10",
//     borderRadius: BorderRadius.full,
//     width: 36,
//     height: 36,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   footer: {
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     padding: Spacing.md,
//     marginBottom: Spacing.lg,
//     ...Shadows.sm,
//   },
//   footerSummary: {
//     marginBottom: Spacing.md,
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 2,
//   },
//   footerLabel: {
//     fontSize: Typography.md,
//     color: Colors.gray600,
//   },
//   footerValue: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   footerTotal: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     paddingTop: Spacing.sm,
//     marginTop: Spacing.xs,
//   },
//   footerTotalLabel: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   footerTotalValue: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   footerButtons: {
//     flexDirection: "row",
//     gap: Spacing.md,
//   },
//   footerButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: Spacing.sm,
//   },
//   addButton: {
//     backgroundColor: Colors.gray200,
//   },
//   addButtonText: {
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   submitButton: {
//     backgroundColor: Colors.primary,
//   },
//   submitButtonText: {
//     fontWeight: "600",
//     color: Colors.white,
//     padding: Spacing.xs,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     flex: 1,
//     marginTop: 80,
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius["3xl"],
//     borderTopRightRadius: BorderRadius["3xl"],
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   modalHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   modalHeaderBadge: {
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.full,
//   },
//   modalHeaderBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "600",
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalSearch: {
//     padding: Spacing.md,
//   },
//   modalSearchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//   },
//   modalSearchInput: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   modalFooter: {
//     padding: Spacing.md,
//     paddingBottom: Spacing.xl,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     backgroundColor: Colors.white,
//   },
//   modalDoneButton: {
//     backgroundColor: Colors.primary,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.sm,
//   },
//   modalDoneButtonText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.md,
//   },
//   productList: {
//     flex: 1,
//   },
//   productListContent: {
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing["2xl"],
//   },
//   productItem: {
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     paddingHorizontal: Spacing.sm,
//   },
//   productItemInCart: {
//     backgroundColor: Colors.success + "10",
//     borderRadius: BorderRadius.sm,
//     marginHorizontal: -Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//   },
//   productItemOutOfStock: {
//     opacity: 0.6,
//   },
//   productItemContainer: {
//     flex: 1,
//   },
//   productItemContent: {
//     position: "relative",
//   },
//   productItemHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.xs,
//   },
//   productItemName: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//     flex: 1,
//     marginRight: Spacing.sm,
//   },
//   productItemMeta: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 4,
//     marginBottom: Spacing.xs,
//   },
//   productItemTag: {
//     backgroundColor: Colors.gray100,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   productItemTagText: {
//     fontSize: Typography.xs,
//     color: Colors.gray600,
//   },
//   productItemDescription: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginBottom: Spacing.sm,
//     lineHeight: 18,
//   },
//   productItemFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   productItemStockInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   productItemStock: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   productItemPrice: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   stockIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: BorderRadius.full,
//   },
//   stockHigh: {
//     backgroundColor: Colors.success,
//   },
//   stockMedium: {
//     backgroundColor: Colors.warning,
//   },
//   stockLow: {
//     backgroundColor: Colors.error,
//   },
//   stockOutText: {
//     color: Colors.error,
//   },
//   inCartBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   inCartText: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: "500",
//   },
//   outOfStockOverlay: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     left: 0,
//     bottom: 0,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: BorderRadius.lg,
//   },
//   outOfStockText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//     fontWeight: "500",
//   },
//   noProductsContainer: {
//     paddingVertical: Spacing["3xl"],
//     alignItems: "center",
//   },
//   noProductsTitle: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray500,
//     marginTop: Spacing.md,
//   },
//   noProductsSubtitle: {
//     fontSize: Typography.sm,
//     color: Colors.gray400,
//     marginTop: Spacing.xs,
//   },
//   quantityModalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   quantityModalContent: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing["2xl"],
//     width: 340,
//   },
//   quantityModalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//     textAlign: "center",
//   },
//   quantityModalPrice: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     textAlign: "center",
//     marginTop: Spacing.xs,
//   },
//   quantityModalStock: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     textAlign: "center",
//     marginTop: Spacing.xs,
//   },
//   quantitySelector: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: Spacing.md,
//   },
//   quantitySelectorButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantitySelectorInput: {
//     width: 60,
//     textAlign: "center",
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.gray300,
//     paddingVertical: Spacing.sm,
//     marginHorizontal: Spacing.md,
//   },
//   quantityModalButtons: {
//     flexDirection: "row",
//     gap: Spacing.sm,
//     marginTop: Spacing["2xl"],
//   },
//   quantityModalButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantityCancelButton: {
//     backgroundColor: Colors.gray200,
//   },
//   quantityCancelText: {
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   quantityAddButton: {
//     backgroundColor: Colors.primary,
//   },
//   quantityAddText: {
//     fontWeight: "600",
//     color: Colors.white,
//   },

//   // Alert Modal Styles
//   alertOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: Spacing["2xl"],
//   },
//   alertContainer: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius["2xl"],
//     width: "100%",
//     maxWidth: 380,
//     ...Shadows.lg,
//     overflow: "hidden",
//   },
//   alertHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   alertTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     flex: 1,
//   },
//   alertCloseButton: {
//     padding: Spacing.xs,
//   },
//   alertBody: {
//     padding: Spacing.lg,
//     paddingVertical: Spacing["2xl"],
//   },
//   alertMessage: {
//     fontSize: Typography.md,
//     color: Colors.gray700,
//     lineHeight: 24,
//     textAlign: "center",
//   },
//   alertFooter: {
//     flexDirection: "row",
//     padding: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//     justifyContent: "flex-end",
//   },
//   alertButton: {
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing["2xl"],
//     borderRadius: BorderRadius.lg,
//     minWidth: 80,
//     alignItems: "center",
//   },
//   alertButtonMargin: {
//     marginLeft: Spacing.sm,
//   },
//   alertPrimaryButton: {
//     backgroundColor: Colors.primary,
//   },
//   alertCancelButton: {
//     backgroundColor: Colors.gray200,
//   },
//   alertPrimaryText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
//   alertCancelText: {
//     color: Colors.gray700,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
// });


































// // app/(app)/(tabs)/sales.jsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Modal,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { useAuth } from "../../../hooks/useAuth";
// import TransactionService from "../../../services/transactionService";
// import ProductService from "../../../services/productService";
// import StoreService from "../../../services/storeService";
// import AuthService from "../../../services/authService";
// import {
//   Plus,
//   Minus,
//   Trash2,
//   ShoppingCart,
//   Search,
//   X,
//   XCircle,
//   QrCode,
//   RefreshCw,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   Send,
//   Store,
//   ChevronDown,
// } from "lucide-react-native";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";
// import { formatCurrency } from "../../../utils/formatters";

// // Custom Alert Modal Component
// const CustomAlertModal = ({ visible, title, message, buttons, onClose }) => {
//   return (
//     <Modal visible={visible} transparent={true} animationType="fade">
//       <View style={styles.alertOverlay}>
//         <View style={styles.alertContainer}>
//           <View style={styles.alertHeader}>
//             <Text style={styles.alertTitle}>{title}</Text>
//             <TouchableOpacity onPress={onClose} style={styles.alertCloseButton}>
//               <XCircle size={20} color={Colors.gray400} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.alertBody}>
//             <Text style={styles.alertMessage}>{message}</Text>
//           </View>
//           <View style={styles.alertFooter}>
//             {buttons && buttons.map((btn, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.alertButton,
//                   btn.style === 'cancel' ? styles.alertCancelButton : styles.alertPrimaryButton,
//                   index > 0 && styles.alertButtonMargin
//                 ]}
//                 onPress={() => {
//                   if (btn.onPress) btn.onPress();
//                   onClose();
//                 }}
//               >
//                 <Text style={btn.style === 'cancel' ? styles.alertCancelText : styles.alertPrimaryText}>
//                   {btn.text}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default function Sales() {
//   const { user: authUser } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [searchModal, setSearchModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [submitting, setSubmitting] = useState(false);
//   const [transactionResult, setTransactionResult] = useState(null);

//   // Store selection state
//   const [user, setUser] = useState(null);
//   const [stores, setStores] = useState([]);
//   const [selectedStoreId, setSelectedStoreId] = useState(null);
//   const [showStoreDropdown, setShowStoreDropdown] = useState(false);

//   const isSuperAdmin = user?.role === 'SUPER_ADMIN';

//   // Alert Modal State
//   const [alertModal, setAlertModal] = useState({
//     visible: false,
//     title: "",
//     message: "",
//     buttons: [],
//     onClose: null,
//   });

//   const showAlert = (title, message, buttons = [{ text: "OK" }]) => {
//     return new Promise((resolve) => {
//       const wrappedButtons = buttons.map(btn => ({
//         ...btn,
//         onPress: () => {
//           if (btn.onPress) btn.onPress();
//           resolve();
//         }
//       }));
//       setAlertModal({
//         visible: true,
//         title,
//         message,
//         buttons: wrappedButtons,
//         onClose: resolve,
//       });
//     });
//   };

//   const closeAlert = () => {
//     setAlertModal(prev => ({ ...prev, visible: false }));
//     if (alertModal.onClose) alertModal.onClose();
//   };

//   // Load user and stores
//   const loadUserAndStores = async () => {
//     try {
//       const currentUser = await AuthService.getCurrentUser();
//       setUser(currentUser);

//       if (currentUser.role === 'SUPER_ADMIN') {
//         const storesData = await StoreService.getStoreOptions();
//         setStores(storesData);
        
//         const currentStoreId = currentUser.currentStoreId?._id || currentUser.currentStoreId;
//         if (currentStoreId) {
//           setSelectedStoreId(currentStoreId);
//         } else if (storesData.length === 1) {
//           setSelectedStoreId(storesData[0].value);
//         }
//       } else {
//         const storeId = currentUser.storeId?._id || currentUser.storeId;
//         setSelectedStoreId(storeId);
//       }
//     } catch (error) {
//       console.error('Failed to load user/stores:', error);
//     }
//   };

//   const getStoreName = (storeId) => {
//     const store = stores.find((s) => s.value === storeId);
//     return store ? store.label : 'Select a store...';
//   };

//   useEffect(() => {
//     loadUserAndStores();
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const result = await ProductService.getProducts({
//         limit: 100,
//         sortBy: "name",
//         sortOrder: "asc",
//       });
//       setProducts(result.products || []);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([fetchProducts(), loadUserAndStores()]);
//     setRefreshing(false);
//   };

//   const searchProducts = () => {
//     if (!searchTerm.trim()) return products;
//     return products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   };

//   const addToLocalCart = (product, qty) => {
//     const existingIndex = cartItems.findIndex(
//       (item) => item.productId === product._id,
//     );

//     if (existingIndex >= 0) {
//       const updated = [...cartItems];
//       updated[existingIndex] = {
//         ...updated[existingIndex],
//         quantity: updated[existingIndex].quantity + qty,
//       };
//       setCartItems(updated);
//     } else {
//       setCartItems([
//         ...cartItems,
//         {
//           productId: product._id,
//           name: product.name,
//           sku: product.sku,
//           unitPrice: product.unitPrice,
//           quantity: qty,
//           taxRate: product.taxRate || 0,
//           product: product,
//         },
//       ]);
//     }
//   };

//   const removeFromLocalCart = (productId) => {
//     setCartItems(cartItems.filter((item) => item.productId !== productId));
//   };

//   const updateLocalQuantity = (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromLocalCart(productId);
//       return;
//     }
//     setCartItems(
//       cartItems.map((item) =>
//         item.productId === productId
//           ? { ...item, quantity: newQuantity }
//           : item,
//       ),
//     );
//   };

//   const clearLocalCart = () => {
//     if (cartItems.length === 0) return;
//     showAlert("Clear Cart", "Are you sure you want to remove all items?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Clear All",
//         style: "destructive",
//         onPress: () => setCartItems([]),
//       },
//     ]);
//   };

//   const submitTransaction = async () => {
//     if (cartItems.length === 0) {
//       await showAlert("Error", "Cart is empty. Please add items first.");
//       return;
//     }

//     if (isSuperAdmin && !selectedStoreId) {
//       await showAlert("Error", "Please select a store first");
//       return;
//     }

//     const lowStockItems = cartItems.filter((item) => {
//       const inventory = item.product?.inventory;
//       return inventory && inventory.quantity < item.quantity;
//     });

//     if (lowStockItems.length > 0) {
//       await showAlert(
//         "Low Stock Warning",
//         `Some items have insufficient stock:\n${lowStockItems
//           .map(
//             (i) =>
//               `- ${i.name}: ${i.quantity} ordered, ${i.product?.inventory?.quantity || 0} available`,
//           )
//           .join("\n")}\n\nDo you want to continue?`,
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Continue", onPress: () => proceedWithSubmission() },
//         ]
//       );
//       return;
//     }

//     proceedWithSubmission();
//   };

//   const proceedWithSubmission = async () => {
//     setSubmitting(true);
//     try {
//       const items = cartItems.map((item) => ({
//         productId: item.productId,
//         quantity: item.quantity,
//       }));

//       const transaction = await TransactionService.createTransactionWithItems(
//         items,
//         isSuperAdmin ? selectedStoreId : null
//       );
      
//       setTransactionResult({ transaction, success: true });

//       await showAlert(
//         "✅ Transaction Created!",
//         `Transaction: ${transaction.transactionNumber}\nItems: ${transaction.items?.length || 0}\nTotal: ${formatCurrency(transaction.totalAmount)}\n\nSales QR has been generated.`,
//         [
//           {
//             text: "View Receipt",
//             onPress: () =>
//               router.push({
//                 pathname: "/(app)/(modals)/receipt-preview",
//                 params: {
//                   transactionId: transaction._id,
//                   qrData: transaction.salesQR,
//                   qrType: "SALES",
//                   transactionNumber: transaction.transactionNumber,
//                   mode: "sales",
//                 },
//               }),
//           },
//           {
//             text: "Process Payment",
//             onPress: () =>
//               router.push({
//                 pathname: "/(app)/(tabs)/finance",
//                 params: {
//                   transactionId: transaction._id,
//                   transactionNumber: transaction.transactionNumber,
//                   totalAmount: transaction.totalAmount,
//                   mode: "pay",
//                 },
//               }),
//           },
//           {
//             text: "Done",
//             style: "cancel",
//             onPress: () => {
//               setCartItems([]);
//               setTransactionResult(null);
//             },
//           },
//         ]
//       );
//     } catch (error) {
//       console.error("Submission error:", error);
//       await showAlert(
//         "Error",
//         error.response?.data?.message || error.message || "Failed to create transaction. Please try again."
//       );
//       setTransactionResult({ success: false, error: error.message });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getItemTotal = (item) => {
//     return (item.unitPrice || 0) * (item.quantity || 0);
//   };

//   const CartItem = ({ item }) => {
//     const total = getItemTotal(item);
//     const inventory = item.product?.inventory;
//     const isLowStock = inventory && inventory.quantity < item.quantity;
//     const isOutOfStock = inventory && inventory.quantity <= 0;

//     return (
//       <View
//         style={[styles.cartItem, isOutOfStock && styles.cartItemOutOfStock]}
//       >
//         <View style={styles.cartItemRow}>
//           <View style={styles.cartItemInfo}>
//             <View style={styles.cartItemHeader}>
//               <Text style={styles.cartItemName} numberOfLines={1}>
//                 {item.name}
//               </Text>
//               {isLowStock && (
//                 <View style={styles.lowStockBadge}>
//                   <AlertCircle size={12} color={Colors.error} />
//                   <Text style={styles.lowStockText}>Low Stock</Text>
//                 </View>
//               )}
//               {isOutOfStock && (
//                 <View style={styles.outOfStockBadge}>
//                   <AlertCircle size={12} color={Colors.error} />
//                   <Text style={styles.outOfStockBadgeText}>Out of Stock</Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.cartItemMeta}>
//               <View style={styles.cartItemTag}>
//                 <Text style={styles.cartItemTagText}>
//                   SKU: {item.sku || "N/A"}
//                 </Text>
//               </View>
//               {item.product?.brand && (
//                 <View style={styles.cartItemTag}>
//                   <Text style={styles.cartItemTagText}>
//                     {item.product.brand}
//                   </Text>
//                 </View>
//               )}
//               {item.product?.category && (
//                 <View style={styles.cartItemTag}>
//                   <Text style={styles.cartItemTagText}>
//                     {item.product.category}
//                   </Text>
//                 </View>
//               )}
//             </View>

//             {item.product?.description && (
//               <Text style={styles.cartItemDescription} numberOfLines={1}>
//                 {item.product.description}
//               </Text>
//             )}

//             <View style={styles.cartItemDetails}>
//               <View style={styles.cartItemStockInfo}>
//                 <View
//                   style={[
//                     styles.cartStockIndicator,
//                     inventory?.quantity > 10
//                       ? styles.stockHigh
//                       : inventory?.quantity > 0
//                         ? styles.stockMedium
//                         : styles.stockLow,
//                   ]}
//                 />
//                 <Text
//                   style={[
//                     styles.cartItemStock,
//                     inventory?.quantity === 0 && styles.stockOutText,
//                   ]}
//                 >
//                   {inventory?.quantity > 0
//                     ? `${inventory.quantity} available`
//                     : "Out of stock"}
//                 </Text>
//               </View>
//               <View style={styles.cartItemPriceContainer}>
//                 <Text style={styles.cartItemUnitPrice}>
//                   {formatCurrency(item.unitPrice)} each
//                 </Text>
//                 <Text style={styles.cartItemTotalPrice}>
//                   {formatCurrency(total)}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.cartItemActions}>
//             <View style={styles.cartQuantityControls}>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() =>
//                   updateLocalQuantity(item.productId, item.quantity - 1)
//                 }
//                 disabled={submitting || isOutOfStock}
//               >
//                 <Minus size={16} color={Colors.gray500} />
//               </TouchableOpacity>
//               <View style={styles.quantityDisplay}>
//                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                 {item.quantity > 1 && (
//                   <Text style={styles.quantitySubtext}>
//                     × {formatCurrency(item.unitPrice)}
//                   </Text>
//                 )}
//               </View>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() =>
//                   updateLocalQuantity(item.productId, item.quantity + 1)
//                 }
//                 disabled={submitting || isOutOfStock}
//               >
//                 <Plus size={16} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//               style={styles.removeButton}
//               onPress={() => removeFromLocalCart(item.productId)}
//               disabled={submitting}
//             >
//               <Trash2 size={20} color={Colors.error} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const getTotal = () => {
//     return cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
//   };

//   const getTaxTotal = () => {
//     return cartItems.reduce((sum, item) => {
//       const taxRate = item.taxRate || 0;
//       return sum + (getItemTotal(item) * taxRate) / 100;
//     }, 0);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={100}
//       >
//         <View style={styles.content}>
//           <View style={styles.header}>
//             <View style={styles.headerLeft}>
//               <Text style={styles.headerTitle}>Sales</Text>
//               {cartItems.length > 0 && (
//                 <View style={styles.cartBadge}>
//                   <Package size={14} color={Colors.primary} />
//                   <Text style={styles.cartBadgeText}>
//                     {cartItems.length} items
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <View style={styles.headerRight}>
//               {cartItems.length > 0 && (
//                 <TouchableOpacity
//                   style={styles.clearHeaderButton}
//                   onPress={clearLocalCart}
//                   disabled={submitting}
//                 >
//                   <Trash2 size={18} color={Colors.error} />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {/* Store Selector - Super Admin Only */}
//           {isSuperAdmin && (
//             <View style={styles.storeSelectorContainer}>
//               <View style={styles.storeSelectorRow}>
//                 <Store size={16} color={Colors.primary} />
//                 <Text style={styles.storeSelectorLabel}>Store:</Text>
//                 <TouchableOpacity
//                   style={styles.storeSelector}
//                   onPress={() => setShowStoreDropdown(!showStoreDropdown)}
//                   disabled={stores.length === 0}
//                 >
//                   <Text style={styles.storeSelectorText}>
//                     {selectedStoreId ? getStoreName(selectedStoreId) : 'Select a store...'}
//                   </Text>
//                   <ChevronDown size={16} color={Colors.gray500} />
//                 </TouchableOpacity>
//               </View>
//               {showStoreDropdown && (
//                 <View style={styles.storeDropdown}>
//                   {stores.map((store) => (
//                     <TouchableOpacity
//                       key={store.value}
//                       style={[
//                         styles.storeDropdownItem,
//                         selectedStoreId === store.value && styles.storeDropdownItemActive,
//                       ]}
//                       onPress={() => {
//                         setSelectedStoreId(store.value);
//                         setShowStoreDropdown(false);
//                       }}
//                     >
//                       <Text style={[
//                         styles.storeDropdownText,
//                         selectedStoreId === store.value && styles.storeDropdownTextActive,
//                       ]}>
//                         {store.label}
//                       </Text>
//                       {selectedStoreId === store.value && (
//                         <CheckCircle size={16} color={Colors.primary} />
//                       )}
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//               {!selectedStoreId && (
//                 <Text style={styles.warningText}>⚠️ Please select a store</Text>
//               )}
//             </View>
//           )}

//           <View style={styles.cartContainer}>
//             {cartItems.length === 0 ? (
//               <View style={styles.emptyCart}>
//                 <ShoppingCart size={80} color={Colors.gray300} />
//                 <Text style={styles.emptyCartTitle}>Cart is Empty</Text>
//                 <Text style={styles.emptyCartSubtitle}>
//                   Search and add products to create a transaction
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.emptyCartButton}
//                   onPress={() => setSearchModal(true)}
//                 >
//                   <Plus size={20} color={Colors.white} />
//                   <Text style={styles.emptyCartButtonText}>Add Items</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <>
//                 <View style={styles.cartHeader}>
//                   <View style={styles.cartHeaderLeft}>
//                     <Text style={styles.cartItemCount}>
//                       {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
//                     </Text>
//                     <View style={styles.cartHeaderBadge}>
//                       <Text style={styles.cartHeaderBadgeText}>
//                         {cartItems.reduce(
//                           (sum, item) => sum + item.quantity,
//                           0,
//                         )}{" "}
//                         units
//                       </Text>
//                     </View>
//                   </View>
//                   <Text style={styles.cartTotal}>
//                     Total: {formatCurrency(getTotal() + getTaxTotal())}
//                   </Text>
//                 </View>

//                 <ScrollView
//                   style={styles.cartList}
//                   showsVerticalScrollIndicator={false}
//                 >
//                   {cartItems.map((item, index) => (
//                     <CartItem key={item.productId || index} item={item} />
//                   ))}
//                 </ScrollView>

//                 <View style={styles.footer}>
//                   <View style={styles.footerSummary}>
//                     <View style={styles.footerRow}>
//                       <Text style={styles.footerLabel}>Items</Text>
//                       <Text style={styles.footerValue}>{cartItems.length}</Text>
//                     </View>
//                     <View style={styles.footerRow}>
//                       <Text style={styles.footerLabel}>Subtotal</Text>
//                       <Text style={styles.footerValue}>
//                         {formatCurrency(getTotal())}
//                       </Text>
//                     </View>
//                     <View style={styles.footerRow}>
//                       <Text style={styles.footerLabel}>Tax</Text>
//                       <Text style={styles.footerValue}>
//                         {formatCurrency(getTaxTotal())}
//                       </Text>
//                     </View>
//                     <View style={[styles.footerRow, styles.footerTotal]}>
//                       <Text style={styles.footerTotalLabel}>Total</Text>
//                       <Text style={styles.footerTotalValue}>
//                         {formatCurrency(getTotal() + getTaxTotal())}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={styles.footerButtons}>
//                     <TouchableOpacity
//                       style={[styles.footerButton, styles.addButton]}
//                       onPress={() => setSearchModal(true)}
//                       disabled={submitting}
//                     >
//                       <Plus size={18} color={Colors.gray700} />
//                       <Text style={styles.addButtonText}>Add Item</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={[
//                         styles.footerButton,
//                         styles.submitButton,
//                         (cartItems.length === 0 || submitting || (isSuperAdmin && !selectedStoreId)) &&
//                           styles.buttonDisabled,
//                       ]}
//                       onPress={submitTransaction}
//                       disabled={cartItems.length === 0 || submitting || (isSuperAdmin && !selectedStoreId)}
//                     >
//                       {submitting ? (
//                         <ActivityIndicator color={Colors.white} size="small" />
//                       ) : (
//                         <>
//                           <Send size={18} color={Colors.white} />
//                           <Text style={styles.submitButtonText}>
//                             {isSuperAdmin && !selectedStoreId ? 'Select Store First' : 'Submit'}
//                           </Text>
//                         </>
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Search Modal */}
//       <Modal visible={searchModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <View style={styles.modalHeaderLeft}>
//                 <Text style={styles.modalTitle}>Add Products</Text>
//                 <View style={styles.modalHeaderBadge}>
//                   <Text style={styles.modalHeaderBadgeText}>
//                     {cartItems.length} in cart
//                   </Text>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={() => setSearchModal(false)}>
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalSearch}>
//               <View style={styles.modalSearchContainer}>
//                 <Search size={20} color={Colors.gray400} />
//                 <TextInput
//                   style={styles.modalSearchInput}
//                   placeholder="Search by name, SKU, or brand..."
//                   value={searchTerm}
//                   onChangeText={setSearchTerm}
//                   placeholderTextColor={Colors.gray400}
//                   autoFocus
//                 />
//                 {searchTerm.length > 0 && (
//                   <TouchableOpacity onPress={() => setSearchTerm("")}>
//                     <X size={18} color={Colors.gray400} />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>

//             <FlatList
//               style={styles.productList}
//               contentContainerStyle={styles.productListContent}
//               data={searchProducts()}
//               keyExtractor={(item) => item._id}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//               renderItem={({ item }) => {
//                 const inCart = cartItems.some((c) => c.productId === item._id);
//                 const inventory = item.inventory;
//                 const isOutOfStock = inventory && inventory.quantity <= 0;
//                 const cartQuantity =
//                   cartItems.find((c) => c.productId === item._id)?.quantity ||
//                   0;

//                 return (
//                   <TouchableOpacity
//                     style={[
//                       styles.productItem,
//                       inCart && styles.productItemInCart,
//                       isOutOfStock && styles.productItemOutOfStock,
//                     ]}
//                     onPress={() => {
//                       if (isOutOfStock) {
//                         showAlert(
//                           "Out of Stock",
//                           "This item is currently out of stock."
//                         );
//                         return;
//                       }
//                       setSelectedProduct(item);
//                       const maxQty = inventory?.quantity || 99;
//                       setQuantity(Math.min(1, maxQty));
//                     }}
//                     disabled={isOutOfStock}
//                   >
//                     <View style={styles.productItemContainer}>
//                       <View style={styles.productItemContent}>
//                         <View style={styles.productItemHeader}>
//                           <Text
//                             style={styles.productItemName}
//                             numberOfLines={1}
//                           >
//                             {item.name}
//                           </Text>
//                           {inCart && (
//                             <View style={styles.inCartBadge}>
//                               <CheckCircle size={12} color={Colors.success} />
//                               <Text style={styles.inCartText}>
//                                 {cartQuantity} in cart
//                               </Text>
//                             </View>
//                           )}
//                         </View>

//                         <View style={styles.productItemMeta}>
//                           <View style={styles.productItemTag}>
//                             <Text style={styles.productItemTagText}>
//                               SKU: {item.sku}
//                             </Text>
//                           </View>
//                           {item.brand && (
//                             <View style={styles.productItemTag}>
//                               <Text style={styles.productItemTagText}>
//                                 {item.brand}
//                               </Text>
//                             </View>
//                           )}
//                           {item.category && (
//                             <View style={styles.productItemTag}>
//                               <Text style={styles.productItemTagText}>
//                                 {item.category}
//                               </Text>
//                             </View>
//                           )}
//                         </View>

//                         {item.description && (
//                           <Text
//                             style={styles.productItemDescription}
//                             numberOfLines={2}
//                           >
//                             {item.description}
//                           </Text>
//                         )}

//                         <View style={styles.productItemFooter}>
//                           <View style={styles.productItemStockInfo}>
//                             <View
//                               style={[
//                                 styles.stockIndicator,
//                                 inventory?.quantity > 10
//                                   ? styles.stockHigh
//                                   : inventory?.quantity > 0
//                                     ? styles.stockMedium
//                                     : styles.stockLow,
//                               ]}
//                             />
//                             <Text
//                               style={[
//                                 styles.productItemStock,
//                                 inventory?.quantity === 0 &&
//                                   styles.stockOutText,
//                               ]}
//                             >
//                               {inventory?.quantity > 0
//                                 ? `${inventory.quantity} in stock`
//                                 : "Out of stock"}
//                             </Text>
//                           </View>
//                           <Text style={styles.productItemPrice}>
//                             {formatCurrency(item.unitPrice || 0)}
//                           </Text>
//                         </View>

//                         {isOutOfStock && (
//                           <View style={styles.outOfStockOverlay}>
//                             <Text style={styles.outOfStockText}>
//                               Out of Stock
//                             </Text>
//                           </View>
//                         )}
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 );
//               }}
//               ListEmptyComponent={() => (
//                 <View style={styles.noProductsContainer}>
//                   <Package size={48} color={Colors.gray300} />
//                   <Text style={styles.noProductsTitle}>
//                     {searchTerm.length >= 2
//                       ? "No products found"
//                       : "Start typing to search"}
//                   </Text>
//                   <Text style={styles.noProductsSubtitle}>
//                     {searchTerm.length >= 2
//                       ? "Try adjusting your search terms"
//                       : "Search by name, SKU, or brand"}
//                   </Text>
//                 </View>
//               )}
//             />

//             <View style={styles.modalFooter}>
//               <TouchableOpacity
//                 style={styles.modalDoneButton}
//                 onPress={() => {
//                   setSearchModal(false);
//                   setSearchTerm("");
//                 }}
//               >
//                 <CheckCircle size={20} color={Colors.white} />
//                 <Text style={styles.modalDoneButtonText}>
//                   Done ({cartItems.length} items)
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Quantity Modal */}
//       <Modal
//         visible={!!selectedProduct}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.quantityModalOverlay}>
//           <View style={styles.quantityModalContent}>
//             <Text style={styles.quantityModalTitle}>
//               {selectedProduct?.name}
//             </Text>
//             <Text style={styles.quantityModalPrice}>
//               {formatCurrency(selectedProduct?.unitPrice || 0)} each
//             </Text>
//             <Text style={styles.quantityModalStock}>
//               Available: {selectedProduct?.inventory?.quantity || 0}
//             </Text>

//             <View style={styles.quantitySelector}>
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Minus size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.quantitySelectorInput}
//                 keyboardType="numeric"
//                 value={String(quantity)}
//                 onChangeText={(text) => {
//                   const num = parseInt(text) || 0;
//                   const max = selectedProduct?.inventory?.quantity || 999;
//                   setQuantity(Math.min(Math.max(1, num), max));
//                 }}
//               />
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => {
//                   const max = selectedProduct?.inventory?.quantity || 999;
//                   setQuantity(Math.min(quantity + 1, max));
//                 }}
//               >
//                 <Plus size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.quantityModalButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.quantityModalButton,
//                   styles.quantityCancelButton,
//                 ]}
//                 onPress={() => {
//                   setSelectedProduct(null);
//                   setQuantity(1);
//                 }}
//               >
//                 <Text style={styles.quantityCancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.quantityModalButton,
//                   styles.quantityAddButton,
//                   loading && styles.buttonDisabled,
//                 ]}
//                 onPress={() => {
//                   if (selectedProduct) {
//                     addToLocalCart(selectedProduct, quantity);
//                     setSelectedProduct(null);
//                     setQuantity(1);
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={Colors.white} size="small" />
//                 ) : (
//                   <Text style={styles.quantityAddText}>
//                     Add {quantity > 1 ? `${quantity}x ` : ""}to Cart
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Custom Alert Modal */}
//       <CustomAlertModal
//         visible={alertModal.visible}
//         title={alertModal.title}
//         message={alertModal.message}
//         buttons={alertModal.buttons}
//         onClose={closeAlert}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: Spacing.md,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray500,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.md,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   headerTitle: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   headerRight: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   clearHeaderButton: {
//     padding: Spacing.sm,
//   },
//   cartBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 4,
//   },
//   cartBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "600",
//   },

//   // Store Selector
//   storeSelectorContainer: {
//     backgroundColor: Colors.white,
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   storeSelectorRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   storeSelectorLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//     marginLeft: Spacing.sm,
//     fontWeight: '500',
//   },
//   storeSelector: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.sm,
//     marginLeft: Spacing.sm,
//   },
//   storeSelectorText: {
//     fontSize: Typography.sm,
//     color: Colors.gray900,
//     flex: 1,
//   },
//   storeDropdown: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     borderWidth: 1,
//     borderColor: Colors.gray200,
//     marginTop: Spacing.xs,
//     ...Shadows.md,
//     maxHeight: 200,
//   },
//   storeDropdownItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   storeDropdownItemActive: {
//     backgroundColor: Colors.primary + '10',
//   },
//   storeDropdownText: {
//     fontSize: Typography.md,
//     color: Colors.gray900,
//     flex: 1,
//   },
//   storeDropdownTextActive: {
//     color: Colors.primary,
//     fontWeight: '500',
//   },
//   warningText: {
//     color: Colors.error,
//     fontSize: Typography.xs,
//     marginTop: Spacing.xs,
//   },

//   cartContainer: {
//     flex: 1,
//   },
//   emptyCart: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: Spacing["2xl"],
//   },
//   emptyCartTitle: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     marginTop: Spacing.md,
//   },
//   emptyCartSubtitle: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//     textAlign: "center",
//   },
//   emptyCartButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: Spacing["2xl"],
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.sm,
//   },
//   emptyCartButtonText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.md,
//   },
//   cartHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: 4,
//     marginBottom: Spacing.xs,
//   },
//   cartHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   cartItemCount: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "500",
//   },
//   cartHeaderBadge: {
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.full,
//   },
//   cartHeaderBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "600",
//   },
//   cartTotal: {
//     fontSize: Typography.sm,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   cartList: {
//     flex: 1,
//     marginBottom: Spacing.sm,
//   },
//   cartItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.gray100,
//   },
//   cartItemOutOfStock: {
//     opacity: 0.6,
//     borderColor: Colors.error + "40",
//   },
//   cartItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   cartItemInfo: {
//     flex: 1,
//     marginRight: Spacing.sm,
//   },
//   cartItemHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//     marginBottom: Spacing.xs,
//   },
//   cartItemName: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//     flex: 1,
//   },
//   cartItemMeta: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 4,
//     marginBottom: Spacing.xs,
//   },
//   cartItemTag: {
//     backgroundColor: Colors.gray100,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   cartItemTagText: {
//     fontSize: Typography.xs,
//     color: Colors.gray600,
//   },
//   cartItemDescription: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginBottom: Spacing.xs,
//     lineHeight: 18,
//   },
//   cartItemDetails: {
//     marginTop: Spacing.xs,
//   },
//   cartItemStockInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 2,
//   },
//   cartStockIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: BorderRadius.full,
//   },
//   cartItemStock: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   cartItemPriceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 2,
//   },
//   cartItemUnitPrice: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   cartItemTotalPrice: {
//     fontSize: Typography.md,
//     fontWeight: "700",
//     color: Colors.gray900,
//   },
//   cartItemActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.xs,
//   },
//   lowStockBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.error + "20",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 2,
//   },
//   lowStockText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//     fontWeight: "500",
//   },
//   outOfStockBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.error + "30",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 2,
//   },
//   outOfStockBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//     fontWeight: "600",
//   },
//   cartQuantityControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.lg,
//     padding: 2,
//   },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//     ...Shadows.xs,
//   },
//   quantityDisplay: {
//     alignItems: "center",
//     paddingHorizontal: 8,
//     minWidth: 32,
//   },
//   quantityText: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//     textAlign: "center",
//   },
//   quantitySubtext: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   removeButton: {
//     padding: Spacing.sm,
//     marginLeft: 2,
//     backgroundColor: Colors.error + "10",
//     borderRadius: BorderRadius.full,
//     width: 36,
//     height: 36,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   footer: {
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     padding: Spacing.md,
//     marginBottom: Spacing.lg,
//     ...Shadows.sm,
//   },
//   footerSummary: {
//     marginBottom: Spacing.md,
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 2,
//   },
//   footerLabel: {
//     fontSize: Typography.md,
//     color: Colors.gray600,
//   },
//   footerValue: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   footerTotal: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     paddingTop: Spacing.sm,
//     marginTop: Spacing.xs,
//   },
//   footerTotalLabel: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   footerTotalValue: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   footerButtons: {
//     flexDirection: "row",
//     gap: Spacing.md,
//   },
//   footerButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: Spacing.sm,
//   },
//   addButton: {
//     backgroundColor: Colors.gray200,
//   },
//   addButtonText: {
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   submitButton: {
//     backgroundColor: Colors.primary,
//   },
//   submitButtonText: {
//     fontWeight: "600",
//     color: Colors.white,
//     padding: Spacing.xs,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     flex: 1,
//     marginTop: 80,
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius["3xl"],
//     borderTopRightRadius: BorderRadius["3xl"],
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   modalHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   modalHeaderBadge: {
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.full,
//   },
//   modalHeaderBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "600",
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalSearch: {
//     padding: Spacing.md,
//   },
//   modalSearchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//   },
//   modalSearchInput: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   modalFooter: {
//     padding: Spacing.md,
//     paddingBottom: Spacing.xl,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     backgroundColor: Colors.white,
//   },
//   modalDoneButton: {
//     backgroundColor: Colors.primary,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.sm,
//   },
//   modalDoneButtonText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.md,
//   },
//   productList: {
//     flex: 1,
//   },
//   productListContent: {
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing["2xl"],
//   },
//   productItem: {
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     paddingHorizontal: Spacing.sm,
//   },
//   productItemInCart: {
//     backgroundColor: Colors.success + "10",
//     borderRadius: BorderRadius.sm,
//     marginHorizontal: -Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//   },
//   productItemOutOfStock: {
//     opacity: 0.6,
//   },
//   productItemContainer: {
//     flex: 1,
//   },
//   productItemContent: {
//     position: "relative",
//   },
//   productItemHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.xs,
//   },
//   productItemName: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//     flex: 1,
//     marginRight: Spacing.sm,
//   },
//   productItemMeta: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 4,
//     marginBottom: Spacing.xs,
//   },
//   productItemTag: {
//     backgroundColor: Colors.gray100,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   productItemTagText: {
//     fontSize: Typography.xs,
//     color: Colors.gray600,
//   },
//   productItemDescription: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginBottom: Spacing.sm,
//     lineHeight: 18,
//   },
//   productItemFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   productItemStockInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   productItemStock: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   productItemPrice: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   stockIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: BorderRadius.full,
//   },
//   stockHigh: {
//     backgroundColor: Colors.success,
//   },
//   stockMedium: {
//     backgroundColor: Colors.warning,
//   },
//   stockLow: {
//     backgroundColor: Colors.error,
//   },
//   stockOutText: {
//     color: Colors.error,
//   },
//   inCartBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   inCartText: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: "500",
//   },
//   outOfStockOverlay: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     left: 0,
//     bottom: 0,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: BorderRadius.lg,
//   },
//   outOfStockText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//     fontWeight: "500",
//   },
//   noProductsContainer: {
//     paddingVertical: Spacing["3xl"],
//     alignItems: "center",
//   },
//   noProductsTitle: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray500,
//     marginTop: Spacing.md,
//   },
//   noProductsSubtitle: {
//     fontSize: Typography.sm,
//     color: Colors.gray400,
//     marginTop: Spacing.xs,
//   },
//   quantityModalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   quantityModalContent: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing["2xl"],
//     width: 340,
//   },
//   quantityModalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//     textAlign: "center",
//   },
//   quantityModalPrice: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     textAlign: "center",
//     marginTop: Spacing.xs,
//   },
//   quantityModalStock: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     textAlign: "center",
//     marginTop: Spacing.xs,
//   },
//   quantitySelector: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: Spacing.md,
//   },
//   quantitySelectorButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantitySelectorInput: {
//     width: 60,
//     textAlign: "center",
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.gray300,
//     paddingVertical: Spacing.sm,
//     marginHorizontal: Spacing.md,
//   },
//   quantityModalButtons: {
//     flexDirection: "row",
//     gap: Spacing.sm,
//     marginTop: Spacing["2xl"],
//   },
//   quantityModalButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantityCancelButton: {
//     backgroundColor: Colors.gray200,
//   },
//   quantityCancelText: {
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   quantityAddButton: {
//     backgroundColor: Colors.primary,
//   },
//   quantityAddText: {
//     fontWeight: "600",
//     color: Colors.white,
//   },

//   // Alert Modal Styles
//   alertOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: Spacing["2xl"],
//   },
//   alertContainer: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius["2xl"],
//     width: "100%",
//     maxWidth: 380,
//     ...Shadows.lg,
//     overflow: "hidden",
//   },
//   alertHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   alertTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     flex: 1,
//   },
//   alertCloseButton: {
//     padding: Spacing.xs,
//   },
//   alertBody: {
//     padding: Spacing.lg,
//     paddingVertical: Spacing["2xl"],
//   },
//   alertMessage: {
//     fontSize: Typography.md,
//     color: Colors.gray700,
//     lineHeight: 24,
//     textAlign: "center",
//   },
//   alertFooter: {
//     flexDirection: "row",
//     padding: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//     justifyContent: "flex-end",
//   },
//   alertButton: {
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing["2xl"],
//     borderRadius: BorderRadius.lg,
//     minWidth: 80,
//     alignItems: "center",
//   },
//   alertButtonMargin: {
//     marginLeft: Spacing.sm,
//   },
//   alertPrimaryButton: {
//     backgroundColor: Colors.primary,
//   },
//   alertCancelButton: {
//     backgroundColor: Colors.gray200,
//   },
//   alertPrimaryText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
//   alertCancelText: {
//     color: Colors.gray700,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
// });


































// app/(app)/(tabs)/sales.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  StyleSheet,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import TransactionService from "../../../services/transactionService";
import ProductService from "../../../services/productService";
import StoreService from "../../../services/storeService";
import AuthService from "../../../services/authService";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Search,
  X,
  XCircle,
  QrCode,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Package,
  Send,
  Store,
  ChevronDown,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";
import { formatCurrency } from "../../../utils/formatters";

// Custom Alert Modal Component
const CustomAlertModal = ({ visible, title, message, buttons, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.alertCloseButton}>
              <XCircle size={20} color={Colors.gray400} />
            </TouchableOpacity>
          </View>
          <View style={styles.alertBody}>
            <Text style={styles.alertMessage}>{message}</Text>
          </View>
          <View style={styles.alertFooter}>
            {buttons && buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.alertButton,
                  btn.style === 'cancel' ? styles.alertCancelButton : styles.alertPrimaryButton,
                  index > 0 && styles.alertButtonMargin
                ]}
                onPress={() => {
                  if (btn.onPress) btn.onPress();
                  onClose();
                }}
              >
                <Text style={btn.style === 'cancel' ? styles.alertCancelText : styles.alertPrimaryText}>
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Sales() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchModal, setSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  // Store selection state
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
    onClose: null,
  });

  const showAlert = (title, message, buttons = [{ text: "OK" }]) => {
    return new Promise((resolve) => {
      const wrappedButtons = buttons.map(btn => ({
        ...btn,
        onPress: () => {
          if (btn.onPress) btn.onPress();
          resolve();
        }
      }));
      setAlertModal({
        visible: true,
        title,
        message,
        buttons: wrappedButtons,
        onClose: resolve,
      });
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, visible: false }));
    if (alertModal.onClose) alertModal.onClose();
  };

  // Load user and stores
  const loadUserAndStores = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser.role === 'SUPER_ADMIN') {
        const storesData = await StoreService.getStoreOptions();
        setStores(storesData);
        
        const currentStoreId = currentUser.currentStoreId?._id || currentUser.currentStoreId;
        if (currentStoreId) {
          setSelectedStoreId(currentStoreId);
        } else if (storesData.length === 1) {
          setSelectedStoreId(storesData[0].value);
        }
      } else {
        const storeId = currentUser.storeId?._id || currentUser.storeId;
        setSelectedStoreId(storeId);
      }
    } catch (error) {
      console.error('Failed to load user/stores:', error);
    }
  };

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.value === storeId);
    return store ? store.label : 'Select a store...';
  };

  // Fetch products based on selected store
  const fetchProducts = async () => {
    if (!selectedStoreId) {
      setProducts([]);
      return;
    }

    setLoadingProducts(true);
    try {
      const params = {
        limit: 100,
        sortBy: "name",
        sortOrder: "asc",
        isActive: "true",
        inStock: "true", // Only show products with stock
      };

      // Add store filter
      if (selectedStoreId) {
        params.storeId = selectedStoreId;
      }

      const result = await ProductService.getProducts(params);
      setProducts(result.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      await showAlert("Error", "Failed to load products. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadUserAndStores();
  }, []);

  // Fetch products when store changes
  useEffect(() => {
    if (selectedStoreId) {
      fetchProducts();
    }
  }, [selectedStoreId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(), loadUserAndStores()]);
    setRefreshing(false);
  };

  const searchProducts = () => {
    if (!searchTerm.trim()) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const addToLocalCart = (product, qty) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === product._id,
    );

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + qty,
      };
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product._id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.unitPrice,
          quantity: qty,
          taxRate: product.taxRate || 0,
          product: product,
        },
      ]);
    }
  };

  const removeFromLocalCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  const updateLocalQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromLocalCart(productId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const clearLocalCart = () => {
    if (cartItems.length === 0) return;
    showAlert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => setCartItems([]),
      },
    ]);
  };

  const submitTransaction = async () => {
    if (cartItems.length === 0) {
      await showAlert("Error", "Cart is empty. Please add items first.");
      return;
    }

    if (isSuperAdmin && !selectedStoreId) {
      await showAlert("Error", "Please select a store first");
      return;
    }

    const lowStockItems = cartItems.filter((item) => {
      const inventory = item.product?.inventory;
      return inventory && inventory.quantity < item.quantity;
    });

    if (lowStockItems.length > 0) {
      await showAlert(
        "Low Stock Warning",
        `Some items have insufficient stock:\n${lowStockItems
          .map(
            (i) =>
              `- ${i.name}: ${i.quantity} ordered, ${i.product?.inventory?.quantity || 0} available`,
          )
          .join("\n")}\n\nDo you want to continue?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", onPress: () => proceedWithSubmission() },
        ]
      );
      return;
    }

    proceedWithSubmission();
  };

  const proceedWithSubmission = async () => {
    setSubmitting(true);
    try {
      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const transaction = await TransactionService.createTransactionWithItems(
        items,
        isSuperAdmin ? selectedStoreId : null
      );
      
      setTransactionResult({ transaction, success: true });

      await showAlert(
        "✅ Transaction Created!",
        `Transaction: ${transaction.transactionNumber}\nItems: ${transaction.items?.length || 0}\nTotal: ${formatCurrency(transaction.totalAmount)}\n\nSales Receipt has been generated.`,
        [
          {
            text: "View Receipt",
            onPress: () =>
              router.push({
                pathname: "/(app)/(modals)/receipt-preview",
                params: {
                  transactionId: transaction._id,
                  qrData: transaction.salesQR,
                  qrType: "SALES",
                  transactionNumber: transaction.transactionNumber,
                  mode: "sales",
                },
              }),
          },
          {
            text: "Done",
            style: "cancel",
            onPress: () => {
              setCartItems([]);
              setTransactionResult(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Submission error:", error);
      await showAlert(
        "Error",
        error.response?.data?.message || error.message || "Failed to create transaction. Please try again."
      );
      setTransactionResult({ success: false, error: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getItemTotal = (item) => {
    return (item.unitPrice || 0) * (item.quantity || 0);
  };

  const CartItem = ({ item }) => {
    const total = getItemTotal(item);
    const inventory = item.product?.inventory;
    const isLowStock = inventory && inventory.quantity < item.quantity;
    const isOutOfStock = inventory && inventory.quantity <= 0;

    return (
      <View
        style={[styles.cartItem, isOutOfStock && styles.cartItemOutOfStock]}
      >
        <View style={styles.cartItemRow}>
          <View style={styles.cartItemInfo}>
            <View style={styles.cartItemHeader}>
              <Text style={styles.cartItemName} numberOfLines={1}>
                {item.name}
              </Text>
              {isLowStock && (
                <View style={styles.lowStockBadge}>
                  <AlertCircle size={12} color={Colors.error} />
                  <Text style={styles.lowStockText}>Low Stock</Text>
                </View>
              )}
              {isOutOfStock && (
                <View style={styles.outOfStockBadge}>
                  <AlertCircle size={12} color={Colors.error} />
                  <Text style={styles.outOfStockBadgeText}>Out of Stock</Text>
                </View>
              )}
            </View>

            <View style={styles.cartItemMeta}>
              <View style={styles.cartItemTag}>
                <Text style={styles.cartItemTagText}>
                  SKU: {item.sku || "N/A"}
                </Text>
              </View>
              {item.product?.brand && (
                <View style={styles.cartItemTag}>
                  <Text style={styles.cartItemTagText}>
                    {item.product.brand}
                  </Text>
                </View>
              )}
              {item.product?.category && (
                <View style={styles.cartItemTag}>
                  <Text style={styles.cartItemTagText}>
                    {item.product.category}
                  </Text>
                </View>
              )}
            </View>

            {item.product?.description && (
              <Text style={styles.cartItemDescription} numberOfLines={1}>
                {item.product.description}
              </Text>
            )}

            <View style={styles.cartItemDetails}>
              <View style={styles.cartItemStockInfo}>
                <View
                  style={[
                    styles.cartStockIndicator,
                    inventory?.quantity > 10
                      ? styles.stockHigh
                      : inventory?.quantity > 0
                        ? styles.stockMedium
                        : styles.stockLow,
                  ]}
                />
                <Text
                  style={[
                    styles.cartItemStock,
                    inventory?.quantity === 0 && styles.stockOutText,
                  ]}
                >
                  {inventory?.quantity > 0
                    ? `${inventory.quantity} available`
                    : "Out of stock"}
                </Text>
              </View>
              <View style={styles.cartItemPriceContainer}>
                <Text style={styles.cartItemUnitPrice}>
                  {formatCurrency(item.unitPrice)} each
                </Text>
                <Text style={styles.cartItemTotalPrice}>
                  {formatCurrency(total)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cartItemActions}>
            <View style={styles.cartQuantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  updateLocalQuantity(item.productId, item.quantity - 1)
                }
                disabled={submitting || isOutOfStock}
              >
                <Minus size={16} color={Colors.gray500} />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                {item.quantity > 1 && (
                  <Text style={styles.quantitySubtext}>
                    × {formatCurrency(item.unitPrice)}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  updateLocalQuantity(item.productId, item.quantity + 1)
                }
                disabled={submitting || isOutOfStock}
              >
                <Plus size={16} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromLocalCart(item.productId)}
              disabled={submitting}
            >
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  };

  const getTaxTotal = () => {
    return cartItems.reduce((sum, item) => {
      const taxRate = item.taxRate || 0;
      return sum + (getItemTotal(item) * taxRate) / 100;
    }, 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Sales</Text>
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Package size={14} color={Colors.primary} />
                  <Text style={styles.cartBadgeText}>
                    {cartItems.length} items
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.headerRight}>
              {cartItems.length > 0 && (
                <TouchableOpacity
                  style={styles.clearHeaderButton}
                  onPress={clearLocalCart}
                  disabled={submitting}
                >
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Store Selector - Super Admin Only */}
          {isSuperAdmin && (
            <View style={styles.storeSelectorContainer}>
              <View style={styles.storeSelectorRow}>
                <Store size={16} color={Colors.primary} />
                <Text style={styles.storeSelectorLabel}>Store:</Text>
                <TouchableOpacity
                  style={styles.storeSelector}
                  onPress={() => setShowStoreDropdown(!showStoreDropdown)}
                  disabled={stores.length === 0}
                >
                  <Text style={styles.storeSelectorText}>
                    {selectedStoreId ? getStoreName(selectedStoreId) : 'Select a store...'}
                  </Text>
                  <ChevronDown size={16} color={Colors.gray500} />
                </TouchableOpacity>
              </View>
              {showStoreDropdown && (
                <View style={styles.storeDropdown}>
                  {stores.map((store) => (
                    <TouchableOpacity
                      key={store.value}
                      style={[
                        styles.storeDropdownItem,
                        selectedStoreId === store.value && styles.storeDropdownItemActive,
                      ]}
                      onPress={() => {
                        setSelectedStoreId(store.value);
                        setShowStoreDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.storeDropdownText,
                        selectedStoreId === store.value && styles.storeDropdownTextActive,
                      ]}>
                        {store.label}
                      </Text>
                      {selectedStoreId === store.value && (
                        <CheckCircle size={16} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {!selectedStoreId && (
                <Text style={styles.warningText}>⚠️ Please select a store</Text>
              )}
            </View>
          )}

          {/* Store Info for Regular Users */}
          {!isSuperAdmin && selectedStoreId && (
            <View style={styles.storeInfoContainer}>
              <Store size={14} color={Colors.gray500} />
              <Text style={styles.storeInfoText}>
                Store: {getStoreName(selectedStoreId)}
              </Text>
            </View>
          )}

          {/* No Store Selected State */}
          {isSuperAdmin && !selectedStoreId && (
            <View style={styles.noStoreContainer}>
              <Store size={40} color={Colors.gray400} />
              <Text style={styles.noStoreTitle}>No Store Selected</Text>
              <Text style={styles.noStoreSubtitle}>
                Please select a store to start selling
              </Text>
            </View>
          )}

          {selectedStoreId && (
            <View style={styles.cartContainer}>
              {cartItems.length === 0 ? (
                <View style={styles.emptyCart}>
                  <ShoppingCart size={80} color={Colors.gray300} />
                  <Text style={styles.emptyCartTitle}>Cart is Empty</Text>
                  <Text style={styles.emptyCartSubtitle}>
                    Search and add products to create a transaction
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyCartButton}
                    onPress={() => setSearchModal(true)}
                  >
                    <Plus size={20} color={Colors.white} />
                    <Text style={styles.emptyCartButtonText}>Add Items</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.cartHeader}>
                    <View style={styles.cartHeaderLeft}>
                      <Text style={styles.cartItemCount}>
                        {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
                      </Text>
                      <View style={styles.cartHeaderBadge}>
                        <Text style={styles.cartHeaderBadgeText}>
                          {cartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          units
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cartTotal}>
                      Total: {formatCurrency(getTotal() + getTaxTotal())}
                    </Text>
                  </View>

                  <ScrollView
                    style={styles.cartList}
                    showsVerticalScrollIndicator={false}
                  >
                    {cartItems.map((item, index) => (
                      <CartItem key={item.productId || index} item={item} />
                    ))}
                  </ScrollView>

                  <View style={styles.footer}>
                    <View style={styles.footerSummary}>
                      <View style={styles.footerRow}>
                        <Text style={styles.footerLabel}>Items</Text>
                        <Text style={styles.footerValue}>{cartItems.length}</Text>
                      </View>
                      <View style={styles.footerRow}>
                        <Text style={styles.footerLabel}>Subtotal</Text>
                        <Text style={styles.footerValue}>
                          {formatCurrency(getTotal())}
                        </Text>
                      </View>
                      <View style={styles.footerRow}>
                        <Text style={styles.footerLabel}>Tax</Text>
                        <Text style={styles.footerValue}>
                          {formatCurrency(getTaxTotal())}
                        </Text>
                      </View>
                      <View style={[styles.footerRow, styles.footerTotal]}>
                        <Text style={styles.footerTotalLabel}>Total</Text>
                        <Text style={styles.footerTotalValue}>
                          {formatCurrency(getTotal() + getTaxTotal())}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.footerButtons}>
                      <TouchableOpacity
                        style={[styles.footerButton, styles.addButton]}
                        onPress={() => setSearchModal(true)}
                        disabled={submitting}
                      >
                        <Plus size={18} color={Colors.gray700} />
                        <Text style={styles.addButtonText}>Add Item</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.footerButton,
                          styles.submitButton,
                          (cartItems.length === 0 || submitting || (isSuperAdmin && !selectedStoreId)) &&
                            styles.buttonDisabled,
                        ]}
                        onPress={submitTransaction}
                        disabled={cartItems.length === 0 || submitting || (isSuperAdmin && !selectedStoreId)}
                      >
                        {submitting ? (
                          <ActivityIndicator color={Colors.white} size="small" />
                        ) : (
                          <>
                            <Send size={18} color={Colors.white} />
                            <Text style={styles.submitButtonText}>
                              {isSuperAdmin && !selectedStoreId ? 'Select Store First' : 'Submit'}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Search Modal - Only show when store is selected */}
      <Modal visible={searchModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalTitle}>Add Products</Text>
                <View style={styles.modalHeaderBadge}>
                  <Text style={styles.modalHeaderBadgeText}>
                    {cartItems.length} in cart
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSearchModal(false)}>
                <X size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearch}>
              <View style={styles.modalSearchContainer}>
                <Search size={20} color={Colors.gray400} />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search by name, SKU, or brand..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholderTextColor={Colors.gray400}
                  autoFocus
                />
                {searchTerm.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchTerm("")}>
                    <X size={18} color={Colors.gray400} />
                  </TouchableOpacity>
                )}
              </View>
              {selectedStoreId && (
                <View style={styles.searchStoreInfo}>
                  <Store size={14} color={Colors.primary} />
                  <Text style={styles.searchStoreText}>
                    Showing products from: {getStoreName(selectedStoreId)}
                  </Text>
                </View>
              )}
            </View>

            {loadingProducts ? (
              <View style={styles.loadingProductsContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingProductsText}>Loading products...</Text>
              </View>
            ) : (
              <FlatList
                style={styles.productList}
                contentContainerStyle={styles.productListContent}
                data={searchProducts()}
                keyExtractor={(item) => item._id}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={({ item }) => {
                  const inCart = cartItems.some((c) => c.productId === item._id);
                  const inventory = item.inventory;
                  const isOutOfStock = inventory && inventory.quantity <= 0;
                  const cartQuantity =
                    cartItems.find((c) => c.productId === item._id)?.quantity ||
                    0;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.productItem,
                        inCart && styles.productItemInCart,
                        isOutOfStock && styles.productItemOutOfStock,
                      ]}
                      onPress={() => {
                        if (isOutOfStock) {
                          showAlert(
                            "Out of Stock",
                            "This item is currently out of stock."
                          );
                          return;
                        }
                        setSelectedProduct(item);
                        const maxQty = inventory?.quantity || 99;
                        setQuantity(Math.min(1, maxQty));
                      }}
                      disabled={isOutOfStock}
                    >
                      <View style={styles.productItemContainer}>
                        <View style={styles.productItemContent}>
                          <View style={styles.productItemHeader}>
                            <Text
                              style={styles.productItemName}
                              numberOfLines={1}
                            >
                              {item.name}
                            </Text>
                            {inCart && (
                              <View style={styles.inCartBadge}>
                                <CheckCircle size={12} color={Colors.success} />
                                <Text style={styles.inCartText}>
                                  {cartQuantity} in cart
                                </Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.productItemMeta}>
                            <View style={styles.productItemTag}>
                              <Text style={styles.productItemTagText}>
                                SKU: {item.sku}
                              </Text>
                            </View>
                            {item.brand && (
                              <View style={styles.productItemTag}>
                                <Text style={styles.productItemTagText}>
                                  {item.brand}
                                </Text>
                              </View>
                            )}
                            {item.category && (
                              <View style={styles.productItemTag}>
                                <Text style={styles.productItemTagText}>
                                  {item.category}
                                </Text>
                              </View>
                            )}
                          </View>

                          {item.description && (
                            <Text
                              style={styles.productItemDescription}
                              numberOfLines={2}
                            >
                              {item.description}
                            </Text>
                          )}

                          <View style={styles.productItemFooter}>
                            <View style={styles.productItemStockInfo}>
                              <View
                                style={[
                                  styles.stockIndicator,
                                  inventory?.quantity > 10
                                    ? styles.stockHigh
                                    : inventory?.quantity > 0
                                      ? styles.stockMedium
                                      : styles.stockLow,
                                ]}
                              />
                              <Text
                                style={[
                                  styles.productItemStock,
                                  inventory?.quantity === 0 &&
                                    styles.stockOutText,
                                ]}
                              >
                                {inventory?.quantity > 0
                                  ? `${inventory.quantity} in stock`
                                  : "Out of stock"}
                              </Text>
                            </View>
                            <Text style={styles.productItemPrice}>
                              {formatCurrency(item.unitPrice || 0)}
                            </Text>
                          </View>

                          {isOutOfStock && (
                            <View style={styles.outOfStockOverlay}>
                              <Text style={styles.outOfStockText}>
                                Out of Stock
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={() => (
                  <View style={styles.noProductsContainer}>
                    <Package size={48} color={Colors.gray300} />
                    <Text style={styles.noProductsTitle}>
                      {searchTerm.length >= 2
                        ? "No products found"
                        : "Start typing to search"}
                    </Text>
                    <Text style={styles.noProductsSubtitle}>
                      {searchTerm.length >= 2
                        ? "Try adjusting your search terms"
                        : "Search by name, SKU, or brand"}
                    </Text>
                    {!searchTerm && products.length === 0 && (
                      <Text style={styles.noProductsSubtitle}>
                        No products available in this store
                      </Text>
                    )}
                  </View>
                )}
              />
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalDoneButton}
                onPress={() => {
                  setSearchModal(false);
                  setSearchTerm("");
                }}
              >
                <CheckCircle size={20} color={Colors.white} />
                <Text style={styles.modalDoneButtonText}>
                  Done ({cartItems.length} items)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quantity Modal */}
      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.quantityModalOverlay}>
          <View style={styles.quantityModalContent}>
            <Text style={styles.quantityModalTitle}>
              {selectedProduct?.name}
            </Text>
            <Text style={styles.quantityModalPrice}>
              {formatCurrency(selectedProduct?.unitPrice || 0)} each
            </Text>
            <Text style={styles.quantityModalStock}>
              Available: {selectedProduct?.inventory?.quantity || 0}
            </Text>

            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantitySelectorButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={24} color={Colors.gray500} />
              </TouchableOpacity>
              <TextInput
                style={styles.quantitySelectorInput}
                keyboardType="numeric"
                value={String(quantity)}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  const max = selectedProduct?.inventory?.quantity || 999;
                  setQuantity(Math.min(Math.max(1, num), max));
                }}
              />
              <TouchableOpacity
                style={styles.quantitySelectorButton}
                onPress={() => {
                  const max = selectedProduct?.inventory?.quantity || 999;
                  setQuantity(Math.min(quantity + 1, max));
                }}
              >
                <Plus size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <View style={styles.quantityModalButtons}>
              <TouchableOpacity
                style={[
                  styles.quantityModalButton,
                  styles.quantityCancelButton,
                ]}
                onPress={() => {
                  setSelectedProduct(null);
                  setQuantity(1);
                }}
              >
                <Text style={styles.quantityCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quantityModalButton,
                  styles.quantityAddButton,
                  loading && styles.buttonDisabled,
                ]}
                onPress={() => {
                  if (selectedProduct) {
                    addToLocalCart(selectedProduct, quantity);
                    setSelectedProduct(null);
                    setQuantity(1);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.quantityAddText}>
                    Add {quantity > 1 ? `${quantity}x ` : ""}to Cart
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert Modal */}
      <CustomAlertModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        buttons={alertModal.buttons}
        onClose={closeAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.md,
    color: Colors.gray500,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearHeaderButton: {
    padding: Spacing.sm,
  },
  cartBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  cartBadgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "600",
  },

  // Store Selector
  storeSelectorContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  storeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeSelectorLabel: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    marginLeft: Spacing.sm,
    fontWeight: '500',
  },
  storeSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  storeSelectorText: {
    fontSize: Typography.sm,
    color: Colors.gray900,
    flex: 1,
  },
  storeDropdown: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginTop: Spacing.xs,
    ...Shadows.md,
    maxHeight: 200,
  },
  storeDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  storeDropdownItemActive: {
    backgroundColor: Colors.primary + '10',
  },
  storeDropdownText: {
    fontSize: Typography.md,
    color: Colors.gray900,
    flex: 1,
  },
  storeDropdownTextActive: {
    color: Colors.primary,
    fontWeight: '500',
  },
  warningText: {
    color: Colors.error,
    fontSize: Typography.xs,
    marginTop: Spacing.xs,
  },

  // Store Info for Regular Users
  storeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  storeInfoText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
  },

  // No Store Selected
  noStoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
    gap: Spacing.md,
  },
  noStoreTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray700,
  },
  noStoreSubtitle: {
    fontSize: Typography.md,
    color: Colors.gray500,
    textAlign: "center",
  },

  cartContainer: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  emptyCartTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.md,
  },
  emptyCartSubtitle: {
    fontSize: Typography.md,
    color: Colors.gray500,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  emptyCartButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing["2xl"],
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  emptyCartButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.md,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: 4,
    marginBottom: Spacing.xs,
  },
  cartHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cartItemCount: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: "500",
  },
  cartHeaderBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  cartHeaderBadgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
  cartTotal: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray900,
  },
  cartList: {
    flex: 1,
    marginBottom: Spacing.sm,
  },
  cartItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  cartItemOutOfStock: {
    opacity: 0.6,
    borderColor: Colors.error + "40",
  },
  cartItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cartItemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cartItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  cartItemName: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    flex: 1,
  },
  cartItemMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: Spacing.xs,
  },
  cartItemTag: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  cartItemTagText: {
    fontSize: Typography.xs,
    color: Colors.gray600,
  },
  cartItemDescription: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  cartItemDetails: {
    marginTop: Spacing.xs,
  },
  cartItemStockInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  cartStockIndicator: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  cartItemStock: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  cartItemPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  cartItemUnitPrice: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  cartItemTotalPrice: {
    fontSize: Typography.md,
    fontWeight: "700",
    color: Colors.gray900,
  },
  cartItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  lowStockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.error + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  lowStockText: {
    fontSize: Typography.xs,
    color: Colors.error,
    fontWeight: "500",
  },
  outOfStockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.error + "30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  outOfStockBadgeText: {
    fontSize: Typography.xs,
    color: Colors.error,
    fontWeight: "600",
  },
  cartQuantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.xs,
  },
  quantityDisplay: {
    alignItems: "center",
    paddingHorizontal: 8,
    minWidth: 32,
  },
  quantityText: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    textAlign: "center",
  },
  quantitySubtext: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  removeButton: {
    padding: Spacing.sm,
    marginLeft: 2,
    backgroundColor: Colors.error + "10",
    borderRadius: BorderRadius.full,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  footerSummary: {
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  footerLabel: {
    fontSize: Typography.md,
    color: Colors.gray600,
  },
  footerValue: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  footerTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  footerTotalLabel: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  footerTotalValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  footerButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  footerButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  addButton: {
    backgroundColor: Colors.gray200,
  },
  addButtonText: {
    fontWeight: "600",
    color: Colors.gray700,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    fontWeight: "600",
    color: Colors.white,
    padding: Spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    marginTop: 80,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["3xl"],
    borderTopRightRadius: BorderRadius["3xl"],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  modalHeaderBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  modalHeaderBadgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
  },
  modalSearch: {
    padding: Spacing.md,
  },
  modalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  modalSearchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.md,
  },
  searchStoreInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  searchStoreText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "500",
  },
  loadingProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["3xl"],
  },
  loadingProductsText: {
    marginTop: Spacing.md,
    color: Colors.gray500,
    fontSize: Typography.md,
  },
  modalFooter: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  modalDoneButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  modalDoneButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.md,
  },
  productList: {
    flex: 1,
  },
  productListContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  productItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    paddingHorizontal: Spacing.sm,
  },
  productItemInCart: {
    backgroundColor: Colors.success + "10",
    borderRadius: BorderRadius.sm,
    marginHorizontal: -Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  productItemOutOfStock: {
    opacity: 0.6,
  },
  productItemContainer: {
    flex: 1,
  },
  productItemContent: {
    position: "relative",
  },
  productItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  productItemName: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    flex: 1,
    marginRight: Spacing.sm,
  },
  productItemMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: Spacing.xs,
  },
  productItemTag: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  productItemTagText: {
    fontSize: Typography.xs,
    color: Colors.gray600,
  },
  productItemDescription: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  productItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productItemStockInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  productItemStock: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  productItemPrice: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  stockHigh: {
    backgroundColor: Colors.success,
  },
  stockMedium: {
    backgroundColor: Colors.warning,
  },
  stockLow: {
    backgroundColor: Colors.error,
  },
  stockOutText: {
    color: Colors.error,
  },
  inCartBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inCartText: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: "500",
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
  },
  outOfStockText: {
    fontSize: Typography.xs,
    color: Colors.error,
    fontWeight: "500",
  },
  noProductsContainer: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  noProductsTitle: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray500,
    marginTop: Spacing.md,
  },
  noProductsSubtitle: {
    fontSize: Typography.sm,
    color: Colors.gray400,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  quantityModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityModalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    width: 340,
  },
  quantityModalTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    textAlign: "center",
  },
  quantityModalPrice: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  quantityModalStock: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  quantitySelectorButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  quantitySelectorInput: {
    width: 60,
    textAlign: "center",
    fontSize: Typography.xl,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  quantityModalButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing["2xl"],
  },
  quantityModalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityCancelButton: {
    backgroundColor: Colors.gray200,
  },
  quantityCancelText: {
    fontWeight: "600",
    color: Colors.gray700,
  },
  quantityAddButton: {
    backgroundColor: Colors.primary,
  },
  quantityAddText: {
    fontWeight: "600",
    color: Colors.white,
  },

  // Alert Modal Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  alertContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius["2xl"],
    width: "100%",
    maxWidth: 380,
    ...Shadows.lg,
    overflow: "hidden",
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  alertTitle: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    flex: 1,
  },
  alertCloseButton: {
    padding: Spacing.xs,
  },
  alertBody: {
    padding: Spacing.lg,
    paddingVertical: Spacing["2xl"],
  },
  alertMessage: {
    fontSize: Typography.md,
    color: Colors.gray700,
    lineHeight: 24,
    textAlign: "center",
  },
  alertFooter: {
    flexDirection: "row",
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    justifyContent: "flex-end",
  },
  alertButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    minWidth: 80,
    alignItems: "center",
  },
  alertButtonMargin: {
    marginLeft: Spacing.sm,
  },
  alertPrimaryButton: {
    backgroundColor: Colors.primary,
  },
  alertCancelButton: {
    backgroundColor: Colors.gray200,
  },
  alertPrimaryText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
  alertCancelText: {
    color: Colors.gray700,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
});