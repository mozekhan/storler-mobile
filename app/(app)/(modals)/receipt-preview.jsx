// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   Image,
// //   ActivityIndicator,
// //   Alert,
// //   Share,
// //   Dimensions,
// //   Platform,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useRouter, useLocalSearchParams } from 'expo-router';
// // import { X, Download, Share2, Printer, QrCode, CheckCircle, ArrowLeft } from 'lucide-react-native';
// // import TransactionService from '../../../services/transactionService';
// // import ReceiptService from '../../../services/receiptService';
// // import PrinterService from '../../../services/printer';
// // import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
// // import { formatCurrency, formatDateTime } from '../../../utils/formatters';
// // import CustomHeader from '../../../components/ui/CustomHeader';
// // import BluetoothPrinterModal from '../../../components/print/BluetoothPrinterModal';
// // import * as FileSystem from 'expo-file-system';
// // import * as Sharing from 'expo-sharing';
// // import ViewShot from 'react-native-view-shot';
// // import { captureRef } from 'react-native-view-shot';

// // const { width } = Dimensions.get('window');

// // export default function ReceiptPreview() {
// //   const router = useRouter();
// //   const { 
// //     transactionId, 
// //     qrData, 
// //     qrType, 
// //     transactionNumber, 
// //     invoiceNumber,
// //     mode 
// //   } = useLocalSearchParams();
  
// //   const [loading, setLoading] = useState(true);
// //   const [transaction, setTransaction] = useState(null);
// //   const [qrCode, setQrCode] = useState(qrData || null);
// //   const [receiptData, setReceiptData] = useState(null);
// //   const [receipt, setReceipt] = useState(null);
// //   const [viewShotRef, setViewShotRef] = useState(null);
// //   const [printerModalVisible, setPrinterModalVisible] = useState(false);
// //   const [printReceiptData, setPrintReceiptData] = useState(null);
// //   const [isPrinterConnected, setIsPrinterConnected] = useState(false);
// //   const [printerDevice, setPrinterDevice] = useState(null);

// //   useEffect(() => {
// //     if (transactionId) {
// //       fetchReceipt();
// //     }
// //   }, [transactionId]);

// //   const fetchReceipt = async () => {
// //     try {
// //       setLoading(true);
      
// //       // Get transaction with full details
// //       const result = await TransactionService.getTransaction(transactionId);
// //       setTransaction(result);
      
// //       // Get receipt data from transaction
// //       if (result.receiptData) {
// //         setReceiptData(result.receiptData);
// //       }
      
// //       // Determine QR code
// //       if (qrData) {
// //         setQrCode(qrData);
// //       } else if (qrType === 'SALES' && result.salesQR) {
// //         setQrCode(result.salesQR);
// //       } else if (qrType === 'PAYMENT' && result.paymentQR) {
// //         setQrCode(result.paymentQR);
// //       } else if (qrType === 'RELEASE' && result.releaseQR) {
// //         setQrCode(result.releaseQR);
// //       } else if (qrType === 'INVOICE' && result.invoiceQR) {
// //         setQrCode(result.invoiceQR);
// //       } else if (result.salesQR) {
// //         setQrCode(result.salesQR);
// //       }
      
// //       // Try to get receipt record
// //       try {
// //         const receiptRecord = await ReceiptService.getReceiptsByTransaction(transactionId);
// //         if (receiptRecord && receiptRecord.length > 0) {
// //           const found = receiptRecord.find(r => r.type === qrType) || receiptRecord[0];
// //           setReceipt(found);
// //         }
// //       } catch (e) {
// //         console.log('No receipt record found');
// //       }
      
// //     } catch (error) {
// //       console.error('Error fetching receipt:', error);
// //       Alert.alert('Error', 'Failed to load receipt');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleShare = async () => {
// //     try {
// //       await Share.share({
// //         message: getShareMessage(),
// //         title: 'Receipt',
// //       });
// //     } catch (error) {
// //       Alert.alert('Error', 'Failed to share receipt');
// //     }
// //   };

// //   const getShareMessage = () => {
// //     const t = transaction || {};
// //     const data = receiptData || {};
// //     const store = data.store || {};
// //     const summary = data.summary || {};
    
// //     return `
// // ${store.name || 'Store'}
// // ${store.address || ''}
// // ${store.phone ? `Tel: ${store.phone}` : ''}
// // ${store.email ? `Email: ${store.email}` : ''}
// // ${'─'.repeat(40)}
// // ${qrType || 'SALES'} RECEIPT
// // ${'─'.repeat(40)}
// // Transaction: ${t.transactionNumber || transactionNumber || 'N/A'}
// // ${t.finalInvoiceNumber ? `Invoice: ${t.finalInvoiceNumber}` : ''}
// // Date: ${formatDateTime(t.createdAt)}
// // Status: ${t.status || 'N/A'}
// // ${'─'.repeat(40)}
// // ITEMS
// // ${'─'.repeat(40)}
// // ${formatItemsForShare(data.items || [])}
// // ${'─'.repeat(40)}
// // Subtotal: ${formatCurrency(summary.subtotal || t.subtotal || 0)}
// // Tax: ${formatCurrency(summary.taxTotal || t.taxTotal || 0)}
// // TOTAL: ${formatCurrency(summary.totalAmount || t.totalAmount || 0)}
// // ${'─'.repeat(40)}
// // ${summary.paymentMethod ? `Payment: ${summary.paymentMethod}` : ''}
// // ${summary.amountPaid ? `Amount Paid: ${formatCurrency(summary.amountPaid)}` : ''}
// // ${summary.changeAmount ? `Change: ${formatCurrency(summary.changeAmount)}` : ''}
// // ${'─'.repeat(40)}
// // Thank you for your business!
// //     `.trim();
// //   };

// //   const formatItemsForShare = (items) => {
// //     if (!items || items.length === 0) return 'No items';
// //     return items.map(item => {
// //       const name = item.name || 'Item';
// //       const qty = item.quantity || 0;
// //       const price = item.unitPrice || 0;
// //       const total = item.totalPrice || (qty * price);
// //       return `${name.substring(0, 25)}  ${qty} × ${formatCurrency(price)} = ${formatCurrency(total)}`;
// //     }).join('\n');
// //   };

// //   const handleDownloadPDF = async () => {
// //     try {
// //       setLoading(true);
      
// //       // Generate receipt PDF via API
// //       const response = await ReceiptService.generateReceipt(transactionId, qrType);
      
// //       if (response && response.downloadUrl) {
// //         // Download the PDF
// //         const fileUri = FileSystem.documentDirectory + `receipt_${transactionNumber || Date.now()}.pdf`;
// //         const downloadResult = await FileSystem.downloadAsync(
// //           response.downloadUrl,
// //           fileUri
// //         );
        
// //         if (downloadResult.status === 200) {
// //           if (await Sharing.isAvailableAsync()) {
// //             await Sharing.shareAsync(fileUri);
// //           } else {
// //             Alert.alert('Download Complete', `Receipt saved to ${fileUri}`);
// //           }
// //         }
// //       } else {
// //         // Fallback: Generate PDF from receipt data
// //         await generateAndDownloadPDF();
// //       }
// //     } catch (error) {
// //       console.error('Download error:', error);
// //       Alert.alert('Error', 'Failed to download receipt. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const generateAndDownloadPDF = async () => {
// //     try {
// //       // Use view-shot to capture the receipt view
// //       if (viewShotRef) {
// //         const uri = await captureRef(viewShotRef, {
// //           format: 'png',
// //           quality: 0.8,
// //         });
        
