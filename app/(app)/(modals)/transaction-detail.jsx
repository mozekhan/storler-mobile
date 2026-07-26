// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { 
//   Printer, 
//   Share2, 
//   Download, 
//   ArrowLeft, 
//   QrCode, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   ShoppingBag,
//   CreditCard,
//   Package,
//   Truck,
//   User,
//   Store,
//   Calendar,
//   DollarSign,
//   List,
//   FileText
// } from 'lucide-react-native';
// import TransactionService from '../../../services/transactionService';
// import ReceiptService from '../../../services/receiptService';
// import { formatCurrency, formatDateTime } from '../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
// import CustomHeader from '../../../components/ui/CustomHeader';

// export default function TransactionDetail() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [transaction, setTransaction] = useState(null);
//   const [receipts, setReceipts] = useState([]);
//   const [qrStatus, setQrStatus] = useState(null);

//   useEffect(() => {
//     fetchTransaction();
//   }, [id]);

//   const fetchTransaction = async () => {
//     try {
//       setLoading(true);
      
//       // Get transaction with full details
//       const data = await TransactionService.getTransaction(id);
//       setTransaction(data);
      
//       // Get QR status
//       try {
//         const qrs = await TransactionService.getTransactionQRs(id);
//         setQrStatus(qrs);
//       } catch (e) {
//         console.log('QR status not available');
//       }
      
//       // Get receipts for this transaction
//       try {
//         const receiptData = await ReceiptService.getReceiptsByTransaction(id);
//         if (receiptData && receiptData.length > 0) {
//           setReceipts(receiptData);
//         }
//       } catch (e) {
//         console.log('No receipts found');
//       }
      
//     } catch (error) {
//       console.error('Error fetching transaction:', error);
//       Alert.alert('Error', 'Failed to load transaction details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusStyles = (status) => {
//     const stylesMap = {
//       'PENDING': { container: styles.statusPending, text: styles.statusPendingText, icon: Clock },
//       'SALES_QR': { container: styles.statusSalesQR, text: styles.statusSalesQRText, icon: QrCode },
//       'PAID': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText, icon: CreditCard },
//       'PAYMENT_QR': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText, icon: CreditCard },
//       'RELEASED': { container: styles.statusReleaseQR, text: styles.statusReleaseQRText, icon: Package },
//       'RELEASE_QR': { container: styles.statusReleaseQR, text: styles.statusReleaseQRText, icon: Package },
//       'INVOICE_QR': { container: styles.statusInvoiceQR, text: styles.statusInvoiceQRText, icon: Truck },
//       'COMPLETED': { container: styles.statusCompleted, text: styles.statusCompletedText, icon: CheckCircle },
//       'CANCELLED': { container: styles.statusCancelled, text: styles.statusCancelledText, icon: XCircle },
//       'REFUNDED': { container: styles.statusCancelled, text: styles.statusCancelledText, icon: XCircle },
//     };
//     return stylesMap[status] || { container: styles.statusDefault, text: styles.statusDefaultText, icon: Clock };
//   };

//   const getWorkflowSteps = () => {
//     if (!transaction) return [];
    
//     const steps = [
//       { 
//         key: 'sales', 
//         label: 'Sales QR', 
//         icon: QrCode,
//         generated: !!transaction.salesQR,
//         scanned: transaction.qrStatus?.salesQRScanned || false,
//         timestamp: transaction.salesQRGeneratedAt,
//       },
//       { 
//         key: 'payment', 
//         label: 'Payment QR', 
//         icon: CreditCard,
//         generated: !!transaction.paymentQR,
//         scanned: transaction.qrStatus?.paymentQRScanned || false,
//         timestamp: transaction.paymentQRGeneratedAt,
//       },
//       { 
//         key: 'release', 
//         label: 'Release QR', 
//         icon: Package,
//         generated: !!transaction.releaseQR,
//         scanned: transaction.qrStatus?.releaseQRScanned || false,
//         timestamp: transaction.releaseQRGeneratedAt,
//       },
//       { 
//         key: 'invoice', 
//         label: 'Invoice QR', 
//         icon: Truck,
//         generated: !!transaction.invoiceQR,
//         scanned: transaction.qrStatus?.invoiceQRScanned || false,
//         timestamp: transaction.invoiceQRGeneratedAt,
//       },
//     ];
//     return steps;
//   };

