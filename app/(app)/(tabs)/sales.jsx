// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
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
//   Printer,
//   CreditCard,
//   QrCode,
//   RefreshCw,
// } from "lucide-react-native";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";

// export default function Sales() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [cart, setCart] = useState([]);
//   const [transaction, setTransaction] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [searchModal, setSearchModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [processingQR, setProcessingQR] = useState(false);

//   useEffect(() => {
//     initializeTransaction();
//     fetchProducts();
//   }, []);

//   const initializeTransaction = async () => {
//     try {
//       const newTransaction = await TransactionService.createTransaction();
//       setTransaction(newTransaction);
//       setCart(newTransaction.items || []);
//     } catch (error) {
//       Alert.alert("Error", "Failed to create transaction");
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const result = await ProductService.getProducts({ limit: 100 });
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

//   const addToCart = async (product, qty) => {
//     if (!transaction) return;

//     setLoading(true);
//     try {
//       const updatedTransaction = await TransactionService.addItem(
//         transaction._id,
//         product._id,
//         qty,
//       );

//       setTransaction(updatedTransaction);
//       setCart(updatedTransaction.items || []);
//       setSearchModal(false);
//       setSelectedProduct(null);
//       setQuantity(1);
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to add item",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (item, newQuantity) => {
//     if (newQuantity < 1) return;

//     try {
//       const updatedItems = cart.filter(
//         (i) => i.productId._id !== item.productId._id,
//       );
//       setCart(updatedItems);
//       const newTotal = updatedItems.reduce(
//         (sum, i) => sum + i.unitPrice * i.quantity,
//         0,
//       );
//       setTransaction((prev) => ({
//         ...prev,
//         items: updatedItems,
//         totalAmount: newTotal,
//         subtotal: newTotal,
//       }));

//       await addToCart(
//         { ...item.productId, _id: item.productId._id },
//         newQuantity,
//       );
//     } catch (error) {
//       Alert.alert("Error", "Failed to update quantity");
//     }
//   };

//   const removeFromCart = async (item) => {
//     const updatedItems = cart.filter(
//       (i) => i.productId._id !== item.productId._id,
//     );
//     setCart(updatedItems);
//     const newTotal = updatedItems.reduce(
//       (sum, i) => sum + i.unitPrice * i.quantity,
//       0,
//     );
//     setTransaction((prev) => ({
//       ...prev,
//       items: updatedItems,
//       totalAmount: newTotal,
//       subtotal: newTotal,
//     }));
//   };

//   const generateSalesQR = async () => {
//     if (!transaction || cart.length === 0) {
//       Alert.alert("Error", "Cart is empty");
//       return;
//     }

//     setProcessingQR(true);
//     try {
//       const result = await TransactionService.generateSalesQR(transaction._id);
//       setTransaction(result.transaction);

//       Alert.alert("Success", "Sales QR generated successfully", [
//         {
//           text: "View QR",
//           onPress: () => {
//             router.push({
//               pathname: "/(app)/(modals)/receipt-preview",
//               params: { transactionId: transaction._id, qrData: result.qrCode },
//             });
//           },
//         },
//         {
//           text: "Process Payment",
//           onPress: () =>
//             router.push({
//               pathname: "/(app)/(modals)/payment-modal",
//               params: { transactionId: transaction._id },
//             }),
//         },
//       ]);
//     } catch (error) {
//       console.error("QR Generation Error:", error);
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to generate QR",
//       );
//     } finally {
//       setProcessingQR(false);
//     }
//   };

//   const CartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <View style={styles.cartItemRow}>
//         <View style={styles.cartItemInfo}>
//           <Text style={styles.cartItemName}>{item.name}</Text>
//           <Text style={styles.cartItemSku}>SKU: {item.sku}</Text>
//           <Text style={styles.cartItemPrice}>
//             ${(item.unitPrice * item.quantity).toFixed(2)}
//           </Text>
//         </View>
//         <View style={styles.cartItemActions}>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={() => updateQuantity(item, item.quantity - 1)}
//           >
//             <Minus size={16} color={Colors.gray500} />
//           </TouchableOpacity>
//           <Text style={styles.quantityText}>{item.quantity}</Text>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={() => updateQuantity(item, item.quantity + 1)}
//           >
//             <Plus size={16} color={Colors.gray500} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.removeButton}
//             onPress={() => removeFromCart(item)}
//           >
//             <Trash2 size={20} color={Colors.error} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   if (!transaction) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Sales</Text>
//           <Text style={styles.headerSubtitle}>
//             Transaction: {transaction.transactionNumber}
//           </Text>
//         </View>