// //         // Share the image as PDF alternative
// //         if (await Sharing.isAvailableAsync()) {
// //           await Sharing.shareAsync(uri);
// //         }
// //       } else {
// //         Alert.alert('Info', 'Please try again with the share button');
// //       }
// //     } catch (error) {
// //       console.error('Capture error:', error);
// //       Alert.alert('Error', 'Failed to generate download');
// //     }
// //   };


// //   const t = transaction;
// //   const data = receiptData || {};
// //   const store = data.store || {};
// //   const summary = data.summary || {};
// //   const items = data.items || t?.items || [];
// //   const staff = data.staff || {};
// //   const timeline = data.timeline || {};
// //   const qrCodes = data.qrCodes || {};
// //   const releasedItems = data.releasedItems || t?.itemsReleased || [];

// // useEffect(() => {
// //   checkPrinterStatus();

// //   // addConnectionListener returns an unsubscribe function - PrinterService
// //   // has no removeConnectionListener(), so capture and call this instead or
// //   // the listener leaks (and unmount previously threw).
// //   const unsubscribe = PrinterService.addConnectionListener(({ connected, device }) => {
// //     setIsPrinterConnected(connected);
// //     setPrinterDevice(device);
// //   });

// //   return () => {
// //     if (typeof unsubscribe === 'function') unsubscribe();
// //   };
// // }, []);

// // // Check printer status
// // const checkPrinterStatus = () => {
// //   const status = PrinterService.getConnectionStatus();
// //   setIsPrinterConnected(status.connected);
// //   if (status.connected) {
// //     setPrinterDevice(status.device);
// //   }
// // };

// // // Update handlePrint function
// // const handlePrint = () => {
// //   // Prepare receipt data
// //   const printData = {
// //     store: {
// //       name: store.name || transaction?.storeId?.name || 'Store',
// //       address: store.address || '',
// //       phone: store.phone || '',
// //       email: store.email || '',
// //     },
// //     transaction: {
// //       number: transaction?.transactionNumber || transactionNumber || 'N/A',
// //       createdAt: transaction?.createdAt || new Date(),
// //       status: transaction?.status || 'N/A',
// //     },
// //     items: items.map(item => ({
// //       name: item.name || item.productId?.name || 'Item',
// //       sku: item.sku || item.productId?.sku || '',
// //       quantity: item.quantity || 0,
// //       unitPrice: item.unitPrice || 0,
// //       totalPrice: item.totalPrice || (item.quantity || 0) * (item.unitPrice || 0),
// //       taxAmount: item.taxAmount || 0,
// //     })),
// //     summary: {
// //       subtotal: summary.subtotal || transaction?.subtotal || 0,
// //       taxTotal: summary.taxTotal || transaction?.taxTotal || 0,
// //       discountTotal: summary.discountTotal || 0,
// //       totalAmount: summary.totalAmount || transaction?.totalAmount || 0,
// //       amountPaid: summary.amountPaid || transaction?.amountPaid || 0,
// //       changeAmount: summary.changeAmount || transaction?.changeAmount || 0,
// //       paymentMethod: summary.paymentMethod || transaction?.paymentMethod || '',
// //     },
// //     staff: {
// //       salesAttendant: staff.salesAttendant || (transaction?.salesAttendantId ? {
// //         name: `${transaction.salesAttendantId.firstName || ''} ${transaction.salesAttendantId.lastName || ''}`.trim() || 'N/A',
// //       } : null),
// //       financeAttendant: staff.financeAttendant || (transaction?.financeAttendantId ? {
// //         name: `${transaction.financeAttendantId.firstName || ''} ${transaction.financeAttendantId.lastName || ''}`.trim() || 'N/A',
// //       } : null),
// //       warehouseStaff: staff.warehouseStaff || (transaction?.warehouseStaffId ? {
// //         name: `${transaction.warehouseStaffId.firstName || ''} ${transaction.warehouseStaffId.lastName || ''}`.trim() || 'N/A',
// //       } : null),
// //     },
// //     payment: {
// //       method: transaction?.paymentMethod || '',
// //       reference: transaction?.paymentReference || '',
// //     },
// //     invoice: {
// //       number: transaction?.finalInvoiceNumber || '',
// //     },
// //     qrCode: qrCode,
// //   };
  
// //   setPrintReceiptData(printData);
// //   setPrinterModalVisible(true);
// // };



// //   const getQRTypeLabel = () => {
// //     const labels = {
// //       'SALES': 'Sales QR - Scan for Payment',
// //       'PAYMENT': 'Payment QR - Scan for Warehouse Release',
// //       'RELEASE': 'Release QR - Scan for Invoice',
// //       'INVOICE': 'Invoice QR - Scan to Complete',
// //       'FINAL': 'Final Receipt'
// //     };
// //     return labels[qrType] || 'QR Code';
// //   };

// //   const getQRTypeColor = () => {
// //     const colors = {
// //       'SALES': Colors.primary,
// //       'PAYMENT': Colors.success,
// //       'RELEASE': Colors.warning,
// //       'INVOICE': Colors.primary,
// //       'FINAL': Colors.success,
// //     };
// //     return colors[qrType] || Colors.primary;
// //   };

// //   const getReceiptTitle = () => {
// //     const titles = {
// //       'SALES': 'Sales Receipt',
// //       'PAYMENT': 'Payment Receipt',
// //       'RELEASE': 'Release Receipt',
// //       'INVOICE': 'Final Invoice',
// //       'FINAL': 'Final Receipt'
// //     };
// //     return titles[qrType] || 'Receipt';
// //   };

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color={Colors.primary} />
// //         <Text style={styles.loadingText}>Loading receipt...</Text>
// //       </SafeAreaView>
// //     );
// //   }

// //   if (!transaction) {
// //     return (
// //       <SafeAreaView style={styles.errorContainer}>
// //         <Text style={styles.errorText}>Receipt not found</Text>
// //         <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
// //           <Text style={styles.closeButtonText}>Close</Text>
// //         </TouchableOpacity>
// //       </SafeAreaView>
// //     );
// //   }

  

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
// //           <ArrowLeft size={24} color={Colors.gray700} />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>{getReceiptTitle()}</Text>
// //         <View style={{ width: 40 }} />
// //       </View>

// //       <ScrollView 
// //         style={styles.scrollView}
// //         contentContainerStyle={styles.scrollContent}
// //       >
// //         <ViewShot 
// //           ref={setViewShotRef}
// //           style={styles.receiptCard}
// //           options={{ format: 'png', quality: 0.9 }}
// //         >
// //           {/* Header */}
// //           <View style={styles.receiptHeader}>
// //             <Text style={styles.receiptTitle}>{getReceiptTitle()}</Text>
// //             <Text style={styles.receiptSubtitle}>{store.name || 'Store'}</Text>
// //             {store.address && (
// //               <Text style={styles.receiptDetail}>{store.address}</Text>
// //             )}
// //             {store.phone && (
// //               <Text style={styles.receiptDetail}>📞 {store.phone}</Text>
// //             )}
// //             {store.email && (
// //               <Text style={styles.receiptDetail}>✉️ {store.email}</Text>
// //             )}
// //           </View>

