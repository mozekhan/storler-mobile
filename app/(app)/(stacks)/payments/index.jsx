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
  CreditCard,
  DollarSign,
} from "lucide-react-native";
import PaymentService from "../../../../services/paymentService";
import { formatCurrency, formatDate } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";

export default function Payments() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, [searchTerm, filterStatus]);

  const fetchPayments = async (page = 1) => {
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

      // const result = await PaymentService.getPaymentStats(params);
      // setPayments(result.byMethod || []);
      // setPagination(result.pagination || {});
      const result = await PaymentService.getPayments(params);

      setPayments(result.payments || []);
      setPagination(result.pagination);
      
    } catch (error) {
      Alert.alert("Error", "Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments(1);
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

  const getStatusColor = (status) => {
    const colors = {
      PENDING: styles.statusPending,
      COMPLETED: styles.statusCompleted,
      FAILED: styles.statusFailed,
      REFUNDED: styles.statusRefunded,
    };
    return colors[status] || styles.statusDefault;
  };

  const getStatusTextColor = (status) => {
    const colors = {
      PENDING: styles.statusPendingText,
      COMPLETED: styles.statusCompletedText,
      FAILED: styles.statusFailedText,
      REFUNDED: styles.statusRefundedText,
    };
    return colors[status] || styles.statusDefaultText;
  };

  const renderPayment = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusTextColor = getStatusTextColor(item.status);

    return (
      <TouchableOpacity
        style={styles.paymentItem}
        onPress={() => router.push(`/payments/${item._id}`)}
      >
        <View style={styles.paymentRow}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentNumber}>{item.paymentNumber}</Text>
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentMethod}>
                {getPaymentMethodIcon(item.method)} {item.method}
              </Text>
            </View>
            <Text style={styles.paymentDate}>
              {formatDate(item.processedAt)}
            </Text>
          </View>
          <View style={styles.paymentRight}>
            <Text style={styles.paymentAmount}>
              {formatCurrency(item.amount)}
            </Text>
            <View style={[styles.statusBadge, statusColor]}>
              <Text style={[styles.statusText, statusTextColor]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.paymentReference}>Ref: {item.reference}</Text>
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
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search payments..."
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
              {
                text: "Completed",
                onPress: () => setFilterStatus("COMPLETED"),
              },
              { text: "Failed", onPress: () => setFilterStatus("FAILED") },
              { text: "Refunded", onPress: () => setFilterStatus("REFUNDED") },
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
        data={payments}
        keyExtractor={(item) => item._id}
        renderItem={renderPayment}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <CreditCard size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>No payments found</Text>
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
  paymentItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentInfo: { flex: 1 },
  paymentNumber: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  paymentMethod: { fontSize: Typography.sm, color: Colors.gray500 },
  paymentDate: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 2 },
  paymentRight: { alignItems: "flex-end" },
  paymentAmount: {
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
  statusCompleted: { backgroundColor: Colors.success + "20" },
  statusCompletedText: { color: Colors.success },
  statusFailed: { backgroundColor: Colors.error + "20" },
  statusFailedText: { color: Colors.error },
  statusRefunded: { backgroundColor: Colors.warning + "20" },
  statusRefundedText: { color: Colors.warning },
  statusDefault: { backgroundColor: Colors.gray200 },
  statusDefaultText: { color: Colors.gray700 },
  paymentReference: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
});
