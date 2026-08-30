// // app/(app)/(tabs)/warehouse.jsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   TextInput,
//   Modal,
//   StyleSheet,
//   RefreshControl,
//   FlatList,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import WarehouseService from "../../../services/warehouseService";
// import TransactionService from "../../../services/transactionService";
// import InventoryService from "../../../services/inventoryService";
// import {
//   Package,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Truck,
//   Scan,
//   Search,
//   RefreshCw,
//   Plus,
//   Minus,
//   AlertTriangle,
//   QrCode,
//   Printer,
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

// export default function Warehouse() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [releaseQueue, setReleaseQueue] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [warehouseStats, setWarehouseStats] = useState(null);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [releaseModal, setReleaseModal] = useState(false);
//   const [releasedItems, setReleasedItems] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [inventoryModal, setInventoryModal] = useState(false);
//   const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
//   const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
//   const [adjustmentReason, setAdjustmentReason] = useState("");
//   const [releaseResult, setReleaseResult] = useState(null);
//   const [scannedTransaction, setScannedTransaction] = useState(null);
//   const [qrData, setQrData] = useState(null);
//   const [processingRelease, setProcessingRelease] = useState(false); // Separate state for release processing
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
//     fetchData();
//     // Check if coming from QR scan
//     if (params.transactionId && params.mode === "release") {
//       handleQRScanResult(params);
//     }
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchReleaseQueue(), fetchInventory(), fetchStats()]);
//     } catch (error) {
//       console.error("Failed to fetch warehouse data:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchReleaseQueue = async () => {
//     try {
//       const result = await WarehouseService.getReleaseQueue();
//       setReleaseQueue(result.transactions || []);
//     } catch (error) {
//       console.error("Failed to fetch release queue:", error);
//     }
//   };

//   const fetchInventory = async () => {
//     try {
//       const result = await InventoryService.getInventory({
//         limit: 20,
//         sortBy: "quantity",
//         sortOrder: "asc",
//       });
//       setInventory(result.inventory || []);
//     } catch (error) {
//       console.error("Failed to fetch inventory:", error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const stats = await WarehouseService.getStats();
//       console.log("Stats received:", stats);
//       setWarehouseStats(stats);
//     } catch (error) {
//       console.error("Failed to fetch warehouse stats:", error);
//       // Set default values to prevent crash
//       setWarehouseStats({
//         pendingReleases: 0,
//         totalProducts: 0,
//         totalInventory: 0,
//         totalInventoryValue: 0,
//         lowStockItems: 0,
//         outOfStockItems: 0,
//         recentTransactions: [],
//         releaseQueue: [],
//       });
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchData();
//   };

//   const handleQRScanResult = async (params) => {
//     try {
//       const result = await TransactionService.scanPaymentQR(params.qrData);

//       if (result && result.isValid) {
//         setScannedTransaction(result.transaction);
//         setQrData(params.qrData);
//         setSelectedTransaction(result.transaction);
//         setReleaseModal(true);

//         // Initialize released items with zeros
//         const initialItems = {};
//         result.transaction.items?.forEach((item) => {
//           initialItems[item.productId?._id] = 0;
//         });
//         setReleasedItems(initialItems);
//         setReleaseResult(null);

//         await showAlert(
//           "Payment Receipt Scanned",
//           `Transaction: ${result.transaction.transactionNumber}\nTotal: $${result.transaction.totalAmount?.toFixed(2)}\nItems: ${result.transaction.items?.length || 0}`,
//           [{ text: "OK" }],
//         );
//       }
//     } catch (error) {
//       await showAlert(
//         "Error",
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to scan QR code",
//       );
//     }
//   };

//   const processRelease = async () => {
//     if (!selectedTransaction) return;

//     const items = Object.entries(releasedItems)
//       .filter(([_, qty]) => qty > 0)
//       .map(([productId, quantity]) => ({ productId, quantity }));

//     if (items.length === 0) {
//       await showAlert("Error", "Please specify quantities to release");
//       return;
//     }

//     setProcessingRelease(true); // Use separate loading state
//     try {
//       const result = await TransactionService.releaseStock(
//         selectedTransaction._id,
//         items,
//       );

//       setReleaseResult(result);

//       // await showAlert(
//       //   "Release Successful",
//       //   `Items released successfully\n` +
//       //     `Invoice: ${result.invoiceNumber}\n` +
//       //     `Items: ${result.releaseResults?.length || 0} released\n` +
//       //     `Errors: ${result.releaseErrors?.length || 0}`,
//       //   [
//       //     {
//       //       text: "View Release Receipt",
//       //       onPress: () => {
//       //         if (result.releaseQR) {
//       //           router.push({
//       //             pathname: "/(app)/(modals)/receipt-preview",
//       //             params: {
//       //               transactionId: selectedTransaction._id,
//       //               qrData: result.releaseQR,
//       //               qrType: "RELEASE",
//       //               invoiceNumber: result.invoiceNumber,
//       //               mode: "release",
//       //             },
//       //           });
//       //         }
//       //       },
//       //     },
//       //     {
//       //       text: "View Invoice",
//       //       onPress: () => {
//       //         if (result.transaction.invoiceQR) {
//       //           router.push({
//       //             pathname: "/(app)/(modals)/receipt-preview",
//       //             params: {
//       //               transactionId: selectedTransaction._id,
//       //               qrData: result.transaction.invoiceQR,
//       //               qrType: "INVOICE",
//       //               invoiceNumber: result.invoiceNumber,
//       //               mode: "invoice",
//       //             },
//       //           });
//       //         }
//       //       },
//       //     },
//       //     {
//       //       text: "Done",
//       //       onPress: () => {
//       //         setReleaseModal(false);
//       //         setSelectedTransaction(null);
//       //         setReleasedItems({});
//       //         setReleaseResult(null);
//       //         setScannedTransaction(null);
//       //         setQrData(null);
//       //         fetchData();
//       //       },
//       //     },
//       //   ],
//       // );
//     } catch (error) {
//       console.error("Release error:", error);
//       await showAlert(
//         "Error",
//         error.response?.data?.message || "Failed to release items",
//       );
//     } finally {
//       setProcessingRelease(false);
//     }
//   };

//   const handleAdjustStock = async () => {
//     if (!selectedInventoryItem) return;
//     if (adjustmentQuantity === 0) {
//       await showAlert("Error", "Please enter a quantity");
//       return;
//     }
//     if (!adjustmentReason.trim()) {
//       await showAlert("Error", "Please enter a reason");
//       return;
//     }

//     setLoading(true);
//     try {
//       await InventoryService.adjustStock(
//         selectedInventoryItem.productId._id,
//         adjustmentQuantity,
//         adjustmentReason.trim(),
//       );
//       await showAlert("Success", "Stock adjusted successfully");
//       setInventoryModal(false);
//       setSelectedInventoryItem(null);
//       setAdjustmentQuantity(0);
//       setAdjustmentReason("");
//       fetchInventory();
//     } catch (error) {
//       await showAlert(
//         "Error",
//         error.response?.data?.message || "Failed to adjust stock",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStockStatus = (item) => {
//     const quantity = item.quantity || 0;
//     const reorderPoint = item.reorderPoint || 5;

//     if (quantity === 0) {
//       return {
//         label: "Out of Stock",
//         container: styles.stockOut,
//         text: styles.stockOutText,
//         icon: XCircle,
//       };
//     } else if (quantity <= reorderPoint) {
//       return {
//         label: "Low Stock",
//         container: styles.stockLow,
//         text: styles.stockLowText,
//         icon: AlertTriangle,
//       };
//     } else {
//       return {
//         label: "In Stock",
//         container: styles.stockIn,
//         text: styles.stockInText,
//         icon: CheckCircle,
//       };
//     }
//   };

//   const renderReleaseItem = ({ item }) => {
//     const hasInventory = item.items?.some((i) =>
//       inventory.some((inv) => inv.productId?._id === i.productId?._id),
//     );

//     return (
//       <TouchableOpacity
//         style={styles.releaseItem}
//         onPress={() => {
//           setSelectedTransaction(item);
//           setReleaseModal(true);
//           const initialItems = {};
//           item.items?.forEach((i) => {
//             initialItems[i.productId?._id] = 0;
//           });
//           setReleasedItems(initialItems);
//           setReleaseResult(null);
//         }}
//       >
//         <View style={styles.releaseItemRow}>
//           <View style={styles.releaseItemInfo}>
//             <Text style={styles.releaseItemNumber}>
//               {item.transactionNumber}
//             </Text>
//             <Text style={styles.releaseItemCount}>
//               {item.items?.length || 0} items
//             </Text>
//             <Text style={styles.releaseItemAmount}>
//               {formatCurrency(item.totalAmount)}
//             </Text>
//             {item.paymentQR && (
//               <Text style={styles.releaseItemQR}>✅ Payment Verified</Text>
//             )}
//           </View>
//           <View style={styles.releaseItemRight}>
//             <View style={styles.readyBadge}>
//               <Text style={styles.readyBadgeText}>
//                 {hasInventory ? "Ready for Release" : "Pending Stock"}
//               </Text>
//             </View>
//             <Clock
//               size={16}
//               color={hasInventory ? Colors.success : Colors.warning}
//             />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderInventoryItem = ({ item }) => {
//     const status = getStockStatus(item);
//     const StatusIcon = status.icon;
//     const available = (item.quantity || 0) - (item.reservedQuantity || 0);

//     return (
//       <TouchableOpacity
//         style={styles.inventoryItem}
//         onPress={() => {
//           setSelectedInventoryItem(item);
//           setAdjustmentQuantity(0);
//           setAdjustmentReason("");
//           setInventoryModal(true);
//         }}
//       >
//         <View style={styles.inventoryItemRow}>
//           <View style={styles.inventoryItemInfo}>
//             <Text style={styles.inventoryItemName}>
//               {item.productId?.name || "Unknown Product"}
//             </Text>
//             <Text style={styles.inventoryItemSku}>
//               SKU: {item.productId?.sku || "N/A"}
//             </Text>
//             <Text style={styles.inventoryItemLocation}>
//               📍 {item.warehouseLocation?.aisle || "N/A"} -{" "}
//               {item.warehouseLocation?.shelf || "N/A"} -{" "}
//               {item.warehouseLocation?.bin || "N/A"}
//             </Text>
//           </View>
//           <View style={styles.inventoryItemRight}>
//             <Text style={styles.inventoryItemQuantity}>{item.quantity}</Text>
//             <Text style={styles.inventoryItemAvailable}>
//               Available: {available}
//             </Text>
//             <View style={[styles.stockBadge, status.container]}>
//               <StatusIcon size={12} />
//               <Text style={[styles.stockBadgeText, status.text]}>
//                 {status.label}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const filteredInventory = inventory.filter(
//     (item) =>
//       item.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.productId?.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Warehouse</Text>
//           <Text style={styles.headerSubtitle}>
//             Manage inventory and releases
//           </Text>
//         </View>