//         <View style={styles.cartContainer}>
//           {cart.length === 0 ? (
//             <View style={styles.emptyCart}>
//               <ShoppingCart size={64} color={Colors.gray300} />
//               <Text style={styles.emptyCartText}>Cart is empty</Text>
//               <TouchableOpacity
//                 style={styles.emptyCartButton}
//                 onPress={() => setSearchModal(true)}
//               >
//                 <Text style={styles.emptyCartButtonText}>Add Items</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <ScrollView style={styles.cartList}>
//                 {cart.map((item, index) => (
//                   <CartItem key={index} item={item} />
//                 ))}
//               </ScrollView>

//               <View style={styles.footer}>
//                 <View style={styles.footerRow}>
//                   <Text style={styles.footerLabel}>Subtotal</Text>
//                   <Text style={styles.footerValue}>
//                     ${transaction.subtotal?.toFixed(2) || "0.00"}
//                   </Text>
//                 </View>
//                 <View style={styles.footerRow}>
//                   <Text style={styles.footerLabel}>Tax</Text>
//                   <Text style={styles.footerValue}>
//                     ${transaction.taxTotal?.toFixed(2) || "0.00"}
//                   </Text>
//                 </View>
//                 <View style={[styles.footerRow, styles.footerTotal]}>
//                   <Text style={styles.footerTotalLabel}>Total</Text>
//                   <Text style={styles.footerTotalValue}>
//                     ${transaction.totalAmount?.toFixed(2) || "0.00"}
//                   </Text>
//                 </View>

//                 <View style={styles.footerButtons}>
//                   <TouchableOpacity
//                     style={[styles.footerButton, styles.addButton]}
//                     onPress={() => setSearchModal(true)}
//                   >
//                     <Text style={styles.addButtonText}>Add Item</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.footerButton,
//                       styles.qrButton,
//                       (cart.length === 0 || processingQR) &&
//                         styles.buttonDisabled,
//                     ]}
//                     onPress={generateSalesQR}
//                     disabled={cart.length === 0 || processingQR}
//                   >
//                     {processingQR ? (
//                       <ActivityIndicator color={Colors.white} size="small" />
//                     ) : (
//                       <>
//                         <QrCode size={18} color={Colors.white} />
//                         <Text style={styles.qrButtonText}>Generate QR</Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </>
//           )}
//         </View>
//       </View>

//       {/* Search Modal */}
//       <Modal visible={searchModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add Products</Text>
//               <TouchableOpacity onPress={() => setSearchModal(false)}>
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalSearch}>
//               <View style={styles.modalSearchContainer}>
//                 <Search size={20} color={Colors.gray400} />
//                 <TextInput
//                   style={styles.modalSearchInput}
//                   placeholder="Search by name or SKU..."
//                   value={searchTerm}
//                   onChangeText={setSearchTerm}
//                   placeholderTextColor={Colors.gray400}
//                 />
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
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.productItem}
//                   onPress={() => {
//                     setSelectedProduct(item);
//                     setQuantity(1);
//                   }}
//                 >
//                   <View>
//                     <Text style={styles.productItemName}>{item.name}</Text>
//                     <Text style={styles.productItemSku}>{item.sku}</Text>
//                     <Text style={styles.productItemStock}>
//                       Stock: {item.inventory?.quantity || 0}
//                     </Text>
//                   </View>
//                   <Text style={styles.productItemPrice}>
//                     ${item.unitPrice.toFixed(2)}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={() => (
//                 <Text style={styles.noProductsText}>
//                   {searchTerm.length >= 2
//                     ? "No products found"
//                     : "Type to search"}
//                 </Text>
//               )}
//             />
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
//               ${selectedProduct?.unitPrice?.toFixed(2)} each
//             </Text>
//             <Text style={styles.quantityModalStock}>
//               Available: {selectedProduct?.inventory?.quantity || 0}
//             </Text>