//   const navigateToReceipt = (type) => {
//     router.push({
//       pathname: '/(app)/(modals)/receipt-preview',
//       params: {
//         transactionId: id,
//         qrType: type,
//         transactionNumber: transaction?.transactionNumber,
//       },
//     });
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   if (!transaction) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Transaction not found</Text>
//         <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
//           <Text style={styles.closeButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const t = transaction;
//   const statusStyles = getStatusStyles(t.status);
//   const StatusIcon = statusStyles.icon;
//   const workflowSteps = getWorkflowSteps();
//   const items = t.items || [];
//   const releasedItems = t.itemsReleased || [];
//   const store = t.storeId || {};

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <CustomHeader title="Transaction Details" />
      
//       {/* Header Card */}
//       <View style={styles.headerCard}>
//         <View style={styles.headerRow}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.headerLabel}>Transaction Number</Text>
//             <Text style={styles.headerNumber}>{t.transactionNumber}</Text>
//           </View>
//           <View style={[styles.statusBadge, statusStyles.container]}>
//             <StatusIcon size={14} color={statusStyles.text.color} />
//             <Text style={[styles.statusText, statusStyles.text]}>{t.status}</Text>
//           </View>
//         </View>
//         <View style={styles.headerMeta}>
//           <View style={styles.headerMetaItem}>
//             <Calendar size={14} color={Colors.gray500} />
//             <Text style={styles.headerMetaText}>{formatDateTime(t.createdAt)}</Text>
//           </View>
//           {store.name && (
//             <View style={styles.headerMetaItem}>
//               <Store size={14} color={Colors.gray500} />
//               <Text style={styles.headerMetaText}>{store.name}</Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Quick Stats */}
//       <View style={styles.statsGrid}>
//         <View style={styles.statItem}>
//           <List size={20} color={Colors.primary} />
//           <Text style={styles.statNumber}>{items.length}</Text>
//           <Text style={styles.statLabel}>Items</Text>
//         </View>
//         <View style={styles.statItem}>
//           <DollarSign size={20} color={Colors.success} />
//           <Text style={styles.statNumber}>{formatCurrency(t.totalAmount || 0)}</Text>
//           <Text style={styles.statLabel}>Total</Text>
//         </View>
//         {t.paymentMethod && (
//           <View style={styles.statItem}>
//             <CreditCard size={20} color={Colors.warning} />
//             <Text style={styles.statNumber}>{t.paymentMethod}</Text>
//             <Text style={styles.statLabel}>Payment</Text>
//           </View>
//         )}
//       </View>

//       {/* Workflow Progress */}
//       <View style={styles.workflowCard}>
//         <Text style={styles.sectionTitle}>Transaction Progress</Text>
//         <View style={styles.workflowContainer}>
//           {workflowSteps.map((step, index) => {
//             const isActive = step.generated;
//             const isCompleted = step.scanned;
//             const isLast = index === workflowSteps.length - 1;