//         {warehouseStats && (
//           <View style={styles.statsRow}>
//             <View style={[styles.statCard, styles.statCardLeft]}>
//               <Text style={styles.statLabel}>Pending Releases</Text>
//               <Text style={styles.statValue}>
//                 {warehouseStats.pendingReleases || 0}
//               </Text>
//             </View>
//             <View style={[styles.statCard, styles.statCardRight]}>
//               <Text style={styles.statLabel}>Low Stock Items</Text>
//               <Text style={[styles.statValue, styles.warningValue]}>
//                 {warehouseStats.lowStockItems || 0}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View style={styles.quickActions}>
//           <TouchableOpacity
//             style={[styles.quickAction, styles.scanAction]}
//             onPress={() => router.push("/(app)/(tabs)/scan")}
//           >
//             <Scan size={20} color={Colors.white} />
//             <Text style={styles.scanActionText}>Scan QR</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.quickAction, styles.refreshAction]}
//             onPress={onRefresh}
//           >
//             <RefreshCw size={20} color={Colors.gray700} />
//             <Text style={styles.refreshActionText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Release Queue ({releaseQueue.length})
//           </Text>
//           {releaseQueue.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Truck size={48} color={Colors.gray300} />
//               <Text style={styles.emptyText}>No pending releases</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={releaseQueue}
//               keyExtractor={(item) => item._id}
//               renderItem={renderReleaseItem}
//               scrollEnabled={false}
//             />
//           )}
//         </View>

//         <View style={styles.section}>
//           <View style={styles.inventoryHeader}>
//             <Text style={styles.sectionTitle}>Inventory Overview</Text>
//             <TouchableOpacity
//               style={styles.viewAllButton}
//               onPress={() => router.push("/(app)/(stacks)/inventory")}
//             >
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.searchContainer}>
//             <Search size={20} color={Colors.gray400} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search inventory..."
//               value={searchTerm}
//               onChangeText={setSearchTerm}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>

//           {filteredInventory.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Package size={48} color={Colors.gray300} />
//               <Text style={styles.emptyText}>No inventory items found</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={filteredInventory.slice(0, 10)}
//               keyExtractor={(item) => item._id}
//               renderItem={renderInventoryItem}
//               scrollEnabled={false}
//             />
//           )}
//         </View>
//       </ScrollView>

//       {/* Release Modal */}
//       <Modal visible={releaseModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Process Release</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setReleaseModal(false);
//                   setSelectedTransaction(null);
//                   setReleasedItems({});
//                   setReleaseResult(null);
//                   setScannedTransaction(null);
//                   setQrData(null);
//                 }}
//               >
//                 <XCircle size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             {selectedTransaction && (
//               <>
//                 <View style={styles.modalTransaction}>
//                   <Text style={styles.modalTransactionLabel}>Transaction</Text>
//                   <Text style={styles.modalTransactionNumber}>
//                     {selectedTransaction.transactionNumber || "Loading..."}
//                   </Text>
//                   <Text style={styles.modalTransactionTotal}>
//                     Total:{" "}
//                     {formatCurrency(selectedTransaction.totalAmount || 0)}
//                   </Text>
//                   {selectedTransaction.paymentQR && (
//                     <Text style={styles.modalPaymentVerified}>
//                       ✅ Payment Verified
//                     </Text>
//                   )}
//                 </View>

//                 {releaseResult ? (
//                   <View style={styles.releaseSuccessContainer}>
//                     <CheckCircle size={48} color={Colors.success} />
//                     <Text style={styles.releaseSuccessTitle}>
//                       Release Complete!
//                     </Text>
//                     <Text style={styles.releaseSuccessSubtitle}>
//                       Invoice: {releaseResult.invoiceNumber}
//                     </Text>
//                     <Text style={styles.releaseSuccessSubtitle}>
//                       Items Released:{" "}
//                       {releaseResult.releaseResults?.length || 0}
//                     </Text>
//                     {releaseResult.releaseErrors?.length > 0 && (
//                       <Text style={styles.releaseSuccessError}>
//                         Errors: {releaseResult.releaseErrors.length}
//                       </Text>
//                     )}
//                     {releaseResult.releaseQR && (
//                       <TouchableOpacity
//                         style={styles.viewQRButton}
//                         onPress={() => {
//                           router.push({
//                             pathname: "/(app)/(modals)/receipt-preview",
//                             params: {
//                               transactionId: selectedTransaction._id,
//                               qrData: releaseResult.releaseQR,
//                               qrType: "RELEASE",
//                               invoiceNumber: releaseResult.invoiceNumber,
//                               mode: "release",
//                             },
//                           });
//                         }}
//                       >
//                         <QrCode size={16} color={Colors.white} />
//                         <Text style={styles.viewQRText}>
//                           View Release Receipt
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                     {selectedTransaction.invoiceQR && (
//                       <TouchableOpacity
//                         style={[styles.viewQRButton, styles.viewInvoiceButton]}
//                         onPress={() => {
//                           router.push({
//                             pathname: "/(app)/(modals)/receipt-preview",
//                             params: {
//                               transactionId: selectedTransaction._id,
//                               qrData: selectedTransaction.invoiceQR,
//                               qrType: "INVOICE",
//                               invoiceNumber: releaseResult.invoiceNumber,
//                               mode: "invoice",
//                             },
//                           });
//                         }}
//                       >
//                         <Printer size={16} color={Colors.white} />
//                         <Text style={styles.viewQRText}>View Invoice</Text>
//                       </TouchableOpacity>
//                     )}
//                     <TouchableOpacity
//                       style={styles.releaseDoneButton}
//                       onPress={() => {
//                         setReleaseModal(false);
//                         setSelectedTransaction(null);
//                         setReleasedItems({});
//                         setReleaseResult(null);
//                         setScannedTransaction(null);
//                         setQrData(null);
//                         fetchData();
//                       }}
//                     >
//                       <Text style={styles.releaseDoneText}>Done</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <>
//                     <ScrollView style={styles.modalItemList}>
//                       {selectedTransaction.items?.map((item) => (
//                         <View key={item._id} style={styles.modalItem}>
//                           <View style={styles.modalItemInfo}>
//                             <Text style={styles.modalItemName}>
//                               {item.name}
//                             </Text>
//                             <Text style={styles.modalItemQuantity}>
//                               Ordered: {item.quantity}
//                             </Text>
//                             {inventory.find(
//                               (inv) =>
//                                 inv.productId?._id === item.productId?._id,
//                             ) && (
//                               <Text style={styles.modalItemAvailable}>
//                                 Available:{" "}
//                                 {inventory.find(
//                                   (inv) =>
//                                     inv.productId?._id === item.productId?._id,
//                                 )?.quantity || 0}
//                               </Text>
//                             )}
//                           </View>
//                           <View style={styles.modalItemActions}>
//                             <TouchableOpacity
//                               style={styles.modalItemButton}
//                               onPress={() => {
//                                 const current =
//                                   releasedItems[item.productId?._id] || 0;
//                                 setReleasedItems((prev) => ({
//                                   ...prev,
//                                   [item.productId?._id]: Math.max(
//                                     0,
//                                     current - 1,
//                                   ),
//                                 }));
//                               }}
//                             >
//                               <Minus size={16} color={Colors.gray500} />
//                             </TouchableOpacity>
//                             <Text style={styles.modalItemInput}>
//                               {releasedItems[item.productId?._id] || 0}
//                             </Text>
//                             <TouchableOpacity
//                               style={styles.modalItemButton}
//                               onPress={() => {
//                                 const current =
//                                   releasedItems[item.productId?._id] || 0;
//                                 const maxQty = item.quantity || 0;
//                                 setReleasedItems((prev) => ({
//                                   ...prev,
//                                   [item.productId?._id]: Math.min(
//                                     current + 1,
//                                     maxQty,
//                                   ),
//                                 }));
//                               }}
//                             >
//                               <Plus size={16} color={Colors.gray500} />
//                             </TouchableOpacity>
//                             <Text style={styles.modalItemMax}>
//                               / {item.quantity}
//                             </Text>
//                           </View>
//                         </View>
//                       ))}
//                     </ScrollView>

//                     <View style={styles.modalButtons}>
//                       <TouchableOpacity
//                         style={[styles.modalButton, styles.modalCancelButton]}
//                         onPress={() => {
//                           setReleaseModal(false);
//                           setSelectedTransaction(null);
//                           setReleasedItems({});
//                           setReleaseResult(null);
//                         }}
//                       >
//                         <Text style={styles.modalCancelText}>Cancel</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={[
//                           styles.modalButton,
//                           styles.modalReleaseButton,
//                           processingRelease && styles.buttonDisabled,
//                         ]}
//                         onPress={processRelease}
//                         disabled={processingRelease}
//                       >
//                         {processingRelease ? (
//                           <ActivityIndicator
//                             color={Colors.white}
//                             size="small"
//                           />
//                         ) : (
//                           <Text style={styles.modalReleaseText}>
//                             Release Items
//                           </Text>
//                         )}
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 )}
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Inventory Adjust Modal */}
//       <Modal visible={inventoryModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, styles.adjustModalContent]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Adjust Stock</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setInventoryModal(false);
//                   setSelectedInventoryItem(null);
//                   setAdjustmentQuantity(0);
//                   setAdjustmentReason("");
//                 }}
//               >
//                 <XCircle size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             {selectedInventoryItem && (
//               <>
//                 <View style={styles.modalTransaction}>
//                   <Text style={styles.modalTransactionLabel}>Product</Text>
//                   <Text style={styles.modalTransactionNumber}>
//                     {selectedInventoryItem.productId?.name}
//                   </Text>
//                   <Text style={styles.modalTransactionLabel}>
//                     Current Stock
//                   </Text>
//                   <Text style={styles.modalTransactionAmount}>
//                     {selectedInventoryItem.quantity}
//                   </Text>
//                   <Text style={styles.modalTransactionLabel}>Reserved</Text>
//                   <Text style={styles.modalTransactionAmount}>
//                     {selectedInventoryItem.reservedQuantity || 0}
//                   </Text>
//                   <Text style={styles.modalTransactionLabel}>SKU</Text>
//                   <Text style={styles.modalTransactionNumber}>
//                     {selectedInventoryItem.productId?.sku}
//                   </Text>
//                 </View>