//             <View style={styles.quantitySelector}>
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Minus size={20} color={Colors.gray500} />
//               </TouchableOpacity>
//               <Text style={styles.quantitySelectorValue}>{quantity}</Text>
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => setQuantity(quantity + 1)}
//               >
//                 <Plus size={20} color={Colors.gray500} />
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
//                 onPress={() => addToCart(selectedProduct, quantity)}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={Colors.white} size="small" />
//                 ) : (
//                   <Text style={styles.quantityAddText}>Add to Cart</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   content: { flex: 1, paddingHorizontal: Spacing.md },
//   header: { paddingVertical: Spacing.md },
//   headerTitle: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
//   cartContainer: { flex: 1 },
//   emptyCart: { flex: 1, justifyContent: "center", alignItems: "center" },
//   emptyCartText: { color: Colors.gray500, marginTop: Spacing.sm },
//   emptyCartButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   emptyCartButtonText: { color: Colors.white, fontWeight: "600" },
//   cartList: { flex: 1 },
//   cartItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     ...Shadows.sm,
//   },
//   cartItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   cartItemInfo: { flex: 1 },
//   cartItemName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   cartItemSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   cartItemPrice: {
//     fontSize: Typography.sm,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   cartItemActions: { flexDirection: "row", alignItems: "center" },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantityText: { width: 32, textAlign: "center", fontWeight: "500" },
//   removeButton: { padding: Spacing.sm, marginLeft: Spacing.xs },
//   footer: {
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     padding: Spacing.md,
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: Spacing.xs,
//   },
//   footerLabel: { fontSize: Typography.md, color: Colors.gray600 },
//   footerValue: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   footerTotal: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     paddingTop: Spacing.sm,
//     marginTop: Spacing.sm,
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
//     gap: Spacing.sm,
//     marginTop: Spacing.md,
//   },
//   footerButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },
//   addButton: { backgroundColor: Colors.gray200 },
//   addButtonText: { fontWeight: "600", color: Colors.gray700 },
//   qrButton: { backgroundColor: Colors.primary },
//   qrButtonText: {
//     fontWeight: "600",
//     color: Colors.white,
//     marginLeft: Spacing.sm,
//   },
//   buttonDisabled: { opacity: 0.7 },
//   modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
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
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalSearch: { padding: Spacing.md },
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
//   productList: { flex: 1 },
//   productListContent: { paddingHorizontal: Spacing.md },
//   productItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   productItemName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   productItemSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   productItemStock: { fontSize: Typography.xs, color: Colors.gray500 },
//   productItemPrice: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   noProductsText: {
//     textAlign: "center",
//     color: Colors.gray500,
//     paddingVertical: Spacing.md,
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
//     width: 320,
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
//     width: 40,
//     height: 40,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantitySelectorValue: {
//     width: 48,
//     textAlign: "center",
//     fontSize: Typography.xl,
//     fontWeight: "bold",
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
//   quantityCancelButton: { backgroundColor: Colors.gray200 },
//   quantityCancelText: { fontWeight: "600", color: Colors.gray700 },
//   quantityAddButton: { backgroundColor: Colors.primary },
//   quantityAddText: { fontWeight: "600", color: Colors.white },
// });

// // screens/sales.jsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
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
//   QrCode,
//   RefreshCw,
// } from "lucide-react-native";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";

// export default function Sales() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [cart, setCart] = useState([]);
//   const [transaction, setTransaction] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [searchModal, setSearchModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [processingQR, setProcessingQR] = useState(false);

//   useEffect(() => {
//     initializeTransaction();
//     fetchProducts();
//   }, []);

//   const initializeTransaction = async () => {
//     try {
//       const newTransaction = await TransactionService.createTransaction();
//       setTransaction(newTransaction);
//       setCart(newTransaction.items || []);
//     } catch (error) {
//       Alert.alert("Error", "Failed to create transaction");
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const result = await ProductService.getProducts({ limit: 100 });
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
//         p.sku.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const addToCart = async (product, qty) => {
//     if (!transaction) return;

//     setLoading(true);
//     try {
//       const updatedTransaction = await TransactionService.addItem(
//         transaction._id,
//         product._id,
//         qty
//       );

//       setTransaction(updatedTransaction);
//       setCart(updatedTransaction.items || []);
//       setSearchModal(false);
//       setSelectedProduct(null);
//       setQuantity(1);

