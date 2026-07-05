import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import PaymentService from "../../../../../services/paymentService";
import { formatCurrency, formatDate } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

export default function TransactionPayments() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, [id]);

  const fetchPayments = async () => {
    try {
      const data = await PaymentService.getPaymentsByTransaction(id);
      setPayments(data || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: Colors.warning,
      COMPLETED: Colors.success,
      FAILED: Colors.error,
      REFUNDED: Colors.warning,
    };
    return colors[status] || Colors.gray500;
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Transaction Payment" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={payments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentNumber}>{item.paymentNumber}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentMethod}>
                {getPaymentMethodIcon(item.method)} {item.method}
              </Text>
              <Text style={styles.paymentAmount}>
                {formatCurrency(item.amount)}
              </Text>
              <Text style={styles.paymentDate}>
                {formatDate(item.processedAt)}
              </Text>
              <Text style={styles.paymentReference}>Ref: {item.reference}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payments found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  paymentItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  paymentNumber: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: { fontSize: Typography.xs, fontWeight: "500" },
  paymentDetails: { gap: Spacing.xs },
  paymentMethod: { fontSize: Typography.sm, color: Colors.gray500 },
  paymentAmount: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  paymentDate: { fontSize: Typography.xs, color: Colors.gray400 },
  paymentReference: { fontSize: Typography.xs, color: Colors.gray400 },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500 },
});