//                 <View style={styles.adjustField}>
//                   <Text style={styles.adjustLabel}>Adjustment Quantity</Text>
//                   <View style={styles.adjustRow}>
//                     <TouchableOpacity
//                       style={styles.adjustButton}
//                       onPress={() => setAdjustmentQuantity((prev) => prev - 1)}
//                     >
//                       <Minus size={20} color={Colors.gray500} />
//                     </TouchableOpacity>
//                     <TextInput
//                       style={styles.adjustInput}
//                       keyboardType="numeric"
//                       value={String(adjustmentQuantity)}
//                       onChangeText={(text) =>
//                         setAdjustmentQuantity(parseInt(text) || 0)
//                       }
//                     />
//                     <TouchableOpacity
//                       style={styles.adjustButton}
//                       onPress={() => setAdjustmentQuantity((prev) => prev + 1)}
//                     >
//                       <Plus size={20} color={Colors.gray500} />
//                     </TouchableOpacity>
//                   </View>
//                   <Text style={styles.adjustHelp}>
//                     Positive to add, negative to remove
//                   </Text>
//                 </View>

//                 <View style={styles.adjustField}>
//                   <Text style={styles.adjustLabel}>Reason</Text>
//                   <TextInput
//                     style={styles.adjustReasonInput}
//                     placeholder="Enter reason for adjustment"
//                     value={adjustmentReason}
//                     onChangeText={setAdjustmentReason}
//                     multiline
//                     numberOfLines={2}
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>

//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.modalCancelButton]}
//                     onPress={() => {
//                       setInventoryModal(false);
//                       setSelectedInventoryItem(null);
//                       setAdjustmentQuantity(0);
//                       setAdjustmentReason("");
//                     }}
//                   >
//                     <Text style={styles.modalCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.modalButton,
//                       styles.modalProcessButton,
//                       loading && styles.buttonDisabled,
//                     ]}
//                     onPress={handleAdjustStock}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <ActivityIndicator color={Colors.white} size="small" />
//                     ) : (
//                       <Text style={styles.modalProcessText}>Adjust Stock</Text>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
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
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   scrollView: { flex: 1 },
//   scrollContent: {
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing["3xl"],
//   },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: { paddingVertical: Spacing.md },
//   headerTitle: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
//   statsRow: { flexDirection: "row", marginBottom: Spacing.md },
//   statCard: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   statCardLeft: { marginRight: Spacing.sm },
//   statCardRight: { marginLeft: Spacing.sm },
//   statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
//   statValue: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   warningValue: { color: Colors.warning },
//   quickActions: { flexDirection: "row", marginBottom: Spacing.md },
//   quickAction: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   scanAction: { backgroundColor: Colors.primary, marginRight: Spacing.sm },
//   scanActionText: {
//     color: Colors.white,
//     fontWeight: "600",
//     marginLeft: Spacing.sm,
//   },
//   refreshAction: { backgroundColor: Colors.gray200, marginLeft: Spacing.sm },
//   refreshActionText: {
//     color: Colors.gray700,
//     fontWeight: "600",
//     marginLeft: Spacing.sm,
//   },
//   section: { marginBottom: Spacing.md },
//   sectionTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//     marginBottom: Spacing.md,
//   },
//   inventoryHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.md,
//   },
//   viewAllButton: { padding: Spacing.sm },
//   viewAllText: {
//     color: Colors.primary,
//     fontSize: Typography.sm,
//     fontWeight: "500",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   emptyContainer: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing["3xl"],
//     alignItems: "center",
//     ...Shadows.sm,
//   },
//   emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
//   releaseItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   releaseItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   releaseItemInfo: { flex: 1 },
//   releaseItemNumber: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   releaseItemCount: { fontSize: Typography.sm, color: Colors.gray500 },
//   releaseItemAmount: {
//     fontSize: Typography.sm,
//     fontWeight: "bold",
//     color: Colors.primary,
//     marginTop: Spacing.xs,
//   },
//   releaseItemQR: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: "500",
//     marginTop: 2,
//   },
//   releaseItemRight: { alignItems: "flex-end" },
//   readyBadge: {
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   readyBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "500",
//   },
//   inventoryItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     ...Shadows.sm,
//   },
//   inventoryItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   inventoryItemInfo: { flex: 1 },
//   inventoryItemName: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   inventoryItemSku: { fontSize: Typography.xs, color: Colors.gray500 },
//   inventoryItemLocation: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: 2,
//   },
//   inventoryItemRight: { alignItems: "flex-end" },
//   inventoryItemQuantity: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   inventoryItemAvailable: {
//     fontSize: Typography.sm,
//     color: Colors.primary,
//   },
//   stockBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//     marginTop: Spacing.xs,
//   },
//   stockBadgeText: { fontSize: Typography.xs, marginLeft: Spacing.xs },
//   stockIn: { backgroundColor: Colors.success + "20" },
//   stockInText: { color: Colors.success },
//   stockLow: { backgroundColor: Colors.warning + "20" },
//   stockLowText: { color: Colors.warning },
//   stockOut: { backgroundColor: Colors.error + "20" },
//   stockOutText: { color: Colors.error },
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
//     maxHeight: "80%",
//   },
//   adjustModalContent: { maxHeight: "85%" },
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
//   modalTransaction: {
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   modalTransactionLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   modalTransactionNumber: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   modalTransactionTotal: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.primary,
//     marginTop: Spacing.xs,
//   },
//   modalTransactionAmount: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.primary,
//     marginTop: Spacing.xs,
//   },
//   modalPaymentVerified: {
//     fontSize: Typography.sm,
//     color: Colors.success,
//     fontWeight: "600",
//     marginTop: Spacing.xs,
//   },
//   modalItemList: { maxHeight: 240 },
//   modalItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   modalItemInfo: { flex: 1 },
//   modalItemName: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   modalItemQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
//   modalItemAvailable: { fontSize: Typography.xs, color: Colors.success },
//   modalItemActions: { flexDirection: "row", alignItems: "center" },
//   modalItemButton: {
//     width: 32,
//     height: 32,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalItemInput: {
//     width: 40,
//     textAlign: "center",
//     fontSize: Typography.md,
//     fontWeight: "500",
//   },
//   modalItemMax: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginLeft: Spacing.xs,
//   },
//   releaseSuccessContainer: {
//     alignItems: "center",
//     paddingVertical: Spacing.md,
//   },
//   releaseSuccessTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     marginTop: Spacing.md,
//   },
//   releaseSuccessSubtitle: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   releaseSuccessError: {
//     fontSize: Typography.md,
//     color: Colors.error,
//     marginTop: Spacing.xs,
//   },
//   viewQRButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     marginTop: Spacing.md,
//   },
//   viewInvoiceButton: {
//     backgroundColor: Colors.success,
//   },
//   viewQRText: {
//     color: Colors.white,
//     fontWeight: "600",
//     marginLeft: Spacing.sm,
//   },
//   releaseDoneButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.gray200,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   releaseDoneText: {
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   adjustField: { marginBottom: Spacing.md },
//   adjustLabel: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   adjustRow: { flexDirection: "row", alignItems: "center" },
//   adjustButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   adjustInput: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.gray300,
//     paddingVertical: Spacing.sm,
//     marginHorizontal: Spacing.md,
//   },
//   adjustHelp: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   adjustReasonInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     minHeight: 60,
//     textAlignVertical: "top",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     gap: Spacing.sm,
//     marginTop: Spacing.md,
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalCancelButton: { backgroundColor: Colors.gray200 },
//   modalCancelText: { fontWeight: "600", color: Colors.gray700 },
//   modalReleaseButton: { backgroundColor: Colors.primary },
//   modalReleaseText: { fontWeight: "600", color: Colors.white },
//   modalProcessButton: { backgroundColor: Colors.primary },
//   modalProcessText: { fontWeight: "600", color: Colors.white },
//   buttonDisabled: { opacity: 0.7 },

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




































// // app/(app)/(tabs)/warehouse.jsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   TextInput,
//   Modal,
//   StyleSheet,
//   RefreshControl,
//   FlatList,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import WarehouseService from "../../../services/warehouseService";
// import TransactionService from "../../../services/transactionService";
// import InventoryService from "../../../services/inventoryService";
// import StoreService from "../../../services/storeService";
// import AuthService from "../../../services/authService";
// import {
//   Package,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Truck,
//   Scan,
//   Search,
//   RefreshCw,
//   Plus,
//   Minus,
//   AlertTriangle,
//   QrCode,
//   Printer,
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

// export default function Warehouse() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [releaseQueue, setReleaseQueue] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [warehouseStats, setWarehouseStats] = useState(null);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [releaseModal, setReleaseModal] = useState(false);
//   const [releasedItems, setReleasedItems] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [inventoryModal, setInventoryModal] = useState(false);
//   const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
//   const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
//   const [adjustmentReason, setAdjustmentReason] = useState("");
//   const [releaseResult, setReleaseResult] = useState(null);
//   const [scannedTransaction, setScannedTransaction] = useState(null);
//   const [qrData, setQrData] = useState(null);
//   const [processingRelease, setProcessingRelease] = useState(false);

//   // Store selection state
//   const [user, setUser] = useState(null);
//   const [stores, setStores] = useState([]);
//   const [selectedStoreId, setSelectedStoreId] = useState(null);
//   const [showStoreDropdown, setShowStoreDropdown] = useState(false);

//   const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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

//   const getStoreName = (storeId) => {
//     const store = stores.find((s) => s.value === storeId);
//     return store ? store.label : 'Select a store...';
//   };

//   // Load user and storess
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

//   useEffect(() => {
//     loadUserAndStores();
//   }, []);

//   useEffect(() => {
//     if (user && (selectedStoreId || !isSuperAdmin)) {
//       fetchData();
//     }
//   }, [selectedStoreId, user]);

//   useEffect(() => {
//     if (params.transactionId && params.mode === "release") {
//       handleQRScanResult(params);
//     }
//   }, [params]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchReleaseQueue(), fetchInventory(), fetchStats()]);
//     } catch (error) {
//       console.error("Failed to fetch warehouse data:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchReleaseQueue = async () => {
//     try {
//       let storeId = null;
//       if (isSuperAdmin) {
//         storeId = selectedStoreId;
//       }
//       const result = await WarehouseService.getReleaseQueue(storeId);
//       setReleaseQueue(result || []);
//     } catch (error) {
//       console.error("Failed to fetch release queue:", error);
//     }
//   };

//   const fetchInventory = async () => {
//     try {
//       const params = {
//         limit: 20,
//         sortBy: "quantity",
//         sortOrder: "asc",
//       };
      
//       if (isSuperAdmin && selectedStoreId) {
//         params.storeId = selectedStoreId;
//       }
      
//       const result = await InventoryService.getInventory(params);
//       setInventory(result.inventory || []);
//     } catch (error) {
//       console.error("Failed to fetch inventory:", error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       let storeId = null;
//       if (isSuperAdmin) {
//         storeId = selectedStoreId;
//       }
      
