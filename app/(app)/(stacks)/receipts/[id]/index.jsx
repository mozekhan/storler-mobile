// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Dimensions,
//   Share,
//   Platform,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   ArrowLeft,
//   Share2,
//   Download,
//   Printer,
//   QrCode,
// } from "lucide-react-native";
// import ReceiptService from "../../../../../services/receiptService";
// import TransactionService from "../../../../../services/transactionService";
// import {
//   formatCurrency,
//   formatDateTime,
// } from "../../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../../constants/theme";
// import { CustomHeader } from "@/components";

// const { width } = Dimensions.get("window");

// export default function ReceiptDetail() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [receipt, setReceipt] = useState(null);
//   const [receiptData, setReceiptData] = useState(null);
//   const [qrCodeImage, setQrCodeImage] = useState(null);

//   useEffect(() => {
//     fetchReceipt();
//   }, [id]);

//   const fetchReceipt = async () => {
//     try {
//       const data = await ReceiptService.getReceipt(id);
//       setReceipt(data);

//       // Handle QR Code - check if it's a valid data URL
//       if (data.qrCode) {
//         // If QR code is already a data URL, use it directly
//         if (data.qrCode.startsWith("data:image")) {
//           setQrCodeImage(data.qrCode);
//         }
//         // If it's a base64 string without data URL prefix, add it
//         else if (data.qrCode.length > 100) {
//           setQrCodeImage(`data:image/png;base64,${data.qrCode}`);
//         }
//         // Otherwise it might be a URL
//         else {
//           setQrCodeImage(data.qrCode);
//         }
//       }

//       // If receipt has cached data, use it
//       if (data.receiptData) {
//         setReceiptData(data.receiptData);
//       } else if (data.transactionId) {
//         // Otherwise fetch transaction data
//         const transaction = await TransactionService.getTransaction(
//           data.transactionId._id,
//         );
//         // Generate receipt data from transaction
//         const generatedData = await ReceiptService.generateReceipt(
//           data.transactionId._id,
//           data.type,
//         );
//         setReceiptData(generatedData);
//       }
//     } catch (error) {
//       console.error("Error fetching receipt:", error);
//       Alert.alert("Error", "Failed to load receipt details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `Receipt: ${receipt.receiptNumber}\nType: ${receipt.type}\nTransaction: ${receipt.transactionId?.transactionNumber}\nTotal: ${formatCurrency(receipt.transactionId?.totalAmount || 0)}\nDate: ${formatDateTime(receipt.createdAt)}`,
//         title: "Receipt",
//       });
//     } catch (error) {
//       Alert.alert("Error", "Failed to share receipt");
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       await ReceiptService.downloadReceipt(id);
//       Alert.alert("Success", "Receipt downloaded successfully");
//     } catch (error) {
//       Alert.alert("Error", "Failed to download receipt");
//     }
//   };

//   const handlePrint = async () => {
//     try {
//       await ReceiptService.markAsPrinted(id);
//       Alert.alert("Success", "Receipt marked as printed");
//       fetchReceipt();
//     } catch (error) {
//       Alert.alert("Error", "Failed to mark receipt as printed");
//     }
//   };

//   const getTypeIcon = (type) => {
//     const icons = {
//       SALES: "📄",
//       PAYMENT: "💰",
//       INVOICE: "📋",
//       FINAL: "✅",
//     };
//     return icons[type] || "📄";
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       SALES: Colors.primary,
//       PAYMENT: Colors.success,
//       INVOICE: Colors.warning,
//       FINAL: Colors.success,
//     };
//     return colors[type] || Colors.gray;
//   };

//   const renderItemDetails = (item) => (
//     <View key={item.id || item._id} style={styles.itemRow}>
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemSku}>SKU: {item.sku || "N/A"}</Text>
//         <View style={styles.itemDetails}>
//           <Text style={styles.itemDetailText}>
//             {item.quantity} × {formatCurrency(item.unitPrice)}
//           </Text>
//           {item.taxAmount > 0 && (
//             <Text style={styles.itemTaxText}>
//               Tax: {formatCurrency(item.taxAmount)}
//             </Text>
//           )}
//           {item.discountAmount > 0 && (
//             <Text style={styles.itemDiscountText}>
//               Disc: {formatCurrency(item.discountAmount)}
//             </Text>
//           )}
//           {item.warehouseLocation &&
//             (item.warehouseLocation.aisle || item.warehouseLocation.shelf) && (
//               <Text style={styles.itemLocationText}>
//                 📍 {item.warehouseLocation.aisle || ""}
//                 {item.warehouseLocation.shelf
//                   ? `-${item.warehouseLocation.shelf}`
//                   : ""}
//               </Text>
//             )}
//         </View>
//       </View>
//       <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading receipt...</Text>
//       </View>
//     );
//   }