// //           <View style={styles.divider} />

// //           {/* Transaction Info */}
// //           <View style={styles.receiptSection}>
// //             <View style={styles.receiptRow}>
// //               <Text style={styles.receiptLabel}>Transaction</Text>
// //               <Text style={styles.receiptValue}>{t.transactionNumber || transactionNumber}</Text>
// //             </View>
// //             {t.finalInvoiceNumber && (
// //               <View style={styles.receiptRow}>
// //                 <Text style={styles.receiptLabel}>Invoice #</Text>
// //                 <Text style={[styles.receiptValue, styles.invoiceText]}>{t.finalInvoiceNumber}</Text>
// //               </View>
// //             )}
// //             <View style={styles.receiptRow}>
// //               <Text style={styles.receiptLabel}>Date</Text>
// //               <Text style={styles.receiptValue}>{formatDateTime(t.createdAt)}</Text>
// //             </View>
// //             <View style={styles.receiptRow}>
// //               <Text style={styles.receiptLabel}>Status</Text>
// //               <Text style={[styles.receiptValue, styles.statusText]}>
// //                 {t.status || 'N/A'}
// //               </Text>
// //             </View>
// //             {t.paymentMethod && (
// //               <View style={styles.receiptRow}>
// //                 <Text style={styles.receiptLabel}>Payment Method</Text>
// //                 <Text style={styles.receiptValue}>{t.paymentMethod}</Text>
// //               </View>
// //             )}
// //           </View>

// //           <View style={styles.divider} />

// //           {/* Items */}
// //           {items && items.length > 0 && (
// //             <View style={styles.receiptSection}>
// //               <Text style={styles.sectionTitle}>Items ({items.length})</Text>
// //               {items.map((item, index) => {
// //                 const product = item.productId || item;
// //                 const itemName = item.name || product?.name || 'Item';
// //                 const qty = item.quantity || 0;
// //                 const unitPrice = item.unitPrice || 0;
// //                 const total = item.totalPrice || (qty * unitPrice);
// //                 const isReleased = item.isReleased || false;
                
// //                 return (
// //                   <View key={index} style={styles.itemRow}>
// //                     <View style={styles.itemInfo}>
// //                       <Text style={styles.itemName} numberOfLines={2}>
// //                         {itemName}
// //                       </Text>
// //                       <Text style={styles.itemDetail}>
// //                         Qty: {qty} × {formatCurrency(unitPrice)}
// //                       </Text>
// //                       {item.sku && (
// //                         <Text style={styles.itemSku}>SKU: {item.sku}</Text>
// //                       )}
// //                       {isReleased && (
// //                         <Text style={styles.itemReleased}>✓ Released</Text>
// //                       )}
// //                     </View>
// //                     <Text style={styles.itemTotal}>{formatCurrency(total)}</Text>
// //                   </View>
// //                 );
// //               })}
// //             </View>
// //           )}

// //           {/* Released Items */}
// //           {releasedItems && releasedItems.length > 0 && (
// //             <View style={styles.receiptSection}>
// //               <Text style={styles.sectionTitle}>Released Items ({releasedItems.length})</Text>
// //               {releasedItems.map((item, index) => (
// //                 <View key={index} style={styles.itemRow}>
// //                   <View style={styles.itemInfo}>
// //                     <Text style={styles.itemName}>
// //                       {item.productName || 'Item'}
// //                     </Text>
// //                     <Text style={styles.itemDetail}>
// //                       Qty: {item.quantityReleased || 0} × {formatCurrency(item.unitPrice || 0)}
// //                     </Text>
// //                     {item.releasedByName && (
// //                       <Text style={styles.itemReleasedBy}>
// //                         Released by: {item.releasedByName}
// //                       </Text>
// //                     )}
// //                   </View>
// //                   <Text style={styles.itemTotal}>
// //                     {formatCurrency(item.totalPrice || 0)}
// //                   </Text>
// //                 </View>
// //               ))}
// //             </View>
// //           )}

// //           <View style={styles.divider} />

// //           {/* Staff */}
// //           {(staff.salesAttendant || staff.financeAttendant || staff.warehouseStaff) && (
// //             <View style={styles.receiptSection}>
// //               <Text style={styles.sectionTitle}>Staff</Text>
// //               {staff.salesAttendant && (
// //                 <View style={styles.staffRow}>
// //                   <Text style={styles.staffRole}>Sales:</Text>
// //                   <Text style={styles.staffName}>{staff.salesAttendant.name}</Text>
// //                   {staff.salesAttendant.email && (
// //                     <Text style={styles.staffEmail}>{staff.salesAttendant.email}</Text>
// //                   )}
// //                 </View>
// //               )}
// //               {staff.financeAttendant && (
// //                 <View style={styles.staffRow}>
// //                   <Text style={styles.staffRole}>Finance:</Text>
// //                   <Text style={styles.staffName}>{staff.financeAttendant.name}</Text>
// //                   {staff.financeAttendant.email && (
// //                     <Text style={styles.staffEmail}>{staff.financeAttendant.email}</Text>
// //                   )}
// //                 </View>
// //               )}
// //               {staff.warehouseStaff && (
// //                 <View style={styles.staffRow}>
// //                   <Text style={styles.staffRole}>Warehouse:</Text>
// //                   <Text style={styles.staffName}>{staff.warehouseStaff.name}</Text>
// //                   {staff.warehouseStaff.email && (
// //                     <Text style={styles.staffEmail}>{staff.warehouseStaff.email}</Text>
// //                   )}
// //                 </View>
// //               )}
// //             </View>
// //           )}

// //           <View style={styles.divider} />

// //           {/* Totals */}
// //           <View style={styles.receiptSection}>
// //             <View style={styles.totalRow}>
// //               <Text style={styles.totalLabel}>Subtotal</Text>
// //               <Text style={styles.totalValue}>
// //                 {formatCurrency(summary.subtotal || t.subtotal || 0)}
// //               </Text>
// //             </View>
// //             <View style={styles.totalRow}>
// //               <Text style={styles.totalLabel}>Tax</Text>
// //               <Text style={styles.totalValue}>
// //                 {formatCurrency(summary.taxTotal || t.taxTotal || 0)}
// //               </Text>
// //             </View>
// //             {summary.discountTotal > 0 && (
// //               <View style={styles.totalRow}>
// //                 <Text style={styles.totalLabel}>Discount</Text>
// //                 <Text style={[styles.totalValue, styles.discountValue]}>
// //                   -{formatCurrency(summary.discountTotal)}
// //                 </Text>
// //               </View>
// //             )}
// //             <View style={[styles.totalRow, styles.grandTotalRow]}>
// //               <Text style={styles.grandTotalLabel}>Total</Text>
// //               <Text style={styles.grandTotalValue}>
// //                 {formatCurrency(summary.totalAmount || t.totalAmount || 0)}
// //               </Text>
// //             </View>
// //             {summary.amountPaid > 0 && (
// //               <>
// //                 <View style={styles.totalRow}>
// //                   <Text style={styles.totalLabel}>Amount Paid</Text>
// //                   <Text style={styles.totalValue}>
// //                     {formatCurrency(summary.amountPaid || t.amountPaid || 0)}
// //                   </Text>
// //                 </View>
// //                 {summary.changeAmount > 0 && (
// //                   <View style={styles.totalRow}>
// //                     <Text style={styles.totalLabel}>Change</Text>
// //                     <Text style={[styles.totalValue, styles.changeText]}>
// //                       {formatCurrency(summary.changeAmount || t.changeAmount || 0)}
// //                     </Text>
// //                   </View>
// //                 )}
// //               </>
// //             )}
// //           </View>

