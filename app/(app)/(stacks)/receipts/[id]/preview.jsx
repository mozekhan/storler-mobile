// // screens/receipts/[id]/preview.jsx
// import React, { useState, useEffect } from 'react';
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
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { ArrowLeft, Download, Share2, Printer, QrCode } from 'lucide-react-native';
// import ReceiptService from '../../../../../services/receiptService';
// import { formatCurrency, formatDateTime } from '../../../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';

// const { width } = Dimensions.get('window');

// export default function ReceiptPreview() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [receipt, setReceipt] = useState(null);
//   const [receiptData, setReceiptData] = useState(null);
//   const [formattedText, setFormattedText] = useState('');
//   const [qrCodeImage, setQrCodeImage] = useState(null);

//   useEffect(() => {
//     fetchReceiptPreview();
//   }, [id]);

//   const fetchReceiptPreview = async () => {
//     try {
//       const data = await ReceiptService.getReceiptPreview(id);
//       setReceipt(data.receipt);
//       setReceiptData(data.receiptData);
//       setFormattedText(data.formattedText || '');
      
//       // Handle QR Code
//       if (data.receipt?.qrCode) {
//         const qr = data.receipt.qrCode;
//         if (qr.startsWith('data:image')) {
//           setQrCodeImage(qr);
//         } else if (qr.length > 100) {
//           setQrCodeImage(`data:image/png;base64,${qr}`);
//         } else {
//           setQrCodeImage(qr);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching receipt preview:', error);
//       Alert.alert('Error', 'Failed to load receipt preview');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = async () => {
//     try {
//       await ReceiptService.markAsPrinted(id);
//       Alert.alert('Success', 'Receipt marked as printed');
//       fetchReceiptPreview();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to mark receipt as printed');
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       await ReceiptService.downloadReceipt(id);
//       Alert.alert('Success', 'Receipt downloaded successfully');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to download receipt');
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: formattedText || `Receipt: ${receipt?.receiptNumber || ''}`,
//         title: 'Receipt',
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Failed to share receipt');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading receipt preview...</Text>
//       </View>
//     );
//   }

//   if (!receipt) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Receipt not found</Text>
//         <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
//           <Text style={styles.closeButtonText}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const getTypeIcon = (type) => {
//     const icons = {
//       SALES: '📄',
//       PAYMENT: '💰',
//       INVOICE: '📋',
//       FINAL: '✅',
//     };
//     return icons[type] || '📄';
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
//           <ArrowLeft size={24} color={Colors.gray700} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Receipt Preview</Text>
//         <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
//           <Share2 size={20} color={Colors.gray700} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         {formattedText ? (
//           <View style={styles.receiptCard}>
//             <Text style={styles.receiptText}>{formattedText}</Text>
//           </View>
//         ) : (
//           <View style={styles.receiptCard}>
//             <View style={styles.receiptHeader}>
//               <Text style={styles.receiptTitle}>
//                 {getTypeIcon(receipt.type)} {receipt.type} Receipt
//               </Text>
//               <Text style={styles.receiptSubtitle}>
//                 {receipt.storeId?.name || 'Store'}
//               </Text>
//               <Text style={styles.receiptNumber}>{receipt.receiptNumber}</Text>
//             </View>

//             {receiptData && (
//               <>
//                 <View style={styles.divider} />

//                 {/* Store Info */}
//                 {receiptData.store && (
//                   <View style={styles.receiptSection}>
//                     <Text style={styles.sectionTitle}>Store</Text>
//                     <Text style={styles.storeName}>{receiptData.store.name}</Text>
//                     {receiptData.store.address && (
//                       <Text style={styles.storeDetail}>{receiptData.store.address}</Text>
//                     )}
//                     {receiptData.store.phone && (
//                       <Text style={styles.storeDetail}>📞 {receiptData.store.phone}</Text>
//                     )}
//                     {receiptData.store.email && (
//                       <Text style={styles.storeDetail}>✉️ {receiptData.store.email}</Text>
//                     )}
//                   </View>
//                 )}

//                 <View style={styles.divider} />