//   if (!receipt) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Receipt not found</Text>
//         <TouchableOpacity
//           style={styles.closeButton}
//           onPress={() => router.back()}
//         >
//           <Text style={styles.closeButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const transaction = receipt.transactionId || {};
//   const summary = receiptData?.summary || {};

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Receipt Details" />
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Header Card */}
//         <View style={styles.headerCard}>
//           <View style={styles.headerRow}>
//             <View style={styles.headerLeft}>
//               <Text style={styles.headerLabel}>Receipt Number</Text>
//               <Text style={styles.headerNumber}>{receipt.receiptNumber}</Text>
//             </View>
//             <View
//               style={[
//                 styles.typeContainer,
//                 { backgroundColor: getTypeColor(receipt.type) + "20" },
//               ]}
//             >
//               <Text style={styles.typeIcon}>{getTypeIcon(receipt.type)}</Text>
//               <Text
//                 style={[styles.typeText, { color: getTypeColor(receipt.type) }]}
//               >
//                 {receipt.type}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.headerMeta}>
//             <Text style={styles.headerDate}>
//               {formatDateTime(receipt.createdAt)}
//             </Text>
//             <View
//               style={[
//                 styles.statusBadge,
//                 receipt.printed
//                   ? styles.statusPrinted
//                   : styles.statusNotPrinted,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.statusText,
//                   receipt.printed
//                     ? styles.statusPrintedText
//                     : styles.statusNotPrintedText,
//                 ]}
//               >
//                 {receipt.printed
//                   ? `Printed (${receipt.printCount || 1}x)`
//                   : "Not Printed"}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Store Info */}
//         {receiptData?.store && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Store Information</Text>
//             <Text style={styles.storeName}>{receiptData.store.name}</Text>
//             {receiptData.store.address && (
//               <Text style={styles.storeDetail}>
//                 {receiptData.store.address}
//               </Text>
//             )}
//             {receiptData.store.phone && (
//               <Text style={styles.storeDetail}>
//                 📞 {receiptData.store.phone}
//               </Text>
//             )}
//             {receiptData.store.email && (
//               <Text style={styles.storeDetail}>
//                 ✉️ {receiptData.store.email}
//               </Text>
//             )}
//             {receiptData.store.taxId && (
//               <Text style={styles.storeDetail}>
//                 Tax ID: {receiptData.store.taxId}
//               </Text>
//             )}
//           </View>
//         )}

//         {/* Transaction Details */}
//         <View style={styles.detailsCard}>
//           <Text style={styles.sectionTitle}>Transaction Details</Text>
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Transaction #</Text>
//             <Text style={styles.detailValue}>
//               {transaction.transactionNumber || "N/A"}
//             </Text>
//           </View>
//           {transaction.invoiceNumber && (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Invoice #</Text>
//               <Text style={styles.detailValue}>
//                 {transaction.invoiceNumber}
//               </Text>
//             </View>
//           )}
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Status</Text>
//             <Text style={[styles.detailValue, styles.statusValue]}>
//               {transaction.status || "N/A"}
//             </Text>
//           </View>
//           {receiptData?.timeline && (
//             <>
//               {receiptData.timeline.sales && (
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Sales Time</Text>
//                   <Text style={styles.detailValue}>
//                     {formatDateTime(receiptData.timeline.sales)}
//                   </Text>
//                 </View>
//               )}
//               {receiptData.timeline.payment && (
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Payment Time</Text>
//                   <Text style={styles.detailValue}>
//                     {formatDateTime(receiptData.timeline.payment)}
//                   </Text>
//                 </View>
//               )}
//               {receiptData.timeline.release && (
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Release Time</Text>
//                   <Text style={styles.detailValue}>
//                     {formatDateTime(receiptData.timeline.release)}
//                   </Text>
//                 </View>
//               )}
//             </>
//           )}
//         </View>

//         {/* Staff Information */}
//         {receiptData?.staff && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Staff</Text>
//             {receiptData.staff.salesAttendant && (
//               <View style={styles.staffRow}>
//                 <Text style={styles.staffRole}>Sales</Text>
//                 <Text style={styles.staffName}>
//                   {receiptData.staff.salesAttendant.name}
//                 </Text>
//                 {receiptData.staff.salesAttendant.email && (
//                   <Text style={styles.staffEmail}>
//                     {receiptData.staff.salesAttendant.email}
//                   </Text>
//                 )}
//               </View>
//             )}
//             {receiptData.staff.financeAttendant && (
//               <View style={styles.staffRow}>
//                 <Text style={styles.staffRole}>Finance</Text>
//                 <Text style={styles.staffName}>
//                   {receiptData.staff.financeAttendant.name}
//                 </Text>
//                 {receiptData.staff.financeAttendant.email && (
//                   <Text style={styles.staffEmail}>
//                     {receiptData.staff.financeAttendant.email}
//                   </Text>
//                 )}
//               </View>
//             )}
//             {receiptData.staff.warehouseStaff && (
//               <View style={styles.staffRow}>
//                 <Text style={styles.staffRole}>Warehouse</Text>
//                 <Text style={styles.staffName}>
//                   {receiptData.staff.warehouseStaff.name}
//                 </Text>
//                 {receiptData.staff.warehouseStaff.email && (
//                   <Text style={styles.staffEmail}>
//                     {receiptData.staff.warehouseStaff.email}
//                   </Text>
//                 )}
//               </View>
//             )}
//           </View>
//         )}