//       // Show success message with QR info
//       if (updatedTransaction.salesQR) {
//         Alert.alert(
//           "Item Added",
//           `Item added to transaction. Sales QR is ready.`,
//           [{ text: "OK" }]
//         );
//       }
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to add item"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (item, newQuantity) => {
//     if (newQuantity < 1) return;

//     try {
//       const updatedItems = cart.filter(
//         (i) => i.productId._id !== item.productId._id
//       );
//       setCart(updatedItems);

//       await addToCart(
//         { ...item.productId, _id: item.productId._id },
//         newQuantity
//       );
//     } catch (error) {
//       Alert.alert("Error", "Failed to update quantity");
//     }
//   };

//   const removeFromCart = async (item) => {
//     const updatedItems = cart.filter(
//       (i) => i.productId._id !== item.productId._id
//     );
//     setCart(updatedItems);
//     setTransaction((prev) => ({
//       ...prev,
//       items: updatedItems,
//     }));
//   };

//   const generateSalesQR = async () => {
//     if (!transaction || cart.length === 0) {
//       Alert.alert("Error", "Cart is empty");
//       return;
//     }

//     setProcessingQR(true);
//     try {
//       const result = await TransactionService.generateSalesQR(transaction._id);
//       setTransaction(result.transaction);

//       Alert.alert(
//         "Success",
//         `Sales QR generated for ${result.transaction.transactionNumber}`,
//         [
//           {
//             text: "View QR",
//             onPress: () => {
//               router.push({
//                 pathname: "/(app)/(modals)/receipt-preview",
//                 params: {
//                   transactionId: transaction._id,
//                   qrType: "SALES",
//                   transactionNumber: result.transaction.transactionNumber,
//                   totalAmount: result.transaction.totalAmount,
//                   itemCount: result.transaction.items?.length || 0
//                 },
//               });
//             },
//           },
//           {
//             text: "Process Payment",
//             onPress: () =>
//               router.push({
//                 pathname: "/(app)/(modals)/payment-modal",
//                 params: { transactionId: transaction._id },
//               }),
//           },
//         ]
//       );
//     } catch (error) {
//       console.error("QR Generation Error:", error);
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to generate QR"
//       );
//     } finally {
//       setProcessingQR(false);
//     }
//   };

//   const CartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <View style={styles.cartItemRow}>
//         <View style={styles.cartItemInfo}>
//           <Text style={styles.cartItemName}>{item.name}</Text>
//           <Text style={styles.cartItemSku}>SKU: {item.sku}</Text>
//           <Text style={styles.cartItemPrice}>
//             ${(item.unitPrice * item.quantity).toFixed(2)}
//           </Text>
//         </View>
//         <View style={styles.cartItemActions}>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={() => updateQuantity(item, item.quantity - 1)}
//           >
//             <Minus size={16} color={Colors.gray500} />
//           </TouchableOpacity>
//           <Text style={styles.quantityText}>{item.quantity}</Text>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={() => updateQuantity(item, item.quantity + 1)}
//           >
//             <Plus size={16} color={Colors.gray500} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.removeButton}
//             onPress={() => removeFromCart(item)}
//           >
//             <Trash2 size={20} color={Colors.error} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   if (!transaction) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Sales</Text>
//           <Text style={styles.headerSubtitle}>
//             Transaction: {transaction.transactionNumber}
//           </Text>
//           {transaction.salesQR && (
//             <View style={styles.qrStatus}>
//               <Text style={styles.qrStatusText}>✅ Sales QR Ready</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.cartContainer}>
//           {cart.length === 0 ? (
//             <View style={styles.emptyCart}>
//               <ShoppingCart size={64} color={Colors.gray300} />
//               <Text style={styles.emptyCartText}>Cart is empty</Text>
//               <TouchableOpacity
//                 style={styles.emptyCartButton}
//                 onPress={() => setSearchModal(true)}
//               >
//                 <Text style={styles.emptyCartButtonText}>Add Items</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <ScrollView style={styles.cartList}>
//                 {cart.map((item, index) => (
//                   <CartItem key={index} item={item} />
//                 ))}
//               </ScrollView>

