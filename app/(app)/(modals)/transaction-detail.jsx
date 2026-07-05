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
// import { Printer, Share2, Download, ArrowLeft, QrCode } from 'lucide-react-native';
// import TransactionService from '../../services/transactionService';
// import { formatCurrency, formatDateTime } from '../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

// export default function TransactionDetail() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [transaction, setTransaction] = useState(null);

//   useEffect(() => {
//     fetchTransaction();
//   }, [id]);

//   const fetchTransaction = async () => {
//     try {
//       const data = await TransactionService.getTransaction(id);
//       setTransaction(data);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load transaction');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusStyles = (status) => {
//     const stylesMap = {
//       'PENDING': { container: styles.statusPending, text: styles.statusPendingText },
//       'SALES_QR': { container: styles.statusSalesQR, text: styles.statusSalesQRText },
//       'PAID': { container: styles.statusPaid, text: styles.statusPaidText },
//       'PAYMENT_QR': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText },
//       'RELEASED': { container: styles.statusReleased, text: styles.statusReleasedText },
//       'COMPLETED': { container: styles.statusCompleted, text: styles.statusCompletedText },
//       'CANCELLED': { container: styles.statusCancelled, text: styles.statusCancelledText },
//     };
//     return stylesMap[status] || { container: styles.statusDefault, text: styles.statusDefaultText };
//   };

//   const getWorkflowSteps = () => {
//     const steps = [
//       { key: 'created', label: 'Created', completed: !!transaction?.createdAt },
//       { key: 'sales_qr', label: 'Sales QR', completed: !!transaction?.salesReceiptQR },
//       { key: 'paid', label: 'Paid', completed: !!transaction?.paymentTimestamp },
//       { key: 'payment_qr', label: 'Payment QR', completed: !!transaction?.paymentReceiptQR },
//       { key: 'released', label: 'Released', completed: transaction?.warehouseStatus === 'RELEASED' },
//       { key: 'completed', label: 'Completed', completed: transaction?.status === 'COMPLETED' },
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
//   const workflowSteps = getWorkflowSteps();
//   const currentStepIndex = workflowSteps.findIndex(step => !step.completed);
//   const activeStep = currentStepIndex === -1 ? workflowSteps.length : currentStepIndex;

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.headerCard}>
//         <View style={styles.headerRow}>
//           <View>
//             <Text style={styles.headerLabel}>Transaction Number</Text>
//             <Text style={styles.headerNumber}>
//               {transaction.transactionNumber}
//             </Text>
//           </View>
//           <View style={[styles.statusBadge, statusStyles.container]}>
//             <Text style={[styles.statusText, statusStyles.text]}>
//               {transaction.status}
//             </Text>
//           </View>
//         </View>
//         <Text style={styles.headerDate}>
//           {formatDateTime(transaction.createdAt)}
//         </Text>
//         <Text style={styles.headerStore}>
//           Store: {transaction.storeId?.name || 'N/A'}
//         </Text>
//       </View>

//       {/* Workflow Progress */}
//       <View style={styles.workflowCard}>
//         <Text style={styles.sectionTitle}>Workflow Progress</Text>
//         <View style={styles.workflowContainer}>
//           {workflowSteps.map((step, index) => {
//             const isActive = index === activeStep;
//             const isCompleted = step.completed;
//             const isLast = index === workflowSteps.length - 1;

//             return (
//               <View key={step.key} style={styles.workflowStep}>
//                 <View style={styles.workflowStepRow}>
//                   <View style={[
//                     styles.workflowDot,
//                     isCompleted && styles.workflowDotCompleted,
//                     isActive && !isCompleted && styles.workflowDotActive,
//                   ]}>
//                     {isCompleted ? (
//                       <Text style={styles.workflowDotText}>✓</Text>
//                     ) : (
//                       <Text style={styles.workflowDotNumber}>{index + 1}</Text>
//                     )}
//                   </View>
//                   <View style={styles.workflowStepInfo}>
//                     <Text style={[
//                       styles.workflowStepLabel,
//                       isCompleted && styles.workflowStepCompleted,
//                       isActive && !isCompleted && styles.workflowStepActive,
//                     ]}>
//                       {step.label}
//                     </Text>
//                     {isActive && !isCompleted && (
//                       <Text style={styles.workflowStepStatus}>In Progress</Text>
//                     )}
//                   </View>
//                   {!isLast && (
//                     <View style={[
//                       styles.workflowLine,
//                       isCompleted && styles.workflowLineCompleted,
//                     ]} />
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </View>