//       const stats = await WarehouseService.getStats(storeId);
//       setWarehouseStats(stats);
//     } catch (error) {
//       console.error("Failed to fetch warehouse stats:", error);
//       setWarehouseStats({
//         pendingReleases: 0,
//         totalProducts: 0,
//         totalInventory: 0,
//         totalInventoryValue: 0,
//         lowStockItems: 0,
//         outOfStockItems: 0,
//         recentTransactions: [],
//         releaseQueue: [],
//       });
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchData();
//   };

//   const handleQRScanResult = async (params) => {
//     try {
//       const result = await TransactionService.scanPaymentQR(params.qrData);

//       if (result && result.isValid) {
//         setScannedTransaction(result.transaction);
//         setQrData(params.qrData);
//         setSelectedTransaction(result.transaction);
//         setReleaseModal(true);

//         const initialItems = {};
//         result.transaction.items?.forEach((item) => {
//           initialItems[item.productId?._id] = 0;
//         });
//         setReleasedItems(initialItems);
//         setReleaseResult(null);

//         await showAlert(
//           "Payment Receipt Scanned",
//           `Transaction: ${result.transaction.transactionNumber}\nTotal: ${formatCurrency(result.transaction.totalAmount || 0)}\nItems: ${result.transaction.items?.length || 0}`,
//           [{ text: "OK" }],
//         );
//       }
//     } catch (error) {
//       await showAlert(
//         "Error",
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to scan QR code",
//       );
//     }
//   };

//   const processRelease = async () => {
//     if (!selectedTransaction) return;

//     const items = Object.entries(releasedItems)
//       .filter(([_, qty]) => qty > 0)
//       .map(([productId, quantity]) => ({ productId, quantity }));

//     if (items.length === 0) {
//       await showAlert("Error", "Please specify quantities to release");
//       return;
//     }

//     setProcessingRelease(true);
//     try {
//       const result = await TransactionService.releaseStock(
//         selectedTransaction._id,
//         items,
//       );

//       setReleaseResult(result);

//       await showAlert(
//         "Release Successful",
//         `Items released successfully\n` +
//           `Invoice: ${result.invoiceNumber}\n` +
//           `Items: ${result.releaseResults?.length || 0} released\n` +
//           `Errors: ${result.releaseErrors?.length || 0}`,
//         [
//           {
//             text: "View Release Receipt",
//             onPress: () => {
//               if (result.releaseQR) {
//                 router.push({
//                   pathname: "/(app)/(modals)/receipt-preview",
//                   params: {
//                     transactionId: selectedTransaction._id,
//                     qrData: result.releaseQR,
//                     qrType: "RELEASE",
//                     invoiceNumber: result.invoiceNumber,
//                     mode: "release",
//                   },
//                 });
//               }
//             },
//           },
//           {
//             text: "View Invoice",
//             onPress: () => {
//               if (result.transaction?.invoiceQR) {
//                 router.push({
//                   pathname: "/(app)/(modals)/receipt-preview",
//                   params: {
//                     transactionId: selectedTransaction._id,
//                     qrData: result.transaction.invoiceQR,
//                     qrType: "INVOICE",
//                     invoiceNumber: result.invoiceNumber,
//                     mode: "invoice",
//                   },
//                 });
//               }
//             },
//           },
//           {
//             text: "Done",
//             onPress: () => {
//               setReleaseModal(false);
//               setSelectedTransaction(null);
//               setReleasedItems({});
//               setReleaseResult(null);
//               setScannedTransaction(null);
//               setQrData(null);
//               fetchData();
//             },
//           },
//         ],
//       );
//     } catch (error) {
//       console.error("Release error:", error);
//       await showAlert(
//         "Error",
//         error.response?.data?.message || error.message || "Failed to release items",
//       );
//     } finally {
//       setProcessingRelease(false);
//     }
//   };

//   const handleAdjustStock = async () => {
//     if (!selectedInventoryItem) return;
//     if (adjustmentQuantity === 0) {
//       await showAlert("Error", "Please enter a quantity");
//       return;
//     }
//     if (!adjustmentReason.trim()) {
//       await showAlert("Error", "Please enter a reason");
//       return;
//     }

//     setLoading(true);
//     try {
//       let storeId = null;
//       if (isSuperAdmin) {
//         storeId = selectedStoreId;
//       }
      
//       await InventoryService.adjustStock(
//         selectedInventoryItem.productId._id,
//         adjustmentQuantity,
//         adjustmentReason.trim(),
//         storeId,
//       );
      
//       await showAlert("Success", "Stock adjusted successfully");
//       setInventoryModal(false);
//       setSelectedInventoryItem(null);
//       setAdjustmentQuantity(0);
//       setAdjustmentReason("");
//       fetchInventory();
//     } catch (error) {
//       await showAlert(
//         "Error",
//         error.response?.data?.message || error.message || "Failed to adjust stock",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStockStatus = (item) => {
//     const quantity = item.quantity || 0;
//     const reorderPoint = item.reorderPoint || 5;

//     if (quantity === 0) {
//       return {
//         label: "Out of Stock",
//         container: styles.stockOut,
//         text: styles.stockOutText,
//         icon: XCircle,
//       };
//     } else if (quantity <= reorderPoint) {
//       return {
//         label: "Low Stock",
//         container: styles.stockLow,
//         text: styles.stockLowText,
//         icon: AlertTriangle,
//       };
//     } else {
//       return {
//         label: "In Stock",
//         container: styles.stockIn,
//         text: styles.stockInText,
//         icon: CheckCircle,
//       };
//     }
//   };

//   const renderReleaseItem = ({ item }) => {
//     const hasInventory = item.items?.some((i) =>
//       inventory.some((inv) => inv.productId?._id === i.productId?._id),
//     );

//     return (
//       <TouchableOpacity
//         style={styles.releaseItem}
//         onPress={() => {
//           setSelectedTransaction(item);
//           setReleaseModal(true);
//           const initialItems = {};
//           item.items?.forEach((i) => {
//             initialItems[i.productId?._id] = 0;
//           });
//           setReleasedItems(initialItems);
//           setReleaseResult(null);
//         }}
//       >
//         <View style={styles.releaseItemRow}>
//           <View style={styles.releaseItemInfo}>
//             <Text style={styles.releaseItemNumber}>
//               {item.transactionNumber}
//             </Text>
//             <Text style={styles.releaseItemCount}>
//               {item.items?.length || 0} items
//             </Text>
//             <Text style={styles.releaseItemAmount}>
//               {formatCurrency(item.totalAmount)}
//             </Text>
//             {item.paymentQR && (
//               <Text style={styles.releaseItemQR}>✅ Payment Verified</Text>
//             )}
//           </View>
//           <View style={styles.releaseItemRight}>
//             <View style={styles.readyBadge}>
//               <Text style={styles.readyBadgeText}>
//                 {hasInventory ? "Ready for Release" : "Pending Stock"}
//               </Text>
//             </View>
//             <Clock
//               size={16}
//               color={hasInventory ? Colors.success : Colors.warning}
//             />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderInventoryItem = ({ item }) => {
//     const status = getStockStatus(item);
//     const StatusIcon = status.icon;
//     const available = (item.quantity || 0) - (item.reservedQuantity || 0);

//     return (
//       <TouchableOpacity
//         style={styles.inventoryItem}
//         onPress={() => {
//           setSelectedInventoryItem(item);
//           setAdjustmentQuantity(0);
//           setAdjustmentReason("");
//           setInventoryModal(true);
//         }}
//       >
//         <View style={styles.inventoryItemRow}>
//           <View style={styles.inventoryItemInfo}>
//             <Text style={styles.inventoryItemName}>
//               {item.productId?.name || "Unknown Product"}
//             </Text>
//             <Text style={styles.inventoryItemSku}>
//               SKU: {item.productId?.sku || "N/A"}
//             </Text>
//             <Text style={styles.inventoryItemLocation}>
//               📍 {item.warehouseLocation?.aisle || "N/A"} -{" "}
//               {item.warehouseLocation?.shelf || "N/A"} -{" "}
//               {item.warehouseLocation?.bin || "N/A"}
//             </Text>
//           </View>
//           <View style={styles.inventoryItemRight}>
//             <Text style={styles.inventoryItemQuantity}>{item.quantity}</Text>
//             <Text style={styles.inventoryItemAvailable}>
//               Available: {available}
//             </Text>
//             <View style={[styles.stockBadge, status.container]}>
//               <StatusIcon size={12} />
//               <Text style={[styles.stockBadgeText, status.text]}>
//                 {status.label}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const filteredInventory = inventory.filter(
//     (item) =>
//       item.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.productId?.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Warehouse</Text>
//           <Text style={styles.headerSubtitle}>
//             Manage inventory and releases
//           </Text>
//         </View>

//         {/* Store Selector - Super Admin Only */}
//         {isSuperAdmin && (
//           <View style={styles.storeSelectorContainer}>
//             <View style={styles.storeSelectorRow}>
//               <Store size={16} color={Colors.primary} />
//               <Text style={styles.storeSelectorLabel}>Store:</Text>
//               <TouchableOpacity
//                 style={styles.storeSelector}
//                 onPress={() => setShowStoreDropdown(!showStoreDropdown)}
//                 disabled={stores.length === 0}
//               >
//                 <Text style={styles.storeSelectorText}>
//                   {selectedStoreId ? getStoreName(selectedStoreId) : 'Select a store...'}
//                 </Text>
//                 <ChevronDown size={16} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//             {showStoreDropdown && (
//               <View style={styles.storeDropdown}>
//                 {stores.map((store) => (
//                   <TouchableOpacity
//                     key={store.value}
//                     style={[
//                       styles.storeDropdownItem,
//                       selectedStoreId === store.value && styles.storeDropdownItemActive,
//                     ]}
//                     onPress={() => {
//                       setSelectedStoreId(store.value);
//                       setShowStoreDropdown(false);
//                       fetchData();
//                     }}
//                   >
//                     <Text style={[
//                       styles.storeDropdownText,
//                       selectedStoreId === store.value && styles.storeDropdownTextActive,
//                     ]}>
//                       {store.label}
//                     </Text>
//                     {selectedStoreId === store.value && (
//                       <CheckCircle size={16} color={Colors.primary} />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//             {!selectedStoreId && (
//               <Text style={styles.warningText}>⚠️ Please select a store</Text>
//             )}
//           </View>
//         )}

