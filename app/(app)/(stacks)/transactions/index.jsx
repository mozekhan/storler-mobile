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
// import { Search, Filter, Eye, Calendar } from "lucide-react-native";
// import TransactionService from "../../../../services/transactionService";
// import { formatCurrency, formatDate } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// export default function Transactions() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   useEffect(() => {
//     fetchTransactions();
//   }, [searchTerm, filterStatus]);

//   const fetchTransactions = async (page = 1) => {
//     try {
//       const params = {
//         page,
//         limit: 20,
//         status: filterStatus !== "all" ? filterStatus : undefined,
//         search: searchTerm,
//       };
//       Object.keys(params).forEach((key) => {
//         if (!params[key]) delete params[key];
//       });

//       const result = await TransactionService.getTransactions(params);
//       setTransactions(result.transactions || []);
//       setPagination(result.pagination || {});
//     } catch (error) {
//       Alert.alert("Error", "Failed to load transactions");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchTransactions(1);
//   };

//   const loadMore = () => {
//     if (pagination.page < pagination.pages) {
//       fetchTransactions(pagination.page + 1);
//     }
//   };

//   const getStatusStyles = (status) => {
//     const stylesMap = {
//       PENDING: {
//         container: styles.statusPending,
//         text: styles.statusPendingText,
//       },
//       SALES_QR: {
//         container: styles.statusSalesQR,
//         text: styles.statusSalesQRText,
//       },
//       PAID: { container: styles.statusPaid, text: styles.statusPaidText },
//       PAYMENT_QR: {
//         container: styles.statusPaymentQR,
//         text: styles.statusPaymentQRText,
//       },
//       RELEASED: {
//         container: styles.statusReleased,
//         text: styles.statusReleasedText,
//       },
//       COMPLETED: {
//         container: styles.statusCompleted,
//         text: styles.statusCompletedText,
//       },
//       CANCELLED: {
//         container: styles.statusCancelled,
//         text: styles.statusCancelledText,
//       },
//     };
//     return (
//       stylesMap[status] || {
//         container: styles.statusDefault,
//         text: styles.statusDefaultText,
//       }
//     );
//   };

//   const renderTransaction = ({ item }) => {
//     const statusStyles = getStatusStyles(item.status);

//     return (
//       <TouchableOpacity
//         style={styles.transactionItem}
//         onPress={() => router.push(`/transactions/${item._id}`)}
//       >
//         <View style={styles.transactionRow}>
//           <View style={styles.transactionInfo}>
//             <Text style={styles.transactionNumber}>
//               {item.transactionNumber}
//             </Text>
//             <Text style={styles.transactionAttendant}>
//               {item.salesAttendantId?.firstName}{" "}
//               {item.salesAttendantId?.lastName || "N/A"}
//             </Text>
//             <Text style={styles.transactionDate}>
//               {formatDate(item.createdAt)}
//             </Text>
//           </View>
//           <View style={styles.transactionRight}>
//             <Text style={styles.transactionAmount}>
//               {formatCurrency(item.totalAmount)}
//             </Text>
//             <View style={[styles.statusBadge, statusStyles.container]}>
//               <Text style={[styles.statusText, statusStyles.text]}>
//                 {item.status}
//               </Text>
//             </View>
//             <Text style={styles.transactionItems}>
//               {item.items?.length || 0} items
//             </Text>
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
//       <CustomHeader title="Transactions" />
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search transactions..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>
//         <TouchableOpacity
//           style={styles.filterButton}
//           onPress={() => {
//             Alert.alert("Filter by Status", "Select a status", [
//               { text: "All", onPress: () => setFilterStatus("all") },
//               { text: "Pending", onPress: () => setFilterStatus("PENDING") },
//               { text: "Sales QR", onPress: () => setFilterStatus("SALES_QR") },
//               { text: "Paid", onPress: () => setFilterStatus("PAID") },
//               {
//                 text: "Payment QR",
//                 onPress: () => setFilterStatus("PAYMENT_QR"),
//               },
//               { text: "Released", onPress: () => setFilterStatus("RELEASED") },
//               {
//                 text: "Completed",
//                 onPress: () => setFilterStatus("COMPLETED"),
//               },
//               {
//                 text: "Cancelled",
//                 onPress: () => setFilterStatus("CANCELLED"),
//               },
//               { text: "Cancel", style: "cancel" },
//             ]);
//           }}
//         >
//           <Filter
//             size={20}
//             color={filterStatus !== "all" ? Colors.primary : Colors.gray400}
//           />
//         </TouchableOpacity>
//       </View>

