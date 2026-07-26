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
// import CustomHeader from "../../../../../components/ui/CustomHeader";
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// const { width } = Dimensions.get("window");

// export default function ReceiptDetail() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [receipt, setReceipt] = useState(null);
//   const [receiptData, setReceiptData] = useState(null);
//   const [qrCodeImage, setQrCodeImage] = useState(null);
//   const [transaction, setTransaction] = useState(null);

//   useEffect(() => {
//     fetchReceipt();
//   }, [id]);

//   const fetchReceipt = async () => {
//     try {
//       // Get receipt details
//       const data = await ReceiptService.getReceipt(id);
//       setReceipt(data);

//       // Handle QR Code
//       if (data.qrCode) {
//         if (data.qrCode.startsWith("data:image")) {
//           setQrCodeImage(data.qrCode);
//         } else if (data.qrCode.length > 100 && !data.qrCode.startsWith("http")) {
//           setQrCodeImage(`data:image/png;base64,${data.qrCode}`);
//         } else {
//           setQrCodeImage(data.qrCode);
//         }
//       }

//       // Get receipt data
//       if (data.receiptData) {
//         setReceiptData(data.receiptData);
//       }

//       // Get transaction if available
//       if (data.transactionId) {
//         const transactionId = data.transactionId._id || data.transactionId;
//         if (transactionId) {
//           try {
//             const trans = await TransactionService.getTransaction(transactionId);
//             setTransaction(trans);
//           } catch (e) {
//             console.log('Could not fetch transaction');
//           }
//         }
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
//       const t = transaction || {};
//       await Share.share({
//         message: `Receipt: ${receipt?.receiptNumber || "N/A"}\nType: ${receipt?.type || "N/A"}\nTransaction: ${t?.transactionNumber || "N/A"}\nTotal: ${formatCurrency(t?.totalAmount || 0)}\nDate: ${formatDateTime(receipt?.createdAt)}`,
//         title: "Receipt",
//       });
//     } catch (error) {
//       Alert.alert("Error", "Failed to share receipt");
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       setLoading(true);
      
//       // Generate receipt PDF
//       const transactionId = receipt?.transactionId?._id || receipt?.transactionId;
//       if (transactionId) {
//         const response = await ReceiptService.generateReceipt(transactionId, receipt.type);
        
//         if (response && response.downloadUrl) {
//           const fileUri = FileSystem.documentDirectory + `receipt_${receipt.receiptNumber}.pdf`;
//           const downloadResult = await FileSystem.downloadAsync(
//             response.downloadUrl,
//             fileUri
//           );
          
//           if (downloadResult.status === 200) {
//             if (await Sharing.isAvailableAsync()) {
//               await Sharing.shareAsync(fileUri);
//             } else {
//               Alert.alert('Download Complete', `Receipt saved to ${fileUri}`);
//             }
//           }
//         } else {
//           Alert.alert('Info', 'Receipt file not available for download');
//         }
//       }
//     } catch (error) {
//       console.error("Download error:", error);
//       Alert.alert("Error", "Failed to download receipt");
//     } finally {
//       setLoading(false);
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
//       RELEASE: "📦",
//       INVOICE: "📋",
//       FINAL: "✅",
//     };
//     return icons[type] || "📄";
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       SALES: Colors.primary,
//       PAYMENT: Colors.success,
//       RELEASE: Colors.warning,
//       INVOICE: '#8B5CF6',
//       FINAL: Colors.success,
//     };
//     return colors[type] || Colors.gray;
//   };

//   const getTypeLabel = (type) => {
//     const labels = {
//       SALES: 'Sales Receipt',
//       PAYMENT: 'Payment Receipt',
//       RELEASE: 'Release Receipt',
//       INVOICE: 'Invoice',
//       FINAL: 'Final Receipt',
//     };
//     return labels[type] || type;
//   };

//   const renderItemDetails = (item) => {
//     const name = item.name || item.productId?.name || 'Item';
//     const qty = item.quantity || 0;
//     const unitPrice = item.unitPrice || 0;
//     const total = item.totalPrice || (qty * unitPrice);
    
