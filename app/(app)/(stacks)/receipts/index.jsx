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
// import {
//   Search,
//   Filter,
//   Eye,
//   FileText,
//   Printer,
//   QrCode,
//   Download,
// } from "lucide-react-native";
// import ReceiptService from "../../../../services/receiptService";
// import { formatDate, formatCurrency } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

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
//       setLoading(true);
//       const params = {
//         page,
//         limit: 20,
//         type: filterType !== "all" ? filterType : undefined,
//         search: searchTerm || undefined,
//       };
//       Object.keys(params).forEach((key) => {
//         if (!params[key]) delete params[key];
//       });

//       const result = await ReceiptService.getReceipts(params);
//       setReceipts(result.receipts || []);
//       setPagination(result.pagination || {});
//     } catch (error) {
//       console.error("Failed to fetch receipts:", error);
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
//       FINAL: "✅",
//     };
//     return icons[type] || "📄";
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       SALES: styles.typeSales,
//       PAYMENT: styles.typePayment,
//       INVOICE: styles.typeInvoice,
//       FINAL: styles.typeFinal,
//     };
//     return colors[type] || styles.typeDefault;
//   };

//   const getTypeTextColor = (type) => {
//     const colors = {
//       SALES: styles.typeSalesText,
//       PAYMENT: styles.typePaymentText,
//       INVOICE: styles.typeInvoiceText,
//       FINAL: styles.typeFinalText,
//     };
//     return colors[type] || styles.typeDefaultText;
//   };

// const renderReceipt = ({ item }) => {
//   const typeColor = getTypeColor(item.type);
//   const typeTextColor = getTypeTextColor(item.type);
//   const transaction = item.transactionId || {};
//   const hasQR = !!item.qrCode;

//   const handlePrintPress = () => {
//     // Navigate to receipt preview with print mode
//     router.push({
//       pathname: `/receipts/${item._id}/preview`,
//       params: { 
//         transactionId: transaction._id || transaction,
//         qrType: item.type,
//         printMode: 'true'
//       }
//     });
//   };

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
//             {hasQR && (
//               <View style={styles.qrStatusBadge}>
//                 <QrCode size={12} color={Colors.success} />
//                 <Text style={styles.qrStatusText}>QR</Text>
//               </View>
//             )}
//           </View>
//           <Text style={styles.receiptTransaction}>
//             {transaction.transactionNumber || "N/A"}
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
//               {item.printed
//                 ? `Printed (${item.printCount || 1}x)`
//                 : "Not Printed"}
//             </Text>
//           </View>
//           <View style={styles.receiptActions}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => router.push(`/receipts/${item._id}`)}
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
//               onPress={handlePrintPress}
//             >
//               <Printer size={18} color={Colors.warning} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Receipts" />
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
//               { text: "Final", onPress: () => setFilterType("FINAL") },
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
//   typeFinal: { backgroundColor: Colors.success + "30" },
//   typeFinalText: { color: Colors.success },
//   typeDefault: { backgroundColor: Colors.gray200 },
//   typeDefaultText: { color: Colors.gray700 },
//   receiptTransaction: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 1,
//   },
//   receiptAmount: {
//     fontSize: Typography.sm,
//     fontWeight: "600",
//     color: Colors.gray900,
//     marginTop: 1,
//   },
//   receiptDate: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 1 },
//   receiptRight: { alignItems: "flex-end" },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   // Add these styles
//   qrStatusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.success + "20",
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 2,
//     marginLeft: 4,
//   },
//   qrStatusText: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: "500",
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







































// import React, { useState, useEffect, useRef, useCallback } from "react";
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
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Search,
//   Filter,
//   Eye,
//   FileText,
//   Printer,
//   QrCode,
//   Download,
//   Calendar,
//   X,
//   RefreshCw,
//   Clock,
// } from "lucide-react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import ReceiptService from "../../../../services/receiptService";
// import { formatDate, formatCurrency, formatDateShort } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// const RECEIPT_TYPES = [
//   { value: "SALES", label: "Sales" },
//   { value: "PAYMENT", label: "Payment" },
//   { value: "INVOICE", label: "Invoice" },
//   { value: "FINAL", label: "Final" },
// ];

// const SORT_OPTIONS = [
//   { value: "createdAt_desc", label: "Newest First" },
//   { value: "createdAt_asc", label: "Oldest First" },
//   { value: "totalAmount_desc", label: "Highest Amount" },
//   { value: "totalAmount_asc", label: "Lowest Amount" },
// ];

// export default function Receipts() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [receipts, setReceipts] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [sortBy, setSortBy] = useState("createdAt_desc");
//   const [dateRange, setDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [showPrintedOnly, setShowPrintedOnly] = useState(false);
//   const [showWithQR, setShowWithQR] = useState(false);

//   // UI state
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(null);
//   const [tempDateRange, setTempDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [hasActiveFilters, setHasActiveFilters] = useState(false);

//   // Debounce refs
//   const searchTimeoutRef = useRef(null);
//   const isInitialLoad = useRef(true);

//   // Apply filters
//   const applyFilters = useCallback(async (page = 1, append = false) => {
//     try {
//       if (append) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       const params = {
//         page,
//         limit: 20,
//         sort: sortBy,
//       };

//       // Only add search if it has value
//       if (searchTerm && searchTerm.trim().length > 0) {
//         params.search = searchTerm.trim();
//       }

//       if (selectedTypes.length > 0) {
//         params.type = selectedTypes.join(",");
//       }

//       if (dateRange.startDate) {
//         params.startDate = dateRange.startDate.toISOString();
//       }

//       if (dateRange.endDate) {
//         params.endDate = dateRange.endDate.toISOString();
//       }

//       if (showPrintedOnly) {
//         params.printed = true;
//       }

//       if (showWithQR) {
//         params.hasQR = true;
//       }

//       // Clean undefined params
//       Object.keys(params).forEach((key) => {
//         if (params[key] === undefined || params[key] === "" || params[key] === null) {
//           delete params[key];
//         }
//       });

//       console.log('Fetching receipts with params:', params); // Debug log

//       const result = await ReceiptService.getReceipts(params);
      
//       if (append) {
//         setReceipts(prev => [...prev, ...(result.receipts || [])]);
//       } else {
//         setReceipts(result.receipts || []);
//       }
//       setPagination(result.pagination || {});
//     } catch (error) {
//       console.error("Failed to fetch receipts:", error);
//       Alert.alert("Error", "Failed to load receipts");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   }, [searchTerm, selectedTypes, sortBy, dateRange, showPrintedOnly, showWithQR]);

//   // Initial load
//   useEffect(() => {
//     if (isInitialLoad.current) {
//       isInitialLoad.current = false;
//       applyFilters(1);
//     }
//   }, []);

//   // Debounced search - Fixed to properly handle search
//   useEffect(() => {
//     // Clear previous timeout
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     // Don't trigger search on initial load
//     if (isInitialLoad.current) {
//       return;
//     }

//     // Set new timeout for search
//     searchTimeoutRef.current = setTimeout(() => {
//       applyFilters(1);
//     }, 500);

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchTerm]);

//   // Check for active filters
//   useEffect(() => {
//     const hasFilters =
//       selectedTypes.length > 0 ||
//       dateRange.startDate ||
//       dateRange.endDate ||
//       sortBy !== "createdAt_desc" ||
//       showPrintedOnly ||
//       showWithQR;
//     setHasActiveFilters(hasFilters);
//   }, [selectedTypes, dateRange, sortBy, showPrintedOnly, showWithQR]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     applyFilters(1);
//   };

