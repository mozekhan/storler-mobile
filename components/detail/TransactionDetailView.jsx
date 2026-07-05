import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import Badge from "../ui/Badge";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../constants/theme";

const TransactionDetailView = ({ transaction }) => {
  const getStatusVariant = (status) => {
    const variants = {
      PENDING: "warning",
      SALES_QR: "info",
      PAID: "info",
      PAYMENT_QR: "info",
      RELEASED: "info",
      COMPLETED: "success",
      CANCELLED: "error",
    };
    return variants[status] || "default";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.transactionNumber}>
            {transaction.transactionNumber}
          </Text>
          <Badge variant={getStatusVariant(transaction.status)}>
            {transaction.status}
          </Badge>
        </View>
        <Text style={styles.date}>{formatDateTime(transaction.createdAt)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store</Text>
        <Text style={styles.storeName}>{transaction.storeId?.name}</Text>
        <Text style={styles.storeCode}>Code: {transaction.storeId?.code}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Totals</Text>
        <View style={styles.totalsGrid}>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(transaction.subtotal)}
            </Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(transaction.taxTotal)}
            </Text>
          </View>
          <View style={[styles.totalItem, styles.totalHighlight]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(transaction.totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Items ({transaction.items?.length || 0})
        </Text>
        {transaction.items?.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={styles.itemUnitPrice}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={styles.itemTotal}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Staff</Text>
        <View style={styles.staffRow}>
          <View style={styles.staffItem}>
            <Text style={styles.staffLabel}>Sales Attendant</Text>
            <Text style={styles.staffName}>
              {transaction.salesAttendantId?.firstName}{" "}
              {transaction.salesAttendantId?.lastName}
            </Text>
          </View>
          {transaction.financeAttendantId && (
            <View style={styles.staffItem}>
              <Text style={styles.staffLabel}>Finance Attendant</Text>
              <Text style={styles.staffName}>
                {transaction.financeAttendantId?.firstName}{" "}
                {transaction.financeAttendantId?.lastName}
              </Text>
            </View>
          )}
          {transaction.warehouseStaffId && (
            <View style={styles.staffItem}>
              <Text style={styles.staffLabel}>Warehouse Staff</Text>
              <Text style={styles.staffName}>
                {transaction.warehouseStaffId?.firstName}{" "}
                {transaction.warehouseStaffId?.lastName}
              </Text>
            </View>
          )}
        </View>
      </View>

      {transaction.paymentMethod && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentGrid}>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Method</Text>
              <Badge variant="info">{transaction.paymentMethod}</Badge>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Amount Paid</Text>
              <Text style={styles.paymentValue}>
                {formatCurrency(transaction.amountPaid)}
              </Text>
            </View>
            {transaction.changeAmount > 0 && (
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Change</Text>
                <Text style={styles.changeText}>
                  {formatCurrency(transaction.changeAmount)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionNumber: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  date: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  section: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  storeName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  storeCode: { fontSize: Typography.sm, color: Colors.gray500 },
  totalsGrid: { flexDirection: "row", justifyContent: "space-between" },
  totalItem: { flex: 1, alignItems: "center" },
  totalHighlight: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    padding: 8,
  },
  totalLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  totalValue: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  totalAmount: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.primary,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  itemSku: { fontSize: Typography.xs, color: Colors.gray500 },
  itemQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
  itemPrice: { alignItems: "flex-end" },
  itemUnitPrice: { fontSize: Typography.xs, color: Colors.gray500 },
  itemTotal: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  staffRow: { gap: 8 },
  staffItem: { paddingVertical: 4 },
  staffLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  staffName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  paymentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  paymentItem: { minWidth: "45%" },
  paymentLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  paymentValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  changeText: { color: Colors.success, fontWeight: "600" },
});

export default TransactionDetailView;
