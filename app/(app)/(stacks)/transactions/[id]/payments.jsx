// app/(app)/(stacks)/transactions/[id]/payments.jsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import useTransactionStore from "../../../../../stores/transactionStore";
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
  const { currentTransaction } = useTransactionStore();

  if (!currentTransaction || currentTransaction._id !== id) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  const receiptData = currentTransaction.receiptData || {};
  const summary = receiptData.summary || {};
  
  const paymentMethod = summary.paymentMethod || currentTransaction.paymentMethod || "N/A";
  const amountPaid = summary.amountPaid || currentTransaction.amountPaid || 0;
  const changeAmount = summary.changeAmount || currentTransaction.changeAmount || 0;
  const paymentReference = summary.paymentReference || currentTransaction.paymentReference || "";
  
  // Only show payment if there's a payment method
  if (paymentMethod === "N/A") {
    return (
      <View style={styles.container}>
        <CustomHeader title="Transaction Payment" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No payment information available</Text>
        </View>
      </View>
    );
  }

  const paymentData = [{
    _id: currentTransaction._id,
    paymentNumber: currentTransaction.transactionNumber || "PAY-001",
    method: paymentMethod,
    amount: amountPaid,
    status: currentTransaction.paymentStatus || "COMPLETED",
    processedAt: currentTransaction.updatedAt || currentTransaction.paymentTimestamp || new Date(),
    reference: paymentReference,
  }];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: Colors.warning,
      COMPLETED: Colors.success,
      PAID: Colors.success,
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

  return (
    <View style={styles.container}>
      <CustomHeader title="Transaction Payment" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={paymentData}
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
              {item.reference && (
                <Text style={styles.paymentReference}>Ref: {item.reference}</Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
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