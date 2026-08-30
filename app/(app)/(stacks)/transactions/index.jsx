// import React, { useState, useEffect, useCallback } from "react";
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
//   Pressable,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Search,
//   Filter,
//   Eye,
//   Calendar,
//   X,
//   ChevronDown,
//   RefreshCw,
//   Clock,
//   Tag,
//   User,
//   Store,
// } from "lucide-react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import TransactionService from "../../../../services/transactionService";
// import { formatCurrency, formatDate, formatDateShort } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// const TRANSACTION_STATUSES = [
//   { value: "PENDING", label: "Pending" },
//   { value: "SALES_QR", label: "Sales QR" },
//   { value: "PAID", label: "Paid" },
//   { value: "PAYMENT_QR", label: "Payment QR" },
//   { value: "RELEASE_QR", label: "Release QR" },
//   { value: "RELEASED", label: "Released" },
//   { value: "COMPLETED", label: "Completed" },
//   { value: "CANCELLED", label: "Cancelled" },
//   { value: "REFUNDED", label: "Refunded" },
// ];

// const PAYMENT_METHODS = [
//   { value: "CASH", label: "Cash" },
//   { value: "CARD", label: "Card" },
//   { value: "TRANSFER", label: "Bank Transfer" },
//   { value: "CREDIT", label: "Credit" },
//   { value: "MOBILE_MONEY", label: "Mobile Money" },
// ];

// const SORT_OPTIONS = [
//   { value: "createdAt_desc", label: "Newest First" },
//   { value: "createdAt_asc", label: "Oldest First" },
//   { value: "totalAmount_desc", label: "Highest Amount" },
//   { value: "totalAmount_asc", label: "Lowest Amount" },
// ];

// const STATUS_COLORS = {
//   PENDING: { bg: "#FEF3C7", text: "#92400E" },
//   SALES_QR: { bg: "#DBEAFE", text: "#1E40AF" },
//   PAID: { bg: "#EDE9FE", text: "#5B21B6" },
//   PAYMENT_QR: { bg: "#EDE9FE", text: "#5B21B6" },
//   RELEASE_QR: { bg: "#FCE4EC", text: "#831843" },
//   RELEASED: { bg: "#FCE4EC", text: "#831843" },
//   COMPLETED: { bg: "#D1FAE5", text: "#065F46" },
//   CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
//   REFUNDED: { bg: "#FEE2E2", text: "#991B1B" },
// };

// export default function Transactions() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState([]);
//   const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
//   const [sortBy, setSortBy] = useState("createdAt_desc");
//   const [dateRange, setDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");

//   // UI state
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(null);
//   const [tempDateRange, setTempDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [hasActiveFilters, setHasActiveFilters] = useState(false);

//   // Apply filters
//   const applyFilters = useCallback(async (page = 1) => {
//     try {
//       setLoading(true);
//       const params = {
//         page,
//         limit: 20,
//         search: searchTerm || undefined,
//         sort: sortBy,
//       };

//       if (selectedStatus.length > 0) {
//         params.status = selectedStatus.join(",");
//       }

//       if (selectedPaymentMethods.length > 0) {
//         params.paymentMethods = selectedPaymentMethods.join(",");
//       }

//       if (dateRange.startDate) {
//         params.startDate = dateRange.startDate.toISOString();
//       }

//       if (dateRange.endDate) {
//         params.endDate = dateRange.endDate.toISOString();
//       }

//       if (minAmount) {
//         params.minAmount = parseFloat(minAmount);
//       }

//       if (maxAmount) {
//         params.maxAmount = parseFloat(maxAmount);
//       }

//       // Clean undefined params
//       Object.keys(params).forEach((key) => {
//         if (params[key] === undefined || params[key] === "") {
//           delete params[key];
//         }
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
//   }, [searchTerm, selectedStatus, selectedPaymentMethods, sortBy, dateRange, minAmount, maxAmount]);