// //           <View style={styles.divider} />

// //           {/* QR Code */}
// //           <View style={[styles.qrSection, { borderColor: getQRTypeColor() }]}>
// //             <Text style={[styles.qrTitle, { color: getQRTypeColor() }]}>
// //               {getQRTypeLabel()}
// //             </Text>
// //             {qrCode ? (
// //               <View style={styles.qrContainer}>
// //                 <Image 
// //                   source={{ uri: qrCode }}
// //                   style={styles.qrImage}
// //                   resizeMode="contain"
// //                   onError={(error) => {
// //                     console.error('QR Image loading error:', error);
// //                     setQrCode(null);
// //                   }}
// //                 />
// //                 <Text style={styles.qrHint}>
// //                   {qrType === 'SALES' && 'Scan to process payment'}
// //                   {qrType === 'PAYMENT' && 'Scan to release items from warehouse'}
// //                   {qrType === 'RELEASE' && 'Scan to view invoice'}
// //                   {qrType === 'INVOICE' && 'Scan to complete transaction'}
// //                 </Text>
// //               </View>
// //             ) : (
// //               <View style={styles.qrPlaceholder}>
// //                 <QrCode size={64} color={Colors.gray400} />
// //                 <Text style={styles.qrPlaceholderText}>QR code not available</Text>
// //               </View>
// //             )}
// //           </View>

// //           {/* Footer */}
// //           <View style={styles.receiptFooter}>
// //             <Text style={styles.footerText}>
// //               {store.receiptFooter || 'Thank you for your business!'}
// //             </Text>
// //             {receipt && receipt.printed && (
// //               <Text style={styles.footerSubtext}>
// //                 Printed: {formatDateTime(receipt.printedAt)} (×{receipt.printCount || 1})
// //               </Text>
// //             )}
// //           </View>
// //         </ViewShot>
// //       </ScrollView>

// //       {/* Action Buttons */}
// //       {/* <View style={styles.actionsContainer}>
// //         <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={handleShare}>
// //           <Share2 size={20} color={Colors.white} />
// //           <Text style={styles.actionButtonText}>Share</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={[styles.actionButton, styles.downloadButton]} onPress={handleDownloadPDF}>
// //           <Download size={20} color={Colors.white} />
// //           <Text style={styles.actionButtonText}>Download</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={[styles.actionButton, styles.printButton]} onPress={handlePrint}>
// //           <Printer size={20} color={Colors.white} />
// //           <Text style={styles.actionButtonText}>Print</Text>
// //         </TouchableOpacity>
// //       </View> */}

      
// // <View style={styles.actionsContainer}>
// //   <TouchableOpacity 
// //     style={[styles.actionButton, styles.shareButton]} 
// //     onPress={handleShare}
// //   >
// //     <Share2 size={20} color={Colors.white} />
// //     <Text style={styles.actionButtonText}>Share</Text>
// //   </TouchableOpacity>
  
// //   <TouchableOpacity 
// //     style={[styles.actionButton, styles.downloadButton]} 
// //     onPress={handleDownloadPDF}
// //   >
// //     <Download size={20} color={Colors.white} />
// //     <Text style={styles.actionButtonText}>Download</Text>
// //   </TouchableOpacity>
  
// //   <TouchableOpacity 
// //     style={[styles.actionButton, styles.printButton]} 
// //     onPress={handlePrint}
// //   >
// //     <Printer size={20} color={Colors.white} />
// //     <Text style={styles.actionButtonText}>Print</Text>
// //   </TouchableOpacity>
// // </View>

