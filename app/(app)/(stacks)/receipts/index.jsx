// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   StyleSheet,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Search, Filter, Eye, FileText, Printer } from "lucide-react-native";
// import ReceiptService from "../../../../services/receiptService";
// import { formatDate } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";

// export default function Receipts() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [receipts, setReceipts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   useEffect(() => {
//     fetchReceipts();
//   }, [searchTerm, filterType]);

//   const fetchReceipts = async (page = 1) => {
//     try {
//       const params = {
//         page,
//         limit: 20,
//         type: filterType !== "all" ? filterType : undefined,
//         search: searchTerm,
//       };
//       Object.keys(params).forEach((key) => {
//         if (!params[key]) delete params[key];
//       });

//       const result = await ReceiptService.getReceipts({ params });
//       setReceipts(result.receipts || []);
//       setPagination(result.pagination || {});
//     } catch (error) {
//       Alert.alert("Error", "Failed to load receipts");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchReceipts(1);
//   };

//   const getTypeIcon = (type) => {
//     const icons = {
//       SALES: "📄",
//       PAYMENT: "💰",
//       INVOICE: "📋",
//     };
//     return icons[type] || "📄";
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       SALES: styles.typeSales,
//       PAYMENT: styles.typePayment,
//       INVOICE: styles.typeInvoice,
//     };
//     return colors[type] || styles.typeDefault;
//   };

//   const getTypeTextColor = (type) => {
//     const colors = {
//       SALES: styles.typeSalesText,
//       PAYMENT: styles.typePaymentText,
//       INVOICE: styles.typeInvoiceText,
//     };
//     return colors[type] || styles.typeDefaultText;
//   };

//   const renderReceipt = ({ item }) => {
//     const typeColor = getTypeColor(item.type);
//     const typeTextColor = getTypeTextColor(item.type);

//     return (
//       <TouchableOpacity
//         style={styles.receiptItem}
//         onPress={() => router.push(`/receipts/${item._id}`)}
//       >
//         <View style={styles.receiptRow}>
//           <View style={styles.receiptInfo}>
//             <Text style={styles.receiptNumber}>{item.receiptNumber}</Text>
//             <View style={styles.receiptTypeContainer}>
//               <Text style={styles.receiptTypeIcon}>
//                 {getTypeIcon(item.type)}
//               </Text>
//               <View style={[styles.typeBadge, typeColor]}>
//                 <Text style={[styles.typeText, typeTextColor]}>
//                   {item.type}
//                 </Text>
//               </View>
//             </View>
//             <Text style={styles.receiptDate}>{formatDate(item.createdAt)}</Text>
//           </View>
//           <View style={styles.receiptRight}>
//             <View
//               style={[
//                 styles.statusBadge,
//                 item.printed ? styles.statusPrinted : styles.statusNotPrinted,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.statusText,
//                   item.printed
//                     ? styles.statusPrintedText
//                     : styles.statusNotPrintedText,
//                 ]}
//               >
//                 {item.printed ? "Printed" : "Not Printed"}
//               </Text>
//             </View>
//             <View style={styles.receiptActions}>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => router.push(`/receipts/${item._id}/preview`)}
//               >
//                 <Eye size={18} color={Colors.primary} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => Alert.alert("Print", "Printing receipt...")}
//               >
//                 <Printer size={18} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search receipts..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>
//         <TouchableOpacity
//           style={styles.filterButton}
//           onPress={() => {
//             Alert.alert("Filter by Type", "Select a type", [
//               { text: "All", onPress: () => setFilterType("all") },
//               { text: "Sales", onPress: () => setFilterType("SALES") },
//               { text: "Payment", onPress: () => setFilterType("PAYMENT") },
//               { text: "Invoice", onPress: () => setFilterType("INVOICE") },
//               { text: "Cancel", style: "cancel" },
//             ]);
//           }}
//         >
//           <Filter
//             size={20}
//             color={filterType !== "all" ? Colors.primary : Colors.gray400}
//           />
//         </TouchableOpacity>
//       </View>