//             return (
//               <View key={step.key} style={styles.workflowStep}>
//                 <View style={styles.workflowStepRow}>
//                   <View style={[
//                     styles.workflowDot,
//                     isCompleted && styles.workflowDotCompleted,
//                     isActive && !isCompleted && styles.workflowDotActive,
//                     !isActive && styles.workflowDotPending,
//                   ]}>
//                     <step.icon size={14} color={isCompleted ? Colors.white : isActive ? Colors.primary : Colors.gray400} />
//                   </View>
//                   <View style={styles.workflowStepInfo}>
//                     <Text style={[
//                       styles.workflowStepLabel,
//                       isCompleted && styles.workflowStepCompleted,
//                       isActive && !isCompleted && styles.workflowStepActive,
//                       !isActive && styles.workflowStepPending,
//                     ]}>
//                       {step.label}
//                     </Text>
//                     <Text style={styles.workflowStepStatus}>
//                       {isCompleted ? '✅ Scanned' : 
//                        isActive ? '📷 Generated' : 
//                        '⏳ Pending'}
//                     </Text>
//                   </View>
//                   {!isLast && (
//                     <View style={[
//                       styles.workflowLine,
//                       isCompleted && styles.workflowLineCompleted,
//                       isActive && !isCompleted && styles.workflowLineActive,
//                     ]} />
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </View>