//     return (
//       <View key={item._id || item.id} style={styles.itemRow}>
//         <View style={styles.itemInfo}>
//           <Text style={styles.itemName}>{name}</Text>
//           <Text style={styles.itemDetail}>
//             Qty: {qty} × {formatCurrency(unitPrice)}
//           </Text>
//           {item.sku && (
//             <Text style={styles.itemSku}>SKU: {item.sku}</Text>
//           )}
//           {item.isReleased && (
//             <Text style={styles.itemReleasedText}>✓ Released</Text>
//           )}
//         </View>
//         <Text style={styles.itemTotal}>{formatCurrency(total)}</Text>
//       </View>
//     );
//   };

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

//   const t = transaction || {};
//   const data = receiptData || {};
//   const store = data.store || {};
//   const summary = data.summary || {};
//   const staff = data.staff || {};
//   const items = data.items || t.items || [];
//   const releasedItems = data.releasedItems || t.itemsReleased || [];
//   const timeline = data.timeline || {};

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
//               <Text style={styles.headerNumber}>{receipt.receiptNumber || "N/A"}</Text>
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
//                 {getTypeLabel(receipt.type)}
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
//           {receipt.printedAt && (
//             <Text style={styles.printedAtText}>
//               Printed at: {formatDateTime(receipt.printedAt)}
//             </Text>
//           )}
//         </View>

//         {/* Store Info */}
//         {store.name && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Store Information</Text>
//             <Text style={styles.storeName}>{store.name}</Text>
//             {store.address && <Text style={styles.storeDetail}>{store.address}</Text>}
//             {store.phone && (
//               <Text style={styles.storeDetail}>📞 {store.phone}</Text>
//             )}
//             {store.email && (
//               <Text style={styles.storeDetail}>✉️ {store.email}</Text>
//             )}
//           </View>
//         )}

//         {/* Transaction Details */}
//         <View style={styles.detailsCard}>
//           <Text style={styles.sectionTitle}>Transaction Details</Text>
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Transaction #</Text>
//             <Text style={styles.detailValue}>
//               {t.transactionNumber || "N/A"}
//             </Text>
//           </View>
//           {t.finalInvoiceNumber && (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Invoice #</Text>
//               <Text style={[styles.detailValue, styles.invoiceText]}>
//                 {t.finalInvoiceNumber}
//               </Text>
//             </View>
//           )}
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Status</Text>
//             <Text style={[styles.detailValue, styles.statusValue]}>
//               {t.status || data.workflow?.status || "N/A"}
//             </Text>
//           </View>
//           {t.paymentMethod && (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Payment Method</Text>
//               <Text style={styles.detailValue}>{t.paymentMethod}</Text>
//             </View>
//           )}
//           {timeline.created && (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Created</Text>
//               <Text style={styles.detailValue}>
//                 {formatDateTime(timeline.created)}
//               </Text>
//             </View>
//           )}
//           {timeline.sales && (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Sales Time</Text>
//               <Text style={styles.detailValue}>
//                 {formatDateTime(timeline.sales)}
//               </Text>
//             </View>
//           )}
//           {timeline.payment && (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Payment Time</Text>
//               <Text style={styles.detailValue}>
//                 {formatDateTime(timeline.payment)}
//               </Text>
//             </View>
//           )}
//           {timeline.release && (
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Release Time</Text>
//               <Text style={styles.detailValue}>
//                 {formatDateTime(timeline.release)}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Staff Information */}
//         {(staff.salesAttendant || staff.financeAttendant || staff.warehouseStaff) && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Staff</Text>
//             {staff.salesAttendant && (
//               <View style={styles.staffRow}>
//                 <Text style={styles.staffRole}>Sales</Text>
//                 <Text style={styles.staffName}>{staff.salesAttendant.name}</Text>
//                 {staff.salesAttendant.email && (
//                   <Text style={styles.staffEmail}>{staff.salesAttendant.email}</Text>
//                 )}
//               </View>
//             )}
//             {staff.financeAttendant && (
//               <View style={styles.staffRow}>
//                 <Text style={styles.staffRole}>Finance</Text>
//                 <Text style={styles.staffName}>{staff.financeAttendant.name}</Text>
//                 {staff.financeAttendant.email && (
//                   <Text style={styles.staffEmail}>{staff.financeAttendant.email}</Text>
//                 )}
//               </View>
//             )}
//             {staff.warehouseStaff && (
//               <View style={styles.staffRow}>
//                 <Text style={styles.staffRole}>Warehouse</Text>
//                 <Text style={styles.staffName}>{staff.warehouseStaff.name}</Text>
//                 {staff.warehouseStaff.email && (
//                   <Text style={styles.staffEmail}>{staff.warehouseStaff.email}</Text>
//                 )}
//               </View>
//             )}
//           </View>
//         )}