//               <View style={styles.footer}>
//                 <View style={styles.footerRow}>
//                   <Text style={styles.footerLabel}>Subtotal</Text>
//                   <Text style={styles.footerValue}>
//                     ${transaction.subtotal?.toFixed(2) || "0.00"}
//                   </Text>
//                 </View>
//                 <View style={styles.footerRow}>
//                   <Text style={styles.footerLabel}>Tax</Text>
//                   <Text style={styles.footerValue}>
//                     ${transaction.taxTotal?.toFixed(2) || "0.00"}
//                   </Text>
//                 </View>
//                 <View style={[styles.footerRow, styles.footerTotal]}>
//                   <Text style={styles.footerTotalLabel}>Total</Text>
//                   <Text style={styles.footerTotalValue}>
//                     ${transaction.totalAmount?.toFixed(2) || "0.00"}
//                   </Text>
//                 </View>

//                 <View style={styles.footerButtons}>
//                   <TouchableOpacity
//                     style={[styles.footerButton, styles.addButton]}
//                     onPress={() => setSearchModal(true)}
//                   >
//                     <Text style={styles.addButtonText}>Add Item</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.footerButton,
//                       styles.qrButton,
//                       (cart.length === 0 || processingQR) &&
//                         styles.buttonDisabled,
//                     ]}
//                     onPress={generateSalesQR}
//                     disabled={cart.length === 0 || processingQR}
//                   >
//                     {processingQR ? (
//                       <ActivityIndicator color={Colors.white} size="small" />
//                     ) : (
//                       <>
//                         <QrCode size={18} color={Colors.white} />
//                         <Text style={styles.qrButtonText}>
//                           {transaction.salesQR ? "Regenerate QR" : "Generate QR"}
//                         </Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </>
//           )}
//         </View>
//       </View>

//       {/* Search Modal */}
//       <Modal visible={searchModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add Products</Text>
//               <TouchableOpacity onPress={() => setSearchModal(false)}>
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalSearch}>
//               <View style={styles.modalSearchContainer}>
//                 <Search size={20} color={Colors.gray400} />
//                 <TextInput
//                   style={styles.modalSearchInput}
//                   placeholder="Search by name or SKU..."
//                   value={searchTerm}
//                   onChangeText={setSearchTerm}
//                   placeholderTextColor={Colors.gray400}
//                 />
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
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.productItem}
//                   onPress={() => {
//                     setSelectedProduct(item);
//                     setQuantity(1);
//                   }}
//                 >
//                   <View>
//                     <Text style={styles.productItemName}>{item.name}</Text>
//                     <Text style={styles.productItemSku}>{item.sku}</Text>
//                     <Text style={styles.productItemStock}>
//                       Stock: {item.inventory?.quantity || 0}
//                     </Text>
//                   </View>
//                   <Text style={styles.productItemPrice}>
//                     ${item.unitPrice.toFixed(2)}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={() => (
//                 <Text style={styles.noProductsText}>
//                   {searchTerm.length >= 2
//                     ? "No products found"
//                     : "Type to search"}
//                 </Text>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Quantity Modal */}
//       <Modal visible={!!selectedProduct} animationType="slide" transparent={true}>
//         <View style={styles.quantityModalOverlay}>
//           <View style={styles.quantityModalContent}>
//             <Text style={styles.quantityModalTitle}>
//               {selectedProduct?.name}
//             </Text>
//             <Text style={styles.quantityModalPrice}>
//               ${selectedProduct?.unitPrice?.toFixed(2)} each
//             </Text>
//             <Text style={styles.quantityModalStock}>
//               Available: {selectedProduct?.inventory?.quantity || 0}
//             </Text>