//       {filterStatus !== "all" && (
//         <View style={styles.filterChipContainer}>
//           <Text style={styles.filterChipText}>Status: {filterStatus}</Text>
//           <TouchableOpacity onPress={() => setFilterStatus("all")}>
//             <Text style={styles.filterChipClear}>✕</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={styles.listContent}
//         data={transactions}
//         keyExtractor={(item) => item._id}
//         renderItem={renderTransaction}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No transactions found</Text>
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
//   transactionItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   transactionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   transactionInfo: { flex: 1 },
//   transactionNumber: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   transactionAttendant: { fontSize: Typography.sm, color: Colors.gray500 },
//   transactionDate: { fontSize: Typography.xs, color: Colors.gray400 },
//   transactionRight: { alignItems: "flex-end" },
//   transactionAmount: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     marginTop: 2,
//   },
//   statusText: { fontSize: Typography.xs, fontWeight: "500" },
//   statusPending: { backgroundColor: Colors.warning + "20" },
//   statusPendingText: { color: Colors.warning },
//   statusSalesQR: { backgroundColor: Colors.primary + "20" },
//   statusSalesQRText: { color: Colors.primary },
//   statusPaid: { backgroundColor: "#8B5CF6" + "20" },
//   statusPaidText: { color: "#8B5CF6" },
//   statusPaymentQR: { backgroundColor: "#8B5CF6" + "20" },
//   statusPaymentQRText: { color: "#8B5CF6" },
//   statusReleased: { backgroundColor: "#EC4899" + "20" },
//   statusReleasedText: { color: "#EC4899" },
//   statusCompleted: { backgroundColor: Colors.success + "20" },
//   statusCompletedText: { color: Colors.success },
//   statusCancelled: { backgroundColor: Colors.error + "20" },
//   statusCancelledText: { color: Colors.error },
//   statusDefault: { backgroundColor: Colors.gray200 },
//   statusDefaultText: { color: Colors.gray700 },
//   transactionItems: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
//   emptyText: { color: Colors.gray500 },
// });




























import React, { useState, useEffect, useCallback } from "react";
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
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  X,
  ChevronDown,
  RefreshCw,
  Clock,
  Tag,
  User,
  Store,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TransactionService from "../../../../services/transactionService";
import { formatCurrency, formatDate, formatDateShort } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

const TRANSACTION_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "SALES_QR", label: "Sales QR" },
  { value: "PAID", label: "Paid" },
  { value: "PAYMENT_QR", label: "Payment QR" },
  { value: "RELEASE_QR", label: "Release QR" },
  { value: "RELEASED", label: "Released" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "TRANSFER", label: "Bank Transfer" },
  { value: "CREDIT", label: "Credit" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "totalAmount_desc", label: "Highest Amount" },
  { value: "totalAmount_asc", label: "Lowest Amount" },
];

const STATUS_COLORS = {
  PENDING: { bg: "#FEF3C7", text: "#92400E" },
  SALES_QR: { bg: "#DBEAFE", text: "#1E40AF" },
  PAID: { bg: "#EDE9FE", text: "#5B21B6" },
  PAYMENT_QR: { bg: "#EDE9FE", text: "#5B21B6" },
  RELEASE_QR: { bg: "#FCE4EC", text: "#831843" },
  RELEASED: { bg: "#FCE4EC", text: "#831843" },
  COMPLETED: { bg: "#D1FAE5", text: "#065F46" },
  CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
  REFUNDED: { bg: "#FEE2E2", text: "#991B1B" },
};