//                 {/* Transaction Info */}
//                 <View style={styles.receiptSection}>
//                   <Text style={styles.sectionTitle}>Transaction</Text>
//                   <View style={styles.receiptRow}>
//                     <Text style={styles.receiptLabel}>Number</Text>
//                     <Text style={styles.receiptValue}>{receiptData.transaction?.number}</Text>
//                   </View>
//                   {receiptData.transaction?.invoiceNumber && (
//                     <View style={styles.receiptRow}>
//                       <Text style={styles.receiptLabel}>Invoice</Text>
//                       <Text style={styles.receiptValue}>{receiptData.transaction.invoiceNumber}</Text>
//                     </View>
//                   )}
//                   <View style={styles.receiptRow}>
//                     <Text style={styles.receiptLabel}>Date</Text>
//                     <Text style={styles.receiptValue}>
//                       {formatDateTime(receiptData.transaction?.createdAt)}
//                     </Text>
//                   </View>
//                   <View style={styles.receiptRow}>
//                     <Text style={styles.receiptLabel}>Status</Text>
//                     <Text style={[styles.receiptValue, styles.statusValue]}>
//                       {receiptData.transaction?.status}
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.divider} />

//                 {/* Items */}
//                 {receiptData.items && receiptData.items.length > 0 && (
//                   <View style={styles.receiptSection}>
//                     <Text style={styles.sectionTitle}>Items ({receiptData.items.length})</Text>
//                     {receiptData.items.map((item, index) => (
//                       <View key={index} style={styles.itemRow}>
//                         <View style={styles.itemInfo}>
//                           <Text style={styles.itemName}>{item.name}</Text>
//                           <Text style={styles.itemDetail}>
//                             {item.quantity} × {formatCurrency(item.unitPrice)}
//                           </Text>
//                           {item.sku && (
//                             <Text style={styles.itemSku}>SKU: {item.sku}</Text>
//                           )}
//                         </View>
//                         <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 )}

//                 <View style={styles.divider} />

//                 {/* Summary */}
//                 {receiptData.summary && (
//                   <View style={styles.receiptSection}>
//                     <View style={styles.summaryRow}>
//                       <Text style={styles.summaryLabel}>Subtotal</Text>
//                       <Text style={styles.summaryValue}>
//                         {formatCurrency(receiptData.summary.subtotal)}
//                       </Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                       <Text style={styles.summaryLabel}>Tax</Text>
//                       <Text style={styles.summaryValue}>
//                         {formatCurrency(receiptData.summary.taxTotal)}
//                       </Text>
//                     </View>
//                     {receiptData.summary.discountTotal > 0 && (
//                       <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Discount</Text>
//                         <Text style={[styles.summaryValue, styles.discountValue]}>
//                           -{formatCurrency(receiptData.summary.discountTotal)}
//                         </Text>
//                       </View>
//                     )}
//                     <View style={[styles.summaryRow, styles.totalRow]}>
//                       <Text style={styles.totalLabel}>Total</Text>
//                       <Text style={styles.totalValue}>
//                         {formatCurrency(receiptData.summary.totalAmount)}
//                       </Text>
//                     </View>
//                     {receiptData.summary.amountPaid > 0 && (
//                       <>
//                         <View style={styles.summaryRow}>
//                           <Text style={styles.summaryLabel}>Amount Paid</Text>
//                           <Text style={styles.summaryValue}>
//                             {formatCurrency(receiptData.summary.amountPaid)}
//                           </Text>
//                         </View>
//                         {receiptData.summary.changeAmount > 0 && (
//                           <View style={styles.summaryRow}>
//                             <Text style={styles.summaryLabel}>Change</Text>
//                             <Text style={styles.summaryValue}>
//                               {formatCurrency(receiptData.summary.changeAmount)}
//                             </Text>
//                           </View>
//                         )}
//                         <View style={styles.summaryRow}>
//                           <Text style={styles.summaryLabel}>Payment Method</Text>
//                           <Text style={styles.summaryValue}>
//                             {receiptData.summary.paymentMethod}
//                           </Text>
//                         </View>
//                       </>
//                     )}
//                   </View>
//                 )}

//                 <View style={styles.divider} />

