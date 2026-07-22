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
//   Truck
// } from 'lucide-react-native';
// import TransactionService from '../../../services/transactionService';
// import { formatCurrency, formatDateTime } from '../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
// import CustomHeader from '../../../components/ui/CustomHeader';

// export default function TransactionDetail() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [transaction, setTransaction] = useState(null);
//   const [qrCodes, setQrCodes] = useState(null);

//   useEffect(() => {
//     fetchTransaction();
//   }, [id]);

//   const fetchTransaction = async () => {
//     try {
//       const [data, qrs] = await Promise.all([
//         TransactionService.getTransaction(id),
//         TransactionService.getTransactionQRs(id),
//       ]);
//       setTransaction(data);
//       setQrCodes(qrs);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load transaction');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusStyles = (status) => {
//     const stylesMap = {
//       'PENDING': { container: styles.statusPending, text: styles.statusPendingText, icon: Clock },
//       'SALES_QR': { container: styles.statusSalesQR, text: styles.statusSalesQRText, icon: QrCode },
//       'PAYMENT_QR': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText, icon: CreditCard },
//       'RELEASE_QR': { container: styles.statusReleaseQR, text: styles.statusReleaseQRText, icon: Package },
//       'INVOICE_QR': { container: styles.statusInvoiceQR, text: styles.statusInvoiceQRText, icon: Truck },
//       'COMPLETED': { container: styles.statusCompleted, text: styles.statusCompletedText, icon: CheckCircle },
//       'CANCELLED': { container: styles.statusCancelled, text: styles.statusCancelledText, icon: XCircle },
//     };
//     return stylesMap[status] || { container: styles.statusDefault, text: styles.statusDefaultText, icon: Clock };
//   };

//   const getWorkflowSteps = () => {
//     const steps = [
//       { 
//         key: 'sales', 
//         label: 'Sales QR', 
//         icon: QrCode,
//         completed: !!transaction?.salesQR,
//         status: transaction?.qrStatus?.salesQRScanned ? 'scanned' : 'generated',
//       },
//       { 
//         key: 'payment', 
//         label: 'Payment QR', 
//         icon: CreditCard,
//         completed: !!transaction?.paymentQR,
//         status: transaction?.qrStatus?.paymentQRScanned ? 'scanned' : transaction?.paymentQR ? 'generated' : 'pending',
//       },
//       { 
//         key: 'release', 
//         label: 'Release QR', 
//         icon: Package,
//         completed: !!transaction?.releaseQR,
//         status: transaction?.qrStatus?.releaseQRScanned ? 'scanned' : transaction?.releaseQR ? 'generated' : 'pending',
//       },
//       { 
//         key: 'invoice', 
//         label: 'Invoice QR', 
//         icon: Truck,
//         completed: !!transaction?.invoiceQR,
//         status: transaction?.qrStatus?.invoiceQRScanned ? 'scanned' : transaction?.invoiceQR ? 'generated' : 'pending',
//       },
//     ];
//     return steps;
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
//       </View>
//     );
//   }

//   const statusStyles = getStatusStyles(transaction.status);
//   const StatusIcon = statusStyles.icon;
//   const workflowSteps = getWorkflowSteps();

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <CustomHeader title="Transaction Details" />
//       <View style={styles.headerCard}>
//         <View style={styles.headerRow}>
//           <View>
//             <Text style={styles.headerLabel}>Transaction Number</Text>
//             <Text style={styles.headerNumber}>{transaction.transactionNumber}</Text>
//           </View>
//           <View style={[styles.statusBadge, statusStyles.container]}>
//             <StatusIcon size={14} color={statusStyles.text.color} />
//             <Text style={[styles.statusText, statusStyles.text]}>{transaction.status}</Text>
//           </View>
//         </View>
//         <Text style={styles.headerDate}>{formatDateTime(transaction.createdAt)}</Text>
//         <Text style={styles.headerStore}>Store: {transaction.storeId?.name || 'N/A'}</Text>
//       </View>