//         {/* Items */}
//         {receiptData?.items && receiptData.items.length > 0 && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>
//               Items ({receiptData.items.length})
//             </Text>
//             {receiptData.items.map((item) => renderItemDetails(item))}
//           </View>
//         )}

//         {/* Released Items */}
//         {receiptData?.releasedItems && receiptData.releasedItems.length > 0 && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>
//               Released Items ({receiptData.releasedItems.length})
//             </Text>
//             {receiptData.releasedItems.map((item, index) => (
//               <View key={index} style={styles.itemRow}>
//                 <View style={styles.itemInfo}>
//                   <Text style={styles.itemName}>
//                     {item.productName || "Item"}
//                   </Text>
//                   <Text style={styles.itemSku}>SKU: {item.sku || "N/A"}</Text>
//                   <Text style={styles.itemDetailText}>
//                     {item.quantityReleased} × {formatCurrency(item.unitPrice)}
//                   </Text>
//                   {item.releasedByName && (
//                     <Text style={styles.itemReleasedBy}>
//                       Released by: {item.releasedByName}
//                     </Text>
//                   )}
//                 </View>
//                 <Text style={styles.itemTotal}>
//                   {formatCurrency(item.totalPrice)}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Financial Summary */}
//         {(Object.keys(summary).length > 0 || transaction) && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Financial Summary</Text>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal</Text>
//               <Text style={styles.summaryValue}>
//                 {formatCurrency(summary.subtotal || transaction.subtotal || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Tax</Text>
//               <Text style={styles.summaryValue}>
//                 {formatCurrency(summary.taxTotal || transaction.taxTotal || 0)}
//               </Text>
//             </View>
//             {summary.discountTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Discount</Text>
//                 <Text style={[styles.summaryValue, styles.discountValue]}>
//                   -{formatCurrency(summary.discountTotal)}
//                 </Text>
//               </View>
//             )}
//             <View style={[styles.summaryRow, styles.totalRow]}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>
//                 {formatCurrency(
//                   summary.totalAmount || transaction.totalAmount || 0,
//                 )}
//               </Text>
//             </View>
//             {summary.amountPaid > 0 && (
//               <>
//                 <View style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>Amount Paid</Text>
//                   <Text style={styles.summaryValue}>
//                     {formatCurrency(summary.amountPaid)}
//                   </Text>
//                 </View>
//                 {summary.changeAmount > 0 && (
//                   <View style={styles.summaryRow}>
//                     <Text style={styles.summaryLabel}>Change</Text>
//                     <Text style={styles.summaryValue}>
//                       {formatCurrency(summary.changeAmount)}
//                     </Text>
//                   </View>
//                 )}
//                 <View style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>Payment Method</Text>
//                   <Text style={styles.summaryValue}>
//                     {summary.paymentMethod || "N/A"}
//                   </Text>
//                 </View>
//                 {summary.paymentReference && (
//                   <View style={styles.summaryRow}>
//                     <Text style={styles.summaryLabel}>Reference</Text>
//                     <Text style={styles.summaryValue}>
//                       {summary.paymentReference}
//                     </Text>
//                   </View>
//                 )}
//               </>
//             )}
//           </View>
//         )}

//         {/* Additional Data */}
//         {receiptData?.additionalData && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Additional Information</Text>
//             {receiptData.additionalData.customerName && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Customer</Text>
//                 <Text style={styles.detailValue}>
//                   {receiptData.additionalData.customerName}
//                 </Text>
//               </View>
//             )}
//             {receiptData.additionalData.customerEmail && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Customer Email</Text>
//                 <Text style={styles.detailValue}>
//                   {receiptData.additionalData.customerEmail}
//                 </Text>
//               </View>
//             )}
//             {receiptData.additionalData.customerPhone && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Customer Phone</Text>
//                 <Text style={styles.detailValue}>
//                   {receiptData.additionalData.customerPhone}
//                 </Text>
//               </View>
//             )}
//             {receiptData.additionalData.orderType && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Order Type</Text>
//                 <Text style={styles.detailValue}>
//                   {receiptData.additionalData.orderType}
//                 </Text>
//               </View>
//             )}
//             {receiptData.additionalData.notes && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Notes</Text>
//                 <Text style={[styles.detailValue, styles.notesValue]}>
//                   {receiptData.additionalData.notes}
//                 </Text>
//               </View>
//             )}
//             {receiptData.additionalData.tags &&
//               receiptData.additionalData.tags.length > 0 && (
//                 <View style={styles.tagsContainer}>
//                   {receiptData.additionalData.tags.map((tag, index) => (
//                     <View key={index} style={styles.tag}>
//                       <Text style={styles.tagText}>{tag}</Text>
//                     </View>
//                   ))}
//                 </View>
//               )}
//           </View>
//         )}