// // {/* <BluetoothPrinterModal
// //   visible={printerModalVisible}
// //   onClose={() => {
// //     setPrinterModalVisible(false);
// //     setPrintReceiptData(null);
// //   }}
// //   receiptData={printReceiptData}
// //   receiptType={qrType || 'SALES'}
// //   onPrintComplete={() => {
// //     fetchReceipt();
// //     setPrinterModalVisible(false);
// //   }}
// // /> */}
// // <BluetoothPrinterModal
// //   visible={printerModalVisible}
// //   onClose={() => {
// //     setPrinterModalVisible(false);
// //     setPrintReceiptData(null);
// //   }}
// //   receiptData={printReceiptData}
// //   receiptType={qrType || 'SALES'}
// //   onPrintComplete={() => {
// //     fetchReceipt();
// //     setPrinterModalVisible(false);
// //   }}
// // />
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: Colors.gray50,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: Colors.white,
// //   },
// //   loadingText: {
// //     marginTop: Spacing.md,
// //     color: Colors.gray500,
// //   },
// //   errorContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: Colors.white,
// //   },
// //   errorText: {
// //     fontSize: Typography.lg,
// //     color: Colors.gray700,
// //   },
// //   closeButton: {
// //     marginTop: Spacing.md,
// //     padding: Spacing.md,
// //     backgroundColor: Colors.primary,
// //     borderRadius: BorderRadius.lg,
// //   },
// //   closeButtonText: {
// //     color: Colors.white,
// //     fontWeight: '600',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: Spacing.md,
// //     paddingVertical: Spacing.md,
// //     backgroundColor: Colors.white,
// //     borderBottomWidth: 1,
// //     borderBottomColor: Colors.gray200,
// //   },
// //   headerButton: {
// //     padding: Spacing.sm,
// //   },
// //   headerTitle: {
// //     fontSize: Typography.lg,
// //     fontWeight: '600',
// //     color: Colors.gray900,
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     padding: Spacing.md,
// //     paddingBottom: Spacing['4xl'],
// //   },
// //   receiptCard: {
// //     backgroundColor: Colors.white,
// //     borderRadius: BorderRadius.lg,
// //     padding: Spacing['2xl'],
// //     ...Shadows.md,
// //   },
// //   receiptHeader: {
// //     alignItems: 'center',
// //     borderBottomWidth: 1,
// //     borderBottomColor: Colors.gray200,
// //     paddingBottom: Spacing.md,
// //     marginBottom: Spacing.md,
// //   },
// //   receiptTitle: {
// //     fontSize: Typography['2xl'],
// //     fontWeight: 'bold',
// //     color: Colors.gray900,
// //   },
// //   receiptSubtitle: {
// //     fontSize: Typography.md,
// //     fontWeight: '600',
// //     color: Colors.gray700,
// //     marginTop: Spacing.xs,
// //   },
// //   receiptDetail: {
// //     fontSize: Typography.sm,
// //     color: Colors.gray500,
// //     marginTop: 2,
// //   },
// //   divider: {
// //     borderTopWidth: 1,
// //     borderTopColor: Colors.gray200,
// //     marginVertical: Spacing.md,
// //   },
// //   receiptSection: {
// //     marginBottom: Spacing.md,
// //   },
// //   sectionTitle: {
// //     fontSize: Typography.md,
// //     fontWeight: '600',
// //     color: Colors.gray900,
// //     marginBottom: Spacing.sm,
// //   },
// //   receiptRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 4,
// //   },
// //   receiptLabel: {
// //     fontSize: Typography.sm,
// //     color: Colors.gray500,
// //   },
// //   receiptValue: {
// //     fontSize: Typography.sm,
// //     fontWeight: '500',
// //     color: Colors.gray900,
// //   },
// //   statusText: {
// //     color: Colors.primary,
// //     fontWeight: '600',
// //   },
// //   invoiceText: {
// //     color: Colors.success,
// //     fontWeight: '600',
// //   },
// //   changeText: {
// //     color: Colors.success,
// //   },
// //   discountValue: {
// //     color: Colors.success,
// //   },
// //   staffRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flexWrap: 'wrap',
// //     paddingVertical: 2,
// //   },
// //   staffRole: {
// //     fontSize: Typography.sm,
// //     color: Colors.gray600,
// //     width: 80,
// //   },
// //   staffName: {
// //     fontSize: Typography.sm,
// //     fontWeight: '500',
// //     color: Colors.gray900,
// //   },
// //   staffEmail: {
// //     fontSize: Typography.xs,
// //     color: Colors.gray400,
// //     marginLeft: 4,
// //   },
// //   itemRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 6,
// //     borderBottomWidth: 1,
// //     borderBottomColor: Colors.gray50,
// //   },
// //   itemInfo: {
// //     flex: 1,
// //     marginRight: Spacing.sm,
// //   },
// //   itemName: {
// //     fontSize: Typography.sm,
// //     fontWeight: '500',
// //     color: Colors.gray900,
// //   },
// //   itemDetail: {
// //     fontSize: Typography.xs,
// //     color: Colors.gray500,
// //   },
// //   itemSku: {
// //     fontSize: Typography.xs,
// //     color: Colors.gray400,
// //   },
// //   itemReleased: {
// //     fontSize: Typography.xs,
// //     color: Colors.success,
// //     fontWeight: '500',
// //   },
// //   itemReleasedBy: {
// //     fontSize: Typography.xs,
// //     color: Colors.primary,
// //   },
// //   itemTotal: {
// //     fontSize: Typography.sm,
// //     fontWeight: '600',
// //     color: Colors.gray900,
// //   },
// //   totalRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 2,
// //   },
// //   totalLabel: {
// //     fontSize: Typography.sm,
// //     color: Colors.gray600,
// //   },
// //   totalValue: {
// //     fontSize: Typography.sm,
// //     color: Colors.gray900,
// //   },
// //   grandTotalRow: {
// //     borderTopWidth: 1,
// //     borderTopColor: Colors.gray200,
// //     paddingTop: Spacing.sm,
// //     marginTop: Spacing.xs,
// //   },
// //   grandTotalLabel: {
// //     fontSize: Typography.md,
// //     fontWeight: 'bold',
// //     color: Colors.gray900,
// //   },
// //   grandTotalValue: {
// //     fontSize: Typography.md,
// //     fontWeight: 'bold',
// //     color: Colors.primary,
// //   },
// //   qrSection: {
// //     alignItems: 'center',
// //     padding: Spacing.md,
// //     marginBottom: Spacing.md,
// //     borderWidth: 2,
// //     borderRadius: BorderRadius.lg,
// //   },
// //   qrTitle: {
// //     fontSize: Typography.md,
// //     fontWeight: '600',
// //     marginBottom: Spacing.sm,
// //   },
// //   qrContainer: {
// //     alignItems: 'center',
// //   },
// //   qrImage: {
// //     width: width * 0.4,
// //     height: width * 0.4,
// //     backgroundColor: Colors.white,
// //     borderRadius: BorderRadius.lg,
// //   },
// //   qrHint: {
// //     fontSize: Typography.sm,
// //     color: Colors.gray500,
// //     marginTop: Spacing.sm,
// //   },
// //   qrPlaceholder: {
// //     width: width * 0.4,
// //     height: width * 0.4,
// //     backgroundColor: Colors.gray100,
// //     borderRadius: BorderRadius.lg,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   qrPlaceholderText: {
// //     marginTop: Spacing.sm,
// //     color: Colors.gray500,
// //     fontSize: Typography.sm,
// //   },
// //   receiptFooter: {
// //     marginTop: Spacing.md,
// //     paddingTop: Spacing.md,
// //     borderTopWidth: 1,
// //     borderTopColor: Colors.gray200,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     fontSize: Typography.md,
// //     color: Colors.gray600,
// //   },
// //   footerSubtext: {
// //     fontSize: Typography.xs,
// //     color: Colors.gray400,
// //     marginTop: 2,
// //   },
// //   actionsContainer: {
// //     flexDirection: 'row',
// //     padding: Spacing.md,
// //     backgroundColor: Colors.white,
// //     borderTopWidth: 1,
// //     borderTopColor: Colors.gray200,
// //   },
// //   actionButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: Spacing.md,
// //     borderRadius: BorderRadius.lg,
// //     marginHorizontal: 4,
// //   },
// //   shareButton: {
// //     backgroundColor: Colors.primary,
// //   },
// //   downloadButton: {
// //     backgroundColor: Colors.success,
// //   },
// //   printButton: {
// //     backgroundColor: Colors.warning,
// //   },
// //   actionButtonText: {
// //     color: Colors.white,
// //     fontWeight: '600',
// //     marginLeft: Spacing.xs,
// //   },
// // });



























// // receipt-preview.jsx (Updated)
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Alert,
//   Share,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Share2, Download, Printer, QrCode } from 'lucide-react-native';
// import TransactionService from '../../../services/transactionService';
// import ReceiptService from '../../../services/receiptService';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
// import { formatCurrency, formatDateTime } from '../../../utils/formatters';
// import CustomHeader from '../../../components/ui/CustomHeader';
// import BluetoothPrinterModal from '../../../components/print/BluetoothPrinterModal';
// import { usePrinter } from '../../../hooks/usePrinter';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import ViewShot from 'react-native-view-shot';

// const { width } = Dimensions.get('window');

// export default function ReceiptPreview() {
//   const router = useRouter();
//   const { 
//     transactionId, 
//     qrData, 
//     qrType, 
//     transactionNumber, 
//     invoiceNumber,
//     mode 
//   } = useLocalSearchParams();
  
//   const viewShotRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [transaction, setTransaction] = useState(null);
//   const [qrCode, setQrCode] = useState(qrData || null);
//   const [receiptData, setReceiptData] = useState(null);
//   const [receipt, setReceipt] = useState(null);

//   // Use the printer hook
//   const {
//     printerModalVisible,
//     printReceiptData,
//     openPrintModal,
//     closePrintModal,
//     handlePrintComplete,
//     setPrinterModalVisible,
//   } = usePrinter();

//   useEffect(() => {
//     if (transactionId) {
//       fetchReceipt();
//     }
//   }, [transactionId]);