//       {/* Workflow Progress */}
//       <View style={styles.workflowCard}>
//         <Text style={styles.sectionTitle}>Transaction Progress</Text>
//         <View style={styles.workflowContainer}>
//           {workflowSteps.map((step, index) => {
//             const isActive = step.status === 'generated' || step.status === 'scanned';
//             const isCompleted = step.status === 'scanned';
//             const isLast = index === workflowSteps.length - 1;

//             return (
//               <View key={step.key} style={styles.workflowStep}>
//                 <View style={styles.workflowStepRow}>
//                   <View style={[
//                     styles.workflowDot,
//                     isCompleted && styles.workflowDotCompleted,
//                     isActive && !isCompleted && styles.workflowDotActive,
//                     step.status === 'pending' && styles.workflowDotPending,
//                   ]}>
//                     <step.icon size={14} color={isCompleted ? Colors.white : isActive ? Colors.primary : Colors.gray400} />
//                   </View>
//                   <View style={styles.workflowStepInfo}>
//                     <Text style={[
//                       styles.workflowStepLabel,
//                       isCompleted && styles.workflowStepCompleted,
//                       isActive && !isCompleted && styles.workflowStepActive,
//                       step.status === 'pending' && styles.workflowStepPending,
//                     ]}>
//                       {step.label}
//                     </Text>
//                     <Text style={styles.workflowStepStatus}>
//                       {step.status === 'scanned' ? '✅ Scanned' : 
//                        step.status === 'generated' ? '📷 Generated' : 
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
//         <Text style={styles.sectionTitle}>Items ({transaction.items?.length || 0})</Text>
//         {transaction.items?.map((item, index) => {
//           const product = item.productId || item;
//           return (
//             <View key={index} style={styles.itemRow}>
//               <View style={styles.itemInfo}>
//                 <Text style={styles.itemName}>{product.name}</Text>
//                 <Text style={styles.itemDetail}>
//                   Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
//                 </Text>
//                 {item.isReleased && (
//                   <Text style={styles.itemReleased}>✓ Released</Text>
//                 )}
//               </View>
//               <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
//             </View>
//           );
//         })}
//         <View style={styles.totalsContainer}>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Subtotal</Text>
//             <Text style={styles.totalValue}>{formatCurrency(transaction.subtotal)}</Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Tax</Text>
//             <Text style={styles.totalValue}>{formatCurrency(transaction.taxTotal)}</Text>
//           </View>
//           <View style={[styles.totalRow, styles.grandTotalRow]}>
//             <Text style={styles.grandTotalLabel}>Total</Text>
//             <Text style={styles.grandTotalValue}>{formatCurrency(transaction.totalAmount)}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Payment Details */}
//       {transaction.paymentMethod && (
//         <View style={styles.paymentCard}>
//           <Text style={styles.sectionTitle}>Payment</Text>
//           <View style={styles.paymentRow}>
//             <Text style={styles.paymentLabel}>Method</Text>
//             <Text style={styles.paymentValue}>{transaction.paymentMethod}</Text>
//           </View>
//           <View style={styles.paymentRow}>
//             <Text style={styles.paymentLabel}>Amount Paid</Text>
//             <Text style={styles.paymentValue}>{formatCurrency(transaction.amountPaid)}</Text>
//           </View>
//           {transaction.changeAmount > 0 && (
//             <View style={styles.paymentRow}>
//               <Text style={styles.paymentLabel}>Change</Text>
//               <Text style={[styles.paymentValue, styles.changeText]}>{formatCurrency(transaction.changeAmount)}</Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Released Items */}
//       {transaction.itemsReleased && transaction.itemsReleased.length > 0 && (
//         <View style={styles.releaseCard}>
//           <Text style={styles.sectionTitle}>Released Items</Text>
//           {transaction.itemsReleased.map((item, index) => (
//             <View key={index} style={styles.releaseRow}>
//               <Text style={styles.releaseName}>{item.productName || 'Product'}</Text>
//               <Text style={styles.releaseQty}>×{item.quantityReleased}</Text>
//               <Text style={styles.releaseTotal}>{formatCurrency(item.totalPrice)}</Text>
//             </View>
//           ))}
//           {transaction.finalInvoiceNumber && (
//             <View style={styles.invoiceRow}>
//               <Text style={styles.invoiceLabel}>Invoice #</Text>
//               <Text style={styles.invoiceValue}>{transaction.finalInvoiceNumber}</Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* QR Codes Summary */}
//       <View style={styles.qrSummaryCard}>
//         <Text style={styles.sectionTitle}>QR Codes</Text>
//         <View style={styles.qrSummaryGrid}>
//           {qrCodes && (
//             <>
//               <View style={styles.qrSummaryItem}>
//                 <Text style={styles.qrSummaryLabel}>Sales QR</Text>
//                 <View style={[styles.qrSummaryDot, qrCodes.salesQR ? styles.qrActive : styles.qrInactive]} />
//               </View>
//               <View style={styles.qrSummaryItem}>
//                 <Text style={styles.qrSummaryLabel}>Payment QR</Text>
//                 <View style={[styles.qrSummaryDot, qrCodes.paymentQR ? styles.qrActive : styles.qrInactive]} />
//               </View>
//               <View style={styles.qrSummaryItem}>
//                 <Text style={styles.qrSummaryLabel}>Release QR</Text>
//                 <View style={[styles.qrSummaryDot, qrCodes.releaseQR ? styles.qrActive : styles.qrInactive]} />
//               </View>
//               <View style={styles.qrSummaryItem}>
//                 <Text style={styles.qrSummaryLabel}>Invoice QR</Text>
//                 <View style={[styles.qrSummaryDot, qrCodes.invoiceQR ? styles.qrActive : styles.qrInactive]} />
//               </View>
//             </>
//           )}
//         </View>
//       </View>