//       {filterType !== "all" && (
//         <View style={styles.filterChipContainer}>
//           <Text style={styles.filterChipText}>Type: {filterType}</Text>
//           <TouchableOpacity onPress={() => setFilterType("all")}>
//             <Text style={styles.filterChipClear}>✕</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={styles.listContent}
//         data={receipts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderReceipt}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <FileText size={48} color={Colors.gray300} />
//             <Text style={styles.emptyText}>No receipts found</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     flexDirection: "row",
//     alignItems: "center",
//     ...Shadows.sm,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   filterButton: {
//     marginLeft: Spacing.sm,
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   filterChipContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.white,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   filterChipText: { fontSize: Typography.sm, color: Colors.primary, flex: 1 },
//   filterChipClear: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     paddingHorizontal: Spacing.sm,
//   },
//   list: { flex: 1 },
//   listContent: { padding: Spacing.md },
//   receiptItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   receiptRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   receiptInfo: { flex: 1 },
//   receiptNumber: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   receiptTypeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 2,
//   },
//   receiptTypeIcon: { fontSize: Typography.md, marginRight: 4 },
//   typeBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   typeText: { fontSize: Typography.xs, fontWeight: "500" },
//   typeSales: { backgroundColor: Colors.primary + "20" },
//   typeSalesText: { color: Colors.primary },
//   typePayment: { backgroundColor: Colors.success + "20" },
//   typePaymentText: { color: Colors.success },
//   typeInvoice: { backgroundColor: Colors.warning + "20" },
//   typeInvoiceText: { color: Colors.warning },
//   typeDefault: { backgroundColor: Colors.gray200 },
//   typeDefaultText: { color: Colors.gray700 },
//   receiptDate: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 2 },
//   receiptRight: { alignItems: "flex-end" },
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
//   receiptActions: { flexDirection: "row", marginTop: 4 },
//   actionButton: { padding: Spacing.sm },
//   emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
//   emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
// });