//       <View style={styles.itemsCard}>
//         <Text style={styles.sectionTitle}>Items</Text>
//         {transaction.items?.map((item, index) => (
//           <View key={index} style={styles.itemRow}>
//             <View style={styles.itemInfo}>
//               <Text style={styles.itemName}>{item.name}</Text>
//               <Text style={styles.itemDetail}>
//                 Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
//               </Text>
//             </View>
//             <Text style={styles.itemTotal}>
//               {formatCurrency(item.totalPrice)}
//             </Text>
//           </View>
//         ))}
//         <View style={styles.totalsContainer}>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Subtotal</Text>
//             <Text style={styles.totalValue}>
//               {formatCurrency(transaction.subtotal)}
//             </Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Tax</Text>
//             <Text style={styles.totalValue}>
//               {formatCurrency(transaction.taxTotal)}
//             </Text>
//           </View>
//           <View style={[styles.totalRow, styles.grandTotalRow]}>
//             <Text style={styles.grandTotalLabel}>Total</Text>
//             <Text style={styles.grandTotalValue}>
//               {formatCurrency(transaction.totalAmount)}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {transaction.paymentMethod && (
//         <View style={styles.paymentCard}>
//           <Text style={styles.sectionTitle}>Payment</Text>
//           <View style={styles.paymentRow}>
//             <Text style={styles.paymentLabel}>Method</Text>
//             <Text style={styles.paymentValue}>
//               {transaction.paymentMethod}
//             </Text>
//           </View>
//           <View style={styles.paymentRow}>
//             <Text style={styles.paymentLabel}>Amount Paid</Text>
//             <Text style={styles.paymentValue}>
//               {formatCurrency(transaction.amountPaid)}
//             </Text>
//           </View>
//           {transaction.changeAmount > 0 && (
//             <View style={styles.paymentRow}>
//               <Text style={styles.paymentLabel}>Change</Text>
//               <Text style={styles.paymentValue}>
//                 {formatCurrency(transaction.changeAmount)}
//               </Text>
//             </View>
//           )}
//           {transaction.financeAttendantId && (
//             <View style={styles.paymentRow}>
//               <Text style={styles.paymentLabel}>Cashier</Text>
//               <Text style={styles.paymentValue}>
//                 {transaction.financeAttendantId.firstName} {transaction.financeAttendantId.lastName}
//               </Text>
//             </View>
//           )}
//         </View>
//       )}

//       {transaction.warehouseStatus === 'RELEASED' && (
//         <View style={styles.releaseCard}>
//           <Text style={styles.sectionTitle}>Release</Text>
//           <View style={styles.releaseRow}>
//             <Text style={styles.releaseLabel}>Released By</Text>
//             <Text style={styles.releaseValue}>
//               {transaction.warehouseStaffId?.firstName} {transaction.warehouseStaffId?.lastName}
//             </Text>
//           </View>
//           <View style={styles.releaseRow}>
//             <Text style={styles.releaseLabel}>Invoice Number</Text>
//             <Text style={styles.releaseValue}>
//               {transaction.finalInvoiceNumber || 'N/A'}
//             </Text>
//           </View>
//           <View style={styles.releaseRow}>
//             <Text style={styles.releaseLabel}>Release Date</Text>
//             <Text style={styles.releaseValue}>
//               {formatDateTime(transaction.releaseTimestamp)}
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* QR Codes */}
//       <View style={styles.qrCard}>
//         <Text style={styles.sectionTitle}>QR Codes</Text>
//         <View style={styles.qrRow}>
//           {transaction.salesReceiptQR && (
//             <View style={styles.qrItem}>
//               <QrCode size={20} color={Colors.primary} />
//               <Text style={styles.qrLabel}>Sales QR</Text>
//               <Text style={styles.qrStatus}>Generated</Text>
//             </View>
//           )}
//           {transaction.paymentReceiptQR && (
//             <View style={styles.qrItem}>
//               <QrCode size={20} color={Colors.success} />
//               <Text style={styles.qrLabel}>Payment QR</Text>
//               <Text style={styles.qrStatus}>Generated</Text>
//             </View>
//           )}
//           {!transaction.salesReceiptQR && !transaction.paymentReceiptQR && (
//             <Text style={styles.qrEmpty}>No QR codes generated</Text>
//           )}
//         </View>
//       </View>