//         {/* QR Code Section - FIXED */}
//         <View style={styles.qrCard}>
//           <Text style={styles.sectionTitle}>QR Code</Text>
//           {qrCodeImage ? (
//             <View style={styles.qrContainer}>
//               <Image
//                 source={{
//                   uri: qrCodeImage,
//                   // Add cache control to prevent caching issues
//                   cache: "reload",
//                 }}
//                 style={styles.qrImage}
//                 resizeMode="contain"
//                 onError={(error) => {
//                   console.error("QR Image loading error:", error.nativeEvent);
//                   // Try to fix the QR code if it failed
//                   if (qrCodeImage && !qrCodeImage.startsWith("data:image")) {
//                     // Try adding data URL prefix
//                     setQrCodeImage(`data:image/png;base64,${qrCodeImage}`);
//                   }
//                 }}
//                 onLoad={() => {
//                   console.log("QR Image loaded successfully");
//                 }}
//               />
//               <Text style={styles.qrHint}>Scan this QR code</Text>
//               {receipt.qrPayload?.step && (
//                 <Text style={styles.qrStep}>
//                   Step: {receipt.qrPayload.step}
//                 </Text>
//               )}
//               {receipt.type && (
//                 <Text style={styles.qrType}>Type: {receipt.type}</Text>
//               )}
//             </View>
//           ) : (
//             <View style={styles.qrPlaceholder}>
//               <QrCode size={64} color={Colors.gray400} />
//               <Text style={styles.qrPlaceholderText}>
//                 QR code not available
//               </Text>
//               <TouchableOpacity
//                 style={styles.regenerateButton}
//                 onPress={async () => {
//                   try {
//                     setLoading(true);
//                     // Generate a new receipt with QR
//                     const result = await ReceiptService.generateReceipt(
//                       receipt.transactionId._id,
//                       receipt.type,
//                     );
//                     // Refresh the receipt
//                     await fetchReceipt();
//                     Alert.alert("Success", "QR code regenerated");
//                   } catch (error) {
//                     Alert.alert("Error", "Failed to regenerate QR code");
//                   } finally {
//                     setLoading(false);
//                   }
//                 }}
//               >
//                 <Text style={styles.regenerateButtonText}>Regenerate QR</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Footer */}
//         {receiptData?.store?.receiptFooter && (
//           <View style={styles.footerCard}>
//             <Text style={styles.footerText}>
//               {receiptData.store.receiptFooter}
//             </Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* Action Buttons */}
//       <View style={styles.actionsContainer}>
//         {/* <TouchableOpacity 
//           style={[styles.actionButton, styles.backActionButton]} 
//           onPress={() => router.back()}
//         >
//           <ArrowLeft size={20} color={Colors.gray700} />
//           <Text style={styles.backActionText}>Back</Text>
//         </TouchableOpacity> */}
//         <TouchableOpacity
//           onPress={handleShare}
//           style={[styles.actionButton, styles.shareActionButton]}
//         >
//           <Share2 size={20} color={Colors.gray700} />
//           <Text style={styles.actionButtonText}>Share</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity 
//           style={[styles.actionButton, styles.previewActionButton]} 
//           onPress={() => router.push(`/receipts/${id}/preview`)}
//         >
//           <Printer size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Preview</Text>
//         </TouchableOpacity> */}
//         <TouchableOpacity
//           style={[styles.actionButton, styles.printActionButton]}
//           onPress={handlePrint}
//         >
//           <Printer size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Print</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.downloadActionButton]}
//           onPress={handleDownload}
//         >
//           <Download size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Download</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.white,
//   },
//   loadingText: {
//     marginTop: Spacing.md,
//     color: Colors.gray500,
//     fontSize: Typography.md,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.white,
//   },
//   errorText: { fontSize: Typography.lg, color: Colors.gray700 },
//   closeButton: {
//     marginTop: Spacing.md,
//     padding: Spacing.md,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//   },
//   closeButtonText: { color: Colors.white, fontWeight: "600" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     backgroundColor: Colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   headerButton: { padding: Spacing.sm },
//   headerTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: Spacing.md, paddingBottom: Spacing["4xl"] },
//   headerCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   headerLeft: { flex: 1 },
//   headerLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   headerNumber: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   typeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 4,
//     borderRadius: BorderRadius.sm,
//     gap: 4,
//   },
//   typeIcon: { fontSize: Typography.md },
//   typeText: { fontSize: Typography.sm, fontWeight: "600" },
//   headerMeta: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: Spacing.sm,
//   },
//   headerDate: { fontSize: Typography.sm, color: Colors.gray500 },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   statusText: { fontSize: Typography.xs, fontWeight: "500" },
//   statusPrinted: { backgroundColor: Colors.success + "20" },
//   statusPrintedText: { color: Colors.success },
//   statusNotPrinted: { backgroundColor: Colors.warning + "20" },
//   statusNotPrintedText: { color: Colors.warning },
//   detailsCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   sectionTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//     marginBottom: Spacing.sm,
//   },
//   storeName: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   storeDetail: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: Spacing.xs,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray50,
//   },
//   detailLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   detailValue: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//     flex: 1,
//     textAlign: "right",
//   },
//   statusValue: { color: Colors.primary },
//   notesValue: { textAlign: "left", flex: 1 },
//   staffRow: {
//     paddingVertical: Spacing.xs,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray50,
//   },
//   staffRole: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     fontWeight: "600",
//   },
//   staffName: {
//     fontSize: Typography.sm,
//     color: Colors.gray900,
//     fontWeight: "500",
//   },
//   staffEmail: { fontSize: Typography.xs, color: Colors.gray400 },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: Spacing.xs,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray50,
//   },
//   itemInfo: { flex: 1, marginRight: Spacing.sm },
//   itemName: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   itemSku: { fontSize: Typography.xs, color: Colors.gray500 },
//   itemDetails: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 2 },
//   itemDetailText: { fontSize: Typography.xs, color: Colors.gray600 },
//   itemTaxText: { fontSize: Typography.xs, color: Colors.warning },
//   itemDiscountText: { fontSize: Typography.xs, color: Colors.success },
//   itemLocationText: { fontSize: Typography.xs, color: Colors.gray400 },
//   itemReleasedBy: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     marginTop: 1,
//   },
//   itemTotal: {
//     fontSize: Typography.sm,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 2,
//   },
//   summaryLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   summaryValue: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   discountValue: { color: Colors.success },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     paddingTop: Spacing.sm,
//     marginTop: Spacing.xs,
//   },
//   totalLabel: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   totalValue: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   tagsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: Spacing.xs,
//     marginTop: Spacing.xs,
//   },
//   tag: {
//     backgroundColor: Colors.gray100,
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   tagText: { fontSize: Typography.xs, color: Colors.gray700 },
//   qrCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     alignItems: "center",
//     ...Shadows.sm,
//   },
//   qrContainer: { alignItems: "center" },
//   qrImage: {
//     width: width * 0.4,
//     height: width * 0.4,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     borderWidth: 1,
//     borderColor: Colors.gray200,
//   },
//   qrHint: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: Spacing.sm,
//   },
//   qrStep: { fontSize: Typography.xs, color: Colors.primary, marginTop: 2 },
//   qrType: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 1 },
//   qrPlaceholder: {
//     width: width * 0.4,
//     height: width * 0.4,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   qrPlaceholderText: {
//     marginTop: Spacing.sm,
//     color: Colors.gray500,
//     fontSize: Typography.sm,
//   },
//   regenerateButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//   },
//   regenerateButtonText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
//   footerCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     alignItems: "center",
//     ...Shadows.sm,
//   },
//   footerText: {
//     fontSize: Typography.md,
//     color: Colors.gray600,
//     textAlign: "center",
//   },
//   actionsContainer: {
//     flexDirection: "row",
//     padding: Spacing.md,
//     paddingBottom: Spacing.xl,
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     gap: Spacing.sm,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     gap: 4,
//   },
//   backActionButton: { backgroundColor: Colors.gray200 },
//   backActionText: {
//     fontWeight: "600",
//     color: Colors.gray700,
//     fontSize: Typography.sm,
//   },
//   shareActionButton: { backgroundColor: Colors.primary },
//   printActionButton: { backgroundColor: Colors.warning },
//   downloadActionButton: { backgroundColor: Colors.success },
//   actionButtonText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
// });





