// screens/receipts/index.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  Filter,
  Eye,
  FileText,
  Printer,
  QrCode,
  Download,
} from "lucide-react-native";
import ReceiptService from "../../../../services/receiptService";
import { formatDate, formatCurrency } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function Receipts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchReceipts();
  }, [searchTerm, filterType]);

  const fetchReceipts = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        type: filterType !== "all" ? filterType : undefined,
        search: searchTerm || undefined,
      };
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const result = await ReceiptService.getReceipts(params);
      setReceipts(result.receipts || []);
      setPagination(result.pagination || {});
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
      Alert.alert("Error", "Failed to load receipts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReceipts(1);
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
      SALES: styles.typeSales,
      PAYMENT: styles.typePayment,
      INVOICE: styles.typeInvoice,
      FINAL: styles.typeFinal,
    };
    return colors[type] || styles.typeDefault;
  };

  const getTypeTextColor = (type) => {
    const colors = {
      SALES: styles.typeSalesText,
      PAYMENT: styles.typePaymentText,
      INVOICE: styles.typeInvoiceText,
      FINAL: styles.typeFinalText,
    };
    return colors[type] || styles.typeDefaultText;
  };

  // const renderReceipt = ({ item }) => {
  //   const typeColor = getTypeColor(item.type);
  //   const typeTextColor = getTypeTextColor(item.type);
  //   const transaction = item.transactionId || {};

  //   return (
  //     <TouchableOpacity
  //       style={styles.receiptItem}
  //       onPress={() => router.push(`/receipts/${item._id}`)}
  //     >
  //       <View style={styles.receiptRow}>
  //         <View style={styles.receiptInfo}>
  //           <Text style={styles.receiptNumber}>{item.receiptNumber}</Text>
  //           <View style={styles.receiptTypeContainer}>
  //             <Text style={styles.receiptTypeIcon}>
  //               {getTypeIcon(item.type)}
  //             </Text>
  //             <View style={[styles.typeBadge, typeColor]}>
  //               <Text style={[styles.typeText, typeTextColor]}>
  //                 {item.type}
  //               </Text>
  //             </View>
  //           </View>
  //           <Text style={styles.receiptTransaction}>
  //             {transaction.transactionNumber || 'N/A'}
  //           </Text>
  //           {transaction.totalAmount !== undefined && (
  //             <Text style={styles.receiptAmount}>
  //               {formatCurrency(transaction.totalAmount)}
  //             </Text>
  //           )}
  //           <Text style={styles.receiptDate}>{formatDate(item.createdAt)}</Text>
  //         </View>
  //         <View style={styles.receiptRight}>
  //           <View
  //             style={[
  //               styles.statusBadge,
  //               item.printed ? styles.statusPrinted : styles.statusNotPrinted,
  //             ]}
  //           >
  //             <Text
  //               style={[
  //                 styles.statusText,
  //                 item.printed
  //                   ? styles.statusPrintedText
  //                   : styles.statusNotPrintedText,
  //               ]}
  //             >
  //               {item.printed ? `Printed (${item.printCount || 1}x)` : "Not Printed"}
  //             </Text>
  //           </View>
  //           <View style={styles.receiptActions}>
  //             <TouchableOpacity
  //               style={styles.actionButton}
  //               onPress={() => router.push(`/receipts/${item._id}/preview`)}
  //             >
  //               <Eye size={18} color={Colors.primary} />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={styles.actionButton}
  //               onPress={async () => {
  //                 try {
  //                   await ReceiptService.downloadReceipt(item._id);
  //                   Alert.alert("Success", "Receipt downloaded");
  //                 } catch (error) {
  //                   Alert.alert("Error", "Failed to download receipt");
  //                 }
  //               }}
  //             >
  //               <Download size={18} color={Colors.gray500} />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={styles.actionButton}
  //               onPress={async () => {
  //                 try {
  //                   await ReceiptService.markAsPrinted(item._id);
  //                   Alert.alert("Success", "Receipt marked as printed");
  //                   fetchReceipts(pagination.page);
  //                 } catch (error) {
  //                   Alert.alert("Error", "Failed to mark as printed");
  //                 }
  //               }}
  //             >
  //               <Printer size={18} color={Colors.gray500} />
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };
  // screens/receipts/index.jsx - Add QR Status indicator
  // Add this to the renderReceipt function

  const renderReceipt = ({ item }) => {
    const typeColor = getTypeColor(item.type);
    const typeTextColor = getTypeTextColor(item.type);
    const transaction = item.transactionId || {};
    const hasQR = !!item.qrCode;

    return (
      <TouchableOpacity
        style={styles.receiptItem}
        onPress={() => router.push(`/receipts/${item._id}`)}
      >
        <View style={styles.receiptRow}>
          <View style={styles.receiptInfo}>
            <Text style={styles.receiptNumber}>{item.receiptNumber}</Text>
            <View style={styles.receiptTypeContainer}>
              <Text style={styles.receiptTypeIcon}>
                {getTypeIcon(item.type)}
              </Text>
              <View style={[styles.typeBadge, typeColor]}>
                <Text style={[styles.typeText, typeTextColor]}>
                  {item.type}
                </Text>
              </View>
              {hasQR && (
                <View style={styles.qrStatusBadge}>
                  <QrCode size={12} color={Colors.success} />
                  <Text style={styles.qrStatusText}>QR</Text>
                </View>
              )}
            </View>
            <Text style={styles.receiptTransaction}>
              {transaction.transactionNumber || "N/A"}
            </Text>
            {transaction.totalAmount !== undefined && (
              <Text style={styles.receiptAmount}>
                {formatCurrency(transaction.totalAmount)}
              </Text>
            )}
            <Text style={styles.receiptDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.receiptRight}>
            <View
              style={[
                styles.statusBadge,
                item.printed ? styles.statusPrinted : styles.statusNotPrinted,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.printed
                    ? styles.statusPrintedText
                    : styles.statusNotPrintedText,
                ]}
              >
                {item.printed
                  ? `Printed (${item.printCount || 1}x)`
                  : "Not Printed"}
              </Text>
            </View>
            <View style={styles.receiptActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/receipts/${item._id}`)}
              >
                <Eye size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    await ReceiptService.downloadReceipt(item._id);
                    Alert.alert("Success", "Receipt downloaded");
                  } catch (error) {
                    Alert.alert("Error", "Failed to download receipt");
                  }
                }}
              >
                <Download size={18} color={Colors.gray500} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    await ReceiptService.markAsPrinted(item._id);
                    Alert.alert("Success", "Receipt marked as printed");
                    fetchReceipts(pagination.page);
                  } catch (error) {
                    Alert.alert("Error", "Failed to mark as printed");
                  }
                }}
              >
                <Printer size={18} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Receipts" />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search receipts..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            Alert.alert("Filter by Type", "Select a type", [
              { text: "All", onPress: () => setFilterType("all") },
              { text: "Sales", onPress: () => setFilterType("SALES") },
              { text: "Payment", onPress: () => setFilterType("PAYMENT") },
              { text: "Invoice", onPress: () => setFilterType("INVOICE") },
              { text: "Final", onPress: () => setFilterType("FINAL") },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
        >
          <Filter
            size={20}
            color={filterType !== "all" ? Colors.primary : Colors.gray400}
          />
        </TouchableOpacity>
      </View>

      {filterType !== "all" && (
        <View style={styles.filterChipContainer}>
          <Text style={styles.filterChipText}>Type: {filterType}</Text>
          <TouchableOpacity onPress={() => setFilterType("all")}>
            <Text style={styles.filterChipClear}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={receipts}
        keyExtractor={(item) => item._id}
        renderItem={renderReceipt}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>No receipts found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...Shadows.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.md,
  },
  filterButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  filterChipText: { fontSize: Typography.sm, color: Colors.primary, flex: 1 },
  filterChipClear: {
    fontSize: Typography.md,
    color: Colors.gray500,
    paddingHorizontal: Spacing.sm,
  },
  list: { flex: 1 },
  listContent: { padding: Spacing.md },
  receiptItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptInfo: { flex: 1 },
  receiptNumber: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  receiptTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  receiptTypeIcon: { fontSize: Typography.md, marginRight: 4 },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeText: { fontSize: Typography.xs, fontWeight: "500" },
  typeSales: { backgroundColor: Colors.primary + "20" },
  typeSalesText: { color: Colors.primary },
  typePayment: { backgroundColor: Colors.success + "20" },
  typePaymentText: { color: Colors.success },
  typeInvoice: { backgroundColor: Colors.warning + "20" },
  typeInvoiceText: { color: Colors.warning },
  typeFinal: { backgroundColor: Colors.success + "30" },
  typeFinalText: { color: Colors.success },
  typeDefault: { backgroundColor: Colors.gray200 },
  typeDefaultText: { color: Colors.gray700 },
  receiptTransaction: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 1,
  },
  receiptAmount: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray900,
    marginTop: 1,
  },
  receiptDate: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 1 },
  receiptRight: { alignItems: "flex-end" },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  // Add these styles
  qrStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.success + "20",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
    marginLeft: 4,
  },
  qrStatusText: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: "500",
  },
  statusText: { fontSize: Typography.xs, fontWeight: "500" },
  statusPrinted: { backgroundColor: Colors.success + "20" },
  statusPrintedText: { color: Colors.success },
  statusNotPrinted: { backgroundColor: Colors.warning + "20" },
  statusNotPrintedText: { color: Colors.warning },
  receiptActions: { flexDirection: "row", marginTop: 4 },
  actionButton: { padding: Spacing.sm },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
});