//                 {/* Staff */}
//                 {receiptData.staff && (
//                   <View style={styles.receiptSection}>
//                     <Text style={styles.sectionTitle}>Staff</Text>
//                     {receiptData.staff.salesAttendant && (
//                       <View style={styles.staffRow}>
//                         <Text style={styles.staffRole}>Sales:</Text>
//                         <Text style={styles.staffName}>{receiptData.staff.salesAttendant.name}</Text>
//                       </View>
//                     )}
//                     {receiptData.staff.financeAttendant && (
//                       <View style={styles.staffRow}>
//                         <Text style={styles.staffRole}>Finance:</Text>
//                         <Text style={styles.staffName}>{receiptData.staff.financeAttendant.name}</Text>
//                       </View>
//                     )}
//                     {receiptData.staff.warehouseStaff && (
//                       <View style={styles.staffRow}>
//                         <Text style={styles.staffRole}>Warehouse:</Text>
//                         <Text style={styles.staffName}>{receiptData.staff.warehouseStaff.name}</Text>
//                       </View>
//                     )}
//                   </View>
//                 )}

//                 <View style={styles.divider} />

//                 {/* Timeline */}
//                 {receiptData.timeline && (
//                   <View style={styles.receiptSection}>
//                     <Text style={styles.sectionTitle}>Timeline</Text>
//                     {receiptData.timeline.created && (
//                       <View style={styles.receiptRow}>
//                         <Text style={styles.receiptLabel}>Created</Text>
//                         <Text style={styles.receiptValue}>
//                           {formatDateTime(receiptData.timeline.created)}
//                         </Text>
//                       </View>
//                     )}
//                     {receiptData.timeline.sales && (
//                       <View style={styles.receiptRow}>
//                         <Text style={styles.receiptLabel}>Sales</Text>
//                         <Text style={styles.receiptValue}>
//                           {formatDateTime(receiptData.timeline.sales)}
//                         </Text>
//                       </View>
//                     )}
//                     {receiptData.timeline.payment && (
//                       <View style={styles.receiptRow}>
//                         <Text style={styles.receiptLabel}>Payment</Text>
//                         <Text style={styles.receiptValue}>
//                           {formatDateTime(receiptData.timeline.payment)}
//                         </Text>
//                       </View>
//                     )}
//                     {receiptData.timeline.release && (
//                       <View style={styles.receiptRow}>
//                         <Text style={styles.receiptLabel}>Release</Text>
//                         <Text style={styles.receiptValue}>
//                           {formatDateTime(receiptData.timeline.release)}
//                         </Text>
//                       </View>
//                     )}
//                     {receiptData.timeline.completed && (
//                       <View style={styles.receiptRow}>
//                         <Text style={styles.receiptLabel}>Completed</Text>
//                         <Text style={styles.receiptValue}>
//                           {formatDateTime(receiptData.timeline.completed)}
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 )}
//               </>
//             )}

//             <View style={styles.divider} />

//             {/* QR Code Section - FIXED */}
//             <View style={styles.qrSection}>
//               <Text style={styles.qrTitle}>Scan QR Code</Text>
//               {qrCodeImage ? (
//                 <View style={styles.qrContainer}>
//                   <Image
//                     source={{ 
//                       uri: qrCodeImage,
//                       cache: 'reload'
//                     }}
//                     style={styles.qrImage}
//                     resizeMode="contain"
//                     onError={(error) => {
//                       console.error('QR Image loading error:', error.nativeEvent);
//                       // Try to fix by adding data URL prefix
//                       if (qrCodeImage && !qrCodeImage.startsWith('data:image')) {
//                         setQrCodeImage(`data:image/png;base64,${qrCodeImage}`);
//                       }
//                     }}
//                   />
//                   <Text style={styles.qrHint}>
//                     {receipt.type === 'SALES' ? 'Scan for payment' :
//                      receipt.type === 'PAYMENT' ? 'Scan for warehouse' :
//                      'Scan for invoice'}
//                   </Text>
//                   {receipt.qrPayload?.step && (
//                     <Text style={styles.qrStep}>Step: {receipt.qrPayload.step}</Text>
//                   )}
//                 </View>
//               ) : (
//                 <View style={styles.qrPlaceholder}>
//                   <QrCode size={64} color={Colors.gray400} />
//                   <Text style={styles.qrPlaceholderText}>QR code not available</Text>
//                   <TouchableOpacity 
//                     style={styles.regenerateButton}
//                     onPress={async () => {
//                       try {
//                         setLoading(true);
//                         const result = await ReceiptService.generateReceipt(
//                           receipt.transactionId._id,
//                           receipt.type
//                         );
//                         await fetchReceiptPreview();
//                         Alert.alert('Success', 'QR code regenerated');
//                       } catch (error) {
//                         Alert.alert('Error', 'Failed to regenerate QR code');
//                       } finally {
//                         setLoading(false);
//                       }
//                     }}
//                   >
//                     <Text style={styles.regenerateButtonText}>Regenerate QR</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             <View style={styles.divider} />