//             <View style={styles.quantitySelector}>
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Minus size={20} color={Colors.gray500} />
//               </TouchableOpacity>
//               <Text style={styles.quantitySelectorValue}>{quantity}</Text>
//               <TouchableOpacity
//                 style={styles.quantitySelectorButton}
//                 onPress={() => setQuantity(quantity + 1)}
//               >
//                 <Plus size={20} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.quantityModalButtons}>
//               <TouchableOpacity
//                 style={[styles.quantityModalButton, styles.quantityCancelButton]}
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
//                 onPress={() => addToCart(selectedProduct, quantity)}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={Colors.white} size="small" />
//                 ) : (
//                   <Text style={styles.quantityAddText}>Add to Cart</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   content: { flex: 1, paddingHorizontal: Spacing.md },
//   header: { paddingVertical: Spacing.md },
//   headerTitle: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
//   qrStatus: {
//     marginTop: Spacing.xs,
//     backgroundColor: Colors.success + "20",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//     alignSelf: "flex-start",
//   },
//   qrStatusText: { fontSize: Typography.xs, color: Colors.success },
//   cartContainer: { flex: 1 },
//   emptyCart: { flex: 1, justifyContent: "center", alignItems: "center" },
//   emptyCartText: { color: Colors.gray500, marginTop: Spacing.sm },
//   emptyCartButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   emptyCartButtonText: { color: Colors.white, fontWeight: "600" },
//   cartList: { flex: 1 },
//   cartItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     ...Shadows.sm,
//   },
//   cartItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   cartItemInfo: { flex: 1 },
//   cartItemName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   cartItemSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   cartItemPrice: {
//     fontSize: Typography.sm,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   cartItemActions: { flexDirection: "row", alignItems: "center" },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantityText: { width: 32, textAlign: "center", fontWeight: "500" },
//   removeButton: { padding: Spacing.sm, marginLeft: Spacing.xs },
//   footer: {
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     padding: Spacing.md,
//   },
//   footerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: Spacing.xs,
//   },
//   footerLabel: { fontSize: Typography.md, color: Colors.gray600 },
//   footerValue: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   footerTotal: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     paddingTop: Spacing.sm,
//     marginTop: Spacing.sm,
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
//     gap: Spacing.sm,
//     marginTop: Spacing.md,
//   },
//   footerButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },
//   addButton: { backgroundColor: Colors.gray200 },
//   addButtonText: { fontWeight: "600", color: Colors.gray700 },
//   qrButton: { backgroundColor: Colors.primary },
//   qrButtonText: {
//     fontWeight: "600",
//     color: Colors.white,
//     marginLeft: Spacing.sm,
//   },
//   buttonDisabled: { opacity: 0.7 },
//   modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
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
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalSearch: { padding: Spacing.md },
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
//   productList: { flex: 1 },
//   productListContent: { paddingHorizontal: Spacing.md },
//   productItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   productItemName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   productItemSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   productItemStock: { fontSize: Typography.xs, color: Colors.gray500 },
//   productItemPrice: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   noProductsText: {
//     textAlign: "center",
//     color: Colors.gray500,
//     paddingVertical: Spacing.md,
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
//     width: 320,
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
//     width: 40,
//     height: 40,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantitySelectorValue: {
//     width: 48,
//     textAlign: "center",
//     fontSize: Typography.xl,
//     fontWeight: "bold",
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
//   quantityCancelButton: { backgroundColor: Colors.gray200 },
//   quantityCancelText: { fontWeight: "600", color: Colors.gray700 },
//   quantityAddButton: { backgroundColor: Colors.primary },
//   quantityAddText: { fontWeight: "600", color: Colors.white },
// });

// screens/sales.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
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
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Search,
  X,
  QrCode,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Package,
  Send,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";
import { formatCurrency } from "../../../utils/formatters";