//       <View style={styles.actionRow}>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.backButton]}
//           onPress={() => router.back()}
//         >
//           <ArrowLeft size={20} color={Colors.gray700} />
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.shareButton]}
//           onPress={() => {
//             // Share transaction details
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
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   content: {
//     padding: Spacing.md,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: Colors.gray500,
//   },
//   headerCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   headerLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   headerNumber: {
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   headerDate: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: Spacing.sm,
//   },
//   headerStore: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   statusBadge: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   statusText: {
//     fontSize: Typography.xs,
//     fontWeight: '500',
//   },
//   statusPending: {
//     backgroundColor: Colors.warning + '20',
//   },
//   statusPendingText: {
//     color: Colors.warning,
//   },
//   statusSalesQR: {
//     backgroundColor: Colors.primary + '20',
//   },
//   statusSalesQRText: {
//     color: Colors.primary,
//   },
//   statusPaid: {
//     backgroundColor: '#8B5CF6' + '20',
//   },
//   statusPaidText: {
//     color: '#8B5CF6',
//   },
//   statusPaymentQR: {
//     backgroundColor: '#8B5CF6' + '20',
//   },
//   statusPaymentQRText: {
//     color: '#8B5CF6',
//   },
//   statusReleased: {
//     backgroundColor: '#EC4899' + '20',
//   },
//   statusReleasedText: {
//     color: '#EC4899',
//   },
//   statusCompleted: {
//     backgroundColor: Colors.success + '20',
//   },
//   statusCompletedText: {
//     color: Colors.success,
//   },
//   statusCancelled: {
//     backgroundColor: Colors.error + '20',
//   },
//   statusCancelledText: {
//     color: Colors.error,
//   },
//   statusDefault: {
//     backgroundColor: Colors.gray200,
//   },
//   statusDefaultText: {
//     color: Colors.gray700,
//   },
//   workflowCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   workflowContainer: {
//     marginTop: Spacing.sm,
//   },
//   workflowStep: {
//     marginBottom: Spacing.md,
//   },
//   workflowStepRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   workflowDot: {
//     width: 28,
//     height: 28,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.gray200,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: Spacing.md,
//   },
//   workflowDotCompleted: {
//     backgroundColor: Colors.success,
//   },
//   workflowDotActive: {
//     backgroundColor: Colors.primary,
//     borderWidth: 2,
//     borderColor: Colors.primary,
//   },
//   workflowDotText: {
//     color: Colors.white,
//     fontSize: Typography.xs,
//     fontWeight: 'bold',
//   },
//   workflowDotNumber: {
//     color: Colors.gray500,
//     fontSize: Typography.xs,
//     fontWeight: 'bold',
//   },
//   workflowStepInfo: {
//     flex: 1,
//   },
//   workflowStepLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   workflowStepCompleted: {
//     color: Colors.success,
//   },
//   workflowStepActive: {
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   workflowStepStatus: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//   },
//   workflowLine: {
//     position: 'absolute',
//     left: 13,
//     top: 28,
//     width: 2,
//     height: 20,
//     backgroundColor: Colors.gray200,
//   },
//   workflowLineCompleted: {
//     backgroundColor: Colors.success,
//   },
//   sectionTitle: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//     marginBottom: Spacing.md,
//   },
//   itemsCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   itemDetail: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   itemTotal: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   totalsContainer: {
//     marginTop: Spacing.md,
//     paddingTop: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: Spacing.xs,
//   },
//   totalLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   totalValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   grandTotalRow: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     paddingTop: Spacing.sm,
//     marginTop: Spacing.xs,
//   },
//   grandTotalLabel: {
//     fontSize: Typography.md,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   grandTotalValue: {
//     fontSize: Typography.md,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   paymentCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: Spacing.xs,
//   },
//   paymentLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   paymentValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   releaseCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   releaseRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: Spacing.xs,
//   },
//   releaseLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   releaseValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   qrCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   qrRow: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   qrItem: {
//     flex: 1,
//     alignItems: 'center',
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray50,
//     borderRadius: BorderRadius.lg,
//   },
//   qrLabel: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   qrStatus: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: '500',
//   },
//   qrEmpty: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     textAlign: 'center',
//     paddingVertical: Spacing.md,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//     marginTop: Spacing.sm,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   backButton: {
//     backgroundColor: Colors.gray200,
//   },
//   backButtonText: {
//     color: Colors.gray700,
//     fontWeight: '600',
//     marginLeft: Spacing.sm,
//   },
//   shareButton: {
//     backgroundColor: Colors.primary,
//   },
//   shareButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     marginLeft: Spacing.sm,
//   },
// });


























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
// import { Printer, Share2, Download, ArrowLeft, QrCode } from 'lucide-react-native';
// import TransactionService from '../../../services/transactionService';
// import { formatCurrency, formatDateTime } from '../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';

// export default function TransactionDetailModal() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [transaction, setTransaction] = useState(null);

//   useEffect(() => {
//     fetchTransaction();
//   }, [id]);

//   const fetchTransaction = async () => {
//     try {
//       const data = await TransactionService.getTransaction(id);
//       setTransaction(data);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load transaction');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusStyles = (status) => {
//     const stylesMap = {
//       'PENDING': { container: styles.statusPending, text: styles.statusPendingText },
//       'SALES_QR': { container: styles.statusSalesQR, text: styles.statusSalesQRText },
//       'PAID': { container: styles.statusPaid, text: styles.statusPaidText },
//       'PAYMENT_QR': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText },
//       'RELEASED': { container: styles.statusReleased, text: styles.statusReleasedText },
//       'COMPLETED': { container: styles.statusCompleted, text: styles.statusCompletedText },
//       'CANCELLED': { container: styles.statusCancelled, text: styles.statusCancelledText },
//     };
//     return stylesMap[status] || { container: styles.statusDefault, text: styles.statusDefaultText };
//   };

//   const getWorkflowSteps = () => {
//     const steps = [
//       { key: 'created', label: 'Created', completed: !!transaction?.createdAt },
//       { key: 'sales_qr', label: 'Sales QR', completed: !!transaction?.salesReceiptQR },
//       { key: 'paid', label: 'Paid', completed: !!transaction?.paymentTimestamp },
//       { key: 'payment_qr', label: 'Payment QR', completed: !!transaction?.paymentReceiptQR },
//       { key: 'released', label: 'Released', completed: transaction?.warehouseStatus === 'RELEASED' },
//       { key: 'completed', label: 'Completed', completed: transaction?.status === 'COMPLETED' },
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
//   const workflowSteps = getWorkflowSteps();
//   const currentStepIndex = workflowSteps.findIndex(step => !step.completed);
//   const activeStep = currentStepIndex === -1 ? workflowSteps.length : currentStepIndex;

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.headerCard}>
//         <View style={styles.headerRow}>
//           <View>
//             <Text style={styles.headerLabel}>Transaction Number</Text>
//             <Text style={styles.headerNumber}>{transaction.transactionNumber}</Text>
//           </View>
//           <View style={[styles.statusBadge, statusStyles.container]}>
//             <Text style={[styles.statusText, statusStyles.text]}>{transaction.status}</Text>
//           </View>
//         </View>
//         <Text style={styles.headerDate}>{formatDateTime(transaction.createdAt)}</Text>
//         <Text style={styles.headerStore}>Store: {transaction.storeId?.name || 'N/A'}</Text>
//       </View>