//         {warehouseStats && (
//           <View style={styles.statsRow}>
//             <View style={[styles.statCard, styles.statCardLeft]}>
//               <Text style={styles.statLabel}>Pending Releases</Text>
//               <Text style={styles.statValue}>
//                 {warehouseStats.pendingReleases || 0}
//               </Text>
//             </View>
//             <View style={[styles.statCard, styles.statCardRight]}>
//               <Text style={styles.statLabel}>Low Stock Items</Text>
//               <Text style={[styles.statValue, styles.warningValue]}>
//                 {warehouseStats.lowStockItems || 0}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View style={styles.quickActions}>
//           <TouchableOpacity
//             style={[styles.quickAction, styles.scanAction]}
//             onPress={() => router.push("/(app)/(tabs)/scan")}
//           >
//             <Scan size={20} color={Colors.white} />
//             <Text style={styles.scanActionText}>Scan QR</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.quickAction, styles.refreshAction]}
//             onPress={onRefresh}
//           >
//             <RefreshCw size={20} color={Colors.gray700} />
//             <Text style={styles.refreshActionText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Release Queue ({releaseQueue.length})
//           </Text>
//           {releaseQueue.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Truck size={48} color={Colors.gray300} />
//               <Text style={styles.emptyText}>No pending releases</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={releaseQueue}
//               keyExtractor={(item) => item._id}
//               renderItem={renderReleaseItem}
//               scrollEnabled={false}
//             />
//           )}
//         </View>

//         <View style={styles.section}>
//           <View style={styles.inventoryHeader}>
//             <Text style={styles.sectionTitle}>Inventory Overview</Text>
//             <TouchableOpacity
//               style={styles.viewAllButton}
//               onPress={() => router.push("/(app)/(stacks)/inventory")}
//             >
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.searchContainer}>
//             <Search size={20} color={Colors.gray400} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search inventory..."
//               value={searchTerm}
//               onChangeText={setSearchTerm}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>

//           {filteredInventory.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Package size={48} color={Colors.gray300} />
//               <Text style={styles.emptyText}>No inventory items found</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={filteredInventory.slice(0, 10)}
//               keyExtractor={(item) => item._id}
//               renderItem={renderInventoryItem}
//               scrollEnabled={false}
//             />
//           )}
//         </View>
//       </ScrollView>

//       {/* Release Modal */}
//       <Modal visible={releaseModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Process Release</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setReleaseModal(false);
//                   setSelectedTransaction(null);
//                   setReleasedItems({});
//                   setReleaseResult(null);
//                   setScannedTransaction(null);
//                   setQrData(null);
//                 }}
//               >
//                 <XCircle size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             {selectedTransaction && (
//               <>
//                 <View style={styles.modalTransaction}>
//                   <Text style={styles.modalTransactionLabel}>Transaction</Text>
//                   <Text style={styles.modalTransactionNumber}>
//                     {selectedTransaction.transactionNumber || "Loading..."}
//                   </Text>
//                   <Text style={styles.modalTransactionTotal}>
//                     Total:{" "}
//                     {formatCurrency(selectedTransaction.totalAmount || 0)}
//                   </Text>
//                   {selectedTransaction.paymentQR && (
//                     <Text style={styles.modalPaymentVerified}>
//                       ✅ Payment Verified
//                     </Text>
//                   )}
//                 </View>

//                 {releaseResult ? (
//                   <View style={styles.releaseSuccessContainer}>
//                     <CheckCircle size={48} color={Colors.success} />
//                     <Text style={styles.releaseSuccessTitle}>
//                       Release Complete!
//                     </Text>
//                     <Text style={styles.releaseSuccessSubtitle}>
//                       Invoice: {releaseResult.invoiceNumber}
//                     </Text>
//                     <Text style={styles.releaseSuccessSubtitle}>
//                       Items Released:{" "}
//                       {releaseResult.releaseResults?.length || 0}
//                     </Text>
//                     {releaseResult.releaseErrors?.length > 0 && (
//                       <Text style={styles.releaseSuccessError}>
//                         Errors: {releaseResult.releaseErrors.length}
//                       </Text>
//                     )}
//                     {releaseResult.releaseQR && (
//                       <TouchableOpacity
//                         style={styles.viewQRButton}
//                         onPress={() => {
//                           router.push({
//                             pathname: "/(app)/(modals)/receipt-preview",
//                             params: {
//                               transactionId: selectedTransaction._id,
//                               qrData: releaseResult.releaseQR,
//                               qrType: "RELEASE",
//                               invoiceNumber: releaseResult.invoiceNumber,
//                               mode: "release",
//                             },
//                           });
//                         }}
//                       >
//                         <QrCode size={16} color={Colors.white} />
//                         <Text style={styles.viewQRText}>
//                           View Release Receipt
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                     {selectedTransaction.invoiceQR && (
//                       <TouchableOpacity
//                         style={[styles.viewQRButton, styles.viewInvoiceButton]}
//                         onPress={() => {
//                           router.push({
//                             pathname: "/(app)/(modals)/receipt-preview",
//                             params: {
//                               transactionId: selectedTransaction._id,
//                               qrData: selectedTransaction.invoiceQR,
//                               qrType: "INVOICE",
//                               invoiceNumber: releaseResult.invoiceNumber,
//                               mode: "invoice",
//                             },
//                           });
//                         }}
//                       >
//                         <Printer size={16} color={Colors.white} />
//                         <Text style={styles.viewQRText}>View Invoice</Text>
//                       </TouchableOpacity>
//                     )}
//                     <TouchableOpacity
//                       style={styles.releaseDoneButton}
//                       onPress={() => {
//                         setReleaseModal(false);
//                         setSelectedTransaction(null);
//                         setReleasedItems({});
//                         setReleaseResult(null);
//                         setScannedTransaction(null);
//                         setQrData(null);
//                         fetchData();
//                       }}
//                     >
//                       <Text style={styles.releaseDoneText}>Done</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <>
//                     <ScrollView style={styles.modalItemList}>
//                       {selectedTransaction.items?.map((item) => (
//                         <View key={item._id} style={styles.modalItem}>
//                           <View style={styles.modalItemInfo}>
//                             <Text style={styles.modalItemName}>
//                               {item.name}
//                             </Text>
//                             <Text style={styles.modalItemQuantity}>
//                               Ordered: {item.quantity}
//                             </Text>
//                             {inventory.find(
//                               (inv) =>
//                                 inv.productId?._id === item.productId?._id,
//                             ) && (
//                               <Text style={styles.modalItemAvailable}>
//                                 Available:{" "}
//                                 {inventory.find(
//                                   (inv) =>
//                                     inv.productId?._id === item.productId?._id,
//                                 )?.quantity || 0}
//                               </Text>
//                             )}
//                           </View>
//                           <View style={styles.modalItemActions}>
//                             <TouchableOpacity
//                               style={styles.modalItemButton}
//                               onPress={() => {
//                                 const current =
//                                   releasedItems[item.productId?._id] || 0;
//                                 setReleasedItems((prev) => ({
//                                   ...prev,
//                                   [item.productId?._id]: Math.max(
//                                     0,
//                                     current - 1,
//                                   ),
//                                 }));
//                               }}
//                             >
//                               <Minus size={16} color={Colors.gray500} />
//                             </TouchableOpacity>
//                             <Text style={styles.modalItemInput}>
//                               {releasedItems[item.productId?._id] || 0}
//                             </Text>
//                             <TouchableOpacity
//                               style={styles.modalItemButton}
//                               onPress={() => {
//                                 const current =
//                                   releasedItems[item.productId?._id] || 0;
//                                 const maxQty = item.quantity || 0;
//                                 setReleasedItems((prev) => ({
//                                   ...prev,
//                                   [item.productId?._id]: Math.min(
//                                     current + 1,
//                                     maxQty,
//                                   ),
//                                 }));
//                               }}
//                             >
//                               <Plus size={16} color={Colors.gray500} />
//                             </TouchableOpacity>
//                             <Text style={styles.modalItemMax}>
//                               / {item.quantity}
//                             </Text>
//                           </View>
//                         </View>
//                       ))}
//                     </ScrollView>

//                     <View style={styles.modalButtons}>
//                       <TouchableOpacity
//                         style={[styles.modalButton, styles.modalCancelButton]}
//                         onPress={() => {
//                           setReleaseModal(false);
//                           setSelectedTransaction(null);
//                           setReleasedItems({});
//                           setReleaseResult(null);
//                         }}
//                       >
//                         <Text style={styles.modalCancelText}>Cancel</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={[
//                           styles.modalButton,
//                           styles.modalReleaseButton,
//                           processingRelease && styles.buttonDisabled,
//                         ]}
//                         onPress={processRelease}
//                         disabled={processingRelease}
//                       >
//                         {processingRelease ? (
//                           <ActivityIndicator
//                             color={Colors.white}
//                             size="small"
//                           />
//                         ) : (
//                           <Text style={styles.modalReleaseText}>
//                             Release Items
//                           </Text>
//                         )}
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 )}
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Inventory Adjust Modal */}
//       <Modal visible={inventoryModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, styles.adjustModalContent]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Adjust Stock</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setInventoryModal(false);
//                   setSelectedInventoryItem(null);
//                   setAdjustmentQuantity(0);
//                   setAdjustmentReason("");
//                 }}
//               >
//                 <XCircle size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             {selectedInventoryItem && (
//               <>
//                 <View style={styles.modalTransaction}>
//                   <Text style={styles.modalTransactionLabel}>Product</Text>
//                   <Text style={styles.modalTransactionNumber}>
//                     {selectedInventoryItem.productId?.name}
//                   </Text>
//                   <Text style={styles.modalTransactionLabel}>
//                     Current Stock
//                   </Text>
//                   <Text style={styles.modalTransactionAmount}>
//                     {selectedInventoryItem.quantity}
//                   </Text>
//                   <Text style={styles.modalTransactionLabel}>Reserved</Text>
//                   <Text style={styles.modalTransactionAmount}>
//                     {selectedInventoryItem.reservedQuantity || 0}
//                   </Text>
//                   <Text style={styles.modalTransactionLabel}>SKU</Text>
//                   <Text style={styles.modalTransactionNumber}>
//                     {selectedInventoryItem.productId?.sku}
//                   </Text>
//                   {isSuperAdmin && selectedStoreId && (
//                     <>
//                       <Text style={styles.modalTransactionLabel}>Store</Text>
//                       <Text style={styles.modalTransactionNumber}>
//                         {getStoreName(selectedStoreId)}
//                       </Text>
//                     </>
//                   )}
//                 </View>