export default function Sales() {
  const { user } = useAuth();
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

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await ProductService.getProducts({
        limit: 100,
        sortBy: "name",
        sortOrder: "asc",
      });
      setProducts(result.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
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

  // Add item to local cart
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

  // Remove item from local cart
  const removeFromLocalCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  // Update quantity in local cart
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

  // Clear local cart
  const clearLocalCart = () => {
    if (cartItems.length === 0) return;
    Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => setCartItems([]),
      },
    ]);
  };

  // Submit transaction - creates transaction, adds items, generates QR
  const submitTransaction = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Error", "Cart is empty. Please add items first.");
      return;
    }

    // Check for low stock
    const lowStockItems = cartItems.filter((item) => {
      const inventory = item.product?.inventory;
      return inventory && inventory.quantity < item.quantity;
    });

    if (lowStockItems.length > 0) {
      Alert.alert(
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
        ],
      );
      return;
    }

    proceedWithSubmission();
  };

  const proceedWithSubmission = async () => {
    setSubmitting(true);
    try {
      // Prepare items for submission
      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Step 1: Create transaction with all items in one call
      const transaction =
        await TransactionService.createTransactionWithItems(items);

      setTransactionResult({
        transaction,
        success: true,
      });

      const finalTransaction = transaction;
      const salesQR = transaction.salesQR;

      //     Alert.alert(
      //   "✅ Transaction Created!",
      //   `Transaction: ${finalTransaction.transactionNumber}\n` +
      //   `Items: ${finalTransaction.items?.length || 0}\n` +
      //   `Total: ${formatCurrency(finalTransaction?.totalAmount ?? 0)}\n\n` +
      //   `Sales QR has been generated.`,
      //   [
      //     {
      //       text: "Print",
      //       onPress: () =>
      //         router.push({
      //           pathname: "/(app)/(stacks)/receipts/[id]",
      //           params: {
      //             id: finalTransaction._id,
      //           },
      //         }),
      //     },
      //   ]
      // );
      Alert.alert(
        "✅ Transaction Created!",
        `Transaction: ${finalTransaction.transactionNumber}
Items: ${finalTransaction.items?.length || 0}
Total: ${formatCurrency(finalTransaction.totalAmount)}

Sales QR has been generated.`,
        [
          {
            text: "View Receipt",
            onPress: () =>
              router.push({
                pathname: "/(app)/(modals)/receipt-preview",
                params: {
                  transactionId: finalTransaction._id,
                  qrData: finalTransaction.salesQR,
                  qrType: "SALES",
                  transactionNumber: finalTransaction.transactionNumber,
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
        ],
      );
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to create transaction. Please try again.",
      );
      setTransactionResult({
        success: false,
        error: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Add the createTransactionWithItems method call when creating a transaction

  const createTransaction = async () => {
    if (cart.length === 0) {
      Alert.alert("Error", "Cart is empty");
      return;
    }

    setProcessingQR(true);
    try {
      // Prepare items for API
      const items = cart.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      // Create transaction with items - this generates Sales QR
      const result = await TransactionService.createTransactionWithItems(items);

      Alert.alert(
        "Transaction Created",
        `Transaction: ${result.transactionNumber}\n` +
          `Items: ${result.items?.length || 0}\n` +
          `Total: ${formatCurrency(result.totalAmount)}\n\n` +
          `Sales QR has been generated.`,
        [
          {
            text: "View Sales QR",
            onPress: () => {
              if (result.salesQR) {
                router.push({
                  pathname: "/(app)/(modals)/receipt-preview",
                  params: {
                    transactionId: result._id,
                    qrData: result.salesQR,
                    qrType: "SALES",
                    transactionNumber: result.transactionNumber,
                    mode: "sales",
                  },
                });
              }
            },
          },
          {
            text: "Process Payment",
            onPress: () =>
              router.push({
                pathname: "/(app)/(tabs)/finance",
                params: {
                  transactionId: result._id,
                  transactionNumber: result.transactionNumber,
                  totalAmount: result.totalAmount,
                  mode: "pay",
                },
              }),
          },
          {
            text: "Done",
            onPress: () => {
              setCart([]);
              setTransaction(null);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create transaction",
      );
    } finally {
      setProcessingQR(false);
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
                        (cartItems.length === 0 || submitting) &&
                          styles.buttonDisabled,
                      ]}
                      onPress={submitTransaction}
                      disabled={cartItems.length === 0 || submitting}
                    >
                      {submitting ? (
                        <ActivityIndicator color={Colors.white} size="small" />
                      ) : (
                        <>
                          <Send size={18} color={Colors.white} />
                          <Text style={styles.submitButtonText}>Submit</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Search Modal */}
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
            </View>

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
                        Alert.alert(
                          "Out of Stock",
                          "This item is currently out of stock.",
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
                </View>
              )}
            />

            {/* Done Button - Fixed at bottom */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container & Layout
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

  // Header
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

  // Badges
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

  // Cart Container
  cartContainer: {
    flex: 1,
  },

  // Empty Cart
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

  // Cart Header
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

  // Cart List
  cartList: {
    flex: 1,
    marginBottom: Spacing.sm,
  },

  // Cart Item
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

  // Badges
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

  // Quantity Controls
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

  // Footer
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

  // Search Modal
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

  // Product List
  productList: {
    flex: 1,
  },
  productListContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },

  // Product Item
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

  // Stock Indicators
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

  // In Cart Badge
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

  // Out of Stock Overlay
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

  // No Products
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
  },

  // Quantity Modal
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
});