//       {/* Workflow Progress */}
//       <View style={styles.workflowCard}>
//         <Text style={styles.sectionTitle}>Workflow Progress</Text>
//         <View style={styles.workflowContainer}>
//           {workflowSteps.map((step, index) => {
//             const isActive = index === activeStep;
//             const isCompleted = step.completed;
//             const isLast = index === workflowSteps.length - 1;

//             return (
//               <View key={step.key} style={styles.workflowStep}>
//                 <View style={styles.workflowStepRow}>
//                   <View style={[
//                     styles.workflowDot,
//                     isCompleted && styles.workflowDotCompleted,
//                     isActive && !isCompleted && styles.workflowDotActive,
//                   ]}>
//                     {isCompleted ? (
//                       <Text style={styles.workflowDotText}>✓</Text>
//                     ) : (
//                       <Text style={styles.workflowDotNumber}>{index + 1}</Text>
//                     )}
//                   </View>
//                   <View style={styles.workflowStepInfo}>
//                     <Text style={[
//                       styles.workflowStepLabel,
//                       isCompleted && styles.workflowStepCompleted,
//                       isActive && !isCompleted && styles.workflowStepActive,
//                     ]}>
//                       {step.label}
//                     </Text>
//                     {isActive && !isCompleted && (
//                       <Text style={styles.workflowStepStatus}>In Progress</Text>
//                     )}
//                   </View>
//                   {!isLast && (
//                     <View style={[
//                       styles.workflowLine,
//                       isCompleted && styles.workflowLineCompleted,
//                     ]} />
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </View>