//       {/* Items */}
//       <View style={styles.itemsCard}>
//         <View style={styles.cardHeader}>
//           <Text style={styles.sectionTitle}>Items ({items.length})</Text>
//           {items.length > 3 && (
//             <TouchableOpacity onPress={() => Alert.alert('Items', `Total items: ${items.length}`)}>
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         {items.slice(0, 3).map((item, index) => {
//           const product = item.productId || item;
//           const itemName = item.name || product?.name || 'Item';
//           const qty = item.quantity || 0;
//           const unitPrice = item.unitPrice || 0;
//           const total = item.totalPrice || (qty * unitPrice);
          
//           return (
//             <View key={index} style={styles.itemRow}>
//               <View style={styles.itemInfo}>
//                 <Text style={styles.itemName} numberOfLines={1}>{itemName}</Text>
//                 <Text style={styles.itemDetail}>
//                   Qty: {qty} × {formatCurrency(unitPrice)}
//                 </Text>
//                 {item.sku && (
//                   <Text style={styles.itemSku}>SKU: {item.sku}</Text>
//                 )}
//               </View>
//               <Text style={styles.itemTotal}>{formatCurrency(total)}</Text>
//             </View>
//           );
//         })}
//         {items.length > 3 && (
//           <TouchableOpacity style={styles.viewMoreButton}>
//             <Text style={styles.viewMoreText}>+ {items.length - 3} more items</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Released Items */}
//       {releasedItems.length > 0 && (
//         <View style={styles.releaseCard}>
//           <Text style={styles.sectionTitle}>Released Items ({releasedItems.length})</Text>
//           {releasedItems.slice(0, 3).map((item, index) => (
//             <View key={index} style={styles.releaseRow}>
//               <Text style={styles.releaseName}>{item.productName || 'Item'}</Text>
//               <Text style={styles.releaseQty}>×{item.quantityReleased || 0}</Text>
//               <Text style={styles.releaseTotal}>{formatCurrency(item.totalPrice || 0)}</Text>
//             </View>
//           ))}
//           {t.finalInvoiceNumber && (
//             <View style={styles.invoiceRow}>
//               <Text style={styles.invoiceLabel}>Invoice #</Text>
//               <Text style={styles.invoiceValue}>{t.finalInvoiceNumber}</Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Staff */}
//       <View style={styles.staffCard}>
//         <Text style={styles.sectionTitle}>Staff</Text>
//         {t.salesAttendantId && (
//           <View style={styles.staffRow}>
//             <View style={styles.staffIconContainer}>
//               <User size={16} color={Colors.primary} />
//             </View>
//             <View style={styles.staffInfo}>
//               <Text style={styles.staffLabel}>Sales Attendant</Text>
//               <Text style={styles.staffName}>
//                 {t.salesAttendantId.firstName} {t.salesAttendantId.lastName}
//               </Text>
//             </View>
//           </View>
//         )}
//         {t.financeAttendantId && (
//           <View style={styles.staffRow}>
//             <View style={styles.staffIconContainer}>
//               <CreditCard size={16} color={Colors.success} />
//             </View>
//             <View style={styles.staffInfo}>
//               <Text style={styles.staffLabel}>Finance Attendant</Text>
//               <Text style={styles.staffName}>
//                 {t.financeAttendantId.firstName} {t.financeAttendantId.lastName}
//               </Text>
//             </View>
//           </View>
//         )}
//         {t.warehouseStaffId && (
//           <View style={styles.staffRow}>
//             <View style={styles.staffIconContainer}>
//               <Package size={16} color={Colors.warning} />
//             </View>
//             <View style={styles.staffInfo}>
//               <Text style={styles.staffLabel}>Warehouse Staff</Text>
//               <Text style={styles.staffName}>
//                 {t.warehouseStaffId.firstName} {t.warehouseStaffId.lastName}
//               </Text>
//             </View>
//           </View>
//         )}
//       </View>

//       {/* Payment Details */}
//       {t.paymentMethod && (
//         <View style={styles.paymentCard}>
//           <Text style={styles.sectionTitle}>Payment</Text>
//           <View style={styles.paymentGrid}>
//             <View style={styles.paymentItem}>
//               <Text style={styles.paymentLabel}>Method</Text>
//               <Text style={styles.paymentValue}>{t.paymentMethod}</Text>
//             </View>
//             <View style={styles.paymentItem}>
//               <Text style={styles.paymentLabel}>Amount Paid</Text>
//               <Text style={styles.paymentValue}>{formatCurrency(t.amountPaid || 0)}</Text>
//             </View>
//             {t.changeAmount > 0 && (
//               <View style={styles.paymentItem}>
//                 <Text style={styles.paymentLabel}>Change</Text>
//                 <Text style={[styles.paymentValue, styles.changeText]}>{formatCurrency(t.changeAmount)}</Text>
//               </View>
//             )}
//             {t.paymentTimestamp && (
//               <View style={styles.paymentItem}>
//                 <Text style={styles.paymentLabel}>Payment Time</Text>
//                 <Text style={styles.paymentValue}>{formatDateTime(t.paymentTimestamp)}</Text>
//               </View>
//             )}
//           </View>
//         </View>
//       )}

//       {/* Receipts */}
//       {receipts.length > 0 && (
//         <View style={styles.receiptsCard}>
//           <Text style={styles.sectionTitle}>Receipts ({receipts.length})</Text>
//           {receipts.map((receipt, index) => (
//             <TouchableOpacity 
//               key={index}
//               style={styles.receiptItem}
//               onPress={() => navigateToReceipt(receipt.type)}
//             >
//               <View style={styles.receiptItemLeft}>
//                 <FileText size={20} color={Colors.primary} />
//                 <View>
//                   <Text style={styles.receiptItemType}>{receipt.type}</Text>
//                   <Text style={styles.receiptItemNumber}>{receipt.receiptNumber}</Text>
//                 </View>
//               </View>
//               <View style={styles.receiptItemRight}>
//                 <View style={[
//                   styles.receiptStatusBadge,
//                   receipt.printed ? styles.receiptPrinted : styles.receiptNotPrinted
//                 ]}>
//                   <Text style={[
//                     styles.receiptStatusText,
//                     receipt.printed ? styles.receiptPrintedText : styles.receiptNotPrintedText
//                   ]}>
//                     {receipt.printed ? 'Printed' : 'Not Printed'}
//                   </Text>
//                 </View>
//                 {receipt.qrCode && (
//                   <QrCode size={16} color={Colors.gray400} />
//                 )}
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* Totals */}
//       <View style={styles.totalsCard}>
//         <Text style={styles.sectionTitle}>Totals</Text>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Subtotal</Text>
//           <Text style={styles.totalValue}>{formatCurrency(t.subtotal || 0)}</Text>
//         </View>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Tax</Text>
//           <Text style={styles.totalValue}>{formatCurrency(t.taxTotal || 0)}</Text>
//         </View>
//         <View style={[styles.totalRow, styles.grandTotalRow]}>
//           <Text style={styles.grandTotalLabel}>Total</Text>
//           <Text style={styles.grandTotalValue}>{formatCurrency(t.totalAmount || 0)}</Text>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionRow}>
//         <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={() => router.back()}>
//           <ArrowLeft size={20} color={Colors.gray700} />
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.shareButton]}
//           onPress={() => {
//             const message = `
// Transaction: ${t.transactionNumber}
// Store: ${store.name || 'N/A'}
// Date: ${formatDateTime(t.createdAt)}
// Status: ${t.status}
// Total: ${formatCurrency(t.totalAmount || 0)}
// Items: ${items.length}
// ${t.paymentMethod ? `Payment: ${t.paymentMethod}` : ''}
//             `.trim();
//             Alert.alert('Share', message);
//           }}
//         >
//           <Share2 size={20} color={Colors.white} />
//           <Text style={styles.shareButtonText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   content: { padding: Spacing.md, paddingBottom: Spacing['4xl'] },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { color: Colors.gray500 },
//   closeButton: { marginTop: Spacing.md, padding: Spacing.md, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg },
//   closeButtonText: { color: Colors.white, fontWeight: '600' },
  