//             {/* Footer */}
//             <View style={styles.footerSection}>
//               <Text style={styles.footerText}>
//                 {receiptData?.store?.receiptFooter || 'Thank you for your business!'}
//               </Text>
//               <Text style={styles.footerSubtext}>
//                 Printed: {receipt.printed ? 'Yes' : 'No'}
//                 {receipt.printCount > 0 && ` (${receipt.printCount}x)`}
//               </Text>
//             </View>
//           </View>
//         )}
//       </ScrollView>

//       {/* Action Buttons */}
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.shareActionButton]}
//           onPress={handleShare}
//         >
//           <Share2 size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Share</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.downloadActionButton]}
//           onPress={handleDownload}
//         >
//           <Download size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Download</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.printActionButton]}
//           onPress={handlePrint}
//         >
//           <Printer size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Print</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
//   loadingText: { marginTop: Spacing.md, color: Colors.gray500, fontSize: Typography.md },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
//   errorText: { fontSize: Typography.lg, color: Colors.gray700 },
//   closeButton: { marginTop: Spacing.md, padding: Spacing.md, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg },
//   closeButtonText: { color: Colors.white, fontWeight: '600' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     backgroundColor: Colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   headerButton: { padding: Spacing.sm },
//   headerTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900 },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: Spacing.md, paddingBottom: Spacing['4xl'] },
//   receiptCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing['2xl'],
//     ...Shadows.md,
//   },
//   receiptText: {
//     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
//     fontSize: Typography.sm,
//     lineHeight: 20,
//     color: Colors.gray900,
//   },
//   receiptHeader: { alignItems: 'center', marginBottom: Spacing.md },
//   receiptTitle: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
//   receiptSubtitle: { fontSize: Typography.md, color: Colors.gray500, marginTop: 2 },
//   receiptNumber: { fontSize: Typography.sm, color: Colors.gray400, marginTop: 2 },
//   divider: { borderTopWidth: 1, borderTopColor: Colors.gray200, marginVertical: Spacing.md },
//   receiptSection: { marginBottom: Spacing.sm },
//   sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.xs },
//   storeName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   storeDetail: { fontSize: Typography.xs, color: Colors.gray500, marginTop: 1 },
//   receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
//   receiptLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   receiptValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   statusValue: { color: Colors.primary },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.gray50 },
//   itemInfo: { flex: 1, marginRight: Spacing.sm },
//   itemName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
//   itemSku: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 1 },
//   itemTotal: { fontSize: Typography.sm, fontWeight: '600', color: Colors.gray900 },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
//   summaryLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   summaryValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   discountValue: { color: Colors.success },
//   totalRow: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
//   totalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
//   totalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
//   staffRow: { flexDirection: 'row', paddingVertical: 2 },
//   staffRole: { fontSize: Typography.sm, color: Colors.gray600, width: 80 },
//   staffName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900, flex: 1 },
//   qrSection: { alignItems: 'center', marginVertical: Spacing.sm },
//   qrTitle: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray600, marginBottom: Spacing.sm },
//   qrContainer: { alignItems: 'center' },
//   qrImage: { 
//     width: width * 0.4, 
//     height: width * 0.4, 
//     backgroundColor: Colors.white, 
//     borderRadius: BorderRadius.lg,
//     borderWidth: 1,
//     borderColor: Colors.gray200,
//   },
//   qrHint: { fontSize: Typography.xs, color: Colors.gray500, marginTop: Spacing.sm },
//   qrStep: { fontSize: Typography.xs, color: Colors.primary, marginTop: 2 },
//   qrPlaceholder: {
//     width: width * 0.4,
//     height: width * 0.4,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   qrPlaceholderText: { marginTop: Spacing.sm, color: Colors.gray500, fontSize: Typography.sm },
//   regenerateButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//   },
//   regenerateButtonText: { color: Colors.white, fontWeight: '600', fontSize: Typography.sm },
//   footerSection: { alignItems: 'center' },
//   footerText: { fontSize: Typography.md, color: Colors.gray600, textAlign: 'center' },
//   footerSubtext: { fontSize: Typography.xs, color: Colors.gray400, marginTop: Spacing.xs },
//   actionsContainer: {
//     flexDirection: 'row',
//     padding: Spacing.md,
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     gap: Spacing.sm,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     gap: 4,
//   },
//   shareActionButton: { backgroundColor: Colors.primary },
//   downloadActionButton: { backgroundColor: Colors.success },
//   printActionButton: { backgroundColor: Colors.warning },
//   actionButtonText: { color: Colors.white, fontWeight: '600', fontSize: Typography.sm },
// });






