//       <View style={styles.actionRow}>
//         <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={() => router.back()}>
//           <ArrowLeft size={20} color={Colors.gray700} />
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.shareButton]}
//           onPress={() => {
//             Alert.alert('Share', 'Share functionality coming soon');
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
//   content: { padding: Spacing.md },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { color: Colors.gray500 },
//   headerCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//   headerLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   headerNumber: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
//   headerDate: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.sm },
//   headerStore: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
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
//   workflowStepLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   workflowStepPending: { color: Colors.gray400 },
//   workflowStepActive: { color: Colors.primary, fontWeight: '600' },
//   workflowStepCompleted: { color: Colors.success },
//   workflowStepStatus: { fontSize: Typography.xs, color: Colors.gray400 },
//   workflowLine: { position: 'absolute', left: 15, top: 32, width: 2, height: 20 },
//   workflowLineCompleted: { backgroundColor: Colors.success },
//   workflowLineActive: { backgroundColor: Colors.primary },
//   itemsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   itemInfo: { flex: 1 },
//   itemName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
//   itemReleased: { fontSize: Typography.xs, color: Colors.success },
//   itemTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   totalsContainer: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.gray200 },
//   totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
//   totalLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   totalValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   grandTotalRow: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
//   grandTotalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
//   grandTotalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
//   paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
//   paymentLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   paymentValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   changeText: { color: Colors.success },
//   releaseCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   releaseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   releaseName: { fontSize: Typography.sm, color: Colors.gray700, flex: 1 },
//   releaseQty: { fontSize: Typography.sm, color: Colors.gray500, marginHorizontal: Spacing.sm },
//   releaseTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.primary },
//   invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray200 },
//   invoiceLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   invoiceValue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.success },
//   qrSummaryCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   qrSummaryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
//   qrSummaryItem: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
//   qrSummaryLabel: { fontSize: Typography.sm, color: Colors.gray600, flex: 1 },
//   qrSummaryDot: { width: 12, height: 12, borderRadius: BorderRadius.full, marginLeft: Spacing.sm },
//   qrActive: { backgroundColor: Colors.success },
//   qrInactive: { backgroundColor: Colors.gray300 },
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
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Printer, 
  Share2, 
  Download, 
  ArrowLeft, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Clock,
  ShoppingBag,
  CreditCard,
  Package,
  Truck,
  User,
  Store,
  Calendar,
  DollarSign,
  List,
  FileText
} from 'lucide-react-native';
import TransactionService from '../../../services/transactionService';
import ReceiptService from '../../../services/receiptService';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import CustomHeader from '../../../components/ui/CustomHeader';

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [qrStatus, setQrStatus] = useState(null);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      
      // Get transaction with full details
      const data = await TransactionService.getTransaction(id);
      setTransaction(data);
      
      // Get QR status
      try {
        const qrs = await TransactionService.getTransactionQRs(id);
        setQrStatus(qrs);
      } catch (e) {
        console.log('QR status not available');
      }
      
      // Get receipts for this transaction
      try {
        const receiptData = await ReceiptService.getReceiptsByTransaction(id);
        if (receiptData && receiptData.length > 0) {
          setReceipts(receiptData);
        }
      } catch (e) {
        console.log('No receipts found');
      }
      
    } catch (error) {
      console.error('Error fetching transaction:', error);
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    const stylesMap = {
      'PENDING': { container: styles.statusPending, text: styles.statusPendingText, icon: Clock },
      'SALES_QR': { container: styles.statusSalesQR, text: styles.statusSalesQRText, icon: QrCode },
      'PAID': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText, icon: CreditCard },
      'PAYMENT_QR': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText, icon: CreditCard },
      'RELEASED': { container: styles.statusReleaseQR, text: styles.statusReleaseQRText, icon: Package },
      'RELEASE_QR': { container: styles.statusReleaseQR, text: styles.statusReleaseQRText, icon: Package },
      'INVOICE_QR': { container: styles.statusInvoiceQR, text: styles.statusInvoiceQRText, icon: Truck },
      'COMPLETED': { container: styles.statusCompleted, text: styles.statusCompletedText, icon: CheckCircle },
      'CANCELLED': { container: styles.statusCancelled, text: styles.statusCancelledText, icon: XCircle },
      'REFUNDED': { container: styles.statusCancelled, text: styles.statusCancelledText, icon: XCircle },
    };
    return stylesMap[status] || { container: styles.statusDefault, text: styles.statusDefaultText, icon: Clock };
  };

  const getWorkflowSteps = () => {
    if (!transaction) return [];
    
    const steps = [
      { 
        key: 'sales', 
        label: 'Sales QR', 
        icon: QrCode,
        generated: !!transaction.salesQR,
        scanned: transaction.qrStatus?.salesQRScanned || false,
        timestamp: transaction.salesQRGeneratedAt,
      },
      { 
        key: 'payment', 
        label: 'Payment QR', 
        icon: CreditCard,
        generated: !!transaction.paymentQR,
        scanned: transaction.qrStatus?.paymentQRScanned || false,
        timestamp: transaction.paymentQRGeneratedAt,
      },
      { 
        key: 'release', 
        label: 'Release QR', 
        icon: Package,
        generated: !!transaction.releaseQR,
        scanned: transaction.qrStatus?.releaseQRScanned || false,
        timestamp: transaction.releaseQRGeneratedAt,
      },
      { 
        key: 'invoice', 
        label: 'Invoice QR', 
        icon: Truck,
        generated: !!transaction.invoiceQR,
        scanned: transaction.qrStatus?.invoiceQRScanned || false,
        timestamp: transaction.invoiceQRGeneratedAt,
      },
    ];
    return steps;
  };

  const navigateToReceipt = (type) => {
    router.push({
      pathname: '/(app)/(modals)/receipt-preview',
      params: {
        transactionId: id,
        qrType: type,
        transactionNumber: transaction?.transactionNumber,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Transaction not found</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const t = transaction;
  const statusStyles = getStatusStyles(t.status);
  const StatusIcon = statusStyles.icon;
  const workflowSteps = getWorkflowSteps();
  const items = t.items || [];
  const releasedItems = t.itemsReleased || [];
  const store = t.storeId || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomHeader title="Transaction Details" />
      
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>Transaction Number</Text>
            <Text style={styles.headerNumber}>{t.transactionNumber}</Text>
          </View>
          <View style={[styles.statusBadge, statusStyles.container]}>
            <StatusIcon size={14} color={statusStyles.text.color} />
            <Text style={[styles.statusText, statusStyles.text]}>{t.status}</Text>
          </View>
        </View>
        <View style={styles.headerMeta}>
          <View style={styles.headerMetaItem}>
            <Calendar size={14} color={Colors.gray500} />
            <Text style={styles.headerMetaText}>{formatDateTime(t.createdAt)}</Text>
          </View>
          {store.name && (
            <View style={styles.headerMetaItem}>
              <Store size={14} color={Colors.gray500} />
              <Text style={styles.headerMetaText}>{store.name}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <List size={20} color={Colors.primary} />
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.statItem}>
          <DollarSign size={20} color={Colors.success} />
          <Text style={styles.statNumber}>{formatCurrency(t.totalAmount || 0)}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        {t.paymentMethod && (
          <View style={styles.statItem}>
            <CreditCard size={20} color={Colors.warning} />
            <Text style={styles.statNumber}>{t.paymentMethod}</Text>
            <Text style={styles.statLabel}>Payment</Text>
          </View>
        )}
      </View>

      {/* Workflow Progress */}
      <View style={styles.workflowCard}>
        <Text style={styles.sectionTitle}>Transaction Progress</Text>
        <View style={styles.workflowContainer}>
          {workflowSteps.map((step, index) => {
            const isActive = step.generated;
            const isCompleted = step.scanned;
            const isLast = index === workflowSteps.length - 1;

            return (
              <View key={step.key} style={styles.workflowStep}>
                <View style={styles.workflowStepRow}>
                  <View style={[
                    styles.workflowDot,
                    isCompleted && styles.workflowDotCompleted,
                    isActive && !isCompleted && styles.workflowDotActive,
                    !isActive && styles.workflowDotPending,
                  ]}>
                    <step.icon size={14} color={isCompleted ? Colors.white : isActive ? Colors.primary : Colors.gray400} />
                  </View>
                  <View style={styles.workflowStepInfo}>
                    <Text style={[
                      styles.workflowStepLabel,
                      isCompleted && styles.workflowStepCompleted,
                      isActive && !isCompleted && styles.workflowStepActive,
                      !isActive && styles.workflowStepPending,
                    ]}>
                      {step.label}
                    </Text>
                    <Text style={styles.workflowStepStatus}>
                      {isCompleted ? '✅ Scanned' : 
                       isActive ? '📷 Generated' : 
                       '⏳ Pending'}
                    </Text>
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.workflowLine,
                      isCompleted && styles.workflowLineCompleted,
                      isActive && !isCompleted && styles.workflowLineActive,
                    ]} />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Items */}
      <View style={styles.itemsCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Items ({items.length})</Text>
          {items.length > 3 && (
            <TouchableOpacity onPress={() => Alert.alert('Items', `Total items: ${items.length}`)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>
        {items.slice(0, 3).map((item, index) => {
          const product = item.productId || item;
          const itemName = item.name || product?.name || 'Item';
          const qty = item.quantity || 0;
          const unitPrice = item.unitPrice || 0;
          const total = item.totalPrice || (qty * unitPrice);
          
          return (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{itemName}</Text>
                <Text style={styles.itemDetail}>
                  Qty: {qty} × {formatCurrency(unitPrice)}
                </Text>
                {item.sku && (
                  <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                )}
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(total)}</Text>
            </View>
          );
        })}
        {items.length > 3 && (
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>+ {items.length - 3} more items</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Released Items */}
      {releasedItems.length > 0 && (
        <View style={styles.releaseCard}>
          <Text style={styles.sectionTitle}>Released Items ({releasedItems.length})</Text>
          {releasedItems.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.releaseRow}>
              <Text style={styles.releaseName}>{item.productName || 'Item'}</Text>
              <Text style={styles.releaseQty}>×{item.quantityReleased || 0}</Text>
              <Text style={styles.releaseTotal}>{formatCurrency(item.totalPrice || 0)}</Text>
            </View>
          ))}
          {t.finalInvoiceNumber && (
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Invoice #</Text>
              <Text style={styles.invoiceValue}>{t.finalInvoiceNumber}</Text>
            </View>
          )}
        </View>
      )}

      {/* Staff */}
      <View style={styles.staffCard}>
        <Text style={styles.sectionTitle}>Staff</Text>
        {t.salesAttendantId && (
          <View style={styles.staffRow}>
            <View style={styles.staffIconContainer}>
              <User size={16} color={Colors.primary} />
            </View>
            <View style={styles.staffInfo}>
              <Text style={styles.staffLabel}>Sales Attendant</Text>
              <Text style={styles.staffName}>
                {t.salesAttendantId.firstName} {t.salesAttendantId.lastName}
              </Text>
            </View>
          </View>
        )}
        {t.financeAttendantId && (
          <View style={styles.staffRow}>
            <View style={styles.staffIconContainer}>
              <CreditCard size={16} color={Colors.success} />
            </View>
            <View style={styles.staffInfo}>
              <Text style={styles.staffLabel}>Finance Attendant</Text>
              <Text style={styles.staffName}>
                {t.financeAttendantId.firstName} {t.financeAttendantId.lastName}
              </Text>
            </View>
          </View>
        )}
        {t.warehouseStaffId && (
          <View style={styles.staffRow}>
            <View style={styles.staffIconContainer}>
              <Package size={16} color={Colors.warning} />
            </View>
            <View style={styles.staffInfo}>
              <Text style={styles.staffLabel}>Warehouse Staff</Text>
              <Text style={styles.staffName}>
                {t.warehouseStaffId.firstName} {t.warehouseStaffId.lastName}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Payment Details */}
      {t.paymentMethod && (
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentGrid}>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Method</Text>
              <Text style={styles.paymentValue}>{t.paymentMethod}</Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Amount Paid</Text>
              <Text style={styles.paymentValue}>{formatCurrency(t.amountPaid || 0)}</Text>
            </View>
            {t.changeAmount > 0 && (
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Change</Text>
                <Text style={[styles.paymentValue, styles.changeText]}>{formatCurrency(t.changeAmount)}</Text>
              </View>
            )}
            {t.paymentTimestamp && (
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Payment Time</Text>
                <Text style={styles.paymentValue}>{formatDateTime(t.paymentTimestamp)}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Receipts */}
      {receipts.length > 0 && (
        <View style={styles.receiptsCard}>
          <Text style={styles.sectionTitle}>Receipts ({receipts.length})</Text>
          {receipts.map((receipt, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.receiptItem}
              onPress={() => navigateToReceipt(receipt.type)}
            >
              <View style={styles.receiptItemLeft}>
                <FileText size={20} color={Colors.primary} />
                <View>
                  <Text style={styles.receiptItemType}>{receipt.type}</Text>
                  <Text style={styles.receiptItemNumber}>{receipt.receiptNumber}</Text>
                </View>
              </View>
              <View style={styles.receiptItemRight}>
                <View style={[
                  styles.receiptStatusBadge,
                  receipt.printed ? styles.receiptPrinted : styles.receiptNotPrinted
                ]}>
                  <Text style={[
                    styles.receiptStatusText,
                    receipt.printed ? styles.receiptPrintedText : styles.receiptNotPrintedText
                  ]}>
                    {receipt.printed ? 'Printed' : 'Not Printed'}
                  </Text>
                </View>
                {receipt.qrCode && (
                  <QrCode size={16} color={Colors.gray400} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Totals */}
      <View style={styles.totalsCard}>
        <Text style={styles.sectionTitle}>Totals</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatCurrency(t.subtotal || 0)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax</Text>
          <Text style={styles.totalValue}>{formatCurrency(t.taxTotal || 0)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(t.totalAmount || 0)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.gray700} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={() => {
            const message = `
Transaction: ${t.transactionNumber}
Store: ${store.name || 'N/A'}
Date: ${formatDateTime(t.createdAt)}
Status: ${t.status}
Total: ${formatCurrency(t.totalAmount || 0)}
Items: ${items.length}
${t.paymentMethod ? `Payment: ${t.paymentMethod}` : ''}
            `.trim();
            Alert.alert('Share', message);
          }}
        >
          <Share2 size={20} color={Colors.white} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingBottom: Spacing['4xl'] },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.gray500 },
  closeButton: { marginTop: Spacing.md, padding: Spacing.md, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg },
  closeButtonText: { color: Colors.white, fontWeight: '600' },
  
  headerCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  headerLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  headerNumber: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  headerMeta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm, gap: Spacing.md },
  headerMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerMetaText: { fontSize: Typography.sm, color: Colors.gray500 },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm, gap: 4 },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  statusPending: { backgroundColor: Colors.warning + '20' },
  statusPendingText: { color: Colors.warning },
  statusSalesQR: { backgroundColor: Colors.primary + '20' },
  statusSalesQRText: { color: Colors.primary },
  statusPaymentQR: { backgroundColor: '#8B5CF6' + '20' },
  statusPaymentQRText: { color: '#8B5CF6' },
  statusReleaseQR: { backgroundColor: '#EC4899' + '20' },
  statusReleaseQRText: { color: '#EC4899' },
  statusInvoiceQR: { backgroundColor: '#F59E0B' + '20' },
  statusInvoiceQRText: { color: '#F59E0B' },
  statusCompleted: { backgroundColor: Colors.success + '20' },
  statusCompletedText: { color: Colors.success },
  statusCancelled: { backgroundColor: Colors.error + '20' },
  statusCancelledText: { color: Colors.error },
  statusDefault: { backgroundColor: Colors.gray200 },
  statusDefaultText: { color: Colors.gray700 },
  
  statsGrid: { flexDirection: 'row', marginBottom: Spacing.md, gap: Spacing.sm },
  statItem: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', ...Shadows.sm },
  statNumber: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900, marginTop: 4 },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  
  workflowCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  workflowContainer: { marginTop: Spacing.sm },
  workflowStep: { marginBottom: Spacing.md },
  workflowStepRow: { flexDirection: 'row', alignItems: 'center' },
  workflowDot: { width: 32, height: 32, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md, borderWidth: 2 },
  workflowDotPending: { borderColor: Colors.gray300, backgroundColor: Colors.gray100 },
  workflowDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  workflowDotCompleted: { borderColor: Colors.success, backgroundColor: Colors.success },
  workflowStepInfo: { flex: 1 },
  workflowStepLabel: { fontSize: Typography.sm },
  workflowStepPending: { color: Colors.gray400 },
  workflowStepActive: { color: Colors.primary, fontWeight: '600' },
  workflowStepCompleted: { color: Colors.success },
  workflowStepStatus: { fontSize: Typography.xs, color: Colors.gray400 },
  workflowLine: { position: 'absolute', left: 15, top: 32, width: 2, height: 20 },
  workflowLineCompleted: { backgroundColor: Colors.success },
  workflowLineActive: { backgroundColor: Colors.primary },
  
  itemsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  viewAllText: { color: Colors.primary, fontSize: Typography.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  itemInfo: { flex: 1, marginRight: Spacing.sm },
  itemName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
  itemSku: { fontSize: Typography.xs, color: Colors.gray400 },
  itemTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  viewMoreButton: { alignItems: 'center', paddingTop: Spacing.sm },
  viewMoreText: { color: Colors.primary, fontSize: Typography.sm },
  
  releaseCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  releaseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  releaseName: { fontSize: Typography.sm, color: Colors.gray700, flex: 1 },
  releaseQty: { fontSize: Typography.sm, color: Colors.gray500, marginHorizontal: Spacing.sm },
  releaseTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.primary },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray200 },
  invoiceLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  invoiceValue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.success },
  
  staffCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  staffRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
  staffIconContainer: { width: 32, alignItems: 'center' },
  staffInfo: { flex: 1 },
  staffLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  staffName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  
  paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  paymentItem: { width: '50%', paddingVertical: 4 },
  paymentLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  paymentValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  changeText: { color: Colors.success },
  
  receiptsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  receiptItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  receiptItemLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  receiptItemType: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  receiptItemNumber: { fontSize: Typography.xs, color: Colors.gray500 },
  receiptItemRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  receiptStatusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
  receiptPrinted: { backgroundColor: Colors.success + '20' },
  receiptNotPrinted: { backgroundColor: Colors.warning + '20' },
  receiptStatusText: { fontSize: Typography.xs },
  receiptPrintedText: { color: Colors.success },
  receiptNotPrintedText: { color: Colors.warning },
  
  totalsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  totalLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  totalValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  grandTotalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  grandTotalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
  
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backButton: { backgroundColor: Colors.gray200 },
  backButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  shareButton: { backgroundColor: Colors.primary },
  shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
});