//   const fetchReceipt = async () => {
//     try {
//       setLoading(true);
      
//       const result = await TransactionService.getTransaction(transactionId);
//       setTransaction(result);
      
//       if (result.receiptData) {
//         setReceiptData(result.receiptData);
//       }
      
//       // Determine QR code
//       if (qrData) {
//         setQrCode(qrData);
//       } else if (qrType === 'SALES' && result.salesQR) {
//         setQrCode(result.salesQR);
//       } else if (qrType === 'PAYMENT' && result.paymentQR) {
//         setQrCode(result.paymentQR);
//       } else if (qrType === 'RELEASE' && result.releaseQR) {
//         setQrCode(result.releaseQR);
//       } else if (qrType === 'INVOICE' && result.invoiceQR) {
//         setQrCode(result.invoiceQR);
//       } else if (result.salesQR) {
//         setQrCode(result.salesQR);
//       }
      
//       try {
//         const receiptRecord = await ReceiptService.getReceiptsByTransaction(transactionId);
//         if (receiptRecord && receiptRecord.length > 0) {
//           const found = receiptRecord.find(r => r.type === qrType) || receiptRecord[0];
//           setReceipt(found);
//         }
//       } catch (e) {
//         console.log('No receipt record found');
//       }
      
//     } catch (error) {
//       console.error('Error fetching receipt:', error);
//       Alert.alert('Error', 'Failed to load receipt');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: getShareMessage(),
//         title: 'Receipt',
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Failed to share receipt');
//     }
//   };

//   const getShareMessage = () => {
//     const t = transaction || {};
//     const data = receiptData || {};
//     const store = data.store || {};
//     const summary = data.summary || {};
    
//     return `
// ${store.name || 'Store'}
// ${store.address || ''}
// ${store.phone ? `Tel: ${store.phone}` : ''}
// ${store.email ? `Email: ${store.email}` : ''}
// ${'─'.repeat(40)}
// ${qrType || 'SALES'} RECEIPT
// ${'─'.repeat(40)}
// Transaction: ${t.transactionNumber || transactionNumber || 'N/A'}
// ${t.finalInvoiceNumber ? `Invoice: ${t.finalInvoiceNumber}` : ''}
// Date: ${formatDateTime(t.createdAt)}
// Status: ${t.status || 'N/A'}
// ${'─'.repeat(40)}
// ITEMS
// ${'─'.repeat(40)}
// ${formatItemsForShare(data.items || [])}
// ${'─'.repeat(40)}
// Subtotal: ${formatCurrency(summary.subtotal || t.subtotal || 0)}
// Tax: ${formatCurrency(summary.taxTotal || t.taxTotal || 0)}
// TOTAL: ${formatCurrency(summary.totalAmount || t.totalAmount || 0)}
// ${'─'.repeat(40)}
// ${summary.paymentMethod ? `Payment: ${summary.paymentMethod}` : ''}
// ${summary.amountPaid ? `Amount Paid: ${formatCurrency(summary.amountPaid)}` : ''}
// ${summary.changeAmount ? `Change: ${formatCurrency(summary.changeAmount)}` : ''}
// ${'─'.repeat(40)}
// Thank you for your business!
//     `.trim();
//   };

//   const formatItemsForShare = (items) => {
//     if (!items || items.length === 0) return 'No items';
//     return items.map(item => {
//       const name = item.name || 'Item';
//       const qty = item.quantity || 0;
//       const price = item.unitPrice || 0;
//       const total = item.totalPrice || (qty * price);
//       return `${name.substring(0, 25)}  ${qty} × ${formatCurrency(price)} = ${formatCurrency(total)}`;
//     }).join('\n');
//   };

//   const handleDownloadPDF = async () => {
//     try {
//       setLoading(true);
      
//       const response = await ReceiptService.generateReceipt(transactionId, qrType);
      
//       if (response && response.downloadUrl) {
//         const fileUri = FileSystem.documentDirectory + `receipt_${transactionNumber || Date.now()}.pdf`;
//         const downloadResult = await FileSystem.downloadAsync(
//           response.downloadUrl,
//           fileUri
//         );
        
//         if (downloadResult.status === 200) {
//           if (await Sharing.isAvailableAsync()) {
//             await Sharing.shareAsync(fileUri);
//           } else {
//             Alert.alert('Download Complete', `Receipt saved to ${fileUri}`);
//           }
//         }
//       } else {
//         // Fallback: Capture view as image
//         if (viewShotRef.current) {
//           const uri = await viewShotRef.current.capture();
//           if (await Sharing.isAvailableAsync()) {
//             await Sharing.shareAsync(uri);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Download error:', error);
//       Alert.alert('Error', 'Failed to download receipt');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     const t = transaction || {};
//     const data = receiptData || {};
//     const store = data.store || {};
//     const summary = data.summary || {};
//     const items = data.items || t?.items || [];

//     // Prepare receipt data for printing
//     const printData = {
//       store: {
//         name: store.name || t?.storeId?.name || 'Store',
//         address: store.address || '',
//         phone: store.phone || '',
//         email: store.email || '',
//       },
//       transaction: {
//         number: t?.transactionNumber || transactionNumber || 'N/A',
//         createdAt: t?.createdAt || new Date(),
//         status: t?.status || 'N/A',
//       },
//       items: items.map(item => ({
//         name: item.name || item.productId?.name || 'Item',
//         sku: item.sku || item.productId?.sku || '',
//         quantity: item.quantity || 0,
//         unitPrice: item.unitPrice || 0,
//         totalPrice: item.totalPrice || (item.quantity || 0) * (item.unitPrice || 0),
//         taxAmount: item.taxAmount || 0,
//       })),
//       summary: {
//         subtotal: summary.subtotal || t?.subtotal || 0,
//         taxTotal: summary.taxTotal || t?.taxTotal || 0,
//         discountTotal: summary.discountTotal || 0,
//         totalAmount: summary.totalAmount || t?.totalAmount || 0,
//         amountPaid: summary.amountPaid || t?.amountPaid || 0,
//         changeAmount: summary.changeAmount || t?.changeAmount || 0,
//         paymentMethod: summary.paymentMethod || t?.paymentMethod || '',
//       },
//       payment: {
//         method: t?.paymentMethod || '',
//         reference: t?.paymentReference || '',
//       },
//       invoice: {
//         number: t?.finalInvoiceNumber || '',
//       },
//       qrCode: qrCode,
//     };

//     // Add staff info if available
//     if (data.staff) {
//       printData.staff = data.staff;
//     }

//     openPrintModal(printData, qrType || 'SALES');
//   };

//   const getQRTypeLabel = () => {
//     const labels = {
//       'SALES': 'Sales QR - Scan for Payment',
//       'PAYMENT': 'Payment QR - Scan for Warehouse Release',
//       'RELEASE': 'Release QR - Scan for Invoice',
//       'INVOICE': 'Invoice QR - Scan to Complete',
//       'FINAL': 'Final Receipt'
//     };
//     return labels[qrType] || 'QR Code';
//   };

//   const getQRTypeColor = () => {
//     const colors = {
//       'SALES': Colors.primary,
//       'PAYMENT': Colors.success,
//       'RELEASE': Colors.warning,
//       'INVOICE': Colors.primary,
//       'FINAL': Colors.success,
//     };
//     return colors[qrType] || Colors.primary;
//   };