// receipt-preview.jsx (Updated)
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2, Download, Printer, QrCode } from 'lucide-react-native';
import TransactionService from '../../../../../services/transactionService';
import ReceiptService from '../../../../../services/receiptService';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';
import { formatCurrency, formatDateTime } from '../../../../../utils/formatters';
import CustomHeader from '../../../../../components/ui/CustomHeader';
import BluetoothPrinterModal from '../../../../../components/print/BluetoothPrinterModal';
import { usePrinter } from '../../../../../hooks/usePrinter';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const { width } = Dimensions.get('window');

export default function ReceiptPreview() {
  const router = useRouter();
  const { 
    transactionId, 
    qrData, 
    qrType, 
    transactionNumber, 
    invoiceNumber,
    mode 
  } = useLocalSearchParams();
  
  const viewShotRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [qrCode, setQrCode] = useState(qrData || null);
  const [receiptData, setReceiptData] = useState(null);
  const [receipt, setReceipt] = useState(null);

  // Use the printer hook
  const {
    printerModalVisible,
    printReceiptData,
    openPrintModal,
    closePrintModal,
    handlePrintComplete,
    setPrinterModalVisible,
  } = usePrinter();

  useEffect(() => {
    if (transactionId) {
      fetchReceipt();
    }
  }, [transactionId]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      
      const result = await TransactionService.getTransaction(transactionId);
      setTransaction(result);
      
      if (result.receiptData) {
        setReceiptData(result.receiptData);
      }
      
      // Determine QR code
      if (qrData) {
        setQrCode(qrData);
      } else if (qrType === 'SALES' && result.salesQR) {
        setQrCode(result.salesQR);
      } else if (qrType === 'PAYMENT' && result.paymentQR) {
        setQrCode(result.paymentQR);
      } else if (qrType === 'RELEASE' && result.releaseQR) {
        setQrCode(result.releaseQR);
      } else if (qrType === 'INVOICE' && result.invoiceQR) {
        setQrCode(result.invoiceQR);
      } else if (result.salesQR) {
        setQrCode(result.salesQR);
      }
      
      try {
        const receiptRecord = await ReceiptService.getReceiptsByTransaction(transactionId);
        if (receiptRecord && receiptRecord.length > 0) {
          const found = receiptRecord.find(r => r.type === qrType) || receiptRecord[0];
          setReceipt(found);
        }
      } catch (e) {
        console.log('No receipt record found');
      }
      
    } catch (error) {
      console.error('Error fetching receipt:', error);
      Alert.alert('Error', 'Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: getShareMessage(),
        title: 'Receipt',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share receipt');
    }
  };

  const getShareMessage = () => {
    const t = transaction || {};
    const data = receiptData || {};
    const store = data.store || {};
    const summary = data.summary || {};
    
    return `
${store.name || 'Store'}
${store.address || ''}
${store.phone ? `Tel: ${store.phone}` : ''}
${store.email ? `Email: ${store.email}` : ''}
${'─'.repeat(40)}
${qrType || 'SALES'} RECEIPT
${'─'.repeat(40)}
Transaction: ${t.transactionNumber || transactionNumber || 'N/A'}
${t.finalInvoiceNumber ? `Invoice: ${t.finalInvoiceNumber}` : ''}
Date: ${formatDateTime(t.createdAt)}
Status: ${t.status || 'N/A'}
${'─'.repeat(40)}
ITEMS
${'─'.repeat(40)}
${formatItemsForShare(data.items || [])}
${'─'.repeat(40)}
Subtotal: ${formatCurrency(summary.subtotal || t.subtotal || 0)}
Tax: ${formatCurrency(summary.taxTotal || t.taxTotal || 0)}
TOTAL: ${formatCurrency(summary.totalAmount || t.totalAmount || 0)}
${'─'.repeat(40)}
${summary.paymentMethod ? `Payment: ${summary.paymentMethod}` : ''}
${summary.amountPaid ? `Amount Paid: ${formatCurrency(summary.amountPaid)}` : ''}
${summary.changeAmount ? `Change: ${formatCurrency(summary.changeAmount)}` : ''}
${'─'.repeat(40)}
Thank you for your business!
    `.trim();
  };

  const formatItemsForShare = (items) => {
    if (!items || items.length === 0) return 'No items';
    return items.map(item => {
      const name = item.name || 'Item';
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const total = item.totalPrice || (qty * price);
      return `${name.substring(0, 25)}  ${qty} × ${formatCurrency(price)} = ${formatCurrency(total)}`;
    }).join('\n');
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      
      const response = await ReceiptService.generateReceipt(transactionId, qrType);
      
      if (response && response.downloadUrl) {
        const fileUri = FileSystem.documentDirectory + `receipt_${transactionNumber || Date.now()}.pdf`;
        const downloadResult = await FileSystem.downloadAsync(
          response.downloadUrl,
          fileUri
        );
        
        if (downloadResult.status === 200) {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            Alert.alert('Download Complete', `Receipt saved to ${fileUri}`);
          }
        }
      } else {
        // Fallback: Capture view as image
        if (viewShotRef.current) {
          const uri = await viewShotRef.current.capture();
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
          }
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download receipt');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const t = transaction || {};
    const data = receiptData || {};
    const store = data.store || {};
    const summary = data.summary || {};
    const items = data.items || t?.items || [];

    // Prepare receipt data for printing
    const printData = {
      store: {
        name: store.name || t?.storeId?.name || 'Store',
        address: store.address || '',
        phone: store.phone || '',
        email: store.email || '',
      },
      transaction: {
        number: t?.transactionNumber || transactionNumber || 'N/A',
        createdAt: t?.createdAt || new Date(),
        status: t?.status || 'N/A',
      },
      items: items.map(item => ({
        name: item.name || item.productId?.name || 'Item',
        sku: item.sku || item.productId?.sku || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        totalPrice: item.totalPrice || (item.quantity || 0) * (item.unitPrice || 0),
        taxAmount: item.taxAmount || 0,
      })),
      summary: {
        subtotal: summary.subtotal || t?.subtotal || 0,
        taxTotal: summary.taxTotal || t?.taxTotal || 0,
        discountTotal: summary.discountTotal || 0,
        totalAmount: summary.totalAmount || t?.totalAmount || 0,
        amountPaid: summary.amountPaid || t?.amountPaid || 0,
        changeAmount: summary.changeAmount || t?.changeAmount || 0,
        paymentMethod: summary.paymentMethod || t?.paymentMethod || '',
      },
      payment: {
        method: t?.paymentMethod || '',
        reference: t?.paymentReference || '',
      },
      invoice: {
        number: t?.finalInvoiceNumber || '',
      },
      qrCode: qrCode,
    };

    // Add staff info if available
    if (data.staff) {
      printData.staff = data.staff;
    }

    openPrintModal(printData, qrType || 'SALES');
  };

  const getQRTypeLabel = () => {
    const labels = {
      'SALES': 'Sales QR - Scan for Payment',
      'PAYMENT': 'Payment QR - Scan for Warehouse Release',
      'RELEASE': 'Release QR - Scan for Invoice',
      'INVOICE': 'Invoice QR - Scan to Complete',
      'FINAL': 'Final Receipt'
    };
    return labels[qrType] || 'QR Code';
  };

  const getQRTypeColor = () => {
    const colors = {
      'SALES': Colors.primary,
      'PAYMENT': Colors.success,
      'RELEASE': Colors.warning,
      'INVOICE': Colors.primary,
      'FINAL': Colors.success,
    };
    return colors[qrType] || Colors.primary;
  };

  const getReceiptTitle = () => {
    const titles = {
      'SALES': 'Sales Receipt',
      'PAYMENT': 'Payment Receipt',
      'RELEASE': 'Release Receipt',
      'INVOICE': 'Final Invoice',
      'FINAL': 'Final Receipt'
    };
    return titles[qrType] || 'Receipt';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Receipt not found</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const t = transaction;
  const data = receiptData || {};
  const store = data.store || {};
  const summary = data.summary || {};
  const items = data.items || t?.items || [];
  const staff = data.staff || {};
  const releasedItems = data.releasedItems || t?.itemsReleased || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getReceiptTitle()}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ViewShot 
          ref={viewShotRef}
          style={styles.receiptCard}
          options={{ format: 'png', quality: 0.9 }}
        >
          {/* Header */}
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>{getReceiptTitle()}</Text>
            <Text style={styles.receiptSubtitle}>{store.name || 'Store'}</Text>
            {store.address && (
              <Text style={styles.receiptDetail}>{store.address}</Text>
            )}
            {store.phone && (
              <Text style={styles.receiptDetail}>📞 {store.phone}</Text>
            )}
            {store.email && (
              <Text style={styles.receiptDetail}>✉️ {store.email}</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Transaction Info */}
          <View style={styles.receiptSection}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction</Text>
              <Text style={styles.receiptValue}>{t.transactionNumber || transactionNumber}</Text>
            </View>
            {t.finalInvoiceNumber && (
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Invoice #</Text>
                <Text style={[styles.receiptValue, styles.invoiceText]}>{t.finalInvoiceNumber}</Text>
              </View>
            )}
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date</Text>
              <Text style={styles.receiptValue}>{formatDateTime(t.createdAt)}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <Text style={[styles.receiptValue, styles.statusText]}>
                {t.status || 'N/A'}
              </Text>
            </View>
            {t.paymentMethod && (
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment Method</Text>
                <Text style={styles.receiptValue}>{t.paymentMethod}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Items */}
          {items && items.length > 0 && (
            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Items ({items.length})</Text>
              {items.map((item, index) => {
                const product = item.productId || item;
                const itemName = item.name || product?.name || 'Item';
                const qty = item.quantity || 0;
                const unitPrice = item.unitPrice || 0;
                const total = item.totalPrice || (qty * unitPrice);
                const isReleased = item.isReleased || false;
                
                return (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {itemName}
                      </Text>
                      <Text style={styles.itemDetail}>
                        Qty: {qty} × {formatCurrency(unitPrice)}
                      </Text>
                      {item.sku && (
                        <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                      )}
                      {isReleased && (
                        <Text style={styles.itemReleased}>✓ Released</Text>
                      )}
                    </View>
                    <Text style={styles.itemTotal}>{formatCurrency(total)}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Released Items */}
          {releasedItems && releasedItems.length > 0 && (
            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Released Items ({releasedItems.length})</Text>
              {releasedItems.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>
                      {item.productName || 'Item'}
                    </Text>
                    <Text style={styles.itemDetail}>
                      Qty: {item.quantityReleased || 0} × {formatCurrency(item.unitPrice || 0)}
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

          <View style={styles.divider} />

          {/* Staff */}
          {(staff.salesAttendant || staff.financeAttendant || staff.warehouseStaff) && (
            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Staff</Text>
              {staff.salesAttendant && (
                <View style={styles.staffRow}>
                  <Text style={styles.staffRole}>Sales:</Text>
                  <Text style={styles.staffName}>{staff.salesAttendant.name}</Text>
                </View>
              )}
              {staff.financeAttendant && (
                <View style={styles.staffRow}>
                  <Text style={styles.staffRole}>Finance:</Text>
                  <Text style={styles.staffName}>{staff.financeAttendant.name}</Text>
                </View>
              )}
              {staff.warehouseStaff && (
                <View style={styles.staffRow}>
                  <Text style={styles.staffRole}>Warehouse:</Text>
                  <Text style={styles.staffName}>{staff.warehouseStaff.name}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.divider} />

          {/* Totals */}
          <View style={styles.receiptSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(summary.subtotal || t.subtotal || 0)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(summary.taxTotal || t.taxTotal || 0)}
              </Text>
            </View>
            {summary.discountTotal > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={[styles.totalValue, styles.discountValue]}>
                  -{formatCurrency(summary.discountTotal)}
                </Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatCurrency(summary.totalAmount || t.totalAmount || 0)}
              </Text>
            </View>
            {summary.amountPaid > 0 && (
              <>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Amount Paid</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(summary.amountPaid || t.amountPaid || 0)}
                  </Text>
                </View>
                {summary.changeAmount > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Change</Text>
                    <Text style={[styles.totalValue, styles.changeText]}>
                      {formatCurrency(summary.changeAmount || t.changeAmount || 0)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.divider} />

          {/* QR Code */}
          <View style={[styles.qrSection, { borderColor: getQRTypeColor() }]}>
            <Text style={[styles.qrTitle, { color: getQRTypeColor() }]}>
              {getQRTypeLabel()}
            </Text>
            {qrCode ? (
              <View style={styles.qrContainer}>
                <Image 
                  source={{ uri: qrCode }}
                  style={styles.qrImage}
                  resizeMode="contain"
                  onError={(error) => {
                    console.error('QR Image loading error:', error);
                    setQrCode(null);
                  }}
                />
                <Text style={styles.qrHint}>
                  {qrType === 'SALES' && 'Scan to process payment'}
                  {qrType === 'PAYMENT' && 'Scan to release items from warehouse'}
                  {qrType === 'RELEASE' && 'Scan to view invoice'}
                  {qrType === 'INVOICE' && 'Scan to complete transaction'}
                </Text>
              </View>
            ) : (
              <View style={styles.qrPlaceholder}>
                <QrCode size={64} color={Colors.gray400} />
                <Text style={styles.qrPlaceholderText}>QR code not available</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.receiptFooter}>
            <Text style={styles.footerText}>
              {store.receiptFooter || 'Thank you for your business!'}
            </Text>
            {receipt && receipt.printed && (
              <Text style={styles.footerSubtext}>
                Printed: {formatDateTime(receipt.printedAt)} (×{receipt.printCount || 1})
              </Text>
            )}
          </View>
        </ViewShot>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.shareButton]} 
          onPress={handleShare}
        >
          <Share2 size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.downloadButton]} 
          onPress={handleDownloadPDF}
        >
          <Download size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.printButton]} 
          onPress={handlePrint}
        >
          <Printer size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Print</Text>
        </TouchableOpacity>
      </View>

      {/* Bluetooth Printer Modal */}
      <BluetoothPrinterModal
        visible={printerModalVisible}
        onClose={closePrintModal}
        receiptData={printReceiptData}
        receiptType={qrType || 'SALES'}
        onPrintComplete={() => {
          handlePrintComplete();
          fetchReceipt();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.gray500,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  errorText: {
    fontSize: Typography.lg,
    color: Colors.gray700,
  },
  closeButton: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  closeButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.gray900,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing['4xl'],
  },
  receiptCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    ...Shadows.md,
  },
  receiptHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
  },
  receiptTitle: {
    fontSize: Typography['2xl'],
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  receiptSubtitle: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray700,
    marginTop: Spacing.xs,
  },
  receiptDetail: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: 2,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    marginVertical: Spacing.md,
  },
  receiptSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  receiptValue: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  statusText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  invoiceText: {
    color: Colors.success,
    fontWeight: '600',
  },
  changeText: {
    color: Colors.success,
  },
  discountValue: {
    color: Colors.success,
  },
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 2,
  },
  staffRole: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    width: 80,
  },
  staffName: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  staffEmail: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginLeft: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemName: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  itemDetail: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  itemSku: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  itemReleased: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: '500',
  },
  itemReleasedBy: {
    fontSize: Typography.xs,
    color: Colors.primary,
  },
  itemTotal: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.gray900,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  totalValue: {
    fontSize: Typography.sm,
    color: Colors.gray900,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  grandTotalLabel: {
    fontSize: Typography.md,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  grandTotalValue: {
    fontSize: Typography.md,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  qrSection: {
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
  },
  qrTitle: {
    fontSize: Typography.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrImage: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
  },
  qrHint: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },
  qrPlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholderText: {
    marginTop: Spacing.sm,
    color: Colors.gray500,
    fontSize: Typography.sm,
  },
  receiptFooter: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.md,
    color: Colors.gray600,
  },
  footerSubtext: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginHorizontal: 4,
  },
  shareButton: {
    backgroundColor: Colors.primary,
  },
  downloadButton: {
    backgroundColor: Colors.success,
  },
  printButton: {
    backgroundColor: Colors.warning,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});