//   headerCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//   headerLeft: { flex: 1 },
//   headerLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   headerNumber: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
//   headerMeta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm, gap: Spacing.md },
//   headerMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   headerMetaText: { fontSize: Typography.sm, color: Colors.gray500 },
  
//   statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm, gap: 4 },
//   statusText: { fontSize: Typography.xs, fontWeight: '500' },
//   statusPending: { backgroundColor: Colors.warning + '20' },
//   statusPendingText: { color: Colors.warning },
//   statusSalesQR: { backgroundColor: Colors.primary + '20' },
//   statusSalesQRText: { color: Colors.primary },
//   statusPaymentQR: { backgroundColor: '#8B5CF6' + '20' },
//   statusPaymentQRText: { color: '#8B5CF6' },
//   statusReleaseQR: { backgroundColor: '#EC4899' + '20' },
//   statusReleaseQRText: { color: '#EC4899' },
//   statusInvoiceQR: { backgroundColor: '#F59E0B' + '20' },
//   statusInvoiceQRText: { color: '#F59E0B' },
//   statusCompleted: { backgroundColor: Colors.success + '20' },
//   statusCompletedText: { color: Colors.success },
//   statusCancelled: { backgroundColor: Colors.error + '20' },
//   statusCancelledText: { color: Colors.error },
//   statusDefault: { backgroundColor: Colors.gray200 },
//   statusDefaultText: { color: Colors.gray700 },
  
//   statsGrid: { flexDirection: 'row', marginBottom: Spacing.md, gap: Spacing.sm },
//   statItem: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', ...Shadows.sm },
//   statNumber: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900, marginTop: 4 },
//   statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  
//   workflowCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
//   workflowContainer: { marginTop: Spacing.sm },
//   workflowStep: { marginBottom: Spacing.md },
//   workflowStepRow: { flexDirection: 'row', alignItems: 'center' },
//   workflowDot: { width: 32, height: 32, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md, borderWidth: 2 },
//   workflowDotPending: { borderColor: Colors.gray300, backgroundColor: Colors.gray100 },
//   workflowDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
//   workflowDotCompleted: { borderColor: Colors.success, backgroundColor: Colors.success },
//   workflowStepInfo: { flex: 1 },
//   workflowStepLabel: { fontSize: Typography.sm },
//   workflowStepPending: { color: Colors.gray400 },
//   workflowStepActive: { color: Colors.primary, fontWeight: '600' },
//   workflowStepCompleted: { color: Colors.success },
//   workflowStepStatus: { fontSize: Typography.xs, color: Colors.gray400 },
//   workflowLine: { position: 'absolute', left: 15, top: 32, width: 2, height: 20 },
//   workflowLineCompleted: { backgroundColor: Colors.success },
//   workflowLineActive: { backgroundColor: Colors.primary },
  