//   const getReceiptTitle = () => {
//     const titles = {
//       'SALES': 'Sales Receipt',
//       'PAYMENT': 'Payment Receipt',
//       'RELEASE': 'Release Receipt',
//       'INVOICE': 'Final Invoice',
//       'FINAL': 'Final Receipt'
//     };
//     return titles[qrType] || 'Receipt';
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading receipt...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (!transaction) {
//     return (
//       <SafeAreaView style={styles.errorContainer}>
//         <Text style={styles.errorText}>Receipt not found</Text>
//         <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
//           <Text style={styles.closeButtonText}>Close</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   const t = transaction;
//   const data = receiptData || {};
//   const store = data.store || {};
//   const summary = data.summary || {};
//   const items = data.items || t?.items || [];
//   const staff = data.staff || {};
//   const releasedItems = data.releasedItems || t?.itemsReleased || [];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
//           <ArrowLeft size={24} color={Colors.gray700} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{getReceiptTitle()}</Text>
//         <View style={{ width: 40 }} />
//       </View>

//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <ViewShot 
//           ref={viewShotRef}
//           style={styles.receiptCard}
//           options={{ format: 'png', quality: 0.9 }}
//         >
//           {/* Header */}
//           <View style={styles.receiptHeader}>
//             <Text style={styles.receiptTitle}>{getReceiptTitle()}</Text>
//             <Text style={styles.receiptSubtitle}>{store.name || 'Store'}</Text>
//             {store.address && (
//               <Text style={styles.receiptDetail}>{store.address}</Text>
//             )}
//             {store.phone && (
//               <Text style={styles.receiptDetail}>📞 {store.phone}</Text>
//             )}
//             {store.email && (
//               <Text style={styles.receiptDetail}>✉️ {store.email}</Text>
//             )}
//           </View>

//           <View style={styles.divider} />

//           {/* Transaction Info */}
//           <View style={styles.receiptSection}>
//             <View style={styles.receiptRow}>
//               <Text style={styles.receiptLabel}>Transaction</Text>
//               <Text style={styles.receiptValue}>{t.transactionNumber || transactionNumber}</Text>
//             </View>
//             {t.finalInvoiceNumber && (
//               <View style={styles.receiptRow}>
//                 <Text style={styles.receiptLabel}>Invoice #</Text>
//                 <Text style={[styles.receiptValue, styles.invoiceText]}>{t.finalInvoiceNumber}</Text>
//               </View>
//             )}
//             <View style={styles.receiptRow}>
//               <Text style={styles.receiptLabel}>Date</Text>
//               <Text style={styles.receiptValue}>{formatDateTime(t.createdAt)}</Text>
//             </View>
//             <View style={styles.receiptRow}>
//               <Text style={styles.receiptLabel}>Status</Text>
//               <Text style={[styles.receiptValue, styles.statusText]}>
//                 {t.status || 'N/A'}
//               </Text>
//             </View>
//             {t.paymentMethod && (
//               <View style={styles.receiptRow}>
//                 <Text style={styles.receiptLabel}>Payment Method</Text>
//                 <Text style={styles.receiptValue}>{t.paymentMethod}</Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.divider} />

//           {/* Items */}
//           {items && items.length > 0 && (
//             <View style={styles.receiptSection}>
//               <Text style={styles.sectionTitle}>Items ({items.length})</Text>
//               {items.map((item, index) => {
//                 const product = item.productId || item;
//                 const itemName = item.name || product?.name || 'Item';
//                 const qty = item.quantity || 0;
//                 const unitPrice = item.unitPrice || 0;
//                 const total = item.totalPrice || (qty * unitPrice);
//                 const isReleased = item.isReleased || false;
                
//                 return (
//                   <View key={index} style={styles.itemRow}>
//                     <View style={styles.itemInfo}>
//                       <Text style={styles.itemName} numberOfLines={2}>
//                         {itemName}
//                       </Text>
//                       <Text style={styles.itemDetail}>
//                         Qty: {qty} × {formatCurrency(unitPrice)}
//                       </Text>
//                       {item.sku && (
//                         <Text style={styles.itemSku}>SKU: {item.sku}</Text>
//                       )}
//                       {isReleased && (
//                         <Text style={styles.itemReleased}>✓ Released</Text>
//                       )}
//                     </View>
//                     <Text style={styles.itemTotal}>{formatCurrency(total)}</Text>
//                   </View>
//                 );
//               })}
//             </View>
//           )}

//           {/* Released Items */}
//           {releasedItems && releasedItems.length > 0 && (
//             <View style={styles.receiptSection}>
//               <Text style={styles.sectionTitle}>Released Items ({releasedItems.length})</Text>
//               {releasedItems.map((item, index) => (
//                 <View key={index} style={styles.itemRow}>
//                   <View style={styles.itemInfo}>
//                     <Text style={styles.itemName}>
//                       {item.productName || 'Item'}
//                     </Text>
//                     <Text style={styles.itemDetail}>
//                       Qty: {item.quantityReleased || 0} × {formatCurrency(item.unitPrice || 0)}
//                     </Text>
//                     {item.releasedByName && (
//                       <Text style={styles.itemReleasedBy}>
//                         Released by: {item.releasedByName}
//                       </Text>
//                     )}
//                   </View>
//                   <Text style={styles.itemTotal}>
//                     {formatCurrency(item.totalPrice || 0)}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           <View style={styles.divider} />

//           {/* Staff */}
//           {(staff.salesAttendant || staff.financeAttendant || staff.warehouseStaff) && (
//             <View style={styles.receiptSection}>
//               <Text style={styles.sectionTitle}>Staff</Text>
//               {staff.salesAttendant && (
//                 <View style={styles.staffRow}>
//                   <Text style={styles.staffRole}>Sales:</Text>
//                   <Text style={styles.staffName}>{staff.salesAttendant.name}</Text>
//                 </View>
//               )}
//               {staff.financeAttendant && (
//                 <View style={styles.staffRow}>
//                   <Text style={styles.staffRole}>Finance:</Text>
//                   <Text style={styles.staffName}>{staff.financeAttendant.name}</Text>
//                 </View>
//               )}
//               {staff.warehouseStaff && (
//                 <View style={styles.staffRow}>
//                   <Text style={styles.staffRole}>Warehouse:</Text>
//                   <Text style={styles.staffName}>{staff.warehouseStaff.name}</Text>
//                 </View>
//               )}
//             </View>
//           )}

//           <View style={styles.divider} />

//           {/* Totals */}
//           <View style={styles.receiptSection}>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Subtotal</Text>
//               <Text style={styles.totalValue}>
//                 {formatCurrency(summary.subtotal || t.subtotal || 0)}
//               </Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Tax</Text>
//               <Text style={styles.totalValue}>
//                 {formatCurrency(summary.taxTotal || t.taxTotal || 0)}
//               </Text>
//             </View>
//             {summary.discountTotal > 0 && (
//               <View style={styles.totalRow}>
//                 <Text style={styles.totalLabel}>Discount</Text>
//                 <Text style={[styles.totalValue, styles.discountValue]}>
//                   -{formatCurrency(summary.discountTotal)}
//                 </Text>
//               </View>
//             )}
//             <View style={[styles.totalRow, styles.grandTotalRow]}>
//               <Text style={styles.grandTotalLabel}>Total</Text>
//               <Text style={styles.grandTotalValue}>
//                 {formatCurrency(summary.totalAmount || t.totalAmount || 0)}
//               </Text>
//             </View>
//             {summary.amountPaid > 0 && (
//               <>
//                 <View style={styles.totalRow}>
//                   <Text style={styles.totalLabel}>Amount Paid</Text>
//                   <Text style={styles.totalValue}>
//                     {formatCurrency(summary.amountPaid || t.amountPaid || 0)}
//                   </Text>
//                 </View>
//                 {summary.changeAmount > 0 && (
//                   <View style={styles.totalRow}>
//                     <Text style={styles.totalLabel}>Change</Text>
//                     <Text style={[styles.totalValue, styles.changeText]}>
//                       {formatCurrency(summary.changeAmount || t.changeAmount || 0)}
//                     </Text>
//                   </View>
//                 )}
//               </>
//             )}
//           </View>

//           <View style={styles.divider} />

//           {/* QR Code */}
//           <View style={[styles.qrSection, { borderColor: getQRTypeColor() }]}>
//             <Text style={[styles.qrTitle, { color: getQRTypeColor() }]}>
//               {getQRTypeLabel()}
//             </Text>
//             {qrCode ? (
//               <View style={styles.qrContainer}>
//                 <Image 
//                   source={{ uri: qrCode }}
//                   style={styles.qrImage}
//                   resizeMode="contain"
//                   onError={(error) => {
//                     console.error('QR Image loading error:', error);
//                     setQrCode(null);
//                   }}
//                 />
//                 <Text style={styles.qrHint}>
//                   {qrType === 'SALES' && 'Scan to process payment'}
//                   {qrType === 'PAYMENT' && 'Scan to release items from warehouse'}
//                   {qrType === 'RELEASE' && 'Scan to view invoice'}
//                   {qrType === 'INVOICE' && 'Scan to complete transaction'}
//                 </Text>
//               </View>
//             ) : (
//               <View style={styles.qrPlaceholder}>
//                 <QrCode size={64} color={Colors.gray400} />
//                 <Text style={styles.qrPlaceholderText}>QR code not available</Text>
//               </View>
//             )}
//           </View>

//           {/* Footer */}
//           <View style={styles.receiptFooter}>
//             <Text style={styles.footerText}>
//               {store.receiptFooter || 'Thank you for your business!'}
//             </Text>
//             {receipt && receipt.printed && (
//               <Text style={styles.footerSubtext}>
//                 Printed: {formatDateTime(receipt.printedAt)} (×{receipt.printCount || 1})
//               </Text>
//             )}
//           </View>
//         </ViewShot>
//       </ScrollView>

//       {/* Action Buttons */}
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.shareButton]} 
//           onPress={handleShare}
//         >
//           <Share2 size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Share</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.downloadButton]} 
//           onPress={handleDownloadPDF}
//         >
//           <Download size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Download</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.printButton]} 
//           onPress={handlePrint}
//         >
//           <Printer size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Print</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Bluetooth Printer Modal */}
//       <BluetoothPrinterModal
//         visible={printerModalVisible}
//         onClose={closePrintModal}
//         receiptData={printReceiptData}
//         receiptType={qrType || 'SALES'}
//         onPrintComplete={() => {
//           handlePrintComplete();
//           fetchReceipt();
//         }}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//   },
//   loadingText: {
//     marginTop: Spacing.md,
//     color: Colors.gray500,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//   },
//   errorText: {
//     fontSize: Typography.lg,
//     color: Colors.gray700,
//   },
//   closeButton: {
//     marginTop: Spacing.md,
//     padding: Spacing.md,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//   },
//   closeButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//   },
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
//   headerButton: {
//     padding: Spacing.sm,
//   },
//   headerTitle: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: Spacing.md,
//     paddingBottom: Spacing['4xl'],
//   },
//   receiptCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing['2xl'],
//     ...Shadows.md,
//   },
//   receiptHeader: {
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//     paddingBottom: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   receiptTitle: {
//     fontSize: Typography['2xl'],
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   receiptSubtitle: {
//     fontSize: Typography.md,
//     fontWeight: '600',
//     color: Colors.gray700,
//     marginTop: Spacing.xs,
//   },
//   receiptDetail: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   divider: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     marginVertical: Spacing.md,
//   },
//   receiptSection: {
//     marginBottom: Spacing.md,
//   },
//   sectionTitle: {
//     fontSize: Typography.md,
//     fontWeight: '600',
//     color: Colors.gray900,
//     marginBottom: Spacing.sm,
//   },
//   receiptRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },
//   receiptLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   receiptValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   statusText: {
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   invoiceText: {
//     color: Colors.success,
//     fontWeight: '600',
//   },
//   changeText: {
//     color: Colors.success,
//   },
//   discountValue: {
//     color: Colors.success,
//   },
//   staffRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     paddingVertical: 2,
//   },
//   staffRole: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//     width: 80,
//   },
//   staffName: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   staffEmail: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginLeft: 4,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray50,
//   },
//   itemInfo: {
//     flex: 1,
//     marginRight: Spacing.sm,
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
//   itemSku: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   itemReleased: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: '500',
//   },
//   itemReleasedBy: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//   },
//   itemTotal: {
//     fontSize: Typography.sm,
//     fontWeight: '600',
//     color: Colors.gray900,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 2,
//   },
//   totalLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   totalValue: {
//     fontSize: Typography.sm,
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
//   qrSection: {
//     alignItems: 'center',
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     borderWidth: 2,
//     borderRadius: BorderRadius.lg,
//   },
//   qrTitle: {
//     fontSize: Typography.md,
//     fontWeight: '600',
//     marginBottom: Spacing.sm,
//   },
//   qrContainer: {
//     alignItems: 'center',
//   },
//   qrImage: {
//     width: width * 0.4,
//     height: width * 0.4,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//   },
//   qrHint: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: Spacing.sm,
//   },
//   qrPlaceholder: {
//     width: width * 0.4,
//     height: width * 0.4,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   qrPlaceholderText: {
//     marginTop: Spacing.sm,
//     color: Colors.gray500,
//     fontSize: Typography.sm,
//   },
//   receiptFooter: {
//     marginTop: Spacing.md,
//     paddingTop: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: Typography.md,
//     color: Colors.gray600,
//   },
//   footerSubtext: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: 2,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     padding: Spacing.md,
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     marginHorizontal: 4,
//   },
//   shareButton: {
//     backgroundColor: Colors.primary,
//   },
//   downloadButton: {
//     backgroundColor: Colors.success,
//   },
//   printButton: {
//     backgroundColor: Colors.warning,
//   },
//   actionButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     marginLeft: Spacing.xs,
//   },
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
import TransactionService from '../../../services/transactionService';
import ReceiptService from '../../../services/receiptService';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import CustomHeader from '../../../components/ui/CustomHeader';
import BluetoothPrinterModal from '../../../components/print/BluetoothPrinterModal';
import { usePrinter } from '../../../hooks/usePrinter';
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