//         {/* Items */}
//         {items.length > 0 && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Items ({items.length})</Text>
//             {items.map((item) => renderItemDetails(item))}
//           </View>
//         )}

//         {/* Released Items */}
//         {releasedItems.length > 0 && (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>
//               Released Items ({releasedItems.length})
//             </Text>
//             {releasedItems.map((item, index) => (
//               <View key={index} style={styles.itemRow}>
//                 <View style={styles.itemInfo}>
//                   <Text style={styles.itemName}>
//                     {item.productName || "Item"}
//                   </Text>
//                   <Text style={styles.itemDetail}>
//                     Qty: {item.quantityReleased || 0} × {formatCurrency(item.unitPrice || 0)}
//                   </Text>
//                   {item.releasedByName && (
//                     <Text style={styles.itemReleasedBy}>
//                       Released by: {item.releasedByName}
//                     </Text>
//                   )}
//                 </View>
//                 <Text style={styles.itemTotal}>
//                   {formatCurrency(item.totalPrice || 0)}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Financial Summary */}
//         <View style={styles.detailsCard}>
//           <Text style={styles.sectionTitle}>Financial Summary</Text>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Subtotal</Text>
//             <Text style={styles.summaryValue}>
//               {formatCurrency(summary.subtotal || t.subtotal || 0)}
//             </Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Tax</Text>
//             <Text style={styles.summaryValue}>
//               {formatCurrency(summary.taxTotal || t.taxTotal || 0)}
//             </Text>
//           </View>
//           {(summary.discountTotal || 0) > 0 && (
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Discount</Text>
//               <Text style={[styles.summaryValue, styles.discountValue]}>
//                 -{formatCurrency(summary.discountTotal)}
//               </Text>
//             </View>
//           )}
//           <View style={[styles.summaryRow, styles.totalRow]}>
//             <Text style={styles.totalLabel}>Total</Text>
//             <Text style={styles.totalValue}>
//               {formatCurrency(
//                 summary.totalAmount || t.totalAmount || 0
//               )}
//             </Text>
//           </View>
//           {(summary.amountPaid || t.amountPaid || 0) > 0 && (
//             <>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Amount Paid</Text>
//                 <Text style={styles.summaryValue}>
//                   {formatCurrency(summary.amountPaid || t.amountPaid || 0)}
//                 </Text>
//               </View>
//               {(summary.changeAmount || t.changeAmount || 0) > 0 && (
//                 <View style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>Change</Text>
//                   <Text style={[styles.summaryValue, styles.changeText]}>
//                     {formatCurrency(summary.changeAmount || t.changeAmount || 0)}
//                   </Text>
//                 </View>
//               )}
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Payment Method</Text>
//                 <Text style={styles.summaryValue}>
//                   {summary.paymentMethod || t.paymentMethod || "N/A"}
//                 </Text>
//               </View>
//             </>
//           )}
//         </View>

//         {/* QR Code Section */}
//         <View style={styles.qrCard}>
//           <Text style={styles.sectionTitle}>QR Code</Text>
//           {qrCodeImage ? (
//             <View style={styles.qrContainer}>
//               <Image
//                 source={{ uri: qrCodeImage }}
//                 style={styles.qrImage}
//                 resizeMode="contain"
//                 onError={(error) => {
//                   console.error("QR Image loading error:", error.nativeEvent);
//                   if (qrCodeImage && !qrCodeImage.startsWith("data:image")) {
//                     setQrCodeImage(`data:image/png;base64,${qrCodeImage}`);
//                   }
//                 }}
//               />
//               <Text style={styles.qrHint}>Scan this QR code</Text>
//               {receipt.type && (
//                 <Text style={styles.qrType}>Type: {getTypeLabel(receipt.type)}</Text>
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
//                     const transactionId = receipt.transactionId?._id || receipt.transactionId;
//                     if (transactionId) {
//                       await ReceiptService.generateReceipt(transactionId, receipt.type);
//                       await fetchReceipt();
//                       Alert.alert("Success", "QR code regenerated");
//                     }
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
//         {store.receiptFooter && (
//           <View style={styles.footerCard}>
//             <Text style={styles.footerText}>{store.receiptFooter}</Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* Action Buttons */}
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity
//           onPress={handleShare}
//           style={[styles.actionButton, styles.shareActionButton]}
//         >
//           <Share2 size={20} color={Colors.white} />
//           <Text style={styles.actionButtonText}>Share</Text>
//         </TouchableOpacity>
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