//   itemsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
//   viewAllText: { color: Colors.primary, fontSize: Typography.sm },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   itemInfo: { flex: 1, marginRight: Spacing.sm },
//   itemName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
//   itemSku: { fontSize: Typography.xs, color: Colors.gray400 },
//   itemTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   viewMoreButton: { alignItems: 'center', paddingTop: Spacing.sm },
//   viewMoreText: { color: Colors.primary, fontSize: Typography.sm },
  
//   releaseCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   releaseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   releaseName: { fontSize: Typography.sm, color: Colors.gray700, flex: 1 },
//   releaseQty: { fontSize: Typography.sm, color: Colors.gray500, marginHorizontal: Spacing.sm },
//   releaseTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.primary },
//   invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray200 },
//   invoiceLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   invoiceValue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.success },
  
//   staffCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   staffRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
//   staffIconContainer: { width: 32, alignItems: 'center' },
//   staffInfo: { flex: 1 },
//   staffLabel: { fontSize: Typography.xs, color: Colors.gray500 },
//   staffName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  
//   paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   paymentGrid: { flexDirection: 'row', flexWrap: 'wrap' },
//   paymentItem: { width: '50%', paddingVertical: 4 },
//   paymentLabel: { fontSize: Typography.xs, color: Colors.gray500 },
//   paymentValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   changeText: { color: Colors.success },
  
//   receiptsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   receiptItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   receiptItemLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
//   receiptItemType: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   receiptItemNumber: { fontSize: Typography.xs, color: Colors.gray500 },
//   receiptItemRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
//   receiptStatusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
//   receiptPrinted: { backgroundColor: Colors.success + '20' },
//   receiptNotPrinted: { backgroundColor: Colors.warning + '20' },
//   receiptStatusText: { fontSize: Typography.xs },
//   receiptPrintedText: { color: Colors.success },
//   receiptNotPrintedText: { color: Colors.warning },
  
//   totalsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
//   totalLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   totalValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   grandTotalRow: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
//   grandTotalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
//   grandTotalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
  
//   actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
//   actionButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
//   backButton: { backgroundColor: Colors.gray200 },
//   backButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
//   shareButton: { backgroundColor: Colors.primary },
//   shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
// });





























