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
import { Search, Filter, Eye, Calendar } from "lucide-react-native";
import TransactionService from "../../../../services/transactionService";
import { formatCurrency, formatDate } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function Transactions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, [searchTerm, filterStatus]);

  const fetchTransactions = async (page = 1) => {
    try {
      const params = {
        page,
        limit: 20,
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: searchTerm,
      };
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
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
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions(1);
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchTransactions(pagination.page + 1);
    }
  };

  const getStatusStyles = (status) => {
    const stylesMap = {
      PENDING: {
        container: styles.statusPending,
        text: styles.statusPendingText,
      },
      SALES_QR: {
        container: styles.statusSalesQR,
        text: styles.statusSalesQRText,
      },
      PAID: { container: styles.statusPaid, text: styles.statusPaidText },
      PAYMENT_QR: {
        container: styles.statusPaymentQR,
        text: styles.statusPaymentQRText,
      },
      RELEASED: {
        container: styles.statusReleased,
        text: styles.statusReleasedText,
      },
      COMPLETED: {
        container: styles.statusCompleted,
        text: styles.statusCompletedText,
      },
      CANCELLED: {
        container: styles.statusCancelled,
        text: styles.statusCancelledText,
      },
    };
    return (
      stylesMap[status] || {
        container: styles.statusDefault,
        text: styles.statusDefaultText,
      }
    );
  };

  const renderTransaction = ({ item }) => {
    const statusStyles = getStatusStyles(item.status);

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => router.push(`/transactions/${item._id}`)}
      >
        <View style={styles.transactionRow}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionNumber}>
              {item.transactionNumber}
            </Text>
            <Text style={styles.transactionAttendant}>
              {item.salesAttendantId?.firstName}{" "}
              {item.salesAttendantId?.lastName || "N/A"}
            </Text>
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
                {item.status}
              </Text>
            </View>
            <Text style={styles.transactionItems}>
              {item.items?.length || 0} items
            </Text>
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
      <CustomHeader title="Transactions" />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            Alert.alert("Filter by Status", "Select a status", [
              { text: "All", onPress: () => setFilterStatus("all") },
              { text: "Pending", onPress: () => setFilterStatus("PENDING") },
              { text: "Sales QR", onPress: () => setFilterStatus("SALES_QR") },
              { text: "Paid", onPress: () => setFilterStatus("PAID") },
              {
                text: "Payment QR",
                onPress: () => setFilterStatus("PAYMENT_QR"),
              },
              { text: "Released", onPress: () => setFilterStatus("RELEASED") },
              {
                text: "Completed",
                onPress: () => setFilterStatus("COMPLETED"),
              },
              {
                text: "Cancelled",
                onPress: () => setFilterStatus("CANCELLED"),
              },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
        >
          <Filter
            size={20}
            color={filterStatus !== "all" ? Colors.primary : Colors.gray400}
          />
        </TouchableOpacity>
      </View>

      {filterStatus !== "all" && (
        <View style={styles.filterChipContainer}>
          <Text style={styles.filterChipText}>Status: {filterStatus}</Text>
          <TouchableOpacity onPress={() => setFilterStatus("all")}>
            <Text style={styles.filterChipClear}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderTransaction}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
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
  transactionItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: { flex: 1 },
  transactionNumber: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  transactionAttendant: { fontSize: Typography.sm, color: Colors.gray500 },
  transactionDate: { fontSize: Typography.xs, color: Colors.gray400 },
  transactionRight: { alignItems: "flex-end" },
  transactionAmount: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  statusText: { fontSize: Typography.xs, fontWeight: "500" },
  statusPending: { backgroundColor: Colors.warning + "20" },
  statusPendingText: { color: Colors.warning },
  statusSalesQR: { backgroundColor: Colors.primary + "20" },
  statusSalesQRText: { color: Colors.primary },
  statusPaid: { backgroundColor: "#8B5CF6" + "20" },
  statusPaidText: { color: "#8B5CF6" },
  statusPaymentQR: { backgroundColor: "#8B5CF6" + "20" },
  statusPaymentQRText: { color: "#8B5CF6" },
  statusReleased: { backgroundColor: "#EC4899" + "20" },
  statusReleasedText: { color: "#EC4899" },
  statusCompleted: { backgroundColor: Colors.success + "20" },
  statusCompletedText: { color: Colors.success },
  statusCancelled: { backgroundColor: Colors.error + "20" },
  statusCancelledText: { color: Colors.error },
  statusDefault: { backgroundColor: Colors.gray200 },
  statusDefaultText: { color: Colors.gray700 },
  transactionItems: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500 },
});