//                 <View style={styles.adjustField}>
//                   <Text style={styles.adjustLabel}>Adjustment Quantity</Text>
//                   <View style={styles.adjustRow}>
//                     <TouchableOpacity
//                       style={styles.adjustButton}
//                       onPress={() => setAdjustmentQuantity((prev) => prev - 1)}
//                     >
//                       <Minus size={20} color={Colors.gray500} />
//                     </TouchableOpacity>
//                     <TextInput
//                       style={styles.adjustInput}
//                       keyboardType="numeric"
//                       value={String(adjustmentQuantity)}
//                       onChangeText={(text) =>
//                         setAdjustmentQuantity(parseInt(text) || 0)
//                       }
//                     />
//                     <TouchableOpacity
//                       style={styles.adjustButton}
//                       onPress={() => setAdjustmentQuantity((prev) => prev + 1)}
//                     >
//                       <Plus size={20} color={Colors.gray500} />
//                     </TouchableOpacity>
//                   </View>
//                   <Text style={styles.adjustHelp}>
//                     Positive to add, negative to remove
//                   </Text>
//                 </View>

//                 <View style={styles.adjustField}>
//                   <Text style={styles.adjustLabel}>Reason</Text>
//                   <TextInput
//                     style={styles.adjustReasonInput}
//                     placeholder="Enter reason for adjustment"
//                     value={adjustmentReason}
//                     onChangeText={setAdjustmentReason}
//                     multiline
//                     numberOfLines={2}
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>

//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.modalCancelButton]}
//                     onPress={() => {
//                       setInventoryModal(false);
//                       setSelectedInventoryItem(null);
//                       setAdjustmentQuantity(0);
//                       setAdjustmentReason("");
//                     }}
//                   >
//                     <Text style={styles.modalCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.modalButton,
//                       styles.modalProcessButton,
//                       loading && styles.buttonDisabled,
//                     ]}
//                     onPress={handleAdjustStock}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <ActivityIndicator color={Colors.white} size="small" />
//                     ) : (
//                       <Text style={styles.modalProcessText}>Adjust Stock</Text>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
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
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   scrollView: { flex: 1 },
//   scrollContent: {
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing["3xl"],
//   },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: { paddingVertical: Spacing.md },
//   headerTitle: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },

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

//   statsRow: { flexDirection: "row", marginBottom: Spacing.md },
//   statCard: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   statCardLeft: { marginRight: Spacing.sm },
//   statCardRight: { marginLeft: Spacing.sm },
//   statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
//   statValue: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   warningValue: { color: Colors.warning },
//   quickActions: { flexDirection: "row", marginBottom: Spacing.md },
//   quickAction: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   scanAction: { backgroundColor: Colors.primary, marginRight: Spacing.sm },
//   scanActionText: {
//     color: Colors.white,
//     fontWeight: "600",
//     marginLeft: Spacing.sm,
//   },
//   refreshAction: { backgroundColor: Colors.gray200, marginLeft: Spacing.sm },
//   refreshActionText: {
//     color: Colors.gray700,
//     fontWeight: "600",
//     marginLeft: Spacing.sm,
//   },
//   section: { marginBottom: Spacing.md },
//   sectionTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//     marginBottom: Spacing.md,
//   },
//   inventoryHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.md,
//   },
//   viewAllButton: { padding: Spacing.sm },
//   viewAllText: {
//     color: Colors.primary,
//     fontSize: Typography.sm,
//     fontWeight: "500",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   emptyContainer: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing["3xl"],
//     alignItems: "center",
//     ...Shadows.sm,
//   },
//   emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
//   releaseItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   releaseItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   releaseItemInfo: { flex: 1 },
//   releaseItemNumber: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   releaseItemCount: { fontSize: Typography.sm, color: Colors.gray500 },
//   releaseItemAmount: {
//     fontSize: Typography.sm,
//     fontWeight: "bold",
//     color: Colors.primary,
//     marginTop: Spacing.xs,
//   },
//   releaseItemQR: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: "500",
//     marginTop: 2,
//   },
//   releaseItemRight: { alignItems: "flex-end" },
//   readyBadge: {
//     backgroundColor: Colors.primary + "20",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   readyBadgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: "500",
//   },
//   inventoryItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     ...Shadows.sm,
//   },
//   inventoryItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   inventoryItemInfo: { flex: 1 },
//   inventoryItemName: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   inventoryItemSku: { fontSize: Typography.xs, color: Colors.gray500 },
//   inventoryItemLocation: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: 2,
//   },
//   inventoryItemRight: { alignItems: "flex-end" },
//   inventoryItemQuantity: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   inventoryItemAvailable: {
//     fontSize: Typography.sm,
//     color: Colors.primary,
//   },
//   stockBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//     marginTop: Spacing.xs,
//   },
//   stockBadgeText: { fontSize: Typography.xs, marginLeft: Spacing.xs },
//   stockIn: { backgroundColor: Colors.success + "20" },
//   stockInText: { color: Colors.success },
//   stockLow: { backgroundColor: Colors.warning + "20" },
//   stockLowText: { color: Colors.warning },
//   stockOut: { backgroundColor: Colors.error + "20" },
//   stockOutText: { color: Colors.error },
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
//     maxHeight: "80%",
//   },
//   adjustModalContent: { maxHeight: "85%" },
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
//   modalTransaction: {
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   modalTransactionLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   modalTransactionNumber: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   modalTransactionTotal: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.primary,
//     marginTop: Spacing.xs,
//   },
//   modalTransactionAmount: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.primary,
//     marginTop: Spacing.xs,
//   },
//   modalPaymentVerified: {
//     fontSize: Typography.sm,
//     color: Colors.success,
//     fontWeight: "600",
//     marginTop: Spacing.xs,
//   },
//   modalItemList: { maxHeight: 240 },
//   modalItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   modalItemInfo: { flex: 1 },
//   modalItemName: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   modalItemQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
//   modalItemAvailable: { fontSize: Typography.xs, color: Colors.success },
//   modalItemActions: { flexDirection: "row", alignItems: "center" },
//   modalItemButton: {
//     width: 32,
//     height: 32,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalItemInput: {
//     width: 40,
//     textAlign: "center",
//     fontSize: Typography.md,
//     fontWeight: "500",
//   },
//   modalItemMax: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginLeft: Spacing.xs,
//   },
//   releaseSuccessContainer: {
//     alignItems: "center",
//     paddingVertical: Spacing.md,
//   },
//   releaseSuccessTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     marginTop: Spacing.md,
//   },
//   releaseSuccessSubtitle: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   releaseSuccessError: {
//     fontSize: Typography.md,
//     color: Colors.error,
//     marginTop: Spacing.xs,
//   },
//   viewQRButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     marginTop: Spacing.md,
//   },
//   viewInvoiceButton: {
//     backgroundColor: Colors.success,
//   },
//   viewQRText: {
//     color: Colors.white,
//     fontWeight: "600",
//     marginLeft: Spacing.sm,
//   },
//   releaseDoneButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.gray200,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   releaseDoneText: {
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   adjustField: { marginBottom: Spacing.md },
//   adjustLabel: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   adjustRow: { flexDirection: "row", alignItems: "center" },
//   adjustButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   adjustInput: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.gray300,
//     paddingVertical: Spacing.sm,
//     marginHorizontal: Spacing.md,
//   },
//   adjustHelp: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   adjustReasonInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     minHeight: 60,
//     textAlignVertical: "top",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     gap: Spacing.sm,
//     marginTop: Spacing.md,
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalCancelButton: { backgroundColor: Colors.gray200 },
//   modalCancelText: { fontWeight: "600", color: Colors.gray700 },
//   modalReleaseButton: { backgroundColor: Colors.primary },
//   modalReleaseText: { fontWeight: "600", color: Colors.white },
//   modalProcessButton: { backgroundColor: Colors.primary },
//   modalProcessText: { fontWeight: "600", color: Colors.white },
//   buttonDisabled: { opacity: 0.7 },

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







































// app/(app)/(tabs)/warehouse.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import WarehouseService from "../../../services/warehouseService";
import TransactionService from "../../../services/transactionService";
import InventoryService from "../../../services/inventoryService";
import StoreService from "../../../services/storeService";
import AuthService from "../../../services/authService";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Scan,
  Search,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  QrCode,
  Printer,
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