//   useEffect(() => {
//     applyFilters(1);
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchTerm !== undefined) {
//         applyFilters(1);
//       }
//     }, 500);
//     return () => clearTimeout(timeoutId);
//   }, [searchTerm]);

//   // Check for active filters
//   useEffect(() => {
//     const hasFilters =
//       selectedStatus.length > 0 ||
//       selectedPaymentMethods.length > 0 ||
//       dateRange.startDate ||
//       dateRange.endDate ||
//       minAmount ||
//       maxAmount ||
//       sortBy !== "createdAt_desc";
//     setHasActiveFilters(hasFilters);
//   }, [selectedStatus, selectedPaymentMethods, dateRange, minAmount, maxAmount, sortBy]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     applyFilters(1);
//   };

//   const loadMore = () => {
//     if (pagination.page < pagination.pages && !loading) {
//       applyFilters(pagination.page + 1);
//     }
//   };

//   const clearAllFilters = () => {
//     setSelectedStatus([]);
//     setSelectedPaymentMethods([]);
//     setDateRange({ startDate: null, endDate: null });
//     setMinAmount("");
//     setMaxAmount("");
//     setSortBy("createdAt_desc");
//     setSearchTerm("");
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const applyFilterChanges = () => {
//     setDateRange(tempDateRange);
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const toggleStatusFilter = (status) => {
//     setSelectedStatus((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//   };

//   const togglePaymentMethodFilter = (method) => {
//     setSelectedPaymentMethods((prev) =>
//       prev.includes(method)
//         ? prev.filter((m) => m !== method)
//         : [...prev, method]
//     );
//   };

//   const getStatusStyles = (status) => {
//     const colors = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
//     return {
//       container: { backgroundColor: colors.bg },
//       text: { color: colors.text },
//     };
//   };

//   const renderTransaction = ({ item }) => {
//     const statusStyles = getStatusStyles(item.status);

//     return (
//       <TouchableOpacity
//         style={styles.transactionItem}
//         onPress={() => router.push(`/transactions/${item._id}`)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.transactionRow}>
//           <View style={styles.transactionLeft}>
//             <Text style={styles.transactionNumber}>
//               {item.transactionNumber}
//             </Text>
//             <View style={styles.transactionMeta}>
//               <Text style={styles.transactionAttendant}>
//                 {item.salesAttendantId?.firstName}{" "}
//                 {item.salesAttendantId?.lastName || "N/A"}
//               </Text>
//               <Text style={styles.transactionDot}>•</Text>
//               <Text style={styles.transactionItems}>
//                 {item.items?.length || 0} items
//               </Text>
//             </View>
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
//                 {item.status.replace("_", " ")}
//               </Text>
//             </View>
//             {item.paymentMethod && (
//               <Text style={styles.paymentMethodText}>
//                 {item.paymentMethod}
//               </Text>
//             )}
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

//             {/* Amount Range */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Amount Range</Text>
//               <View style={styles.amountRangeContainer}>
//                 <View style={styles.amountInputWrapper}>
//                   <Text style={styles.amountPrefix}>Min</Text>
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="0"
//                     value={minAmount}
//                     onChangeText={setMinAmount}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//                 <Text style={styles.dateSeparator}>—</Text>
//                 <View style={styles.amountInputWrapper}>
//                   <Text style={styles.amountPrefix}>Max</Text>
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="∞"
//                     value={maxAmount}
//                     onChangeText={setMaxAmount}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Status Filter */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Status</Text>
//               <View style={styles.chipContainer}>
//                 {TRANSACTION_STATUSES.map((status) => (
//                   <TouchableOpacity
//                     key={status.value}
//                     style={[
//                       styles.chip,
//                       selectedStatus.includes(status.value) && styles.chipActive,
//                     ]}
//                     onPress={() => toggleStatusFilter(status.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         selectedStatus.includes(status.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {status.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Payment Method Filter */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Payment Method</Text>
//               <View style={styles.chipContainer}>
//                 {PAYMENT_METHODS.map((method) => (
//                   <TouchableOpacity
//                     key={method.value}
//                     style={[
//                       styles.chip,
//                       selectedPaymentMethods.includes(method.value) &&
//                         styles.chipActive,
//                     ]}
//                     onPress={() => togglePaymentMethodFilter(method.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         selectedPaymentMethods.includes(method.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {method.label}
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
//             placeholder="Search by number, customer, item..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
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
//           {selectedStatus.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Status: {selectedStatus.join(", ")}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedStatus([])}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {selectedPaymentMethods.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Payment: {selectedPaymentMethods.join(", ")}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedPaymentMethods([])}
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
//           {(minAmount || maxAmount) && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Amount: {minAmount || "0"} - {maxAmount || "∞"}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setMinAmount("");
//                   setMaxAmount("");
//                 }}
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
//           <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
//             <Text style={styles.clearAllChipText}>Clear All</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={[
//           styles.listContent,
//           transactions.length === 0 && styles.emptyListContent,
//         ]}
//         data={transactions}
//         keyExtractor={(item) => item._id}
//         renderItem={renderTransaction}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           transactions.length > 0 ? (
//             <View style={styles.listHeader}>
//               <Text style={styles.listHeaderText}>
//                 Showing {transactions.length} of {pagination.total} transactions
//               </Text>
//             </View>
//           ) : null
//         }
//         ListFooterComponent={
//           loading && transactions.length > 0 ? (
//             <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
//           ) : null
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <View style={styles.emptyIconContainer}>
//               <Clock size={48} color={Colors.gray300} />
//             </View>
//             <Text style={styles.emptyTitle}>No Transactions Found</Text>
//             <Text style={styles.emptyDescription}>
//               {searchTerm || hasActiveFilters
//                 ? "Try adjusting your search or filters"
//                 : "Start by creating your first transaction"}
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

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     paddingTop: Spacing.lg,
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

//   // Filter Chips
//   filterChipsScroll: {
//     backgroundColor: Colors.white,
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     maxHeight:50,
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

//   // Transaction Item
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
//   transactionItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   transactionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   transactionLeft: { flex: 1, gap: 2 },
//   transactionNumber: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   transactionMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.xs,
//   },
//   transactionAttendant: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   transactionDot: {
//     color: Colors.gray400,
//     fontSize: Typography.xs,
//   },
//   transactionItems: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   transactionDate: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   transactionRight: { alignItems: "flex-end", gap: 2 },
//   transactionAmount: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   statusText: {
//     fontSize: Typography.xs,
//     fontWeight: "500",
//     textTransform: "capitalize",
//   },
//   paymentMethodText: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     textTransform: "capitalize",
//   },

//   // Empty State
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: Spacing["4xl"],
//     gap: Spacing.md,
//   },
//   emptyIconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: Colors.gray100,
//     justifyContent: "center",
//     alignItems: "center",
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

//   // Modal
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

//   // Filter Sections
//   filterSection: {
//     marginVertical: Spacing.md,
//   },
//   filterSectionTitle: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },

//   // Date Range
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

//   // Amount Range
//   amountRangeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   amountInputWrapper: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.xs,
//   },
//   amountPrefix: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "500",
//   },
//   amountInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
//   },

//   // Chips
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

//   // Sort
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

//   // Modal Footer
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
//   Pressable,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Search,
//   Filter,
//   Eye,
//   Calendar,
//   X,
//   ChevronDown,
//   RefreshCw,
//   Clock,
//   Tag,
//   User,
//   Store,
// } from "lucide-react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import TransactionService from "../../../../services/transactionService";
// import { formatCurrency, formatDate, formatDateShort } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// const TRANSACTION_STATUSES = [
//   { value: "PENDING", label: "Pending" },
//   { value: "SALES_QR", label: "Sales QR" },
//   { value: "PAID", label: "Paid" },
//   { value: "PAYMENT_QR", label: "Payment QR" },
//   { value: "RELEASE_QR", label: "Release QR" },
//   { value: "RELEASED", label: "Released" },
//   { value: "COMPLETED", label: "Completed" },
//   { value: "CANCELLED", label: "Cancelled" },
//   { value: "REFUNDED", label: "Refunded" },
// ];

// const PAYMENT_METHODS = [
//   { value: "CASH", label: "Cash" },
//   { value: "CARD", label: "Card" },
//   { value: "TRANSFER", label: "Bank Transfer" },
//   { value: "CREDIT", label: "Credit" },
//   { value: "MOBILE_MONEY", label: "Mobile Money" },
// ];

// const SORT_OPTIONS = [
//   { value: "createdAt_desc", label: "Newest First" },
//   { value: "createdAt_asc", label: "Oldest First" },
//   { value: "totalAmount_desc", label: "Highest Amount" },
//   { value: "totalAmount_asc", label: "Lowest Amount" },
// ];

// const STATUS_COLORS = {
//   PENDING: { bg: "#FEF3C7", text: "#92400E" },
//   SALES_QR: { bg: "#DBEAFE", text: "#1E40AF" },
//   PAID: { bg: "#EDE9FE", text: "#5B21B6" },
//   PAYMENT_QR: { bg: "#EDE9FE", text: "#5B21B6" },
//   RELEASE_QR: { bg: "#FCE4EC", text: "#831843" },
//   RELEASED: { bg: "#FCE4EC", text: "#831843" },
//   COMPLETED: { bg: "#D1FAE5", text: "#065F46" },
//   CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
//   REFUNDED: { bg: "#FEE2E2", text: "#991B1B" },
// };

// export default function Transactions() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState([]);
//   const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
//   const [sortBy, setSortBy] = useState("createdAt_desc");
//   const [dateRange, setDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");

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

//   // Apply filters with background loading
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

//       if (selectedStatus.length > 0) {
//         params.status = selectedStatus.join(",");
//       }

//       if (selectedPaymentMethods.length > 0) {
//         params.paymentMethods = selectedPaymentMethods.join(",");
//       }

//       if (dateRange.startDate) {
//         params.startDate = dateRange.startDate.toISOString();
//       }

//       if (dateRange.endDate) {
//         params.endDate = dateRange.endDate.toISOString();
//       }

//       if (minAmount) {
//         params.minAmount = parseFloat(minAmount);
//       }

//       if (maxAmount) {
//         params.maxAmount = parseFloat(maxAmount);
//       }

//       // Clean undefined params
//       Object.keys(params).forEach((key) => {
//         if (params[key] === undefined || params[key] === "" || params[key] === null) {
//           delete params[key];
//         }
//       });

//       console.log('Fetching transactions with params:', params); // Debug log

//       const result = await TransactionService.getTransactions(params);
      
//       if (append) {
//         setTransactions(prev => [...prev, ...(result.transactions || [])]);
//       } else {
//         setTransactions(result.transactions || []);
//       }
//       setPagination(result.pagination || {});
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       Alert.alert("Error", "Failed to load transactions");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   }, [searchTerm, selectedStatus, selectedPaymentMethods, sortBy, dateRange, minAmount, maxAmount]);

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
//       selectedStatus.length > 0 ||
//       selectedPaymentMethods.length > 0 ||
//       dateRange.startDate ||
//       dateRange.endDate ||
//       minAmount ||
//       maxAmount ||
//       sortBy !== "createdAt_desc";
//     setHasActiveFilters(hasFilters);
//   }, [selectedStatus, selectedPaymentMethods, dateRange, minAmount, maxAmount, sortBy]);

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
//     setSelectedStatus([]);
//     setSelectedPaymentMethods([]);
//     setDateRange({ startDate: null, endDate: null });
//     setMinAmount("");
//     setMaxAmount("");
//     setSortBy("createdAt_desc");
//     setSearchTerm("");
//     setShowFilterModal(false);
//     // Reset pagination and fetch
//     applyFilters(1);
//   };

//   const applyFilterChanges = () => {
//     setDateRange(tempDateRange);
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const toggleStatusFilter = (status) => {
//     setSelectedStatus((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//   };

//   const togglePaymentMethodFilter = (method) => {
//     setSelectedPaymentMethods((prev) =>
//       prev.includes(method)
//         ? prev.filter((m) => m !== method)
//         : [...prev, method]
//     );
//   };

//   const getStatusStyles = (status) => {
//     const colors = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
//     return {
//       container: { backgroundColor: colors.bg },
//       text: { color: colors.text },
//     };
//   };

//   const renderTransaction = ({ item }) => {
//     const statusStyles = getStatusStyles(item.status);

//     return (
//       <TouchableOpacity
//         style={styles.transactionItem}
//         onPress={() => router.push(`/transactions/${item._id}`)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.transactionRow}>
//           <View style={styles.transactionLeft}>
//             <Text style={styles.transactionNumber}>
//               {item.transactionNumber}
//             </Text>
//             <View style={styles.transactionMeta}>
//               <Text style={styles.transactionAttendant}>
//                 {item.salesAttendantId?.firstName}{" "}
//                 {item.salesAttendantId?.lastName || "N/A"}
//               </Text>
//               <Text style={styles.transactionDot}>•</Text>
//               <Text style={styles.transactionItems}>
//                 {item.items?.length || 0} items
//               </Text>
//             </View>
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
//                 {item.status.replace("_", " ")}
//               </Text>
//             </View>
//             {item.paymentMethod && (
//               <Text style={styles.paymentMethodText}>
//                 {item.paymentMethod}
//               </Text>
//             )}
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

//             {/* Amount Range */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Amount Range</Text>
//               <View style={styles.amountRangeContainer}>
//                 <View style={styles.amountInputWrapper}>
//                   <Text style={styles.amountPrefix}>Min</Text>
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="0"
//                     value={minAmount}
//                     onChangeText={setMinAmount}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//                 <Text style={styles.dateSeparator}>—</Text>
//                 <View style={styles.amountInputWrapper}>
//                   <Text style={styles.amountPrefix}>Max</Text>
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="∞"
//                     value={maxAmount}
//                     onChangeText={setMaxAmount}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Status Filter */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Status</Text>
//               <View style={styles.chipContainer}>
//                 {TRANSACTION_STATUSES.map((status) => (
//                   <TouchableOpacity
//                     key={status.value}
//                     style={[
//                       styles.chip,
//                       selectedStatus.includes(status.value) && styles.chipActive,
//                     ]}
//                     onPress={() => toggleStatusFilter(status.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         selectedStatus.includes(status.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {status.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Payment Method Filter */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Payment Method</Text>
//               <View style={styles.chipContainer}>
//                 {PAYMENT_METHODS.map((method) => (
//                   <TouchableOpacity
//                     key={method.value}
//                     style={[
//                       styles.chip,
//                       selectedPaymentMethods.includes(method.value) &&
//                         styles.chipActive,
//                     ]}
//                     onPress={() => togglePaymentMethodFilter(method.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         selectedPaymentMethods.includes(method.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {method.label}
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

//   if (loading && transactions.length === 0 && !isInitialLoad.current) {
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
//             placeholder="Search by number, customer, item..."
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
//           {selectedStatus.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Status: {selectedStatus.join(", ")}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedStatus([])}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {selectedPaymentMethods.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Payment: {selectedPaymentMethods.join(", ")}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedPaymentMethods([])}
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
//           {(minAmount || maxAmount) && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Amount: {minAmount || "0"} - {maxAmount || "∞"}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setMinAmount("");
//                   setMaxAmount("");
//                 }}
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
//           <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
//             <Text style={styles.clearAllChipText}>Clear All</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={[
//           styles.listContent,
//           transactions.length === 0 && styles.emptyListContent,
//         ]}
//         data={transactions}
//         keyExtractor={(item) => item._id}
//         renderItem={renderTransaction}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           transactions.length > 0 ? (
//             <View style={styles.listHeader}>
//               <Text style={styles.listHeaderText}>
//                 Showing {transactions.length} of {pagination.total} transactions
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
//             <View style={styles.emptyIconContainer}>
//               <Clock size={48} color={Colors.gray300} />
//             </View>
//             <Text style={styles.emptyTitle}>No Transactions Found</Text>
//             <Text style={styles.emptyDescription}>
//               {searchTerm || hasActiveFilters
//                 ? "Try adjusting your search or filters"
//                 : "Start by creating your first transaction"}
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

// // Styles remain the same as in your original file...
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     paddingTop: Spacing.lg,
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
//   transactionItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   transactionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   transactionLeft: { flex: 1, gap: 2 },
//   transactionNumber: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   transactionMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.xs,
//   },
//   transactionAttendant: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   transactionDot: {
//     color: Colors.gray400,
//     fontSize: Typography.xs,
//   },
//   transactionItems: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   transactionDate: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   transactionRight: { alignItems: "flex-end", gap: 2 },
//   transactionAmount: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   statusText: {
//     fontSize: Typography.xs,
//     fontWeight: "500",
//     textTransform: "capitalize",
//   },
//   paymentMethodText: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     textTransform: "capitalize",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: Spacing["4xl"],
//     gap: Spacing.md,
//   },
//   emptyIconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: Colors.gray100,
//     justifyContent: "center",
//     alignItems: "center",
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
//   amountRangeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   amountInputWrapper: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.xs,
//   },
//   amountPrefix: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "500",
//   },
//   amountInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
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
//   Pressable,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Search,
//   Filter,
//   Eye,
//   Calendar,
//   X,
//   ChevronDown,
//   RefreshCw,
//   Clock,
//   Tag,
//   User,
//   Store,
// } from "lucide-react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import TransactionService from "../../../../services/transactionService";
// import { formatCurrency, formatDate, formatDateShort } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// const TRANSACTION_STATUSES = [
//   { value: "PENDING", label: "Pending" },
//   { value: "SALES_QR", label: "Sales QR" },
//   { value: "PAID", label: "Paid" },
//   { value: "PAYMENT_QR", label: "Payment QR" },
//   { value: "RELEASE_QR", label: "Release QR" },
//   { value: "RELEASED", label: "Released" },
//   { value: "COMPLETED", label: "Completed" },
//   { value: "CANCELLED", label: "Cancelled" },
//   { value: "REFUNDED", label: "Refunded" },
// ];

// const PAYMENT_METHODS = [
//   { value: "CASH", label: "Cash" },
//   { value: "CARD", label: "Card" },
//   { value: "TRANSFER", label: "Bank Transfer" },
//   { value: "CREDIT", label: "Credit" },
//   { value: "MOBILE_MONEY", label: "Mobile Money" },
// ];

// const SORT_OPTIONS = [
//   { value: "createdAt_desc", label: "Newest First" },
//   { value: "createdAt_asc", label: "Oldest First" },
//   { value: "totalAmount_desc", label: "Highest Amount" },
//   { value: "totalAmount_asc", label: "Lowest Amount" },
// ];

// const STATUS_COLORS = {
//   PENDING: { bg: "#FEF3C7", text: "#92400E" },
//   SALES_QR: { bg: "#DBEAFE", text: "#1E40AF" },
//   PAID: { bg: "#EDE9FE", text: "#5B21B6" },
//   PAYMENT_QR: { bg: "#EDE9FE", text: "#5B21B6" },
//   RELEASE_QR: { bg: "#FCE4EC", text: "#831843" },
//   RELEASED: { bg: "#FCE4EC", text: "#831843" },
//   COMPLETED: { bg: "#D1FAE5", text: "#065F46" },
//   CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
//   REFUNDED: { bg: "#FEE2E2", text: "#991B1B" },
// };

// const DEFAULT_DATE_RANGE = { startDate: null, endDate: null };
// const DEFAULT_SORT = "createdAt_desc";
// const DEFAULT_FILTERS = {
//   selectedStatus: [],
//   selectedPaymentMethods: [],
//   sortBy: DEFAULT_SORT,
//   dateRange: DEFAULT_DATE_RANGE,
//   minAmount: "",
//   maxAmount: "",
// };

// // Keeps only digits and a single decimal point, so a stray letter or a second
// // "." pasted into the field can't reach the API as a bad numeric string.
// const sanitizeAmountInput = (text) => {
//   const cleaned = text.replace(/[^0-9.]/g, "");
//   const firstDot = cleaned.indexOf(".");
//   if (firstDot === -1) return cleaned;
//   return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
// };

// export default function Transactions() {
//   const router = useRouter();

//   // List state
//   const [loading, setLoading] = useState(true); // true so the first render shows a spinner, not an empty state
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [transactions, setTransactions] = useState([]);
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

//   // Committed filters — these are the values the current `transactions` list reflects.
//   const [selectedStatus, setSelectedStatus] = useState(DEFAULT_FILTERS.selectedStatus);
//   const [selectedPaymentMethods, setSelectedPaymentMethods] = useState(
//     DEFAULT_FILTERS.selectedPaymentMethods
//   );
//   const [sortBy, setSortBy] = useState(DEFAULT_FILTERS.sortBy);
//   const [dateRange, setDateRange] = useState(DEFAULT_FILTERS.dateRange);
//   const [minAmount, setMinAmount] = useState(DEFAULT_FILTERS.minAmount);
//   const [maxAmount, setMaxAmount] = useState(DEFAULT_FILTERS.maxAmount);

//   // Draft filters — edited inside the modal, only committed to the state above
//   // when the user taps "Apply Filters". Closing the modal any other way discards them.
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(null);
//   const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

//   const hasActiveFilters =
//     selectedStatus.length > 0 ||
//     selectedPaymentMethods.length > 0 ||
//     !!dateRange.startDate ||
//     !!dateRange.endDate ||
//     !!minAmount ||
//     !!maxAmount ||
//     sortBy !== DEFAULT_SORT;

//   // Guards against out-of-order responses: if the user changes filters again before
//   // an in-flight request resolves, the stale response is dropped instead of overwriting
//   // newer results.
//   const requestIdRef = useRef(0);

//   const fetchTransactions = useCallback(
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
//         if (selectedStatus.length > 0) params.status = selectedStatus.join(",");
//         if (selectedPaymentMethods.length > 0) {
//           params.paymentMethods = selectedPaymentMethods.join(",");
//         }
//         if (dateRange.startDate) params.startDate = dateRange.startDate.toISOString();
//         if (dateRange.endDate) params.endDate = dateRange.endDate.toISOString();
//         if (minAmount) params.minAmount = parseFloat(minAmount);
//         if (maxAmount) params.maxAmount = parseFloat(maxAmount);

//         const result = await TransactionService.getTransactions(params);

//         // A newer request has since started — ignore this response.
//         if (requestId !== requestIdRef.current) return;

//         setTransactions((prev) =>
//           append ? [...prev, ...(result.transactions || [])] : result.transactions || []
//         );
//         setPagination(result.pagination || { page, limit: 20, total: 0, pages: 0 });
//       } catch (error) {
//         if (requestId !== requestIdRef.current) return;
//         console.error("Error fetching transactions:", error);
//         Alert.alert("Error", "Failed to load transactions");
//       } finally {
//         if (requestId === requestIdRef.current) {
//           setLoading(false);
//           setLoadingMore(false);
//           setRefreshing(false);
//         }
//       }
//     },
//     [
//       debouncedSearch,
//       selectedStatus,
//       selectedPaymentMethods,
//       sortBy,
//       dateRange,
//       minAmount,
//       maxAmount,
//     ]
//   );

//   // Single source of truth: refetch page 1 whenever any *committed* filter changes,
//   // including on mount. Every filter action below only needs to update state —
//   // no more scattered manual applyFilters(...) calls to keep in sync.
//   useEffect(() => {
//     fetchTransactions(1);
//   }, [fetchTransactions]);

//   // Debounce typing in the search box. Submitting or clearing bypasses the wait.
//   useEffect(() => {
//     const handle = setTimeout(() => {
//       setDebouncedSearch(searchTerm.trim());
//     }, 500);
//     return () => clearTimeout(handle);
//   }, [searchTerm]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchTransactions(1);
//   };

//   const loadMore = () => {
//     if (!loading && !loadingMore && pagination.page < pagination.pages) {
//       fetchTransactions(pagination.page + 1, true);
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
//     setSelectedStatus(DEFAULT_FILTERS.selectedStatus);
//     setSelectedPaymentMethods(DEFAULT_FILTERS.selectedPaymentMethods);
//     setSortBy(DEFAULT_FILTERS.sortBy);
//     setDateRange(DEFAULT_FILTERS.dateRange);
//     setMinAmount(DEFAULT_FILTERS.minAmount);
//     setMaxAmount(DEFAULT_FILTERS.maxAmount);
//     setShowFilterModal(false);
//   };

//   const openFilterModal = () => {
//     // Seed the draft from the currently-committed filters every time the modal opens.
//     setDraftFilters({
//       selectedStatus,
//       selectedPaymentMethods,
//       sortBy,
//       dateRange,
//       minAmount,
//       maxAmount,
//     });
//     setShowFilterModal(true);
//   };

//   const applyFilterChanges = () => {
//     // Min shouldn't exceed max — swap instead of silently sending an invalid range.
//     let { minAmount: min, maxAmount: max } = draftFilters;
//     const minNum = parseFloat(min);
//     const maxNum = parseFloat(max);
//     if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
//       [min, max] = [max, min];
//     }

//     setSelectedStatus(draftFilters.selectedStatus);
//     setSelectedPaymentMethods(draftFilters.selectedPaymentMethods);
//     setSortBy(draftFilters.sortBy);
//     setDateRange(draftFilters.dateRange);
//     setMinAmount(min);
//     setMaxAmount(max);
//     setShowFilterModal(false);
//   };

//   const toggleDraftStatus = (status) => {
//     setDraftFilters((prev) => ({
//       ...prev,
//       selectedStatus: prev.selectedStatus.includes(status)
//         ? prev.selectedStatus.filter((s) => s !== status)
//         : [...prev.selectedStatus, status],
//     }));
//   };

//   const toggleDraftPaymentMethod = (method) => {
//     setDraftFilters((prev) => ({
//       ...prev,
//       selectedPaymentMethods: prev.selectedPaymentMethods.includes(method)
//         ? prev.selectedPaymentMethods.filter((m) => m !== method)
//         : [...prev.selectedPaymentMethods, method],
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

//   const getStatusStyles = (status) => {
//     const colors = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
//     return {
//       container: { backgroundColor: colors.bg },
//       text: { color: colors.text },
//     };
//   };

//   const renderTransaction = ({ item }) => {
//     const statusStyles = getStatusStyles(item.status);

//     return (
//       <TouchableOpacity
//         style={styles.transactionItem}
//         onPress={() => router.push(`/transactions/${item._id}`)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.transactionRow}>
//           <View style={styles.transactionLeft}>
//             <Text style={styles.transactionNumber}>{item.transactionNumber}</Text>
//             <View style={styles.transactionMeta}>
//               <Text style={styles.transactionAttendant}>
//                 {item.salesAttendantId?.firstName} {item.salesAttendantId?.lastName || "N/A"}
//               </Text>
//               <Text style={styles.transactionDot}>•</Text>
//               <Text style={styles.transactionItems}>{item.items?.length || 0} items</Text>
//             </View>
//             <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
//           </View>
//           <View style={styles.transactionRight}>
//             <Text style={styles.transactionAmount}>{formatCurrency(item.totalAmount)}</Text>
//             <View style={[styles.statusBadge, statusStyles.container]}>
//               <Text style={[styles.statusText, statusStyles.text]}>
//                 {item.status.replace("_", " ")}
//               </Text>
//             </View>
//             {item.paymentMethod && (
//               <Text style={styles.paymentMethodText}>{item.paymentMethod}</Text>
//             )}
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

//             {/* Amount Range */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Amount Range</Text>
//               <View style={styles.amountRangeContainer}>
//                 <View style={styles.amountInputWrapper}>
//                   <Text style={styles.amountPrefix}>Min</Text>
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="0"
//                     value={draftFilters.minAmount}
//                     onChangeText={(text) =>
//                       setDraftFilters((prev) => ({
//                         ...prev,
//                         minAmount: sanitizeAmountInput(text),
//                       }))
//                     }
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//                 <Text style={styles.dateSeparator}>—</Text>
//                 <View style={styles.amountInputWrapper}>
//                   <Text style={styles.amountPrefix}>Max</Text>
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="∞"
//                     value={draftFilters.maxAmount}
//                     onChangeText={(text) =>
//                       setDraftFilters((prev) => ({
//                         ...prev,
//                         maxAmount: sanitizeAmountInput(text),
//                       }))
//                     }
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Status Filter */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Status</Text>
//               <View style={styles.chipContainer}>
//                 {TRANSACTION_STATUSES.map((status) => (
//                   <TouchableOpacity
//                     key={status.value}
//                     style={[
//                       styles.chip,
//                       draftFilters.selectedStatus.includes(status.value) && styles.chipActive,
//                     ]}
//                     onPress={() => toggleDraftStatus(status.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         draftFilters.selectedStatus.includes(status.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {status.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Payment Method Filter */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Payment Method</Text>
//               <View style={styles.chipContainer}>
//                 {PAYMENT_METHODS.map((method) => (
//                   <TouchableOpacity
//                     key={method.value}
//                     style={[
//                       styles.chip,
//                       draftFilters.selectedPaymentMethods.includes(method.value) &&
//                         styles.chipActive,
//                     ]}
//                     onPress={() => toggleDraftPaymentMethod(method.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.chipText,
//                         draftFilters.selectedPaymentMethods.includes(method.value) &&
//                           styles.chipTextActive,
//                       ]}
//                     >
//                       {method.label}
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

//   if (loading && transactions.length === 0) {
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
//             placeholder="Search by number, customer, item..."
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
//           {selectedStatus.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>Status: {selectedStatus.join(", ")}</Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedStatus([])}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {selectedPaymentMethods.length > 0 && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Payment: {selectedPaymentMethods.join(", ")}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedPaymentMethods([])}
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
//           {(minAmount || maxAmount) && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Amount: {minAmount || "0"} - {maxAmount || "∞"}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setMinAmount("");
//                   setMaxAmount("");
//                 }}
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
//           <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
//             <Text style={styles.clearAllChipText}>Clear All</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={[
//           styles.listContent,
//           transactions.length === 0 && styles.emptyListContent,
//         ]}
//         data={transactions}
//         keyExtractor={(item) => item._id}
//         renderItem={renderTransaction}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           transactions.length > 0 ? (
//             <View style={styles.listHeader}>
//               <Text style={styles.listHeaderText}>
//                 Showing {transactions.length} of {pagination.total} transactions
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
//             <View style={styles.emptyIconContainer}>
//               <Clock size={48} color={Colors.gray300} />
//             </View>
//             <Text style={styles.emptyTitle}>No Transactions Found</Text>
//             <Text style={styles.emptyDescription}>
//               {debouncedSearch || hasActiveFilters
//                 ? "Try adjusting your search or filters"
//                 : "Start by creating your first transaction"}
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
//     paddingTop: Spacing.lg,
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
//   transactionItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   transactionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   transactionLeft: { flex: 1, gap: 2 },
//   transactionNumber: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   transactionMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.xs,
//   },
//   transactionAttendant: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   transactionDot: {
//     color: Colors.gray400,
//     fontSize: Typography.xs,
//   },
//   transactionItems: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   transactionDate: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   transactionRight: { alignItems: "flex-end", gap: 2 },
//   transactionAmount: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   statusText: {
//     fontSize: Typography.xs,
//     fontWeight: "500",
//     textTransform: "capitalize",
//   },
//   paymentMethodText: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     textTransform: "capitalize",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: Spacing["4xl"],
//     gap: Spacing.md,
//   },
//   emptyIconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: Colors.gray100,
//     justifyContent: "center",
//     alignItems: "center",
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
//   amountRangeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   amountInputWrapper: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.xs,
//   },
//   amountPrefix: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "500",
//   },
//   amountInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
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































// app/(stacks)/transactions/index.jsx
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
  Check,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TransactionService from "../../../../services/transactionService";
import AuthService from "../../../../services/authService";
import StoreService from "../../../../services/storeService";
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

const DEFAULT_DATE_RANGE = { startDate: null, endDate: null };
const DEFAULT_SORT = "createdAt_desc";
const DEFAULT_FILTERS = {
  selectedStatus: [],
  selectedPaymentMethods: [],
  sortBy: DEFAULT_SORT,
  dateRange: DEFAULT_DATE_RANGE,
  minAmount: "",
  maxAmount: "",
};

const sanitizeAmountInput = (text) => {
  const cleaned = text.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) return cleaned;
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
};

export default function Transactions() {
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
  const [transactions, setTransactions] = useState([]);
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
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_FILTERS.selectedStatus);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState(
    DEFAULT_FILTERS.selectedPaymentMethods
  );
  const [sortBy, setSortBy] = useState(DEFAULT_FILTERS.sortBy);
  const [dateRange, setDateRange] = useState(DEFAULT_FILTERS.dateRange);
  const [minAmount, setMinAmount] = useState(DEFAULT_FILTERS.minAmount);
  const [maxAmount, setMaxAmount] = useState(DEFAULT_FILTERS.maxAmount);

  // Draft filters
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

  const requestIdRef = useRef(0);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.value === storeId);
    return store ? store.label : "";
  };

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

  const hasActiveFilters =
    selectedStatus.length > 0 ||
    selectedPaymentMethods.length > 0 ||
    !!dateRange.startDate ||
    !!dateRange.endDate ||
    !!minAmount ||
    !!maxAmount ||
    sortBy !== DEFAULT_SORT;

  const fetchTransactions = useCallback(
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
        if (selectedStatus.length > 0) params.status = selectedStatus.join(",");
        if (selectedPaymentMethods.length > 0) {
          params.paymentMethods = selectedPaymentMethods.join(",");
        }
        if (dateRange.startDate) params.startDate = dateRange.startDate.toISOString();
        if (dateRange.endDate) params.endDate = dateRange.endDate.toISOString();
        if (minAmount) params.minAmount = parseFloat(minAmount);
        if (maxAmount) params.maxAmount = parseFloat(maxAmount);

        // Add store filter for Super Admin
        if (isSuperAdmin && selectedStoreId) {
          params.storeId = selectedStoreId;
        }

        const result = await TransactionService.getTransactions(params);

        if (requestId !== requestIdRef.current) return;

        setTransactions((prev) =>
          append ? [...prev, ...(result.transactions || [])] : result.transactions || []
        );
        setPagination(result.pagination || { page, limit: 20, total: 0, pages: 0 });
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        console.error("Error fetching transactions:", error);
        Alert.alert("Error", "Failed to load transactions");
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
      selectedStatus,
      selectedPaymentMethods,
      sortBy,
      dateRange,
      minAmount,
      maxAmount,
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
      fetchTransactions(1);
    }
  }, [fetchTransactions]);

  // Debounce search
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions(1);
  };

  const loadMore = () => {
    if (!loading && !loadingMore && pagination.page < pagination.pages) {
      fetchTransactions(pagination.page + 1, true);
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
    setSelectedStatus(DEFAULT_FILTERS.selectedStatus);
    setSelectedPaymentMethods(DEFAULT_FILTERS.selectedPaymentMethods);
    setSortBy(DEFAULT_FILTERS.sortBy);
    setDateRange(DEFAULT_FILTERS.dateRange);
    setMinAmount(DEFAULT_FILTERS.minAmount);
    setMaxAmount(DEFAULT_FILTERS.maxAmount);
    setShowFilterModal(false);
  };

  const openFilterModal = () => {
    setDraftFilters({
      selectedStatus,
      selectedPaymentMethods,
      sortBy,
      dateRange,
      minAmount,
      maxAmount,
    });
    setShowFilterModal(true);
  };

  const applyFilterChanges = () => {
    let { minAmount: min, maxAmount: max } = draftFilters;
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
      [min, max] = [max, min];
    }

    setSelectedStatus(draftFilters.selectedStatus);
    setSelectedPaymentMethods(draftFilters.selectedPaymentMethods);
    setSortBy(draftFilters.sortBy);
    setDateRange(draftFilters.dateRange);
    setMinAmount(min);
    setMaxAmount(max);
    setShowFilterModal(false);
  };

  const toggleDraftStatus = (status) => {
    setDraftFilters((prev) => ({
      ...prev,
      selectedStatus: prev.selectedStatus.includes(status)
        ? prev.selectedStatus.filter((s) => s !== status)
        : [...prev.selectedStatus, status],
    }));
  };

  const toggleDraftPaymentMethod = (method) => {
    setDraftFilters((prev) => ({
      ...prev,
      selectedPaymentMethods: prev.selectedPaymentMethods.includes(method)
        ? prev.selectedPaymentMethods.filter((m) => m !== method)
        : [...prev.selectedPaymentMethods, method],
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
            <Text style={styles.transactionNumber}>{item.transactionNumber}</Text>
            <View style={styles.transactionMeta}>
              <Text style={styles.transactionAttendant}>
                {item.salesAttendantId?.firstName} {item.salesAttendantId?.lastName || "N/A"}
              </Text>
              <Text style={styles.transactionDot}>•</Text>
              <Text style={styles.transactionItems}>{item.items?.length || 0} items</Text>
            </View>
            <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.transactionRight}>
            <Text style={styles.transactionAmount}>{formatCurrency(item.totalAmount)}</Text>
            <View style={[styles.statusBadge, statusStyles.container]}>
              <Text style={[styles.statusText, statusStyles.text]}>
                {item.status.replace("_", " ")}
              </Text>
            </View>
            {item.paymentMethod && (
              <Text style={styles.paymentMethodText}>{item.paymentMethod}</Text>
            )}
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

            {/* Amount Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Amount Range</Text>
              <View style={styles.amountRangeContainer}>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.amountPrefix}>Min</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    value={draftFilters.minAmount}
                    onChangeText={(text) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        minAmount: sanitizeAmountInput(text),
                      }))
                    }
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
                    value={draftFilters.maxAmount}
                    onChangeText={(text) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        maxAmount: sanitizeAmountInput(text),
                      }))
                    }
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
                      draftFilters.selectedStatus.includes(status.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleDraftStatus(status.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        draftFilters.selectedStatus.includes(status.value) &&
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
                      draftFilters.selectedPaymentMethods.includes(method.value) &&
                        styles.chipActive,
                    ]}
                    onPress={() => toggleDraftPaymentMethod(method.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        draftFilters.selectedPaymentMethods.includes(method.value) &&
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

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Transactions"
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
            placeholder="Search by number, customer, item..."
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
          {selectedStatus.length > 0 && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Status: {selectedStatus.join(", ")}</Text>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          transactions.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Showing {transactions.length} of {pagination.total} transactions
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
            <View style={styles.emptyIconContainer}>
              <Clock size={48} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>No Transactions Found</Text>
            <Text style={styles.emptyDescription}>
              {debouncedSearch || hasActiveFilters
                ? "Try adjusting your search or filters"
                : isSuperAdmin && !selectedStoreId
                ? "Please select a store to view transactions"
                : "Start by creating your first transaction"}
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
    paddingTop: Spacing.lg,
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