//       <View style={styles.itemsCard}>
//         <Text style={styles.sectionTitle}>Items</Text>
//         {transaction.items?.map((item, index) => (
//           <View key={index} style={styles.itemRow}>
//             <View style={styles.itemInfo}>
//               <Text style={styles.itemName}>{item.name}</Text>
//               <Text style={styles.itemDetail}>
//                 Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
//               </Text>
//             </View>
//             <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
//           </View>
//         ))}
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
//               <Text style={styles.paymentValue}>{formatCurrency(transaction.changeAmount)}</Text>
//             </View>
//           )}
//           {transaction.financeAttendantId && (
//             <View style={styles.paymentRow}>
//               <Text style={styles.paymentLabel}>Cashier</Text>
//               <Text style={styles.paymentValue}>
//                 {transaction.financeAttendantId.firstName} {transaction.financeAttendantId.lastName}
//               </Text>
//             </View>
//           )}
//         </View>
//       )}

//       {transaction.warehouseStatus === 'RELEASED' && (
//         <View style={styles.releaseCard}>
//           <Text style={styles.sectionTitle}>Release</Text>
//           <View style={styles.releaseRow}>
//             <Text style={styles.releaseLabel}>Released By</Text>
//             <Text style={styles.releaseValue}>
//               {transaction.warehouseStaffId?.firstName} {transaction.warehouseStaffId?.lastName}
//             </Text>
//           </View>
//           <View style={styles.releaseRow}>
//             <Text style={styles.releaseLabel}>Invoice Number</Text>
//             <Text style={styles.releaseValue}>{transaction.finalInvoiceNumber || 'N/A'}</Text>
//           </View>
//           <View style={styles.releaseRow}>
//             <Text style={styles.releaseLabel}>Release Date</Text>
//             <Text style={styles.releaseValue}>{formatDateTime(transaction.releaseTimestamp)}</Text>
//           </View>
//         </View>
//       )}

//       {/* QR Codes */}
//       <View style={styles.qrCard}>
//         <Text style={styles.sectionTitle}>QR Codes</Text>
//         <View style={styles.qrRow}>
//           {transaction.salesReceiptQR && (
//             <View style={styles.qrItem}>
//               <QrCode size={20} color={Colors.primary} />
//               <Text style={styles.qrLabel}>Sales QR</Text>
//               <Text style={styles.qrStatus}>Generated</Text>
//             </View>
//           )}
//           {transaction.paymentReceiptQR && (
//             <View style={styles.qrItem}>
//               <QrCode size={20} color={Colors.success} />
//               <Text style={styles.qrLabel}>Payment QR</Text>
//               <Text style={styles.qrStatus}>Generated</Text>
//             </View>
//           )}
//           {!transaction.salesReceiptQR && !transaction.paymentReceiptQR && (
//             <Text style={styles.qrEmpty}>No QR codes generated</Text>
//           )}
//         </View>
//       </View>