import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Share2,
  Download,
  Printer,
  QrCode,
} from "lucide-react-native";
import ReceiptService from "../../../../../services/receiptService";
import TransactionService from "../../../../../services/transactionService";
import {
  formatCurrency,
  formatDateTime,
} from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../../constants/theme";
import { CustomHeader } from "@/components";

const { width } = Dimensions.get("window");

export default function ReceiptDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      const data = await ReceiptService.getReceipt(id);
      setReceipt(data);

      // Handle QR Code
      if (data.qrCode) {
        // If it's already a data URL with image format
        if (data.qrCode.startsWith("data:image")) {
          setQrCodeImage(data.qrCode);
        }
        // If it's a base64 string without prefix
        else if (data.qrCode.length > 100 && !data.qrCode.startsWith("http")) {
          setQrCodeImage(`data:image/png;base64,${data.qrCode}`);
        }
        // Otherwise it might be a URL or raw data
        else {
          setQrCodeImage(data.qrCode);
        }
      }

      // Handle receipt data - use the cached data from the receipt
      if (data.receiptData) {
        setReceiptData(data.receiptData);
      } else if (data.transactionId) {
        // If no cached data, fetch from transaction
        const transactionId = data.transactionId._id || data.transactionId;
        if (transactionId) {
          const transaction = await TransactionService.getTransaction(transactionId);
          // Generate receipt data from transaction
          const generatedData = await ReceiptService.generateReceipt(
            transactionId,
            data.type
          );
          setReceiptData(generatedData);
        }
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);
      Alert.alert("Error", "Failed to load receipt details");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const transaction = receipt?.transactionId || {};
      await Share.share({
        message: `Receipt: ${receipt?.receiptNumber || "N/A"}\nType: ${receipt?.type || "N/A"}\nTransaction: ${transaction?.transactionNumber || "N/A"}\nTotal: ${formatCurrency(transaction?.totalAmount || 0)}\nDate: ${formatDateTime(receipt?.createdAt)}`,
        title: "Receipt",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share receipt");
    }
  };

  const handleDownload = async () => {
    try {
      await ReceiptService.downloadReceipt(id);
      Alert.alert("Success", "Receipt downloaded successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to download receipt");
    }
  };

  const handlePrint = async () => {
    try {
      await ReceiptService.markAsPrinted(id);
      Alert.alert("Success", "Receipt marked as printed");
      fetchReceipt();
    } catch (error) {
      Alert.alert("Error", "Failed to mark receipt as printed");
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      SALES: "📄",
      PAYMENT: "💰",
      INVOICE: "📋",
      FINAL: "✅",
    };
    return icons[type] || "📄";
  };

  const getTypeColor = (type) => {
    const colors = {
      SALES: Colors.primary,
      PAYMENT: Colors.success,
      INVOICE: Colors.warning,
      FINAL: Colors.success,
    };
    return colors[type] || Colors.gray;
  };

  const renderItemDetails = (item) => (
    <View key={item.id || item._id || item.productId} style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name || "Item"}</Text>
        <Text style={styles.itemSku}>SKU: {item.sku || "N/A"}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetailText}>
            {item.quantity || 0} × {formatCurrency(item.unitPrice || 0)}
          </Text>
          {(item.taxAmount || 0) > 0 && (
            <Text style={styles.itemTaxText}>
              Tax: {formatCurrency(item.taxAmount || 0)}
            </Text>
          )}
          {(item.discountAmount || 0) > 0 && (
            <Text style={styles.itemDiscountText}>
              Disc: {formatCurrency(item.discountAmount || 0)}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice || 0)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Receipt not found</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Safely get transaction data
  const transaction = receipt.transactionId || {};
  const summary = receiptData?.summary || {};
  const store = receiptData?.store || {};
  const staff = receiptData?.staff || {};
  const timeline = receiptData?.timeline || {};
  const qrCodes = receiptData?.qrCodes || {};
  const workflow = receiptData?.workflow || {};
  const additionalData = receiptData?.additionalData || {};
  const items = receiptData?.items || [];
  const releasedItems = receiptData?.releasedItems || [];

  return (
    <View style={styles.container}>
      <CustomHeader title="Receipt Details" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerLabel}>Receipt Number</Text>
              <Text style={styles.headerNumber}>{receipt.receiptNumber || "N/A"}</Text>
            </View>
            <View
              style={[
                styles.typeContainer,
                { backgroundColor: getTypeColor(receipt.type) + "20" },
              ]}
            >
              <Text style={styles.typeIcon}>{getTypeIcon(receipt.type)}</Text>
              <Text
                style={[styles.typeText, { color: getTypeColor(receipt.type) }]}
              >
                {receipt.type || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerDate}>
              {formatDateTime(receipt.createdAt)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                receipt.printed
                  ? styles.statusPrinted
                  : styles.statusNotPrinted,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  receipt.printed
                    ? styles.statusPrintedText
                    : styles.statusNotPrintedText,
                ]}
              >
                {receipt.printed
                  ? `Printed (${receipt.printCount || 1}x)`
                  : "Not Printed"}
              </Text>
            </View>
          </View>
        </View>

        {/* Store Info - Only show if data exists */}
        {store.name && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Store Information</Text>
            <Text style={styles.storeName}>{store.name}</Text>
            {store.address && <Text style={styles.storeDetail}>{store.address}</Text>}
            {store.city && store.state && (
              <Text style={styles.storeDetail}>
                {store.city}, {store.state} {store.zipCode || ""}
              </Text>
            )}
            {store.phone && (
              <Text style={styles.storeDetail}>📞 {store.phone}</Text>
            )}
            {store.email && (
              <Text style={styles.storeDetail}>✉️ {store.email}</Text>
            )}
          </View>
        )}

        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction #</Text>
            <Text style={styles.detailValue}>
              {transaction.transactionNumber || "N/A"}
            </Text>
          </View>
          {transaction.invoiceNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Invoice #</Text>
              <Text style={styles.detailValue}>
                {transaction.invoiceNumber}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={[styles.detailValue, styles.statusValue]}>
              {transaction.status || workflow.status || "N/A"}
            </Text>
          </View>
          {/* Workflow Statuses */}
          {workflow.salesStatus && workflow.salesStatus !== "PENDING" && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sales Status</Text>
              <Text style={styles.detailValue}>{workflow.salesStatus}</Text>
            </View>
          )}
          {workflow.paymentStatus && workflow.paymentStatus !== "PENDING" && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Status</Text>
              <Text style={styles.detailValue}>{workflow.paymentStatus}</Text>
            </View>
          )}
          {workflow.warehouseStatus && workflow.warehouseStatus !== "PENDING" && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Warehouse Status</Text>
              <Text style={styles.detailValue}>{workflow.warehouseStatus}</Text>
            </View>
          )}
          {/* Timeline */}
          {timeline.created && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(timeline.created)}
              </Text>
            </View>
          )}
          {timeline.sales && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sales Time</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(timeline.sales)}
              </Text>
            </View>
          )}
          {timeline.payment && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Time</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(timeline.payment)}
              </Text>
            </View>
          )}
          {timeline.release && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Release Time</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(timeline.release)}
              </Text>
            </View>
          )}
        </View>

        {/* Staff Information */}
        {(staff.salesAttendant || staff.financeAttendant || staff.warehouseStaff) && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Staff</Text>
            {staff.salesAttendant && (
              <View style={styles.staffRow}>
                <Text style={styles.staffRole}>Sales</Text>
                <Text style={styles.staffName}>{staff.salesAttendant.name}</Text>
                {staff.salesAttendant.email && (
                  <Text style={styles.staffEmail}>{staff.salesAttendant.email}</Text>
                )}
              </View>
            )}
            {staff.financeAttendant && (
              <View style={styles.staffRow}>
                <Text style={styles.staffRole}>Finance</Text>
                <Text style={styles.staffName}>{staff.financeAttendant.name}</Text>
                {staff.financeAttendant.email && (
                  <Text style={styles.staffEmail}>{staff.financeAttendant.email}</Text>
                )}
              </View>
            )}
            {staff.warehouseStaff && (
              <View style={styles.staffRow}>
                <Text style={styles.staffRole}>Warehouse</Text>
                <Text style={styles.staffName}>{staff.warehouseStaff.name}</Text>
                {staff.warehouseStaff.email && (
                  <Text style={styles.staffEmail}>{staff.warehouseStaff.email}</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Items */}
        {items.length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Items ({items.length})</Text>
            {items.map((item, index) => renderItemDetails(item))}
          </View>
        )}

        {/* Released Items */}
        {releasedItems.length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>
              Released Items ({releasedItems.length})
            </Text>
            {releasedItems.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.productName || "Item"}
                  </Text>
                  <Text style={styles.itemSku}>SKU: {item.sku || "N/A"}</Text>
                  <Text style={styles.itemDetailText}>
                    {item.quantityReleased || 0} × {formatCurrency(item.unitPrice || 0)}
                  </Text>
                  {item.releasedByName && (
                    <Text style={styles.itemReleasedBy}>
                      Released by: {item.releasedByName}
                    </Text>
                  )}
                </View>
                <Text style={styles.itemTotal}>
                  {formatCurrency(item.totalPrice || 0)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Financial Summary */}
        {(summary.subtotal > 0 || summary.totalAmount > 0) && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.subtotal || transaction.subtotal || 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.taxTotal || transaction.taxTotal || 0)}
              </Text>
            </View>
            {(summary.discountTotal || 0) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -{formatCurrency(summary.discountTotal)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(
                  summary.totalAmount || transaction.totalAmount || 0
                )}
              </Text>
            </View>
            {(summary.amountPaid || 0) > 0 && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount Paid</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(summary.amountPaid)}
                  </Text>
                </View>
                {(summary.changeAmount || 0) > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Change</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(summary.changeAmount)}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Payment Method</Text>
                  <Text style={styles.summaryValue}>
                    {summary.paymentMethod || "N/A"}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* Additional Data */}
        {(additionalData.customerName || additionalData.notes || additionalData.orderType) && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            {additionalData.customerName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer</Text>
                <Text style={styles.detailValue}>
                  {additionalData.customerName}
                </Text>
              </View>
            )}
            {additionalData.customerEmail && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer Email</Text>
                <Text style={styles.detailValue}>
                  {additionalData.customerEmail}
                </Text>
              </View>
            )}
            {additionalData.customerPhone && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer Phone</Text>
                <Text style={styles.detailValue}>
                  {additionalData.customerPhone}
                </Text>
              </View>
            )}
            {additionalData.orderType && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Type</Text>
                <Text style={styles.detailValue}>
                  {additionalData.orderType}
                </Text>
              </View>
            )}
            {additionalData.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={[styles.detailValue, styles.notesValue]}>
                  {additionalData.notes}
                </Text>
              </View>
            )}
            {additionalData.tags && additionalData.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {additionalData.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* QR Code Section */}
        <View style={styles.qrCard}>
          <Text style={styles.sectionTitle}>QR Code</Text>
          {qrCodeImage ? (
            <View style={styles.qrContainer}>
              <Image
                source={{ uri: qrCodeImage }}
                style={styles.qrImage}
                resizeMode="contain"
                onError={(error) => {
                  console.error("QR Image loading error:", error.nativeEvent);
                  // Try to fix the QR code if it failed
                  if (qrCodeImage && !qrCodeImage.startsWith("data:image")) {
                    setQrCodeImage(`data:image/png;base64,${qrCodeImage}`);
                  }
                }}
              />
              <Text style={styles.qrHint}>Scan this QR code</Text>
              {receipt.type && (
                <Text style={styles.qrType}>Type: {receipt.type}</Text>
              )}
            </View>
          ) : (
            <View style={styles.qrPlaceholder}>
              <QrCode size={64} color={Colors.gray400} />
              <Text style={styles.qrPlaceholderText}>
                QR code not available
              </Text>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={async () => {
                  try {
                    setLoading(true);
                    const transactionId = receipt.transactionId?._id || receipt.transactionId;
                    if (transactionId) {
                      await ReceiptService.generateReceipt(transactionId, receipt.type);
                      await fetchReceipt();
                      Alert.alert("Success", "QR code regenerated");
                    }
                  } catch (error) {
                    Alert.alert("Error", "Failed to regenerate QR code");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Text style={styles.regenerateButtonText}>Regenerate QR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer */}
        {store.receiptFooter && (
          <View style={styles.footerCard}>
            <Text style={styles.footerText}>{store.receiptFooter}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={handleShare}
          style={[styles.actionButton, styles.shareActionButton]}
        >
          <Share2 size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.printActionButton]}
          onPress={handlePrint}
        >
          <Printer size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Print</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.downloadActionButton]}
          onPress={handleDownload}
        >
          <Download size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.gray500,
    fontSize: Typography.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  errorText: { fontSize: Typography.lg, color: Colors.gray700 },
  closeButton: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  closeButtonText: { color: Colors.white, fontWeight: "600" },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing["4xl"] },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flex: 1 },
  headerLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  headerNumber: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  typeIcon: { fontSize: Typography.md },
  typeText: { fontSize: Typography.sm, fontWeight: "600" },
  headerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  headerDate: { fontSize: Typography.sm, color: Colors.gray500 },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: { fontSize: Typography.xs, fontWeight: "500" },
  statusPrinted: { backgroundColor: Colors.success + "20" },
  statusPrintedText: { color: Colors.success },
  statusNotPrinted: { backgroundColor: Colors.warning + "20" },
  statusNotPrintedText: { color: Colors.warning },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  storeName: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  storeDetail: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    flex: 1,
    textAlign: "right",
  },
  statusValue: { color: Colors.primary },
  notesValue: { textAlign: "left", flex: 1 },
  staffRow: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  staffRole: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    fontWeight: "600",
  },
  staffName: {
    fontSize: Typography.sm,
    color: Colors.gray900,
    fontWeight: "500",
  },
  staffEmail: { fontSize: Typography.xs, color: Colors.gray400 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  itemInfo: { flex: 1, marginRight: Spacing.sm },
  itemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  itemSku: { fontSize: Typography.xs, color: Colors.gray500 },
  itemDetails: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 2 },
  itemDetailText: { fontSize: Typography.xs, color: Colors.gray600 },
  itemTaxText: { fontSize: Typography.xs, color: Colors.warning },
  itemDiscountText: { fontSize: Typography.xs, color: Colors.success },
  itemReleasedBy: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: 1,
  },
  itemTotal: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray900,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  summaryLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  summaryValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  discountValue: { color: Colors.success },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  totalLabel: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  totalValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.primary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tagText: { fontSize: Typography.xs, color: Colors.gray700 },
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: "center",
    ...Shadows.sm,
  },
  qrContainer: { alignItems: "center" },
  qrImage: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  qrHint: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },
  qrType: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 1 },
  qrPlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  qrPlaceholderText: {
    marginTop: Spacing.sm,
    color: Colors.gray500,
    fontSize: Typography.sm,
  },
  regenerateButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  regenerateButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
  footerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadows.sm,
  },
  footerText: {
    fontSize: Typography.md,
    color: Colors.gray600,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  shareActionButton: { backgroundColor: Colors.primary },
  printActionButton: { backgroundColor: Colors.warning },
  downloadActionButton: { backgroundColor: Colors.success },
  actionButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
});