//   const loadMore = () => {
//     if (pagination.page < pagination.pages && !loading && !loadingMore) {
//       applyFilters(pagination.page + 1, true);
//     }
//   };

//   const clearAllFilters = () => {
//     setSelectedTypes([]);
//     setDateRange({ startDate: null, endDate: null });
//     setSortBy("createdAt_desc");
//     setSearchTerm("");
//     setShowPrintedOnly(false);
//     setShowWithQR(false);
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const applyFilterChanges = () => {
//     setDateRange(tempDateRange);
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const toggleTypeFilter = (type) => {
//     setSelectedTypes((prev) =>
//       prev.includes(type)
//         ? prev.filter((t) => t !== type)
//         : [...prev, type]
//     );
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
//       SALES: styles.typeSales,
//       PAYMENT: styles.typePayment,
//       INVOICE: styles.typeInvoice,
//       FINAL: styles.typeFinal,
//     };
//     return colors[type] || styles.typeDefault;
//   };

//   const getTypeTextColor = (type) => {
//     const colors = {
//       SALES: styles.typeSalesText,
//       PAYMENT: styles.typePaymentText,
//       INVOICE: styles.typeInvoiceText,
//       FINAL: styles.typeFinalText,
//     };
//     return colors[type] || styles.typeDefaultText;
//   };

//   const renderReceipt = ({ item }) => {
//     const typeColor = getTypeColor(item.type);
//     const typeTextColor = getTypeTextColor(item.type);
//     const transaction = item.transactionId || {};
//     const hasQR = !!item.qrCode;

//     const handlePrintPress = () => {
//       router.push({
//         pathname: `/receipts/${item._id}/preview`,
//         params: { 
//           transactionId: transaction._id || transaction,
//           qrType: item.type,
//           printMode: 'true'
//         }
//       });
//     };

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
//               {hasQR && (
//                 <View style={styles.qrStatusBadge}>
//                   <QrCode size={12} color={Colors.success} />
//                   <Text style={styles.qrStatusText}>QR</Text>
//                 </View>
//               )}
//             </View>
//             <Text style={styles.receiptTransaction}>
//               {transaction.transactionNumber || "N/A"}
//             </Text>
//             {transaction.totalAmount !== undefined && (
//               <Text style={styles.receiptAmount}>
//                 {formatCurrency(transaction.totalAmount)}
//               </Text>
//             )}
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
//                 {item.printed
//                   ? `Printed (${item.printCount || 1}x)`
//                   : "Not Printed"}
//               </Text>
//             </View>
//             <View style={styles.receiptActions}>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => router.push(`/receipts/${item._id}`)}
//               >
//                 <Eye size={18} color={Colors.primary} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={async () => {
//                   try {
//                     await ReceiptService.downloadReceipt(item._id);
//                     Alert.alert("Success", "Receipt downloaded");
//                   } catch (error) {
//                     Alert.alert("Error", "Failed to download receipt");
//                   }
//                 }}
//               >
//                 <Download size={18} color={Colors.gray500} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={handlePrintPress}
//               >
//                 <Printer size={18} color={Colors.warning} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderFilterModal = () => (
//     <Modal
//       visible={showFilterModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowFilterModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <TouchableOpacity
//               onPress={() => setShowFilterModal(false)}
//               style={styles.modalCloseButton}
//             >
//               <X size={24} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             style={styles.modalScroll}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Date Range */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Date Range</Text>
//               <View style={styles.dateRangeContainer}>
//                 <TouchableOpacity
//                   style={styles.dateButton}
//                   onPress={() => setShowDatePicker("start")}
//                 >
//                   <Calendar size={18} color={Colors.gray500} />
//                   <Text style={styles.dateButtonText}>
//                     {tempDateRange.startDate
//                       ? formatDateShort(tempDateRange.startDate)
//                       : "Start Date"}
//                   </Text>
//                 </TouchableOpacity>
//                 <Text style={styles.dateSeparator}>—</Text>
//                 <TouchableOpacity
//                   style={styles.dateButton}
//                   onPress={() => setShowDatePicker("end")}
//                 >
//                   <Calendar size={18} color={Colors.gray500} />
//                   <Text style={styles.dateButtonText}>
//                     {tempDateRange.endDate
//                       ? formatDateShort(tempDateRange.endDate)
//                       : "End Date"}
//                   </Text>
//                 </TouchableOpacity>
//                 {(tempDateRange.startDate || tempDateRange.endDate) && (
//                   <TouchableOpacity
//                     style={styles.clearDateButton}
//                     onPress={() =>
//                       setTempDateRange({ startDate: null, endDate: null })
//                     }
//                   >
//                     <X size={16} color={Colors.gray400} />
//                   </TouchableOpacity>
//                 )}
//               </View>
//               {showDatePicker && (
//                 <DateTimePicker
//                   value={
//                     showDatePicker === "start"
//                       ? tempDateRange.startDate || new Date()
//                       : tempDateRange.endDate || new Date()
//                   }
//                   mode="date"
//                   display="default"
//                   onChange={(event, selectedDate) => {
//                     setShowDatePicker(null);
//                     if (selectedDate) {
//                       if (showDatePicker === "start") {
//                         setTempDateRange({
//                           ...tempDateRange,
//                           startDate: selectedDate,
//                         });
//                       } else {
//                         setTempDateRange({
//                           ...tempDateRange,
//                           endDate: selectedDate,
//                         });
//                       }
//                     }
//                   }}
//                 />
//               )}
//             </View>

//             {/* Receipt Types */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Receipt Types</Text>
//               <View style={styles.chipContainer}>
//                 {RECEIPT_TYPES.map((type) => (
//                   <TouchableOpacity
//                     key={type.value}
//                     style={[
//                       styles.chip,
//                       selectedTypes.includes(type.value) && styles.chipActive,
//                     ]}
//                     onPress={() => toggleTypeFilter(type.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         selectedTypes.includes(type.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {type.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Sort By */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Sort By</Text>
//               <View style={styles.sortContainer}>
//                 {SORT_OPTIONS.map((option) => (
//                   <TouchableOpacity
//                     key={option.value}
//                     style={[
//                       styles.sortOption,
//                       sortBy === option.value && styles.sortOptionActive,
//                     ]}
//                     onPress={() => setSortBy(option.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.sortOptionText,
//                         sortBy === option.value && styles.sortOptionTextActive,
//                       ]}
//                     >
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Toggle Options */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Options</Text>
//               <View style={styles.toggleContainer}>
//                 <TouchableOpacity
//                   style={[
//                     styles.toggleOption,
//                     showPrintedOnly && styles.toggleOptionActive,
//                   ]}
//                   onPress={() => setShowPrintedOnly(!showPrintedOnly)}
//                 >
//                   <Text
//                     style={[
//                       styles.toggleOptionText,
//                       showPrintedOnly && styles.toggleOptionTextActive,
//                     ]}
//                   >
//                     Printed Only
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.toggleOption,
//                     showWithQR && styles.toggleOptionActive,
//                   ]}
//                   onPress={() => setShowWithQR(!showWithQR)}
//                 >
//                   <Text
//                     style={[
//                       styles.toggleOptionText,
//                       showWithQR && styles.toggleOptionTextActive,
//                     ]}
//                   >
//                     With QR Code
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={clearAllFilters}
//             >
//               <RefreshCw size={18} color={Colors.gray500} />
//               <Text style={styles.clearButtonText}>Clear All</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.applyButton}
//               onPress={applyFilterChanges}
//             >
//               <Text style={styles.applyButtonText}>Apply Filters</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading && receipts.length === 0 && !isInitialLoad.current) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Receipts" />
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search receipts..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//             returnKeyType="search"
//             onSubmitEditing={() => {
//               if (searchTimeoutRef.current) {
//                 clearTimeout(searchTimeoutRef.current);
//               }
//               applyFilters(1);
//             }}
//           />
//           {searchTerm.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchTerm("")}>
//               <X size={18} color={Colors.gray400} />
//             </TouchableOpacity>
//           )}
//         </View>
//         <TouchableOpacity
//           style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
//           onPress={() => {
//             setTempDateRange(dateRange);
//             setShowFilterModal(true);
//           }}
//         >
//           <Filter
//             size={20}
//             color={hasActiveFilters ? Colors.white : Colors.gray400}
//           />
//           {hasActiveFilters && <View style={styles.filterBadge} />}
//         </TouchableOpacity>
//       </View>

//       {/* Active Filters Summary */}
//       {hasActiveFilters && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.filterChipsScroll}
//           contentContainerStyle={styles.filterChipsContent}
//         >
//           {selectedTypes.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Types: {selectedTypes.join(", ")}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedTypes([])}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {dateRange.startDate && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 From: {formatDateShort(dateRange.startDate)}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setDateRange({ ...dateRange, startDate: null })}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {dateRange.endDate && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 To: {formatDateShort(dateRange.endDate)}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setDateRange({ ...dateRange, endDate: null })}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {sortBy !== "createdAt_desc" && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSortBy("createdAt_desc")}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {showPrintedOnly && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>Printed Only</Text>
//               <TouchableOpacity
//                 onPress={() => setShowPrintedOnly(false)}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {showWithQR && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>With QR</Text>
//               <TouchableOpacity
//                 onPress={() => setShowWithQR(false)}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
//             <Text style={styles.clearAllChipText}>Clear All</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={[
//           styles.listContent,
//           receipts.length === 0 && styles.emptyListContent,
//         ]}
//         data={receipts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderReceipt}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           receipts.length > 0 ? (
//             <View style={styles.listHeader}>
//               <Text style={styles.listHeaderText}>
//                 Showing {receipts.length} of {pagination.total} receipts
//               </Text>
//             </View>
//           ) : null
//         }
//         ListFooterComponent={
//           loadingMore ? (
//             <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
//           ) : null
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Clock size={48} color={Colors.gray300} />
//             <Text style={styles.emptyTitle}>No Receipts Found</Text>
//             <Text style={styles.emptyDescription}>
//               {searchTerm || hasActiveFilters
//                 ? "Try adjusting your search or filters"
//                 : "No receipts available"}
//             </Text>
//             {(searchTerm || hasActiveFilters) && (
//               <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
//                 <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       />

//       {renderFilterModal()}
//     </View>
//   );
// }

// // Styles remain the same...
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//     ...Shadows.sm,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
//   },
//   filterButton: {
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     justifyContent: "center",
//     alignItems: "center",
//     width: 44,
//     height: 44,
//     position: "relative",
//   },
//   filterButtonActive: {
//     backgroundColor: Colors.primary,
//   },
//   filterBadge: {
//     position: "absolute",
//     top: 4,
//     right: 4,
//     width: 10,
//     height: 10,
//     borderRadius: 10,
//     backgroundColor: Colors.error,
//     borderWidth: 2,
//     borderColor: Colors.white,
//   },
//   filterChipsScroll: {
//     backgroundColor: Colors.white,
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     maxHeight: 50,
//   },
//   filterChipsContent: {
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   filterChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "10",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.xs,
//   },
//   filterChipText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//   },
//   filterChipRemove: {
//     padding: 2,
//   },
//   clearAllChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//   },
//   clearAllChipText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//   },
//   list: { flex: 1 },
//   listContent: { padding: Spacing.md, gap: Spacing.md },
//   emptyListContent: { flex: 1 },
//   listHeader: {
//     paddingBottom: Spacing.sm,
//   },
//   listHeaderText: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   receiptItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
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
//   typeFinal: { backgroundColor: Colors.success + "30" },
//   typeFinalText: { color: Colors.success },
//   typeDefault: { backgroundColor: Colors.gray200 },
//   typeDefaultText: { color: Colors.gray700 },
//   receiptTransaction: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 1,
//   },
//   receiptAmount: {
//     fontSize: Typography.sm,
//     fontWeight: "600",
//     color: Colors.gray900,
//     marginTop: 1,
//   },
//   receiptDate: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 1 },
//   receiptRight: { alignItems: "flex-end" },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   qrStatusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.success + "20",
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 2,
//     marginLeft: 4,
//   },
//   qrStatusText: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: "500",
//   },
//   statusText: { fontSize: Typography.xs, fontWeight: "500" },
//   statusPrinted: { backgroundColor: Colors.success + "20" },
//   statusPrintedText: { color: Colors.success },
//   statusNotPrinted: { backgroundColor: Colors.warning + "20" },
//   statusNotPrintedText: { color: Colors.warning },
//   receiptActions: { flexDirection: "row", marginTop: 4 },
//   actionButton: { padding: Spacing.sm },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: Spacing["4xl"],
//     gap: Spacing.md,
//   },
//   emptyTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   emptyDescription: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     textAlign: "center",
//     maxWidth: "80%",
//   },
//   clearFiltersButton: {
//     marginTop: Spacing.md,
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.sm,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//   },
//   clearFiltersButtonText: {
//     color: Colors.white,
//     fontWeight: "500",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     maxHeight: "90%",
//     minHeight: "70%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalCloseButton: {
//     padding: Spacing.xs,
//   },
//   modalScroll: {
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.md,
//   },
//   filterSection: {
//     marginVertical: Spacing.md,
//   },
//   filterSectionTitle: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   dateRangeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   dateButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.md,
//     gap: Spacing.sm,
//   },
//   dateButtonText: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//   },
//   dateSeparator: {
//     color: Colors.gray400,
//     fontSize: Typography.sm,
//   },
//   clearDateButton: {
//     padding: Spacing.xs,
//   },
//   chipContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: Spacing.xs,
//   },
//   chip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   chipActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   chipText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   chipTextActive: {
//     color: Colors.white,
//   },
//   sortContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: Spacing.xs,
//   },
//   sortOption: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   sortOptionActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   sortOptionText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   sortOptionTextActive: {
//     color: Colors.white,
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     gap: Spacing.sm,
//   },
//   toggleOption: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.md,
//     borderRadius: BorderRadius.md,
//     backgroundColor: Colors.gray100,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   toggleOptionActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   toggleOptionText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   toggleOptionTextActive: {
//     color: Colors.white,
//   },
//   modalFooter: {
//     flexDirection: "row",
//     padding: Spacing.lg,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//     gap: Spacing.md,
//   },
//   clearButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     gap: Spacing.sm,
//   },
//   clearButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray600,
//   },
//   applyButton: {
//     flex: 2,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   applyButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.white,
//   },
//   footerLoader: {
//     paddingVertical: Spacing.lg,
//   },
// });


































// import React, { useState, useEffect, useCallback, useRef } from "react";
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
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Search,
//   Filter,
//   Eye,
//   FileText,
//   Printer,
//   QrCode,
//   Download,
//   Calendar,
//   X,
//   RefreshCw,
//   Clock,
// } from "lucide-react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import ReceiptService from "../../../../services/receiptService";
// import { formatDate, formatCurrency, formatDateShort } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// const RECEIPT_TYPES = [
//   { value: "SALES", label: "Sales" },
//   { value: "PAYMENT", label: "Payment" },
//   { value: "INVOICE", label: "Invoice" },
//   { value: "FINAL", label: "Final" },
// ];

// const SORT_OPTIONS = [
//   { value: "createdAt_desc", label: "Newest First" },
//   { value: "createdAt_asc", label: "Oldest First" },
//   { value: "totalAmount_desc", label: "Highest Amount" },
//   { value: "totalAmount_asc", label: "Lowest Amount" },
// ];

// const DEFAULT_DATE_RANGE = { startDate: null, endDate: null };
// const DEFAULT_SORT = "createdAt_desc";

// export default function Receipts() {
//   const router = useRouter();

//   // List state
//   const [loading, setLoading] = useState(true); // true so the first render shows a spinner, not an empty state
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [receipts, setReceipts] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   // Search: `searchTerm` is what's in the input, `debouncedSearch` is what's actually
//   // sent to the API 500ms after typing stops (or immediately on submit/clear).
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   // Committed filters — these are the values the current `receipts` list reflects.
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [sortBy, setSortBy] = useState(DEFAULT_SORT);
//   const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
//   const [showPrintedOnly, setShowPrintedOnly] = useState(false);
//   const [showWithQR, setShowWithQR] = useState(false);

//   // Draft filters — edited inside the modal, only committed to the state above
//   // when the user taps "Apply Filters". Closing the modal any other way discards them.
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(null);
//   const [draftFilters, setDraftFilters] = useState({
//     selectedTypes: [],
//     sortBy: DEFAULT_SORT,
//     dateRange: DEFAULT_DATE_RANGE,
//     showPrintedOnly: false,
//     showWithQR: false,
//   });

//   const hasActiveFilters =
//     selectedTypes.length > 0 ||
//     !!dateRange.startDate ||
//     !!dateRange.endDate ||
//     sortBy !== DEFAULT_SORT ||
//     showPrintedOnly ||
//     showWithQR;

//   // Guards against out-of-order responses: if the user changes filters again before
//   // an in-flight request resolves, the stale response is dropped instead of overwriting
//   // newer results.
//   const requestIdRef = useRef(0);

//   const fetchReceipts = useCallback(
//     async (page = 1, append = false) => {
//       const requestId = ++requestIdRef.current;
//       try {
//         if (append) {
//           setLoadingMore(true);
//         } else {
//           setLoading(true);
//         }

//         const params = { page, limit: 20, sort: sortBy };

//         if (debouncedSearch) params.search = debouncedSearch;
//         if (selectedTypes.length > 0) params.type = selectedTypes.join(",");
//         if (dateRange.startDate) params.startDate = dateRange.startDate.toISOString();
//         if (dateRange.endDate) params.endDate = dateRange.endDate.toISOString();
//         if (showPrintedOnly) params.printed = true;
//         if (showWithQR) params.hasQR = true;

//         const result = await ReceiptService.getReceipts(params);

//         // A newer request has since started — ignore this response.
//         if (requestId !== requestIdRef.current) return;

//         setReceipts((prev) =>
//           append ? [...prev, ...(result.receipts || [])] : result.receipts || []
//         );
//         setPagination(result.pagination || { page, limit: 20, total: 0, pages: 0 });
//       } catch (error) {
//         if (requestId !== requestIdRef.current) return;
//         console.error("Failed to fetch receipts:", error);
//         Alert.alert("Error", "Failed to load receipts");
//       } finally {
//         if (requestId === requestIdRef.current) {
//           setLoading(false);
//           setLoadingMore(false);
//           setRefreshing(false);
//         }
//       }
//     },
//     [debouncedSearch, selectedTypes, sortBy, dateRange, showPrintedOnly, showWithQR]
//   );

//   // Single source of truth: refetch page 1 whenever any *committed* filter changes,
//   // including on mount. Every filter action below only needs to update state —
//   // no more scattered manual applyFilters(...) calls to keep in sync.
//   useEffect(() => {
//     fetchReceipts(1);
//   }, [fetchReceipts]);

//   // Debounce typing in the search box. Submitting or clearing bypasses the wait.
//   useEffect(() => {
//     const handle = setTimeout(() => {
//       setDebouncedSearch(searchTerm.trim());
//     }, 500);
//     return () => clearTimeout(handle);
//   }, [searchTerm]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchReceipts(1);
//   };

//   const loadMore = () => {
//     if (!loading && !loadingMore && pagination.page < pagination.pages) {
//       fetchReceipts(pagination.page + 1, true);
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     setDebouncedSearch("");
//   };

//   const submitSearch = () => {
//     setDebouncedSearch(searchTerm.trim());
//   };

//   const clearAllFilters = () => {
//     setSearchTerm("");
//     setDebouncedSearch("");
//     setSelectedTypes([]);
//     setSortBy(DEFAULT_SORT);
//     setDateRange(DEFAULT_DATE_RANGE);
//     setShowPrintedOnly(false);
//     setShowWithQR(false);
//     setShowFilterModal(false);
//   };

//   const openFilterModal = () => {
//     // Seed the draft from the currently-committed filters every time the modal opens.
//     setDraftFilters({
//       selectedTypes,
//       sortBy,
//       dateRange,
//       showPrintedOnly,
//       showWithQR,
//     });
//     setShowFilterModal(true);
//   };

//   const applyFilterChanges = () => {
//     setSelectedTypes(draftFilters.selectedTypes);
//     setSortBy(draftFilters.sortBy);
//     setDateRange(draftFilters.dateRange);
//     setShowPrintedOnly(draftFilters.showPrintedOnly);
//     setShowWithQR(draftFilters.showWithQR);
//     setShowFilterModal(false);
//   };

//   const toggleDraftType = (type) => {
//     setDraftFilters((prev) => ({
//       ...prev,
//       selectedTypes: prev.selectedTypes.includes(type)
//         ? prev.selectedTypes.filter((t) => t !== type)
//         : [...prev.selectedTypes, type],
//     }));
//   };

//   const handleDraftDateChange = (which, selectedDate) => {
//     if (!selectedDate) return;
//     setDraftFilters((prev) => {
//       const next = { ...prev.dateRange, [which]: selectedDate };
//       // Keep the range valid — dragging one end past the other pulls it along.
//       if (which === "startDate" && next.endDate && selectedDate > next.endDate) {
//         next.endDate = selectedDate;
//       }
//       if (which === "endDate" && next.startDate && selectedDate < next.startDate) {
//         next.startDate = selectedDate;
//       }
//       return { ...prev, dateRange: next };
//     });
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
//       SALES: styles.typeSales,
//       PAYMENT: styles.typePayment,
//       INVOICE: styles.typeInvoice,
//       FINAL: styles.typeFinal,
//     };
//     return colors[type] || styles.typeDefault;
//   };

//   const getTypeTextColor = (type) => {
//     const colors = {
//       SALES: styles.typeSalesText,
//       PAYMENT: styles.typePaymentText,
//       INVOICE: styles.typeInvoiceText,
//       FINAL: styles.typeFinalText,
//     };
//     return colors[type] || styles.typeDefaultText;
//   };

//   const renderReceipt = ({ item }) => {
//     const typeColor = getTypeColor(item.type);
//     const typeTextColor = getTypeTextColor(item.type);
//     const transaction = item.transactionId || {};
//     const hasQR = !!item.qrCode;

//     const handlePrintPress = () => {
//       router.push({
//         pathname: `/receipts/${item._id}/preview`,
//         params: {
//           transactionId: transaction._id || transaction,
//           qrType: item.type,
//           printMode: "true",
//         },
//       });
//     };

//     return (
//       <TouchableOpacity
//         style={styles.receiptItem}
//         onPress={() => router.push(`/receipts/${item._id}`)}
//       >
//         <View style={styles.receiptRow}>
//           <View style={styles.receiptInfo}>
//             <Text style={styles.receiptNumber}>{item.receiptNumber}</Text>
//             <View style={styles.receiptTypeContainer}>
//               <Text style={styles.receiptTypeIcon}>{getTypeIcon(item.type)}</Text>
//               <View style={[styles.typeBadge, typeColor]}>
//                 <Text style={[styles.typeText, typeTextColor]}>{item.type}</Text>
//               </View>
//               {hasQR && (
//                 <View style={styles.qrStatusBadge}>
//                   <QrCode size={12} color={Colors.success} />
//                   <Text style={styles.qrStatusText}>QR</Text>
//                 </View>
//               )}
//             </View>
//             <Text style={styles.receiptTransaction}>
//               {transaction.transactionNumber || "N/A"}
//             </Text>
//             {transaction.totalAmount !== undefined && (
//               <Text style={styles.receiptAmount}>
//                 {formatCurrency(transaction.totalAmount)}
//               </Text>
//             )}
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
//                   item.printed ? styles.statusPrintedText : styles.statusNotPrintedText,
//                 ]}
//               >
//                 {item.printed ? `Printed (${item.printCount || 1}x)` : "Not Printed"}
//               </Text>
//             </View>
//             <View style={styles.receiptActions}>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => router.push(`/receipts/${item._id}`)}
//               >
//                 <Eye size={18} color={Colors.primary} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={async () => {
//                   try {
//                     await ReceiptService.downloadReceipt(item._id);
//                     Alert.alert("Success", "Receipt downloaded");
//                   } catch (error) {
//                     Alert.alert("Error", "Failed to download receipt");
//                   }
//                 }}
//               >
//                 <Download size={18} color={Colors.gray500} />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.actionButton} onPress={handlePrintPress}>
//                 <Printer size={18} color={Colors.warning} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderFilterModal = () => (
//     <Modal
//       visible={showFilterModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowFilterModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <TouchableOpacity
//               onPress={() => setShowFilterModal(false)}
//               style={styles.modalCloseButton}
//             >
//               <X size={24} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
//             {/* Date Range */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Date Range</Text>
//               <View style={styles.dateRangeContainer}>
//                 <TouchableOpacity
//                   style={styles.dateButton}
//                   onPress={() => setShowDatePicker("start")}
//                 >
//                   <Calendar size={18} color={Colors.gray500} />
//                   <Text style={styles.dateButtonText}>
//                     {draftFilters.dateRange.startDate
//                       ? formatDateShort(draftFilters.dateRange.startDate)
//                       : "Start Date"}
//                   </Text>
//                 </TouchableOpacity>
//                 <Text style={styles.dateSeparator}>—</Text>
//                 <TouchableOpacity
//                   style={styles.dateButton}
//                   onPress={() => setShowDatePicker("end")}
//                 >
//                   <Calendar size={18} color={Colors.gray500} />
//                   <Text style={styles.dateButtonText}>
//                     {draftFilters.dateRange.endDate
//                       ? formatDateShort(draftFilters.dateRange.endDate)
//                       : "End Date"}
//                   </Text>
//                 </TouchableOpacity>
//                 {(draftFilters.dateRange.startDate || draftFilters.dateRange.endDate) && (
//                   <TouchableOpacity
//                     style={styles.clearDateButton}
//                     onPress={() =>
//                       setDraftFilters((prev) => ({ ...prev, dateRange: DEFAULT_DATE_RANGE }))
//                     }
//                   >
//                     <X size={16} color={Colors.gray400} />
//                   </TouchableOpacity>
//                 )}
//               </View>
//               {showDatePicker && (
//                 <DateTimePicker
//                   value={
//                     showDatePicker === "start"
//                       ? draftFilters.dateRange.startDate || new Date()
//                       : draftFilters.dateRange.endDate || new Date()
//                   }
//                   mode="date"
//                   display="default"
//                   maximumDate={new Date()}
//                   onChange={(event, selectedDate) => {
//                     setShowDatePicker(null);
//                     handleDraftDateChange(
//                       showDatePicker === "start" ? "startDate" : "endDate",
//                       selectedDate
//                     );
//                   }}
//                 />
//               )}
//             </View>

//             {/* Receipt Types */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Receipt Types</Text>
//               <View style={styles.chipContainer}>
//                 {RECEIPT_TYPES.map((type) => (
//                   <TouchableOpacity
//                     key={type.value}
//                     style={[
//                       styles.chip,
//                       draftFilters.selectedTypes.includes(type.value) && styles.chipActive,
//                     ]}
//                     onPress={() => toggleDraftType(type.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         draftFilters.selectedTypes.includes(type.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {type.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Sort By */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Sort By</Text>
//               <View style={styles.sortContainer}>
//                 {SORT_OPTIONS.map((option) => (
//                   <TouchableOpacity
//                     key={option.value}
//                     style={[
//                       styles.sortOption,
//                       draftFilters.sortBy === option.value && styles.sortOptionActive,
//                     ]}
//                     onPress={() =>
//                       setDraftFilters((prev) => ({ ...prev, sortBy: option.value }))
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.sortOptionText,
//                         draftFilters.sortBy === option.value && styles.sortOptionTextActive,
//                       ]}
//                     >
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Toggle Options */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Options</Text>
//               <View style={styles.toggleContainer}>
//                 <TouchableOpacity
//                   style={[
//                     styles.toggleOption,
//                     draftFilters.showPrintedOnly && styles.toggleOptionActive,
//                   ]}
//                   onPress={() =>
//                     setDraftFilters((prev) => ({
//                       ...prev,
//                       showPrintedOnly: !prev.showPrintedOnly,
//                     }))
//                   }
//                 >
//                   <Text
//                     style={[
//                       styles.toggleOptionText,
//                       draftFilters.showPrintedOnly && styles.toggleOptionTextActive,
//                     ]}
//                   >
//                     Printed Only
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.toggleOption,
//                     draftFilters.showWithQR && styles.toggleOptionActive,
//                   ]}
//                   onPress={() =>
//                     setDraftFilters((prev) => ({ ...prev, showWithQR: !prev.showWithQR }))
//                   }
//                 >
//                   <Text
//                     style={[
//                       styles.toggleOptionText,
//                       draftFilters.showWithQR && styles.toggleOptionTextActive,
//                     ]}
//                   >
//                     With QR Code
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
//               <RefreshCw size={18} color={Colors.gray500} />
//               <Text style={styles.clearButtonText}>Clear All</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.applyButton} onPress={applyFilterChanges}>
//               <Text style={styles.applyButtonText}>Apply Filters</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading && receipts.length === 0) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Receipts" />
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search receipts..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//             returnKeyType="search"
//             onSubmitEditing={submitSearch}
//           />
//           {searchTerm.length > 0 && (
//             <TouchableOpacity onPress={clearSearch}>
//               <X size={18} color={Colors.gray400} />
//             </TouchableOpacity>
//           )}
//         </View>
//         <TouchableOpacity
//           style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
//           onPress={openFilterModal}
//         >
//           <Filter size={20} color={hasActiveFilters ? Colors.white : Colors.gray400} />
//           {hasActiveFilters && <View style={styles.filterBadge} />}
//         </TouchableOpacity>
//       </View>

//       {/* Active Filters Summary — removing a chip here updates the committed filter
//           directly, and the fetch effect above automatically refetches. */}
//       {hasActiveFilters && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.filterChipsScroll}
//           contentContainerStyle={styles.filterChipsContent}
//         >
//           {selectedTypes.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>Types: {selectedTypes.join(", ")}</Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedTypes([])}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {dateRange.startDate && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 From: {formatDateShort(dateRange.startDate)}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setDateRange((prev) => ({ ...prev, startDate: null }))}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {dateRange.endDate && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 To: {formatDateShort(dateRange.endDate)}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setDateRange((prev) => ({ ...prev, endDate: null }))}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {sortBy !== DEFAULT_SORT && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSortBy(DEFAULT_SORT)}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {showPrintedOnly && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>Printed Only</Text>
//               <TouchableOpacity
//                 onPress={() => setShowPrintedOnly(false)}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {showWithQR && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>With QR</Text>
//               <TouchableOpacity
//                 onPress={() => setShowWithQR(false)}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
//             <Text style={styles.clearAllChipText}>Clear All</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={[
//           styles.listContent,
//           receipts.length === 0 && styles.emptyListContent,
//         ]}
//         data={receipts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderReceipt}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           receipts.length > 0 ? (
//             <View style={styles.listHeader}>
//               <Text style={styles.listHeaderText}>
//                 Showing {receipts.length} of {pagination.total} receipts
//               </Text>
//             </View>
//           ) : null
//         }
//         ListFooterComponent={
//           loadingMore ? (
//             <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
//           ) : null
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Clock size={48} color={Colors.gray300} />
//             <Text style={styles.emptyTitle}>No Receipts Found</Text>
//             <Text style={styles.emptyDescription}>
//               {debouncedSearch || hasActiveFilters
//                 ? "Try adjusting your search or filters"
//                 : "No receipts available"}
//             </Text>
//             {(debouncedSearch || hasActiveFilters) && (
//               <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
//                 <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       />

//       {renderFilterModal()}
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
//     gap: Spacing.sm,
//     ...Shadows.sm,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
//   },
//   filterButton: {
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     justifyContent: "center",
//     alignItems: "center",
//     width: 44,
//     height: 44,
//     position: "relative",
//   },
//   filterButtonActive: {
//     backgroundColor: Colors.primary,
//   },
//   filterBadge: {
//     position: "absolute",
//     top: 4,
//     right: 4,
//     width: 10,
//     height: 10,
//     borderRadius: 10,
//     backgroundColor: Colors.error,
//     borderWidth: 2,
//     borderColor: Colors.white,
//   },
//   filterChipsScroll: {
//     backgroundColor: Colors.white,
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     maxHeight: 50,
//   },
//   filterChipsContent: {
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   filterChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "10",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.xs,
//   },
//   filterChipText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//   },
//   filterChipRemove: {
//     padding: 2,
//   },
//   clearAllChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//   },
//   clearAllChipText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//   },
//   list: { flex: 1 },
//   listContent: { padding: Spacing.md, gap: Spacing.md },
//   emptyListContent: { flex: 1 },
//   listHeader: {
//     paddingBottom: Spacing.sm,
//   },
//   listHeaderText: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   receiptItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
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
//   typeFinal: { backgroundColor: Colors.success + "30" },
//   typeFinalText: { color: Colors.success },
//   typeDefault: { backgroundColor: Colors.gray200 },
//   typeDefaultText: { color: Colors.gray700 },
//   receiptTransaction: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 1,
//   },
//   receiptAmount: {
//     fontSize: Typography.sm,
//     fontWeight: "600",
//     color: Colors.gray900,
//     marginTop: 1,
//   },
//   receiptDate: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 1 },
//   receiptRight: { alignItems: "flex-end" },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   qrStatusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.success + "20",
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     gap: 2,
//     marginLeft: 4,
//   },
//   qrStatusText: {
//     fontSize: Typography.xs,
//     color: Colors.success,
//     fontWeight: "500",
//   },
//   statusText: { fontSize: Typography.xs, fontWeight: "500" },
//   statusPrinted: { backgroundColor: Colors.success + "20" },
//   statusPrintedText: { color: Colors.success },
//   statusNotPrinted: { backgroundColor: Colors.warning + "20" },
//   statusNotPrintedText: { color: Colors.warning },
//   receiptActions: { flexDirection: "row", marginTop: 4 },
//   actionButton: { padding: Spacing.sm },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: Spacing["4xl"],
//     gap: Spacing.md,
//   },
//   emptyTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   emptyDescription: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     textAlign: "center",
//     maxWidth: "80%",
//   },
//   clearFiltersButton: {
//     marginTop: Spacing.md,
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.sm,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//   },
//   clearFiltersButtonText: {
//     color: Colors.white,
//     fontWeight: "500",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     maxHeight: "90%",
//     minHeight: "70%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalCloseButton: {
//     padding: Spacing.xs,
//   },
//   modalScroll: {
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.md,
//   },
//   filterSection: {
//     marginVertical: Spacing.md,
//   },
//   filterSectionTitle: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   dateRangeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   dateButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.md,
//     gap: Spacing.sm,
//   },
//   dateButtonText: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//   },
//   dateSeparator: {
//     color: Colors.gray400,
//     fontSize: Typography.sm,
//   },
//   clearDateButton: {
//     padding: Spacing.xs,
//   },
//   chipContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: Spacing.xs,
//   },
//   chip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   chipActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   chipText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   chipTextActive: {
//     color: Colors.white,
//   },
//   sortContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: Spacing.xs,
//   },
//   sortOption: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   sortOptionActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   sortOptionText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   sortOptionTextActive: {
//     color: Colors.white,
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     gap: Spacing.sm,
//   },
//   toggleOption: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.md,
//     borderRadius: BorderRadius.md,
//     backgroundColor: Colors.gray100,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   toggleOptionActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   toggleOptionText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   toggleOptionTextActive: {
//     color: Colors.white,
//   },
//   modalFooter: {
//     flexDirection: "row",
//     padding: Spacing.lg,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//     gap: Spacing.md,
//   },
//   clearButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     gap: Spacing.sm,
//   },
//   clearButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray600,
//   },
//   applyButton: {
//     flex: 2,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   applyButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.white,
//   },
//   footerLoader: {
//     paddingVertical: Spacing.lg,
//   },
// });




































// app/(stacks)/receipts/index.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Modal,
  ScrollView,
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
  Calendar,
  X,
  RefreshCw,
  Clock,
  Store,
  Check,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ReceiptService from "../../../../services/receiptService";
import AuthService from "../../../../services/authService";
import StoreService from "../../../../services/storeService";
import { formatDate, formatCurrency, formatDateShort } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

const RECEIPT_TYPES = [
  { value: "SALES", label: "Sales" },
  { value: "PAYMENT", label: "Payment" },
  { value: "INVOICE", label: "Invoice" },
  { value: "FINAL", label: "Final" },
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "totalAmount_desc", label: "Highest Amount" },
  { value: "totalAmount_asc", label: "Lowest Amount" },
];

const DEFAULT_DATE_RANGE = { startDate: null, endDate: null };
const DEFAULT_SORT = "createdAt_desc";

export default function Receipts() {
  const router = useRouter();

  // User and store state
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);

  // List state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Committed filters
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [showPrintedOnly, setShowPrintedOnly] = useState(false);
  const [showWithQR, setShowWithQR] = useState(false);

  // Draft filters
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [draftFilters, setDraftFilters] = useState({
    selectedTypes: [],
    sortBy: DEFAULT_SORT,
    dateRange: DEFAULT_DATE_RANGE,
    showPrintedOnly: false,
    showWithQR: false,
  });

  const requestIdRef = useRef(0);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.value === storeId);
    return store ? store.label : "";
  };

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    !!dateRange.startDate ||
    !!dateRange.endDate ||
    sortBy !== DEFAULT_SORT ||
    showPrintedOnly ||
    showWithQR;

  // Load user and stores
  const loadUserAndStores = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser.role === "SUPER_ADMIN") {
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
      console.error("Failed to load user/stores:", error);
    }
  };

  const fetchReceipts = useCallback(
    async (page = 1, append = false) => {
      const requestId = ++requestIdRef.current;
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const params = { page, limit: 20, sort: sortBy };

        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedTypes.length > 0) params.type = selectedTypes.join(",");
        if (dateRange.startDate) params.startDate = dateRange.startDate.toISOString();
        if (dateRange.endDate) params.endDate = dateRange.endDate.toISOString();
        if (showPrintedOnly) params.printed = true;
        if (showWithQR) params.hasQR = true;

        // Add store filter for Super Admin
        if (isSuperAdmin && selectedStoreId) {
          params.storeId = selectedStoreId;
        }

        const result = await ReceiptService.getReceipts(params);

        if (requestId !== requestIdRef.current) return;

        setReceipts((prev) =>
          append ? [...prev, ...(result.receipts || [])] : result.receipts || []
        );
        setPagination(result.pagination || { page, limit: 20, total: 0, pages: 0 });
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        console.error("Failed to fetch receipts:", error);
        Alert.alert("Error", "Failed to load receipts");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [
      debouncedSearch,
      selectedTypes,
      sortBy,
      dateRange,
      showPrintedOnly,
      showWithQR,
      selectedStoreId,
      isSuperAdmin,
    ]
  );

  // Initial load
  useEffect(() => {
    loadUserAndStores();
  }, []);

  // Apply filters when stores are loaded or filters change
  useEffect(() => {
    if (user) {
      fetchReceipts(1);
    }
  }, [fetchReceipts]);

  // Debounce search
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReceipts(1);
  };

  const loadMore = () => {
    if (!loading && !loadingMore && pagination.page < pagination.pages) {
      fetchReceipts(pagination.page + 1, true);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  const submitSearch = () => {
    setDebouncedSearch(searchTerm.trim());
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedTypes([]);
    setSortBy(DEFAULT_SORT);
    setDateRange(DEFAULT_DATE_RANGE);
    setShowPrintedOnly(false);
    setShowWithQR(false);
    setShowFilterModal(false);
  };

  const openFilterModal = () => {
    setDraftFilters({
      selectedTypes,
      sortBy,
      dateRange,
      showPrintedOnly,
      showWithQR,
    });
    setShowFilterModal(true);
  };

  const applyFilterChanges = () => {
    setSelectedTypes(draftFilters.selectedTypes);
    setSortBy(draftFilters.sortBy);
    setDateRange(draftFilters.dateRange);
    setShowPrintedOnly(draftFilters.showPrintedOnly);
    setShowWithQR(draftFilters.showWithQR);
    setShowFilterModal(false);
  };

  const toggleDraftType = (type) => {
    setDraftFilters((prev) => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter((t) => t !== type)
        : [...prev.selectedTypes, type],
    }));
  };

  const handleDraftDateChange = (which, selectedDate) => {
    if (!selectedDate) return;
    setDraftFilters((prev) => {
      const next = { ...prev.dateRange, [which]: selectedDate };
      if (which === "startDate" && next.endDate && selectedDate > next.endDate) {
        next.endDate = selectedDate;
      }
      if (which === "endDate" && next.startDate && selectedDate < next.startDate) {
        next.startDate = selectedDate;
      }
      return { ...prev, dateRange: next };
    });
  };

  const selectStore = (storeId) => {
    setSelectedStoreId(storeId);
    setShowStoreModal(false);
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

  const renderReceipt = ({ item }) => {
    const typeColor = getTypeColor(item.type);
    const typeTextColor = getTypeTextColor(item.type);
    const transaction = item.transactionId || {};
    const hasQR = !!item.qrCode;

    const handlePrintPress = () => {
      router.push({
        pathname: `/receipts/${item._id}/preview`,
        params: {
          transactionId: transaction._id || transaction,
          qrType: item.type,
          printMode: "true",
        },
      });
    };

    return (
      <TouchableOpacity
        style={styles.receiptItem}
        onPress={() => router.push(`/receipts/${item._id}`)}
      >
        <View style={styles.receiptRow}>
          <View style={styles.receiptInfo}>
            <Text style={styles.receiptNumber}>{item.receiptNumber}</Text>
            <View style={styles.receiptTypeContainer}>
              <Text style={styles.receiptTypeIcon}>{getTypeIcon(item.type)}</Text>
              <View style={[styles.typeBadge, typeColor]}>
                <Text style={[styles.typeText, typeTextColor]}>{item.type}</Text>
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
                  item.printed ? styles.statusPrintedText : styles.statusNotPrintedText,
                ]}
              >
                {item.printed ? `Printed (${item.printCount || 1}x)` : "Not Printed"}
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
              <TouchableOpacity style={styles.actionButton} onPress={handlePrintPress}>
                <Printer size={18} color={Colors.warning} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStoreModal = () => (
    <Modal
      visible={showStoreModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowStoreModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Store</Text>
            <TouchableOpacity onPress={() => setShowStoreModal(false)}>
              <X size={24} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={stores}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.storeItem,
                  selectedStoreId === item.value && styles.storeItemSelected,
                ]}
                onPress={() => selectStore(item.value)}
              >
                <View style={styles.storeItemLeft}>
                  <Store size={20} color={selectedStoreId === item.value ? Colors.white : Colors.gray500} />
                  <View style={styles.storeItemInfo}>
                    <Text style={[styles.storeItemName, selectedStoreId === item.value && styles.storeItemTextSelected]}>
                      {item.label}
                    </Text>
                  </View>
                </View>
                {selectedStoreId === item.value && (
                  <Check size={20} color={Colors.white} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No stores available</Text>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={styles.modalCloseButton}
            >
              <X size={24} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker("start")}
                >
                  <Calendar size={18} color={Colors.gray500} />
                  <Text style={styles.dateButtonText}>
                    {draftFilters.dateRange.startDate
                      ? formatDateShort(draftFilters.dateRange.startDate)
                      : "Start Date"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.dateSeparator}>—</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker("end")}
                >
                  <Calendar size={18} color={Colors.gray500} />
                  <Text style={styles.dateButtonText}>
                    {draftFilters.dateRange.endDate
                      ? formatDateShort(draftFilters.dateRange.endDate)
                      : "End Date"}
                  </Text>
                </TouchableOpacity>
                {(draftFilters.dateRange.startDate || draftFilters.dateRange.endDate) && (
                  <TouchableOpacity
                    style={styles.clearDateButton}
                    onPress={() =>
                      setDraftFilters((prev) => ({ ...prev, dateRange: DEFAULT_DATE_RANGE }))
                    }
                  >
                    <X size={16} color={Colors.gray400} />
                  </TouchableOpacity>
                )}
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={
                    showDatePicker === "start"
                      ? draftFilters.dateRange.startDate || new Date()
                      : draftFilters.dateRange.endDate || new Date()
                  }
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(null);
                    handleDraftDateChange(
                      showDatePicker === "start" ? "startDate" : "endDate",
                      selectedDate
                    );
                  }}
                />
              )}
            </View>

            {/* Receipt Types */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Receipt Types</Text>
              <View style={styles.chipContainer}>
                {RECEIPT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.chip,
                      draftFilters.selectedTypes.includes(type.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleDraftType(type.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        draftFilters.selectedTypes.includes(type.value) &&
                          styles.chipTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortContainer}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      draftFilters.sortBy === option.value && styles.sortOptionActive,
                    ]}
                    onPress={() =>
                      setDraftFilters((prev) => ({ ...prev, sortBy: option.value }))
                    }
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        draftFilters.sortBy === option.value && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Toggle Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Options</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    draftFilters.showPrintedOnly && styles.toggleOptionActive,
                  ]}
                  onPress={() =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      showPrintedOnly: !prev.showPrintedOnly,
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.toggleOptionText,
                      draftFilters.showPrintedOnly && styles.toggleOptionTextActive,
                    ]}
                  >
                    Printed Only
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    draftFilters.showWithQR && styles.toggleOptionActive,
                  ]}
                  onPress={() =>
                    setDraftFilters((prev) => ({ ...prev, showWithQR: !prev.showWithQR }))
                  }
                >
                  <Text
                    style={[
                      styles.toggleOptionText,
                      draftFilters.showWithQR && styles.toggleOptionTextActive,
                    ]}
                  >
                    With QR Code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
              <RefreshCw size={18} color={Colors.gray500} />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilterChanges}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && receipts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Receipts"
      />

      {/* Store Selector Bar - Super Admin Only */}
      {isSuperAdmin && selectedStoreId && (
        <View style={styles.storeSelectorBar}>
          <Store size={16} color={Colors.primary} />
          <Text style={styles.storeSelectorText}>
            Store: {getStoreName(selectedStoreId)}
          </Text>
          <TouchableOpacity
            style={styles.storeSelectorChange}
            onPress={() => setShowStoreModal(true)}
          >
            <Text style={styles.storeSelectorChangeText}>Change Store ➔</Text>
          </TouchableOpacity>
          {
          isSuperAdmin && stores.length > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowStoreModal(true)}
            >
              <Store size={20} color={Colors.primary} />
            </TouchableOpacity>
          )
        }
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search receipts..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
            returnKeyType="search"
            onSubmitEditing={submitSearch}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={openFilterModal}
        >
          <Filter size={20} color={hasActiveFilters ? Colors.white : Colors.gray400} />
          {hasActiveFilters && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsScroll}
          contentContainerStyle={styles.filterChipsContent}
        >
          {selectedTypes.length > 0 && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Types: {selectedTypes.join(", ")}</Text>
              <TouchableOpacity
                onPress={() => setSelectedTypes([])}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {dateRange.startDate && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                From: {formatDateShort(dateRange.startDate)}
              </Text>
              <TouchableOpacity
                onPress={() => setDateRange((prev) => ({ ...prev, startDate: null }))}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {dateRange.endDate && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                To: {formatDateShort(dateRange.endDate)}
              </Text>
              <TouchableOpacity
                onPress={() => setDateRange((prev) => ({ ...prev, endDate: null }))}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {sortBy !== DEFAULT_SORT && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              </Text>
              <TouchableOpacity
                onPress={() => setSortBy(DEFAULT_SORT)}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {showPrintedOnly && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Printed Only</Text>
              <TouchableOpacity
                onPress={() => setShowPrintedOnly(false)}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {showWithQR && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>With QR</Text>
              <TouchableOpacity
                onPress={() => setShowWithQR(false)}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
            <Text style={styles.clearAllChipText}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          receipts.length === 0 && styles.emptyListContent,
        ]}
        data={receipts}
        keyExtractor={(item) => item._id}
        renderItem={renderReceipt}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          receipts.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Showing {receipts.length} of {pagination.total} receipts
                {isSuperAdmin && selectedStoreId && ` in ${getStoreName(selectedStoreId)}`}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Clock size={48} color={Colors.gray300} />
            <Text style={styles.emptyTitle}>No Receipts Found</Text>
            <Text style={styles.emptyDescription}>
              {debouncedSearch || hasActiveFilters
                ? "Try adjusting your search or filters"
                : isSuperAdmin && !selectedStoreId
                ? "Please select a store to view receipts"
                : "No receipts available"}
            </Text>
            {(debouncedSearch || hasActiveFilters) ? (
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            ) : isSuperAdmin && !selectedStoreId ? (
              <TouchableOpacity style={styles.emptyButton} onPress={() => setShowStoreModal(true)}>
                <Text style={styles.emptyButtonText}>Select Store</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />

      {renderFilterModal()}
      {renderStoreModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  // Header
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  headerButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
  },

  // Store Selector
  storeSelectorBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  storeSelectorText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    fontWeight: "500",
  },
  storeSelectorChange: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  storeSelectorChangeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "600",
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    color: Colors.gray900,
  },
  filterButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
  },

  // Filter Chips
  filterChipsScroll: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    maxHeight: 50,
  },
  filterChipsContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  filterChipText: {
    fontSize: Typography.xs,
    color: Colors.primary,
  },
  filterChipRemove: {
    padding: 2,
  },
  clearAllChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  clearAllChipText: {
    fontSize: Typography.xs,
    color: Colors.error,
  },

  // Receipt Item
  list: { flex: 1 },
  listContent: { padding: Spacing.md, gap: Spacing.md },
  emptyListContent: { flex: 1 },
  listHeader: {
    paddingBottom: Spacing.sm,
  },
  listHeaderText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  receiptItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
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

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray700,
  },
  emptyDescription: {
    fontSize: Typography.md,
    color: Colors.gray500,
    textAlign: "center",
    maxWidth: "80%",
  },
  clearFiltersButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  clearFiltersButtonText: {
    color: Colors.white,
    fontWeight: "500",
  },
  emptyButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: { color: Colors.white, fontWeight: "600" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "90%",
    minHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  modalScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  // Filter Sections
  filterSection: {
    marginVertical: Spacing.md,
  },
  filterSectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },

  // Date Range
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  dateButtonText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  dateSeparator: {
    color: Colors.gray400,
    fontSize: Typography.sm,
  },
  clearDateButton: {
    padding: Spacing.xs,
  },

  // Chips
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  chipTextActive: {
    color: Colors.white,
  },

  // Sort
  sortContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  sortOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: "transparent",
  },
  sortOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortOptionText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  sortOptionTextActive: {
    color: Colors.white,
  },

  // Toggle Options
  toggleContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleOptionText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  toggleOptionTextActive: {
    color: Colors.white,
  },

  // Modal Footer
  modalFooter: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: Spacing.md,
  },
  clearButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    gap: Spacing.sm,
  },
  clearButtonText: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray600,
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.white,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
  },

  // Store Modal
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  storeItemSelected: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  storeItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  storeItemInfo: {
    flex: 1,
  },
  storeItemName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  storeItemTextSelected: {
    color: Colors.white,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray500,
    padding: Spacing["2xl"],
  },
});