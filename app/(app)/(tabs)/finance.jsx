// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   TextInput,
//   Modal,
//   StyleSheet,
//   RefreshControl,
//   FlatList,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import TransactionService from "../../../services/transactionService";
// import PaymentService from "../../../services/paymentService";
// import { useAuth } from "../../../hooks/useAuth";
// import {
//   CreditCard,
//   CheckCircle,
//   XCircle,
//   Clock,
//   DollarSign,
//   Scan,
//   RefreshCw,
//   QrCode,
//   Printer,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react-native";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";
// import { formatCurrency } from "../../../utils/formatters";

// export default function Finance() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const { user, currentStore, storeVersion } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [pendingPayments, setPendingPayments] = useState([]);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [paymentModal, setPaymentModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("CASH");
//   const [amountPaid, setAmountPaid] = useState("");
//   const [history, setHistory] = useState([]);
//   const [paymentReference, setPaymentReference] = useState("");
//   const [paymentDetails, setPaymentDetails] = useState({});
//   const [transactionDetailModal, setTransactionDetailModal] = useState(false);
//   const [scannedTransaction, setScannedTransaction] = useState(null);
//   const [qrData, setQrData] = useState(null);
//   const [dropdownVisible, setDropdownVisible] = useState(false);

//   const paymentMethods = [
//     { id: "CASH", label: "Cash", icon: "💵" },
//     { id: "CARD", label: "Card", icon: "💳" },
//     { id: "TRANSFER", label: "Bank Transfer", icon: "🏦" },
//     { id: "MOBILE_MONEY", label: "Mobile Money", icon: "📱" },
//     { id: "CREDIT", label: "Credit", icon: "💳" },
//   ];

//   useEffect(() => {
//     fetchPendingPayments();
//     fetchHistory();

//     // Check if coming from QR scan
//     if (params.transactionId && params.mode === "pay") {
//       handleQRScanResult(params);
//     }
//   }, [currentStore, storeVersion]);

//   const fetchPendingPayments = async () => {
//     setLoading(true);
//     try {
//       const result = await TransactionService.getTransactions({
//         status: "SALES_QR",
//         limit: 50,
//       });
//       setPendingPayments(result.transactions || []);
//     } catch (error) {
//       console.error("Failed to fetch pending payments:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const result = await PaymentService.getPaymentStats({ limit: 10 });
//       setHistory(result.byMethod || []);
//     } catch (error) {
//       console.error("Failed to fetch history:", error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchPendingPayments();
//     await fetchHistory();
//   };

//   const handleQRScanResult = async (params) => {
//     try {
//       const result = await TransactionService.scanSalesQR(params.qrData);

//       if (result && result.isValid) {
//         setScannedTransaction(result.transaction);
//         setQrData(params.qrData);
//         setSelectedTransaction(result.transaction);
//         setAmountPaid(result.transaction.totalAmount?.toString() || "");
//         setPaymentModal(true);

//         Alert.alert(
//           "QR Scanned",
//           `Transaction: ${result.transaction.transactionNumber}\nTotal: $${result.transaction.totalAmount?.toFixed(2)}\nItems: ${result.transaction.items?.length || 0}`,
//           [{ text: "OK" }],
//         );
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to scan QR code");
//     }
//   };

//   const processPayment = async () => {
//     if (!selectedTransaction || !amountPaid) {
//       Alert.alert("Error", "Please enter amount paid");
//       return;
//     }