export default function Transactions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // UI state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [tempDateRange, setTempDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Apply filters
  const applyFilters = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        search: searchTerm || undefined,
        sort: sortBy,
      };

      if (selectedStatus.length > 0) {
        params.status = selectedStatus.join(",");
      }

      if (selectedPaymentMethods.length > 0) {
        params.paymentMethods = selectedPaymentMethods.join(",");
      }

      if (dateRange.startDate) {
        params.startDate = dateRange.startDate.toISOString();
      }

      if (dateRange.endDate) {
        params.endDate = dateRange.endDate.toISOString();
      }

      if (minAmount) {
        params.minAmount = parseFloat(minAmount);
      }

      if (maxAmount) {
        params.maxAmount = parseFloat(maxAmount);
      }

      // Clean undefined params
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const result = await TransactionService.getTransactions(params);
      setTransactions(result.transactions || []);
      setPagination(result.pagination || {});
    } catch (error) {
      Alert.alert("Error", "Failed to load transactions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, selectedStatus, selectedPaymentMethods, sortBy, dateRange, minAmount, maxAmount]);

  useEffect(() => {
    applyFilters(1);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== undefined) {
        applyFilters(1);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Check for active filters
  useEffect(() => {
    const hasFilters =
      selectedStatus.length > 0 ||
      selectedPaymentMethods.length > 0 ||
      dateRange.startDate ||
      dateRange.endDate ||
      minAmount ||
      maxAmount ||
      sortBy !== "createdAt_desc";
    setHasActiveFilters(hasFilters);
  }, [selectedStatus, selectedPaymentMethods, dateRange, minAmount, maxAmount, sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    applyFilters(1);
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages && !loading) {
      applyFilters(pagination.page + 1);
    }
  };

  const clearAllFilters = () => {
    setSelectedStatus([]);
    setSelectedPaymentMethods([]);
    setDateRange({ startDate: null, endDate: null });
    setMinAmount("");
    setMaxAmount("");
    setSortBy("createdAt_desc");
    setSearchTerm("");
    setShowFilterModal(false);
    applyFilters(1);
  };

  const applyFilterChanges = () => {
    setDateRange(tempDateRange);
    setShowFilterModal(false);
    applyFilters(1);
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const togglePaymentMethodFilter = (method) => {
    setSelectedPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const getStatusStyles = (status) => {
    const colors = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
    return {
      container: { backgroundColor: colors.bg },
      text: { color: colors.text },
    };
  };

  const renderTransaction = ({ item }) => {
    const statusStyles = getStatusStyles(item.status);

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => router.push(`/transactions/${item._id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.transactionRow}>
          <View style={styles.transactionLeft}>
            <Text style={styles.transactionNumber}>
              {item.transactionNumber}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={styles.transactionAttendant}>
                {item.salesAttendantId?.firstName}{" "}
                {item.salesAttendantId?.lastName || "N/A"}
              </Text>
              <Text style={styles.transactionDot}>•</Text>
              <Text style={styles.transactionItems}>
                {item.items?.length || 0} items
              </Text>
            </View>
            <Text style={styles.transactionDate}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <View style={styles.transactionRight}>
            <Text style={styles.transactionAmount}>
              {formatCurrency(item.totalAmount)}
            </Text>
            <View style={[styles.statusBadge, statusStyles.container]}>
              <Text style={[styles.statusText, statusStyles.text]}>
                {item.status.replace("_", " ")}
              </Text>
            </View>
            {item.paymentMethod && (
              <Text style={styles.paymentMethodText}>
                {item.paymentMethod}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
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
                    {tempDateRange.startDate
                      ? formatDateShort(tempDateRange.startDate)
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
                    {tempDateRange.endDate
                      ? formatDateShort(tempDateRange.endDate)
                      : "End Date"}
                  </Text>
                </TouchableOpacity>
                {(tempDateRange.startDate || tempDateRange.endDate) && (
                  <TouchableOpacity
                    style={styles.clearDateButton}
                    onPress={() =>
                      setTempDateRange({ startDate: null, endDate: null })
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
                      ? tempDateRange.startDate || new Date()
                      : tempDateRange.endDate || new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(null);
                    if (selectedDate) {
                      if (showDatePicker === "start") {
                        setTempDateRange({
                          ...tempDateRange,
                          startDate: selectedDate,
                        });
                      } else {
                        setTempDateRange({
                          ...tempDateRange,
                          endDate: selectedDate,
                        });
                      }
                    }
                  }}
                />
              )}
            </View>

            {/* Amount Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Amount Range</Text>
              <View style={styles.amountRangeContainer}>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.amountPrefix}>Min</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    value={minAmount}
                    onChangeText={setMinAmount}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.gray400}
                  />
                </View>
                <Text style={styles.dateSeparator}>—</Text>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.amountPrefix}>Max</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="∞"
                    value={maxAmount}
                    onChangeText={setMaxAmount}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.gray400}
                  />
                </View>
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              <View style={styles.chipContainer}>
                {TRANSACTION_STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.chip,
                      selectedStatus.includes(status.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleStatusFilter(status.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStatus.includes(status.value) &&
                          styles.chipTextActive,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Payment Method Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Payment Method</Text>
              <View style={styles.chipContainer}>
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method.value}
                    style={[
                      styles.chip,
                      selectedPaymentMethods.includes(method.value) &&
                        styles.chipActive,
                    ]}
                    onPress={() => togglePaymentMethodFilter(method.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedPaymentMethods.includes(method.value) &&
                          styles.chipTextActive,
                      ]}
                    >
                      {method.label}
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
                      sortBy === option.value && styles.sortOptionActive,
                    ]}
                    onPress={() => setSortBy(option.value)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy === option.value && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllFilters}
            >
              <RefreshCw size={18} color={Colors.gray500} />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilterChanges}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Transactions" />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by number, customer, item..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <X size={18} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => {
            setTempDateRange(dateRange);
            setShowFilterModal(true);
          }}
        >
          <Filter
            size={20}
            color={hasActiveFilters ? Colors.white : Colors.gray400}
          />
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
          {selectedStatus.length > 0 && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Status: {selectedStatus.join(", ")}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedStatus([])}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {selectedPaymentMethods.length > 0 && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Payment: {selectedPaymentMethods.join(", ")}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedPaymentMethods([])}
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
                onPress={() => setDateRange({ ...dateRange, startDate: null })}
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
                onPress={() => setDateRange({ ...dateRange, endDate: null })}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {(minAmount || maxAmount) && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Amount: {minAmount || "0"} - {maxAmount || "∞"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setMinAmount("");
                  setMaxAmount("");
                }}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {sortBy !== "createdAt_desc" && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              </Text>
              <TouchableOpacity
                onPress={() => setSortBy("createdAt_desc")}
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
          transactions.length === 0 && styles.emptyListContent,
        ]}
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderTransaction}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          transactions.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Showing {transactions.length} of {pagination.total} transactions
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && transactions.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Clock size={48} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>No Transactions Found</Text>
            <Text style={styles.emptyDescription}>
              {searchTerm || hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Start by creating your first transaction"}
            </Text>
            {(searchTerm || hasActiveFilters) && (
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
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
    maxHeight:50,
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

  // Transaction Item
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
  transactionItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionLeft: { flex: 1, gap: 2 },
  transactionNumber: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  transactionAttendant: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  transactionDot: {
    color: Colors.gray400,
    fontSize: Typography.xs,
  },
  transactionItems: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  transactionDate: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  transactionRight: { alignItems: "flex-end", gap: 2 },
  transactionAmount: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  paymentMethodText: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    textTransform: "capitalize",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.md,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
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

  // Amount Range
  amountRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  amountInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  amountPrefix: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: "500",
  },
  amountInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    color: Colors.gray900,
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
});