import React, { useState, useEffect } from 'react';
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
import { Download, Share2, Printer, QrCode, ArrowLeft } from 'lucide-react-native';
import TransactionService from '../../../services/transactionService';
import ReceiptService from '../../../services/receiptService';
import PrinterService from '../../../services/printer';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import BluetoothPrinterModal from '../../../components/print/BluetoothPrinterModal';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';

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

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [qrCode, setQrCode] = useState(qrData || null);
  const [receiptData, setReceiptData] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [viewShotRef, setViewShotRef] = useState(null);
  const [printerModalVisible, setPrinterModalVisible] = useState(false);
  const [printReceiptData, setPrintReceiptData] = useState(null);
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [printerDevice, setPrinterDevice] = useState(null);

  // Fetch receipt data on mount
  useEffect(() => {
    if (transactionId) {
      fetchReceipt();
    }
  }, [transactionId]);

  // Printer connection listener
  useEffect(() => {
    checkPrinterStatus();

    const unsubscribe = PrinterService.addConnectionListener(({ connected, device }) => {
      setIsPrinterConnected(connected);
      setPrinterDevice(device);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const fetchReceipt = async () => {
    try {
      setLoading(true);

      const result = await TransactionService.getTransaction(transactionId);
      setTransaction(result);

      if (result.receiptData) {
        setReceiptData(result.receiptData);
      }

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
        await generateAndDownloadPDF();
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateAndDownloadPDF = async () => {
    try {
      if (viewShotRef) {
        const uri = await captureRef(viewShotRef, {
          format: 'png',
          quality: 0.8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
      } else {
        Alert.alert('Info', 'Please try again with the share button');
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to generate download');
    }
  };

  const checkPrinterStatus = () => {
    const status = PrinterService.getConnectionStatus();
    setIsPrinterConnected(status.connected);
    if (status.connected) {
      setPrinterDevice(status.device);
    }
  };

  const handlePrint = () => {
    const data = receiptData || {};
    const store = data.store || {};
    const summary = data.summary || {};
    const items = data.items || transaction?.items || [];
    const staff = data.staff || {};

    const printData = {
      store: {
        name: store.name || transaction?.storeId?.name || 'Store',
        address: store.address || '',
        phone: store.phone || '',
        email: store.email || '',
      },
      transaction: {
        number: transaction?.transactionNumber || transactionNumber || 'N/A',
        createdAt: transaction?.createdAt || new Date(),
        status: transaction?.status || 'N/A',
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
        subtotal: summary.subtotal || transaction?.subtotal || 0,
        taxTotal: summary.taxTotal || transaction?.taxTotal || 0,
        discountTotal: summary.discountTotal || 0,
        totalAmount: summary.totalAmount || transaction?.totalAmount || 0,
        amountPaid: summary.amountPaid || transaction?.amountPaid || 0,
        changeAmount: summary.changeAmount || transaction?.changeAmount || 0,
        paymentMethod: summary.paymentMethod || transaction?.paymentMethod || '',
      },
      staff: {
        salesAttendant: staff.salesAttendant || (transaction?.salesAttendantId ? {
          name: `${transaction.salesAttendantId.firstName || ''} ${transaction.salesAttendantId.lastName || ''}`.trim() || 'N/A',
        } : null),
        financeAttendant: staff.financeAttendant || (transaction?.financeAttendantId ? {
          name: `${transaction.financeAttendantId.firstName || ''} ${transaction.financeAttendantId.lastName || ''}`.trim() || 'N/A',
        } : null),
        warehouseStaff: staff.warehouseStaff || (transaction?.warehouseStaffId ? {
          name: `${transaction.warehouseStaffId.firstName || ''} ${transaction.warehouseStaffId.lastName || ''}`.trim() || 'N/A',
        } : null),
      },
      payment: {
        method: transaction?.paymentMethod || '',
        reference: transaction?.paymentReference || '',
      },
      invoice: {
        number: transaction?.finalInvoiceNumber || '',
      },
      qrCode: qrCode,
    };

    setPrintReceiptData(printData);
    setPrinterModalVisible(true);
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

  // Derived values for render
  const t = transaction;
  const data = receiptData || {};
  const store = data.store || {};
  const summary = data.summary || {};
  const items = data.items || t?.items || [];
  const staff = data.staff || {};
  const releasedItems = data.releasedItems || t?.itemsReleased || [];

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
          ref={setViewShotRef}
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
                  {staff.salesAttendant.email && (
                    <Text style={styles.staffEmail}>{staff.salesAttendant.email}</Text>
                  )}
                </View>
              )}
              {staff.financeAttendant && (
                <View style={styles.staffRow}>
                  <Text style={styles.staffRole}>Finance:</Text>
                  <Text style={styles.staffName}>{staff.financeAttendant.name}</Text>
                  {staff.financeAttendant.email && (
                    <Text style={styles.staffEmail}>{staff.financeAttendant.email}</Text>
                  )}
                </View>
              )}
              {staff.warehouseStaff && (
                <View style={styles.staffRow}>
                  <Text style={styles.staffRole}>Warehouse:</Text>
                  <Text style={styles.staffName}>{staff.warehouseStaff.name}</Text>
                  {staff.warehouseStaff.email && (
                    <Text style={styles.staffEmail}>{staff.warehouseStaff.email}</Text>
                  )}
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

      <BluetoothPrinterModal
        visible={printerModalVisible}
        onClose={() => {
          setPrinterModalVisible(false);
          setPrintReceiptData(null);
        }}
        receiptData={printReceiptData}
        receiptType={qrType || 'SALES'}
        onPrintComplete={() => {
          fetchReceipt();
          setPrinterModalVisible(false);
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