//     const amount = parseFloat(amountPaid);
//     if (amount < selectedTransaction.totalAmount) {
//       Alert.alert("Error", "Amount paid is less than total");
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await TransactionService.processPayment(
//         selectedTransaction._id,
//         paymentMethod,
//         amount,
//         paymentReference || undefined,
//         paymentDetails,
//       );

//       Alert.alert(
//         "Payment Successful",
//         `Payment of ${formatCurrency(amount)} processed successfully.\n` +
//           `Change: ${formatCurrency(result.change || 0)}\n` +
//           `Transaction: ${result.transaction.transactionNumber}`,
//         [
//           {
//             text: "View Payment QR",
//             onPress: () => {
//               if (result.paymentQR) {
//                 router.push({
//                   pathname: "/(app)/(modals)/receipt-preview",
//                   params: {
//                     transactionId: selectedTransaction._id,
//                     qrData: result.paymentQR,
//                     qrType: "PAYMENT",
//                     mode: "payment",
//                   },
//                 });
//               }
//             },
//           },
//           {
//             text: "Done",
//             onPress: () => {
//               setPaymentModal(false);
//               setSelectedTransaction(null);
//               setAmountPaid("");
//               setPaymentReference("");
//               setPaymentDetails({});
//               setScannedTransaction(null);
//               setQrData(null);
//               fetchPendingPayments();
//               fetchHistory();
//             },
//           },
//         ],
//       );
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to process payment",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPaymentMethodIcon = (method) => {
//     const icons = {
//       CASH: "💵",
//       CARD: "💳",
//       TRANSFER: "🏦",
//       MOBILE_MONEY: "📱",
//       CREDIT: "💳",
//     };
//     return icons[method] || "💰";
//   };

//   const getSelectedMethodLabel = () => {
//     const method = paymentMethods.find(m => m.id === paymentMethod);
//     return method ? `${method.icon} ${method.label}` : "Select Payment Method";
//   };

//   const PaymentItem = ({ transaction }) => (
//     <TouchableOpacity
//       style={styles.paymentItem}
//       onPress={() => {
//         setSelectedTransaction(transaction);
//         setPaymentModal(true);
//         setAmountPaid(transaction.totalAmount?.toString() || "");
//         setPaymentReference("");
//         setPaymentDetails({});
//       }}
//     >
//       <View style={styles.paymentItemRow}>
//         <View style={styles.paymentItemInfo}>
//           <Text style={styles.paymentItemNumber}>
//             {transaction.transactionNumber}
//           </Text>
//           <Text style={styles.paymentItemAttendant}>
//             {transaction.salesAttendantId?.firstName}{" "}
//             {transaction.salesAttendantId?.lastName}
//           </Text>
//           <Text style={styles.paymentItemCount}>
//             {transaction.items?.length || 0} items
//           </Text>
//           {transaction.salesQR && (
//             <Text style={styles.paymentItemQR}>✅ QR Ready</Text>
//           )}
//         </View>
//         <View style={styles.paymentItemRight}>
//           <Text style={styles.paymentItemAmount}>
//             {formatCurrency(transaction.totalAmount)}
//           </Text>
//           <View style={styles.pendingBadge}>
//             <Clock size={14} color={Colors.warning} />
//             <Text style={styles.pendingBadgeText}>Pending Payment</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

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
//           <Text style={styles.headerTitle}>Finance</Text>
//           <Text style={styles.headerSubtitle}>
//             Process payments and view history
//           </Text>
//         </View>

//         <View style={styles.quickActions}>
//           <TouchableOpacity
//             style={[styles.quickAction, styles.scanAction]}
//             onPress={() => router.push("/(app)/(tabs)/scan")}
//           >
//             <Scan size={20} color={Colors.white} />
//             <Text style={styles.scanActionText}>Scan QR</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.quickAction, styles.historyAction]}
//             onPress={onRefresh}
//           >
//             <RefreshCw size={20} color={Colors.gray700} />
//             <Text style={styles.historyActionText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Pending Payments ({pendingPayments.length})
//           </Text>
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={Colors.primary} />
//             </View>
//           ) : pendingPayments.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <CheckCircle size={48} color={Colors.success} />
//               <Text style={styles.emptyText}>No pending payments</Text>
//             </View>
//           ) : (
//             pendingPayments.map((transaction, index) => (
//               <PaymentItem key={index} transaction={transaction} />
//             ))
//           )}
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Payment Method Summary</Text>
//           {history.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <CreditCard size={48} color={Colors.gray300} />
//               <Text style={styles.emptyText}>No payment data</Text>
//             </View>
//           ) : (
//             history.map((item, index) => (
//               <View key={index} style={styles.historyItem}>
//                 <View style={styles.historyItemRow}>
//                   <View style={styles.historyItemInfo}>
//                     <Text style={styles.historyItemMethod}>
//                       {getPaymentMethodIcon(item._id)} {item._id || "Unknown"}
//                     </Text>
//                     <Text style={styles.historyItemCount}>
//                       {item.count} transactions
//                     </Text>
//                   </View>
//                   <Text style={styles.historyItemAmount}>
//                     {formatCurrency(item.totalAmount || 0)}
//                   </Text>
//                 </View>
//               </View>
//             ))
//           )}
//         </View>
//       </ScrollView>

// app/(app)/(tabs)/finance.jsx - Updated

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import TransactionService from "../../../services/transactionService";
import PaymentService from "../../../services/paymentService";
import { useAuth } from "../../../hooks/useAuth";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Scan,
  RefreshCw,
  QrCode,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";
import { formatCurrency } from "../../../utils/formatters";

export default function Finance() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, currentStore, storeVersion } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountPaid, setAmountPaid] = useState("");
  const [history, setHistory] = useState([]);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [transactionDetailModal, setTransactionDetailModal] = useState(false);
  const [scannedTransaction, setScannedTransaction] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const paymentMethods = [
    { id: "CASH", label: "Cash", icon: "💵" },
    { id: "CARD", label: "Card", icon: "💳" },
    { id: "TRANSFER", label: "Bank Transfer", icon: "🏦" },
    { id: "MOBILE_MONEY", label: "Mobile Money", icon: "📱" },
    { id: "CREDIT", label: "Credit", icon: "💳" },
  ];

  useEffect(() => {
    fetchPendingPayments();
    fetchPaymentStats();
    fetchPaymentHistory();

    // Check if coming from QR scan
    if (params.transactionId && params.mode === "pay") {
      handleQRScanResult(params);
    }
  }, [currentStore, storeVersion]);

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const result = await TransactionService.getTransactions({
        status: "SALES_QR",
        limit: 50,
      });
      setPendingPayments(result.transactions || []);
    } catch (error) {
      console.error("Failed to fetch pending payments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPaymentStats = async () => {
    setStatsLoading(true);
    try {
      // Pass storeId to get stats
      const storeId = currentStore?._id || user?.storeId;

      if (!storeId) {
        console.warn("No storeId available for payment stats");
        return;
      }

      const result = await PaymentService.getPaymentStats({ storeId });
      console.log("Payment stats received:", result);

      // Update history with stats data
      if (result.byMethod && result.byMethod.length > 0) {
        setHistory(result.byMethod);
      } else {
        // Set empty state
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch payment stats:", error);
      // Don't show alert for stats, just log
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const storeId = currentStore?._id || user?.storeId;

      if (!storeId) {
        return;
      }

      const result = await PaymentService.getPaymentSummary({
        storeId,
        limit: 10,
        status: "COMPLETED",
      });

      // You can use this data for recent transactions list
      console.log("Payment history:", result);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPendingPayments(),
      fetchPaymentStats(),
      fetchPaymentHistory(),
    ]);
  };

  const handleQRScanResult = async (params) => {
    try {
      const result = await TransactionService.scanSalesQR(params.qrData);

      if (result && result.isValid) {
        setScannedTransaction(result.transaction);
        setQrData(params.qrData);
        setSelectedTransaction(result.transaction);
        setAmountPaid(result.transaction.totalAmount?.toString() || "");
        setPaymentModal(true);

        Alert.alert(
          "QR Scanned",
          `Transaction: ${result.transaction.transactionNumber}\nTotal: $${result.transaction.totalAmount?.toFixed(2)}\nItems: ${result.transaction.items?.length || 0}`,
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to scan QR code");
    }
  };

  const processPayment = async () => {
    if (!selectedTransaction || !amountPaid) {
      Alert.alert("Error", "Please enter amount paid");
      return;
    }

    const amount = parseFloat(amountPaid);
    if (amount < selectedTransaction.totalAmount) {
      Alert.alert("Error", "Amount paid is less than total");
      return;
    }

    setLoading(true);
    try {
      const result = await TransactionService.processPayment(
        selectedTransaction._id,
        paymentMethod,
        amount,
        paymentReference || undefined,
        paymentDetails,
      );

      Alert.alert(
        "Payment Successful",
        `Payment of ${formatCurrency(amount)} processed successfully.\n` +
          `Change: ${formatCurrency(result.change || 0)}\n` +
          `Transaction: ${result.transaction.transactionNumber}`,
        [
          {
            text: "View Receipt",
            onPress: () => {
              if (result.paymentQR) {
                router.push({
                  pathname: "/(app)/(modals)/receipt-preview",
                  params: {
                    transactionId: selectedTransaction._id,
                    qrData: result.paymentQR,
                    qrType: "PAYMENT",
                    mode: "payment",
                  },
                });
              }
            },
          },
          {
            text: "Done",
            onPress: () => {
              setPaymentModal(false);
              setSelectedTransaction(null);
              setAmountPaid("");
              setPaymentReference("");
              setPaymentDetails({});
              setScannedTransaction(null);
              setQrData(null);
              // Refresh all data
              onRefresh();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to process payment",
      );
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      CASH: "💵",
      CARD: "💳",
      TRANSFER: "🏦",
      MOBILE_MONEY: "📱",
      CREDIT: "💳",
    };
    return icons[method] || "💰";
  };

  const getSelectedMethodLabel = () => {
    const method = paymentMethods.find((m) => m.id === paymentMethod);
    return method ? `${method.icon} ${method.label}` : "Select Payment Method";
  };

  const PaymentItem = ({ transaction }) => (
    <TouchableOpacity
      style={styles.paymentItem}
      onPress={() => {
        setSelectedTransaction(transaction);
        setPaymentModal(true);
        setAmountPaid(transaction.totalAmount?.toString() || "");
        setPaymentReference("");
        setPaymentDetails({});
      }}
    >
      <View style={styles.paymentItemRow}>
        <View style={styles.paymentItemInfo}>
          <Text style={styles.paymentItemNumber}>
            {transaction.transactionNumber}
          </Text>
          <Text style={styles.paymentItemAttendant}>
            {transaction.salesAttendantId?.firstName}{" "}
            {transaction.salesAttendantId?.lastName}
          </Text>
          <Text style={styles.paymentItemCount}>
            {transaction.items?.length || 0} items
          </Text>
          {transaction.salesQR && (
            <Text style={styles.paymentItemQR}>✅ QR Ready</Text>
          )}
        </View>
        <View style={styles.paymentItemRight}>
          <Text style={styles.paymentItemAmount}>
            {formatCurrency(transaction.totalAmount)}
          </Text>
          <View style={styles.pendingBadge}>
            <Clock size={14} color={Colors.warning} />
            <Text style={styles.pendingBadgeText}>Pending Payment</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Finance</Text>
          <Text style={styles.headerSubtitle}>
            Process payments and view history
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, styles.scanAction]}
            onPress={() => router.push("/(app)/(tabs)/scan")}
          >
            <Scan size={20} color={Colors.white} />
            <Text style={styles.scanActionText}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, styles.historyAction]}
            onPress={onRefresh}
          >
            <RefreshCw size={20} color={Colors.gray700} />
            <Text style={styles.historyActionText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pending Payments ({pendingPayments.length})
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : pendingPayments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CheckCircle size={48} color={Colors.success} />
              <Text style={styles.emptyText}>No pending payments</Text>
            </View>
          ) : (
            pendingPayments.map((transaction, index) => (
              <PaymentItem key={index} transaction={transaction} />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method Summary</Text>
          {statsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CreditCard size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>No payment data available</Text>
              <Text style={styles.emptySubtext}>
                Complete a payment to see statistics here
              </Text>
            </View>
          ) : (
            history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyItemRow}>
                  <View style={styles.historyItemInfo}>
                    <Text style={styles.historyItemMethod}>
                      {getPaymentMethodIcon(item._id)} {item._id || "Unknown"}
                    </Text>
                    <Text style={styles.historyItemCount}>
                      {item.count} transactions
                    </Text>
                    <Text style={styles.historyItemAverage}>
                      Avg: {formatCurrency(item.averageAmount || 0)}
                    </Text>
                  </View>
                  <Text style={styles.historyItemAmount}>
                    {formatCurrency(item.totalAmount || 0)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal visible={paymentModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Process Payment</Text>
              <TouchableOpacity
                onPress={() => {
                  setPaymentModal(false);
                  setSelectedTransaction(null);
                  setAmountPaid("");
                  setPaymentReference("");
                  setPaymentDetails({});
                  setScannedTransaction(null);
                  setQrData(null);
                  setDropdownVisible(false);
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
                    {selectedTransaction.transactionNumber}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>Total Amount</Text>
                  <Text style={styles.modalTransactionAmount}>
                    {formatCurrency(selectedTransaction.totalAmount)}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>Items</Text>
                  <Text style={styles.modalTransactionNumber}>
                    {selectedTransaction.items?.length || 0} items
                  </Text>
                </View>

                <View style={styles.modalItemListContainer}>
                  <Text style={styles.modalItemListTitle}>
                    Items ({selectedTransaction.items?.length || 0})
                  </Text>
                  <ScrollView
                    style={styles.modalItemList}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {selectedTransaction.items?.map((item, index) => (
                      <View key={index} style={styles.modalItem}>
                        <View style={styles.modalItemLeft}>
                          <Text style={styles.modalItemName} numberOfLines={2}>
                            {item.name ||
                              item.productId?.name ||
                              "Unknown Item"}
                          </Text>
                          <Text style={styles.modalItemDetail}>
                            Qty: {item.quantity} ×{" "}
                            {formatCurrency(item.unitPrice || 0)}
                          </Text>
                          {item.productId?.sku && (
                            <Text style={styles.modalItemSku}>
                              SKU: {item.productId.sku}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.modalItemTotal}>
                          {formatCurrency(
                            (item.unitPrice || 0) * (item.quantity || 0),
                          )}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {/* Payment Method Dropdown */}
                <View style={styles.modalMethodContainer}>
                  <Text style={styles.modalMethodLabel}>Payment Method</Text>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {getSelectedMethodLabel()}
                    </Text>
                    {dropdownVisible ? (
                      <ChevronUp size={20} color={Colors.gray500} />
                    ) : (
                      <ChevronDown size={20} color={Colors.gray500} />
                    )}
                  </TouchableOpacity>

                  {dropdownVisible && (
                    <View style={styles.dropdownList}>
                      {paymentMethods.map((method) => (
                        <TouchableOpacity
                          key={method.id}
                          style={[
                            styles.dropdownItem,
                            paymentMethod === method.id &&
                              styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setPaymentMethod(method.id);
                            setDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemIcon}>
                            {method.icon}
                          </Text>
                          <Text
                            style={[
                              styles.dropdownItemText,
                              paymentMethod === method.id &&
                                styles.dropdownItemTextActive,
                            ]}
                          >
                            {method.label}
                          </Text>
                          {paymentMethod === method.id && (
                            <CheckCircle size={16} color={Colors.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.modalAmountContainer}>
                  <Text style={styles.modalAmountLabel}>Amount Received</Text>
                  <View style={styles.modalAmountInputContainer}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: Colors.gray500,
                        fontWeight: "bold",
                      }}
                    >
                      ₦
                    </Text>
                    <TextInput
                      style={styles.modalAmountInput}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      value={amountPaid}
                      onChangeText={setAmountPaid}
                      placeholderTextColor={Colors.gray400}
                    />
                  </View>
                  {amountPaid && selectedTransaction && (
                    <Text style={styles.changeText}>
                      Change:{" "}
                      {formatCurrency(
                        parseFloat(amountPaid) -
                          selectedTransaction.totalAmount,
                      )}
                    </Text>
                  )}
                </View>

                <View style={styles.modalReferenceContainer}>
                  <Text style={styles.modalReferenceLabel}>
                    Reference (Optional)
                  </Text>
                  <TextInput
                    style={styles.modalReferenceInput}
                    placeholder="Enter reference number"
                    value={paymentReference}
                    onChangeText={setPaymentReference}
                    placeholderTextColor={Colors.gray400}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={() => {
                      setPaymentModal(false);
                      setSelectedTransaction(null);
                      setAmountPaid("");
                      setPaymentReference("");
                      setPaymentDetails({});
                      setDropdownVisible(false);
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
                    onPress={processPayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Text style={styles.modalProcessText}>
                        Process Payment
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  header: { paddingVertical: Spacing.md },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
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
  historyAction: { backgroundColor: Colors.gray200, marginLeft: Spacing.sm },
  historyActionText: {
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
  loadingContainer: { paddingVertical: Spacing["3xl"], alignItems: "center" },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["3xl"],
    alignItems: "center",
    ...Shadows.sm,
  },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
  paymentItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  paymentItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentItemInfo: { flex: 1 },
  paymentItemNumber: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  paymentItemAttendant: { fontSize: Typography.sm, color: Colors.gray500 },
  paymentItemCount: { fontSize: Typography.sm, color: Colors.gray500 },
  paymentItemQR: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: "500",
  },
  paymentItemRight: { alignItems: "flex-end" },
  paymentItemAmount: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  pendingBadgeText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
  },
  historyItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  historyItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyItemInfo: { flex: 1 },
  historyItemMethod: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  historyItemCount: { fontSize: Typography.xs, color: Colors.gray500 },
  historyItemAmount: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: Spacing["2xl"],
    height: "100%",
  },
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
  modalTransactionAmount: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  modalItemListContainer: {
    flex: 1,
    minHeight: 150,
    maxHeight: 300,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  modalItemListTitle: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  modalItemList: {
    flex: 1,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    marginBottom: 2,
  },
  modalItemLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  modalItemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    flex: 1,
  },
  modalItemDetail: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  modalItemSku: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 1,
  },
  modalItemTotal: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.primary,
    minWidth: 70,
    textAlign: "right",
  },
  // Dropdown Styles
  modalMethodContainer: {
    marginBottom: Spacing.md,
    zIndex: 1000,
  },
  modalMethodLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  dropdownButtonText: {
    fontSize: Typography.md,
    color: Colors.gray900,
    fontWeight: "500",
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.md,
    maxHeight: 200,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primary + "10",
  },
  dropdownItemIcon: {
    fontSize: Typography.md,
    marginRight: Spacing.sm,
    width: 24,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: Typography.md,
    color: Colors.gray900,
    fontWeight: "500",
  },
  dropdownItemTextActive: {
    color: Colors.primary,
  },
  modalAmountContainer: { marginBottom: Spacing.sm },
  modalAmountLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  modalAmountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  modalAmountInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.md,
  },
  changeText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },
  modalReferenceContainer: { marginBottom: Spacing.md },
  modalReferenceLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  modalReferenceInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.md,
  },
  modalButtons: { flexDirection: "row", gap: Spacing.sm },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  modalCancelButton: { backgroundColor: Colors.gray200 },
  modalCancelText: { fontWeight: "600", color: Colors.gray700 },
  modalProcessButton: { backgroundColor: Colors.primary },
  modalProcessText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
  emptySubtext: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  historyItemAverage: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
});