// screens/receipts/[id]/index.jsx (Updated with print functionality)
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
import CustomHeader from "../../../../../components/ui/CustomHeader";
import BluetoothPrinterModal from "../../../../../components/print/BluetoothPrinterModal";
import { usePrinter } from "../../../../../hooks/usePrinter";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get("window");

export default function ReceiptDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [transaction, setTransaction] = useState(null);

  // Use the printer hook
  const {
    printerModalVisible,
    printReceiptData,
    openPrintModal,
    closePrintModal,
    handlePrintComplete,
  } = usePrinter();

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      const data = await ReceiptService.getReceipt(id);
      setReceipt(data);

      if (data.qrCode) {
        if (data.qrCode.startsWith("data:image")) {
          setQrCodeImage(data.qrCode);
        } else if (data.qrCode.length > 100 && !data.qrCode.startsWith("http")) {
          setQrCodeImage(`data:image/png;base64,${data.qrCode}`);
        } else {
          setQrCodeImage(data.qrCode);
        }
      }

      if (data.receiptData) {
        setReceiptData(data.receiptData);
      }

      if (data.transactionId) {
        const transactionId = data.transactionId._id || data.transactionId;
        if (transactionId) {
          try {
            const trans = await TransactionService.getTransaction(transactionId);
            setTransaction(trans);
          } catch (e) {
            console.log('Could not fetch transaction');
          }
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
      const t = transaction || {};
      await Share.share({
        message: `Receipt: ${receipt?.receiptNumber || "N/A"}\nType: ${receipt?.type || "N/A"}\nTransaction: ${t?.transactionNumber || "N/A"}\nTotal: ${formatCurrency(t?.totalAmount || 0)}\nDate: ${formatDateTime(receipt?.createdAt)}`,
        title: "Receipt",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share receipt");
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      const transactionId = receipt?.transactionId?._id || receipt?.transactionId;
      if (transactionId) {
        const response = await ReceiptService.generateReceipt(transactionId, receipt.type);
        
        if (response && response.downloadUrl) {
          const fileUri = FileSystem.documentDirectory + `receipt_${receipt.receiptNumber}.pdf`;
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
          Alert.alert('Info', 'Receipt file not available for download');
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download receipt");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const t = transaction || {};
    const data = receiptData || {};
    const store = data.store || {};
    const summary = data.summary || {};
    const items = data.items || t.items || [];

    // Prepare receipt data for printing
    const printData = {
      store: {
        name: store.name || t?.storeId?.name || 'Store',
        address: store.address || '',
        phone: store.phone || '',
        email: store.email || '',
      },
      transaction: {
        number: t?.transactionNumber || 'N/A',
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
      qrCode: qrCodeImage,
    };

    if (data.staff) {
      printData.staff = data.staff;
    }

    openPrintModal(printData, receipt?.type || 'SALES');
  };

  const getTypeIcon = (type) => {
    const icons = {
      SALES: "📄",
      PAYMENT: "💰",
      RELEASE: "📦",
      INVOICE: "📋",
      FINAL: "✅",
    };
    return icons[type] || "📄";
  };

  const getTypeColor = (type) => {
    const colors = {
      SALES: Colors.primary,
      PAYMENT: Colors.success,
      RELEASE: Colors.warning,
      INVOICE: '#8B5CF6',
      FINAL: Colors.success,
    };
    return colors[type] || Colors.gray;
  };

  const getTypeLabel = (type) => {
    const labels = {
      SALES: 'Sales Receipt',
      PAYMENT: 'Payment Receipt',
      RELEASE: 'Release Receipt',
      INVOICE: 'Invoice',
      FINAL: 'Final Receipt',
    };
    return labels[type] || type;
  };

  const renderItemDetails = (item) => {
    const name = item.name || item.productId?.name || 'Item';
    const qty = item.quantity || 0;
    const unitPrice = item.unitPrice || 0;
    const total = item.totalPrice || (qty * unitPrice);
    
    return (
      <View key={item._id || item.id} style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{name}</Text>
          <Text style={styles.itemDetail}>
            Qty: {qty} × {formatCurrency(unitPrice)}
          </Text>
          {item.sku && (
            <Text style={styles.itemSku}>SKU: {item.sku}</Text>
          )}
          {item.isReleased && (
            <Text style={styles.itemReleasedText}>✓ Released</Text>
          )}
        </View>
        <Text style={styles.itemTotal}>{formatCurrency(total)}</Text>
      </View>
    );
  };

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

  const t = transaction || {};
  const data = receiptData || {};
  const store = data.store || {};
  const summary = data.summary || {};
  const staff = data.staff || {};
  const items = data.items || t.items || [];
  const releasedItems = data.releasedItems || t.itemsReleased || [];
  const timeline = data.timeline || {};

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
                {getTypeLabel(receipt.type)}
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
          {receipt.printedAt && (
            <Text style={styles.printedAtText}>
              Printed at: {formatDateTime(receipt.printedAt)}
            </Text>
          )}
        </View>

        {/* Store Info */}
        {store.name && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Store Information</Text>
            <Text style={styles.storeName}>{store.name}</Text>
            {store.address && <Text style={styles.storeDetail}>{store.address}</Text>}
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
              {t.transactionNumber || "N/A"}
            </Text>
          </View>
          {t.finalInvoiceNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Invoice #</Text>
              <Text style={[styles.detailValue, styles.invoiceText]}>
                {t.finalInvoiceNumber}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={[styles.detailValue, styles.statusValue]}>
              {t.status || data.workflow?.status || "N/A"}
            </Text>
          </View>
          {t.paymentMethod && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>{t.paymentMethod}</Text>
            </View>
          )}
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
            {items.map((item) => renderItemDetails(item))}
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

        {/* Financial Summary */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.subtotal || t.subtotal || 0)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.taxTotal || t.taxTotal || 0)}
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
                summary.totalAmount || t.totalAmount || 0
              )}
            </Text>
          </View>
          {(summary.amountPaid || t.amountPaid || 0) > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount Paid</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(summary.amountPaid || t.amountPaid || 0)}
                </Text>
              </View>
              {(summary.changeAmount || t.changeAmount || 0) > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Change</Text>
                  <Text style={[styles.summaryValue, styles.changeText]}>
                    {formatCurrency(summary.changeAmount || t.changeAmount || 0)}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment Method</Text>
                <Text style={styles.summaryValue}>
                  {summary.paymentMethod || t.paymentMethod || "N/A"}
                </Text>
              </View>
            </>
          )}
        </View>

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
                  if (qrCodeImage && !qrCodeImage.startsWith("data:image")) {
                    setQrCodeImage(`data:image/png;base64,${qrCodeImage}`);
                  }
                }}
              />
              <Text style={styles.qrHint}>Scan this QR code</Text>
              {receipt.type && (
                <Text style={styles.qrType}>Type: {getTypeLabel(receipt.type)}</Text>
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

      {/* Bluetooth Printer Modal */}
      <BluetoothPrinterModal
        visible={printerModalVisible}
        onClose={closePrintModal}
        receiptData={printReceiptData}
        receiptType={receipt?.type || 'SALES'}
        onPrintComplete={() => {
          handlePrintComplete();
          fetchReceipt();
        }}
      />
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
  printedAtText: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 4 },
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
  invoiceText: { color: Colors.success },
  
  staffRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  staffRole: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    width: 80,
  },
  staffName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
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
  itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
  itemSku: { fontSize: Typography.xs, color: Colors.gray400 },
  itemReleasedText: { fontSize: Typography.xs, color: Colors.success },
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
  changeText: { color: Colors.success },
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