//       <View style={styles.actionRow}>
//         <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={() => router.back()}>
//           <ArrowLeft size={20} color={Colors.gray700} />
//           <Text style={styles.backButtonText}>Close</Text>
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
//   statusBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
//   statusText: { fontSize: Typography.xs, fontWeight: '500' },
//   statusPending: { backgroundColor: Colors.warning + '20' },
//   statusPendingText: { color: Colors.warning },
//   statusSalesQR: { backgroundColor: Colors.primary + '20' },
//   statusSalesQRText: { color: Colors.primary },
//   statusPaid: { backgroundColor: '#8B5CF6' + '20' },
//   statusPaidText: { color: '#8B5CF6' },
//   statusPaymentQR: { backgroundColor: '#8B5CF6' + '20' },
//   statusPaymentQRText: { color: '#8B5CF6' },
//   statusReleased: { backgroundColor: '#EC4899' + '20' },
//   statusReleasedText: { color: '#EC4899' },
//   statusCompleted: { backgroundColor: Colors.success + '20' },
//   statusCompletedText: { color: Colors.success },
//   statusCancelled: { backgroundColor: Colors.error + '20' },
//   statusCancelledText: { color: Colors.error },
//   statusDefault: { backgroundColor: Colors.gray200 },
//   statusDefaultText: { color: Colors.gray700 },
//   workflowCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   workflowContainer: { marginTop: Spacing.sm },
//   workflowStep: { marginBottom: Spacing.md },
//   workflowStepRow: { flexDirection: 'row', alignItems: 'center' },
//   workflowDot: { width: 28, height: 28, borderRadius: BorderRadius.full, backgroundColor: Colors.gray200, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
//   workflowDotCompleted: { backgroundColor: Colors.success },
//   workflowDotActive: { backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.primary },
//   workflowDotText: { color: Colors.white, fontSize: Typography.xs, fontWeight: 'bold' },
//   workflowDotNumber: { color: Colors.gray500, fontSize: Typography.xs, fontWeight: 'bold' },
//   workflowStepInfo: { flex: 1 },
//   workflowStepLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   workflowStepCompleted: { color: Colors.success },
//   workflowStepActive: { color: Colors.primary, fontWeight: '600' },
//   workflowStepStatus: { fontSize: Typography.xs, color: Colors.primary },
//   workflowLine: { position: 'absolute', left: 13, top: 28, width: 2, height: 20, backgroundColor: Colors.gray200 },
//   workflowLineCompleted: { backgroundColor: Colors.success },
//   sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
//   itemsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   itemInfo: { flex: 1 },
//   itemName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
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
//   releaseCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   releaseRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
//   releaseLabel: { fontSize: Typography.sm, color: Colors.gray600 },
//   releaseValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
//   qrCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   qrRow: { flexDirection: 'row', gap: Spacing.md },
//   qrItem: { flex: 1, alignItems: 'center', padding: Spacing.sm, backgroundColor: Colors.gray50, borderRadius: BorderRadius.lg },
//   qrLabel: { fontSize: Typography.xs, color: Colors.gray500, marginTop: 2 },
//   qrStatus: { fontSize: Typography.xs, color: Colors.success, fontWeight: '500' },
//   qrEmpty: { fontSize: Typography.sm, color: Colors.gray500, textAlign: 'center', paddingVertical: Spacing.md },
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
  Truck
} from 'lucide-react-native';
import TransactionService from '../../../services/transactionService';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import CustomHeader from '../../../components/ui/CustomHeader';

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [qrCodes, setQrCodes] = useState(null);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const [data, qrs] = await Promise.all([
        TransactionService.getTransaction(id),
        TransactionService.getTransactionQRs(id),
      ]);
      setTransaction(data);
      setQrCodes(qrs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    const stylesMap = {
      'PENDING': { container: styles.statusPending, text: styles.statusPendingText, icon: Clock },
      'SALES_QR': { container: styles.statusSalesQR, text: styles.statusSalesQRText, icon: QrCode },
      'PAYMENT_QR': { container: styles.statusPaymentQR, text: styles.statusPaymentQRText, icon: CreditCard },
      'RELEASE_QR': { container: styles.statusReleaseQR, text: styles.statusReleaseQRText, icon: Package },
      'INVOICE_QR': { container: styles.statusInvoiceQR, text: styles.statusInvoiceQRText, icon: Truck },
      'COMPLETED': { container: styles.statusCompleted, text: styles.statusCompletedText, icon: CheckCircle },
      'CANCELLED': { container: styles.statusCancelled, text: styles.statusCancelledText, icon: XCircle },
    };
    return stylesMap[status] || { container: styles.statusDefault, text: styles.statusDefaultText, icon: Clock };
  };

  const getWorkflowSteps = () => {
    const steps = [
      { 
        key: 'sales', 
        label: 'Sales QR', 
        icon: QrCode,
        completed: !!transaction?.salesQR,
        status: transaction?.qrStatus?.salesQRScanned ? 'scanned' : 'generated',
      },
      { 
        key: 'payment', 
        label: 'Payment QR', 
        icon: CreditCard,
        completed: !!transaction?.paymentQR,
        status: transaction?.qrStatus?.paymentQRScanned ? 'scanned' : transaction?.paymentQR ? 'generated' : 'pending',
      },
      { 
        key: 'release', 
        label: 'Release QR', 
        icon: Package,
        completed: !!transaction?.releaseQR,
        status: transaction?.qrStatus?.releaseQRScanned ? 'scanned' : transaction?.releaseQR ? 'generated' : 'pending',
      },
      { 
        key: 'invoice', 
        label: 'Invoice QR', 
        icon: Truck,
        completed: !!transaction?.invoiceQR,
        status: transaction?.qrStatus?.invoiceQRScanned ? 'scanned' : transaction?.invoiceQR ? 'generated' : 'pending',
      },
    ];
    return steps;
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
      </View>
    );
  }

  const statusStyles = getStatusStyles(transaction.status);
  const StatusIcon = statusStyles.icon;
  const workflowSteps = getWorkflowSteps();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomHeader title="Transaction Details" />
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerLabel}>Transaction Number</Text>
            <Text style={styles.headerNumber}>{transaction.transactionNumber}</Text>
          </View>
          <View style={[styles.statusBadge, statusStyles.container]}>
            <StatusIcon size={14} color={statusStyles.text.color} />
            <Text style={[styles.statusText, statusStyles.text]}>{transaction.status}</Text>
          </View>
        </View>
        <Text style={styles.headerDate}>{formatDateTime(transaction.createdAt)}</Text>
        <Text style={styles.headerStore}>Store: {transaction.storeId?.name || 'N/A'}</Text>
      </View>

      {/* Workflow Progress */}
      <View style={styles.workflowCard}>
        <Text style={styles.sectionTitle}>Transaction Progress</Text>
        <View style={styles.workflowContainer}>
          {workflowSteps.map((step, index) => {
            const isActive = step.status === 'generated' || step.status === 'scanned';
            const isCompleted = step.status === 'scanned';
            const isLast = index === workflowSteps.length - 1;

            return (
              <View key={step.key} style={styles.workflowStep}>
                <View style={styles.workflowStepRow}>
                  <View style={[
                    styles.workflowDot,
                    isCompleted && styles.workflowDotCompleted,
                    isActive && !isCompleted && styles.workflowDotActive,
                    step.status === 'pending' && styles.workflowDotPending,
                  ]}>
                    <step.icon size={14} color={isCompleted ? Colors.white : isActive ? Colors.primary : Colors.gray400} />
                  </View>
                  <View style={styles.workflowStepInfo}>
                    <Text style={[
                      styles.workflowStepLabel,
                      isCompleted && styles.workflowStepCompleted,
                      isActive && !isCompleted && styles.workflowStepActive,
                      step.status === 'pending' && styles.workflowStepPending,
                    ]}>
                      {step.label}
                    </Text>
                    <Text style={styles.workflowStepStatus}>
                      {step.status === 'scanned' ? '✅ Scanned' : 
                       step.status === 'generated' ? '📷 Generated' : 
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
        <Text style={styles.sectionTitle}>Items ({transaction.items?.length || 0})</Text>
        {transaction.items?.map((item, index) => {
          const product = item.productId || item;
          return (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{product.name}</Text>
                <Text style={styles.itemDetail}>
                  Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                </Text>
                {item.isReleased && (
                  <Text style={styles.itemReleased}>✓ Released</Text>
                )}
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          );
        })}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(transaction.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>{formatCurrency(transaction.taxTotal)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(transaction.totalAmount)}</Text>
          </View>
        </View>
      </View>

      {/* Payment Details */}
      {transaction.paymentMethod && (
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Method</Text>
            <Text style={styles.paymentValue}>{transaction.paymentMethod}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Amount Paid</Text>
            <Text style={styles.paymentValue}>{formatCurrency(transaction.amountPaid)}</Text>
          </View>
          {transaction.changeAmount > 0 && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Change</Text>
              <Text style={[styles.paymentValue, styles.changeText]}>{formatCurrency(transaction.changeAmount)}</Text>
            </View>
          )}
        </View>
      )}

      {/* Released Items */}
      {transaction.itemsReleased && transaction.itemsReleased.length > 0 && (
        <View style={styles.releaseCard}>
          <Text style={styles.sectionTitle}>Released Items</Text>
          {transaction.itemsReleased.map((item, index) => (
            <View key={index} style={styles.releaseRow}>
              <Text style={styles.releaseName}>{item.productName || 'Product'}</Text>
              <Text style={styles.releaseQty}>×{item.quantityReleased}</Text>
              <Text style={styles.releaseTotal}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          ))}
          {transaction.finalInvoiceNumber && (
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Invoice #</Text>
              <Text style={styles.invoiceValue}>{transaction.finalInvoiceNumber}</Text>
            </View>
          )}
        </View>
      )}

      {/* QR Codes Summary */}
      <View style={styles.qrSummaryCard}>
        <Text style={styles.sectionTitle}>QR Codes</Text>
        <View style={styles.qrSummaryGrid}>
          {qrCodes && (
            <>
              <View style={styles.qrSummaryItem}>
                <Text style={styles.qrSummaryLabel}>Sales QR</Text>
                <View style={[styles.qrSummaryDot, qrCodes.salesQR ? styles.qrActive : styles.qrInactive]} />
              </View>
              <View style={styles.qrSummaryItem}>
                <Text style={styles.qrSummaryLabel}>Payment QR</Text>
                <View style={[styles.qrSummaryDot, qrCodes.paymentQR ? styles.qrActive : styles.qrInactive]} />
              </View>
              <View style={styles.qrSummaryItem}>
                <Text style={styles.qrSummaryLabel}>Release QR</Text>
                <View style={[styles.qrSummaryDot, qrCodes.releaseQR ? styles.qrActive : styles.qrInactive]} />
              </View>
              <View style={styles.qrSummaryItem}>
                <Text style={styles.qrSummaryLabel}>Invoice QR</Text>
                <View style={[styles.qrSummaryDot, qrCodes.invoiceQR ? styles.qrActive : styles.qrInactive]} />
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.gray700} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={() => {
            Alert.alert('Share', 'Share functionality coming soon');
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
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.gray500 },
  headerCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  headerNumber: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  headerDate: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.sm },
  headerStore: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
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
  workflowStepLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  workflowStepPending: { color: Colors.gray400 },
  workflowStepActive: { color: Colors.primary, fontWeight: '600' },
  workflowStepCompleted: { color: Colors.success },
  workflowStepStatus: { fontSize: Typography.xs, color: Colors.gray400 },
  workflowLine: { position: 'absolute', left: 15, top: 32, width: 2, height: 20 },
  workflowLineCompleted: { backgroundColor: Colors.success },
  workflowLineActive: { backgroundColor: Colors.primary },
  itemsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
  itemReleased: { fontSize: Typography.xs, color: Colors.success },
  itemTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  totalsContainer: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.gray200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
  totalLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  totalValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  grandTotalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  grandTotalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
  paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
  paymentLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  paymentValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  changeText: { color: Colors.success },
  releaseCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  releaseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  releaseName: { fontSize: Typography.sm, color: Colors.gray700, flex: 1 },
  releaseQty: { fontSize: Typography.sm, color: Colors.gray500, marginHorizontal: Spacing.sm },
  releaseTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.primary },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray200 },
  invoiceLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  invoiceValue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.success },
  qrSummaryCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  qrSummaryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  qrSummaryItem: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  qrSummaryLabel: { fontSize: Typography.sm, color: Colors.gray600, flex: 1 },
  qrSummaryDot: { width: 12, height: 12, borderRadius: BorderRadius.full, marginLeft: Spacing.sm },
  qrActive: { backgroundColor: Colors.success },
  qrInactive: { backgroundColor: Colors.gray300 },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backButton: { backgroundColor: Colors.gray200 },
  backButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  shareButton: { backgroundColor: Colors.primary },
  shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
});