export default function Warehouse() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [releaseQueue, setReleaseQueue] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [warehouseStats, setWarehouseStats] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [releaseModal, setReleaseModal] = useState(false);
  const [releasedItems, setReleasedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryModal, setInventoryModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [releaseResult, setReleaseResult] = useState(null);
  const [scannedTransaction, setScannedTransaction] = useState(null);
  const [qrData, setQrData] = useState(null);
  // Guards against re-processing the same scanned QR. useLocalSearchParams()
  // returns a NEW object on every render even when the values are
  // identical, so using the whole `params` object as an effect dependency
  // (as this screen used to) re-fires the handler on every re-render the
  // handler itself causes via setState - an infinite loop bounded only by
  // round-trip latency. This ref makes the effect idempotent regardless of
  // how often it re-fires.
  const processedQrDataRef = useRef(null);
  const [processingRelease, setProcessingRelease] = useState(false);

  // Store selection state
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.value === storeId);
    return store ? store.label : 'Select a store...';
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

  useEffect(() => {
    loadUserAndStores();
  }, []);

  useEffect(() => {
    if (user && (selectedStoreId || !isSuperAdmin)) {
      fetchData();
    }
  }, [selectedStoreId, user]);

  useEffect(() => {
    if (
      params.transactionId &&
      params.mode === "release" &&
      params.qrData &&
      processedQrDataRef.current !== params.qrData
    ) {
      processedQrDataRef.current = params.qrData;
      handleQRScanResult(params);
    }
    // FIX: depend on the specific primitive fields we actually use, not
    // the whole `params` object - useLocalSearchParams() returns a new
    // object reference every render, which previously made this effect
    // re-fire on every render (see processedQrDataRef comment above).
  }, [params.transactionId, params.mode, params.qrData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchReleaseQueue(), fetchInventory(), fetchStats()]);
    } catch (error) {
      console.error("Failed to fetch warehouse data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchReleaseQueue = async () => {
    try {
      let storeId = null;
      if (isSuperAdmin) {
        storeId = selectedStoreId;
      }
      const result = await WarehouseService.getReleaseQueue(storeId);
      setReleaseQueue(result || []);
    } catch (error) {
      console.error("Failed to fetch release queue:", error);
    }
  };

  const fetchInventory = async () => {
    try {
      const params = {
        limit: 20,
        sortBy: "quantity",
        sortOrder: "asc",
      };
      
      if (isSuperAdmin && selectedStoreId) {
        params.storeId = selectedStoreId;
      }
      
      const result = await InventoryService.getInventory(params);
      setInventory(result.inventory || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  const fetchStats = async () => {
    try {
      let storeId = null;
      if (isSuperAdmin) {
        storeId = selectedStoreId;
      }
      
      const stats = await WarehouseService.getStats(storeId);
      setWarehouseStats(stats);
    } catch (error) {
      console.error("Failed to fetch warehouse stats:", error);
      setWarehouseStats({
        pendingReleases: 0,
        totalProducts: 0,
        totalInventory: 0,
        totalInventoryValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        recentTransactions: [],
        releaseQueue: [],
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleQRScanResult = async (params) => {
    try {
      const result = await TransactionService.scanPaymentQR(params.qrData);

      if (result && result.isValid) {
        setScannedTransaction(result.transaction);
        setQrData(params.qrData);
        setSelectedTransaction(result.transaction);
        setReleaseModal(true);

        const initialItems = {};
        result.transaction.items?.forEach((item) => {
          initialItems[item.productId?._id] = 0;
        });
        setReleasedItems(initialItems);
        setReleaseResult(null);

        await showAlert(
          "Payment Receipt Scanned",
          `Transaction: ${result.transaction.transactionNumber}\nTotal: ${formatCurrency(result.transaction.totalAmount || 0)}\nItems: ${result.transaction.items?.length || 0}`,
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      await showAlert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to scan QR code",
      );
    }
  };

  const processRelease = async () => {
    if (!selectedTransaction) return;

    const items = Object.entries(releasedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (items.length === 0) {
      await showAlert("Error", "Please specify quantities to release");
      return;
    }

    setProcessingRelease(true);
    try {
      const result = await TransactionService.releaseStock(
        selectedTransaction._id,
        items,
      );

      setReleaseResult(result);

      await showAlert(
        "Release Successful",
        `Items released successfully\n` +
          `Invoice: ${result.invoiceNumber}\n` +
          `Items: ${result.releaseResults?.length || 0} released\n` +
          `Errors: ${result.releaseErrors?.length || 0}`,
        [
          {
            text: "View Release Receipt",
            onPress: () => {
              if (result.releaseQR) {
                router.push({
                  pathname: "/(app)/(modals)/receipt-preview",
                  params: {
                    transactionId: selectedTransaction._id,
                    qrData: result.releaseQR,
                    qrType: "RELEASE",
                    invoiceNumber: result.invoiceNumber,
                    mode: "release",
                  },
                });
              }
            },
          },
          {
            text: "View Invoice",
            onPress: () => {
              if (result.transaction?.invoiceQR) {
                router.push({
                  pathname: "/(app)/(modals)/receipt-preview",
                  params: {
                    transactionId: selectedTransaction._id,
                    qrData: result.transaction.invoiceQR,
                    qrType: "INVOICE",
                    invoiceNumber: result.invoiceNumber,
                    mode: "invoice",
                  },
                });
              }
            },
          },
          {
            text: "Done",
            onPress: () => {
              setReleaseModal(false);
              setSelectedTransaction(null);
              setReleasedItems({});
              setReleaseResult(null);
              setScannedTransaction(null);
              setQrData(null);
              fetchData();
            },
          },
        ],
      );
    } catch (error) {
      console.error("Release error:", error);
      await showAlert(
        "Error",
        error.response?.data?.message || error.message || "Failed to release items",
      );
    } finally {
      setProcessingRelease(false);
    }
  };

  const handleAdjustStock = async () => {
    if (!selectedInventoryItem) return;
    if (adjustmentQuantity === 0) {
      await showAlert("Error", "Please enter a quantity");
      return;
    }
    if (!adjustmentReason.trim()) {
      await showAlert("Error", "Please enter a reason");
      return;
    }

    setLoading(true);
    try {
      let storeId = null;
      if (isSuperAdmin) {
        storeId = selectedStoreId;
      }
      
      await InventoryService.adjustStock(
        selectedInventoryItem.productId._id,
        adjustmentQuantity,
        adjustmentReason.trim(),
        storeId,
      );
      
      await showAlert("Success", "Stock adjusted successfully");
      setInventoryModal(false);
      setSelectedInventoryItem(null);
      setAdjustmentQuantity(0);
      setAdjustmentReason("");
      fetchInventory();
    } catch (error) {
      await showAlert(
        "Error",
        error.response?.data?.message || error.message || "Failed to adjust stock",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (item) => {
    const quantity = item.quantity || 0;
    const reorderPoint = item.reorderPoint || 5;

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        container: styles.stockOut,
        text: styles.stockOutText,
        icon: XCircle,
      };
    } else if (quantity <= reorderPoint) {
      return {
        label: "Low Stock",
        container: styles.stockLow,
        text: styles.stockLowText,
        icon: AlertTriangle,
      };
    } else {
      return {
        label: "In Stock",
        container: styles.stockIn,
        text: styles.stockInText,
        icon: CheckCircle,
      };
    }
  };

  const renderReleaseItem = ({ item }) => {
    const hasInventory = item.items?.some((i) =>
      inventory.some((inv) => inv.productId?._id === i.productId?._id),
    );

    return (
      <TouchableOpacity
        style={styles.releaseItem}
        onPress={() => {
          setSelectedTransaction(item);
          setReleaseModal(true);
          const initialItems = {};
          item.items?.forEach((i) => {
            initialItems[i.productId?._id] = 0;
          });
          setReleasedItems(initialItems);
          setReleaseResult(null);
        }}
      >
        <View style={styles.releaseItemRow}>
          <View style={styles.releaseItemInfo}>
            <Text style={styles.releaseItemNumber}>
              {item.transactionNumber}
            </Text>
            <Text style={styles.releaseItemCount}>
              {item.items?.length || 0} items
            </Text>
            <Text style={styles.releaseItemAmount}>
              {formatCurrency(item.totalAmount)}
            </Text>
            {item.paymentQR && (
              <Text style={styles.releaseItemQR}>✅ Payment Verified</Text>
            )}
          </View>
          <View style={styles.releaseItemRight}>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>
                {hasInventory ? "Ready for Release" : "Pending Stock"}
              </Text>
            </View>
            <Clock
              size={16}
              color={hasInventory ? Colors.success : Colors.warning}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderInventoryItem = ({ item }) => {
    const status = getStockStatus(item);
    const StatusIcon = status.icon;
    const available = (item.quantity || 0) - (item.reservedQuantity || 0);

    return (
      <TouchableOpacity
        style={styles.inventoryItem}
        onPress={() => {
          setSelectedInventoryItem(item);
          setAdjustmentQuantity(0);
          setAdjustmentReason("");
          setInventoryModal(true);
        }}
      >
        <View style={styles.inventoryItemRow}>
          <View style={styles.inventoryItemInfo}>
            <Text style={styles.inventoryItemName}>
              {item.productId?.name || "Unknown Product"}
            </Text>
            <Text style={styles.inventoryItemSku}>
              SKU: {item.productId?.sku || "N/A"}
            </Text>
            <Text style={styles.inventoryItemLocation}>
              📍 {item.warehouseLocation?.aisle || "N/A"} -{" "}
              {item.warehouseLocation?.shelf || "N/A"} -{" "}
              {item.warehouseLocation?.bin || "N/A"}
            </Text>
          </View>
          <View style={styles.inventoryItemRight}>
            <Text style={styles.inventoryItemQuantity}>{item.quantity}</Text>
            <Text style={styles.inventoryItemAvailable}>
              Available: {available}
            </Text>
            <View style={[styles.stockBadge, status.container]}>
              <StatusIcon size={12} />
              <Text style={[styles.stockBadgeText, status.text]}>
                {status.label}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId?.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Warehouse</Text>
          <Text style={styles.headerSubtitle}>
            Manage inventory and releases
          </Text>
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
                      fetchData();
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

        {warehouseStats && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardLeft]}>
              <Text style={styles.statLabel}>Pending Releases</Text>
              <Text style={styles.statValue}>
                {warehouseStats.pendingReleases || 0}
              </Text>
            </View>
            <View style={[styles.statCard, styles.statCardRight]}>
              <Text style={styles.statLabel}>Low Stock Items</Text>
              <Text style={[styles.statValue, styles.warningValue]}>
                {warehouseStats.lowStockItems || 0}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, styles.scanAction]}
            onPress={() => router.push("/(app)/(tabs)/scan")}
          >
            <Scan size={20} color={Colors.white} />
            <Text style={styles.scanActionText}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, styles.refreshAction]}
            onPress={onRefresh}
          >
            <RefreshCw size={20} color={Colors.gray700} />
            <Text style={styles.refreshActionText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Release Queue ({releaseQueue.length})
          </Text>
          {releaseQueue.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Truck size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>No pending releases</Text>
            </View>
          ) : (
            <FlatList
              data={releaseQueue}
              keyExtractor={(item) => item._id}
              renderItem={renderReleaseItem}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.inventoryHeader}>
            <Text style={styles.sectionTitle}>Inventory Overview</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/(app)/(stacks)/inventory")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search inventory..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={Colors.gray400}
            />
          </View>

          {filteredInventory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Package size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>No inventory items found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredInventory.slice(0, 10)}
              keyExtractor={(item) => item._id}
              renderItem={renderInventoryItem}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Release Modal */}
      <Modal visible={releaseModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Process Release</Text>
              <TouchableOpacity
                onPress={() => {
                  setReleaseModal(false);
                  setSelectedTransaction(null);
                  setReleasedItems({});
                  setReleaseResult(null);
                  setScannedTransaction(null);
                  setQrData(null);
                }}
              >
                <XCircle size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <>
                <View style={styles.modalTransaction}>
                  <Text style={styles.modalTransactionLabel}>Transaction</Text>
                  <Text style={styles.modalTransactionNumber}>
                    {selectedTransaction.transactionNumber || "Loading..."}
                  </Text>
                  <Text style={styles.modalTransactionTotal}>
                    Total:{" "}
                    {formatCurrency(selectedTransaction.totalAmount || 0)}
                  </Text>
                  {selectedTransaction.paymentQR && (
                    <Text style={styles.modalPaymentVerified}>
                      ✅ Payment Verified
                    </Text>
                  )}
                </View>

                {releaseResult ? (
                  <View style={styles.releaseSuccessContainer}>
                    <CheckCircle size={48} color={Colors.success} />
                    <Text style={styles.releaseSuccessTitle}>
                      Release Complete!
                    </Text>
                    <Text style={styles.releaseSuccessSubtitle}>
                      Invoice: {releaseResult.invoiceNumber}
                    </Text>
                    <Text style={styles.releaseSuccessSubtitle}>
                      Items Released:{" "}
                      {releaseResult.releaseResults?.length || 0}
                    </Text>
                    {releaseResult.releaseErrors?.length > 0 && (
                      <Text style={styles.releaseSuccessError}>
                        Errors: {releaseResult.releaseErrors.length}
                      </Text>
                    )}
                    {releaseResult.releaseQR && (
                      <TouchableOpacity
                        style={styles.viewQRButton}
                        onPress={() => {
                          router.push({
                            pathname: "/(app)/(modals)/receipt-preview",
                            params: {
                              transactionId: selectedTransaction._id,
                              qrData: releaseResult.releaseQR,
                              qrType: "RELEASE",
                              invoiceNumber: releaseResult.invoiceNumber,
                              mode: "release",
                            },
                          });
                        }}
                      >
                        <QrCode size={16} color={Colors.white} />
                        <Text style={styles.viewQRText}>
                          View Release Receipt
                        </Text>
                      </TouchableOpacity>
                    )}
                    {selectedTransaction.invoiceQR && (
                      <TouchableOpacity
                        style={[styles.viewQRButton, styles.viewInvoiceButton]}
                        onPress={() => {
                          router.push({
                            pathname: "/(app)/(modals)/receipt-preview",
                            params: {
                              transactionId: selectedTransaction._id,
                              qrData: selectedTransaction.invoiceQR,
                              qrType: "INVOICE",
                              invoiceNumber: releaseResult.invoiceNumber,
                              mode: "invoice",
                            },
                          });
                        }}
                      >
                        <Printer size={16} color={Colors.white} />
                        <Text style={styles.viewQRText}>View Invoice</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.releaseDoneButton}
                      onPress={() => {
                        setReleaseModal(false);
                        setSelectedTransaction(null);
                        setReleasedItems({});
                        setReleaseResult(null);
                        setScannedTransaction(null);
                        setQrData(null);
                        fetchData();
                      }}
                    >
                      <Text style={styles.releaseDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <ScrollView style={styles.modalItemList}>
                      {selectedTransaction.items?.map((item) => (
                        <View key={item._id} style={styles.modalItem}>
                          <View style={styles.modalItemInfo}>
                            <Text style={styles.modalItemName}>
                              {item.name}
                            </Text>
                            <Text style={styles.modalItemQuantity}>
                              Ordered: {item.quantity}
                            </Text>
                            {inventory.find(
                              (inv) =>
                                inv.productId?._id === item.productId?._id,
                            ) && (
                              <Text style={styles.modalItemAvailable}>
                                Available:{" "}
                                {inventory.find(
                                  (inv) =>
                                    inv.productId?._id === item.productId?._id,
                                )?.quantity || 0}
                              </Text>
                            )}
                          </View>
                          <View style={styles.modalItemActions}>
                            <TouchableOpacity
                              style={styles.modalItemButton}
                              onPress={() => {
                                const current =
                                  releasedItems[item.productId?._id] || 0;
                                setReleasedItems((prev) => ({
                                  ...prev,
                                  [item.productId?._id]: Math.max(
                                    0,
                                    current - 1,
                                  ),
                                }));
                              }}
                            >
                              <Minus size={16} color={Colors.gray500} />
                            </TouchableOpacity>
                            <Text style={styles.modalItemInput}>
                              {releasedItems[item.productId?._id] || 0}
                            </Text>
                            <TouchableOpacity
                              style={styles.modalItemButton}
                              onPress={() => {
                                const current =
                                  releasedItems[item.productId?._id] || 0;
                                const maxQty = item.quantity || 0;
                                setReleasedItems((prev) => ({
                                  ...prev,
                                  [item.productId?._id]: Math.min(
                                    current + 1,
                                    maxQty,
                                  ),
                                }));
                              }}
                            >
                              <Plus size={16} color={Colors.gray500} />
                            </TouchableOpacity>
                            <Text style={styles.modalItemMax}>
                              / {item.quantity}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>

                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalCancelButton]}
                        onPress={() => {
                          setReleaseModal(false);
                          setSelectedTransaction(null);
                          setReleasedItems({});
                          setReleaseResult(null);
                        }}
                      >
                        <Text style={styles.modalCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.modalButton,
                          styles.modalReleaseButton,
                          processingRelease && styles.buttonDisabled,
                        ]}
                        onPress={processRelease}
                        disabled={processingRelease}
                      >
                        {processingRelease ? (
                          <ActivityIndicator
                            color={Colors.white}
                            size="small"
                          />
                        ) : (
                          <Text style={styles.modalReleaseText}>
                            Release Items
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Inventory Adjust Modal */}
      <Modal visible={inventoryModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.adjustModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Stock</Text>
              <TouchableOpacity
                onPress={() => {
                  setInventoryModal(false);
                  setSelectedInventoryItem(null);
                  setAdjustmentQuantity(0);
                  setAdjustmentReason("");
                }}
              >
                <XCircle size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            {selectedInventoryItem && (
              <>
                <View style={styles.modalTransaction}>
                  <Text style={styles.modalTransactionLabel}>Product</Text>
                  <Text style={styles.modalTransactionNumber}>
                    {selectedInventoryItem.productId?.name}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>
                    Current Stock
                  </Text>
                  <Text style={styles.modalTransactionAmount}>
                    {selectedInventoryItem.quantity}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>Reserved</Text>
                  <Text style={styles.modalTransactionAmount}>
                    {selectedInventoryItem.reservedQuantity || 0}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>SKU</Text>
                  <Text style={styles.modalTransactionNumber}>
                    {selectedInventoryItem.productId?.sku}
                  </Text>
                  {isSuperAdmin && selectedStoreId && (
                    <>
                      <Text style={styles.modalTransactionLabel}>Store</Text>
                      <Text style={styles.modalTransactionNumber}>
                        {getStoreName(selectedStoreId)}
                      </Text>
                    </>
                  )}
                </View>

                <View style={styles.adjustField}>
                  <Text style={styles.adjustLabel}>Adjustment Quantity</Text>
                  <View style={styles.adjustRow}>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => setAdjustmentQuantity((prev) => prev - 1)}
                    >
                      <Minus size={20} color={Colors.gray500} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.adjustInput}
                      keyboardType="numeric"
                      value={String(adjustmentQuantity)}
                      onChangeText={(text) =>
                        setAdjustmentQuantity(parseInt(text) || 0)
                      }
                    />
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => setAdjustmentQuantity((prev) => prev + 1)}
                    >
                      <Plus size={20} color={Colors.gray500} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.adjustHelp}>
                    Positive to add, negative to remove
                  </Text>
                </View>

                <View style={styles.adjustField}>
                  <Text style={styles.adjustLabel}>Reason</Text>
                  <TextInput
                    style={styles.adjustReasonInput}
                    placeholder="Enter reason for adjustment"
                    value={adjustmentReason}
                    onChangeText={setAdjustmentReason}
                    multiline
                    numberOfLines={2}
                    placeholderTextColor={Colors.gray400}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={() => {
                      setInventoryModal(false);
                      setSelectedInventoryItem(null);
                      setAdjustmentQuantity(0);
                      setAdjustmentReason("");
                    }}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.modalProcessButton,
                      loading && styles.buttonDisabled,
                    ]}
                    onPress={handleAdjustStock}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Text style={styles.modalProcessText}>Adjust Stock</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  container: { flex: 1, backgroundColor: Colors.gray50 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingVertical: Spacing.md },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },

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

  statsRow: { flexDirection: "row", marginBottom: Spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statCardLeft: { marginRight: Spacing.sm },
  statCardRight: { marginLeft: Spacing.sm },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  warningValue: { color: Colors.warning },
  quickActions: { flexDirection: "row", marginBottom: Spacing.md },
  quickAction: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanAction: { backgroundColor: Colors.primary, marginRight: Spacing.sm },
  scanActionText: {
    color: Colors.white,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  refreshAction: { backgroundColor: Colors.gray200, marginLeft: Spacing.sm },
  refreshActionText: {
    color: Colors.gray700,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  inventoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  viewAllButton: { padding: Spacing.sm },
  viewAllText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.md,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["3xl"],
    alignItems: "center",
    ...Shadows.sm,
  },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
  releaseItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  releaseItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  releaseItemInfo: { flex: 1 },
  releaseItemNumber: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  releaseItemCount: { fontSize: Typography.sm, color: Colors.gray500 },
  releaseItemAmount: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  releaseItemQR: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: "500",
    marginTop: 2,
  },
  releaseItemRight: { alignItems: "flex-end" },
  readyBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  readyBadgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "500",
  },
  inventoryItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  inventoryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inventoryItemInfo: { flex: 1 },
  inventoryItemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  inventoryItemSku: { fontSize: Typography.xs, color: Colors.gray500 },
  inventoryItemLocation: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
  inventoryItemRight: { alignItems: "flex-end" },
  inventoryItemQuantity: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  inventoryItemAvailable: {
    fontSize: Typography.sm,
    color: Colors.primary,
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  stockBadgeText: { fontSize: Typography.xs, marginLeft: Spacing.xs },
  stockIn: { backgroundColor: Colors.success + "20" },
  stockInText: { color: Colors.success },
  stockLow: { backgroundColor: Colors.warning + "20" },
  stockLowText: { color: Colors.warning },
  stockOut: { backgroundColor: Colors.error + "20" },
  stockOutText: { color: Colors.error },
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
    maxHeight: "80%",
  },
  adjustModalContent: { maxHeight: "85%" },
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
  modalTransaction: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  modalTransactionLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  modalTransactionNumber: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalTransactionTotal: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  modalTransactionAmount: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  modalPaymentVerified: {
    fontSize: Typography.sm,
    color: Colors.success,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  modalItemList: { maxHeight: 240 },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalItemInfo: { flex: 1 },
  modalItemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  modalItemQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
  modalItemAvailable: { fontSize: Typography.xs, color: Colors.success },
  modalItemActions: { flexDirection: "row", alignItems: "center" },
  modalItemButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemInput: {
    width: 40,
    textAlign: "center",
    fontSize: Typography.md,
    fontWeight: "500",
  },
  modalItemMax: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
  },
  releaseSuccessContainer: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  releaseSuccessTitle: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.md,
  },
  releaseSuccessSubtitle: {
    fontSize: Typography.md,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  releaseSuccessError: {
    fontSize: Typography.md,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  viewQRButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  viewInvoiceButton: {
    backgroundColor: Colors.success,
  },
  viewQRText: {
    color: Colors.white,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  releaseDoneButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.gray200,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  releaseDoneText: {
    fontWeight: "600",
    color: Colors.gray700,
  },
  adjustField: { marginBottom: Spacing.md },
  adjustLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  adjustRow: { flexDirection: "row", alignItems: "center" },
  adjustButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  adjustInput: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.xl,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  adjustHelp: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  adjustReasonInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 60,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButton: { backgroundColor: Colors.gray200 },
  modalCancelText: { fontWeight: "600", color: Colors.gray700 },
  modalReleaseButton: { backgroundColor: Colors.primary },
  modalReleaseText: { fontWeight: "600", color: Colors.white },
  modalProcessButton: { backgroundColor: Colors.primary },
  modalProcessText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },

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