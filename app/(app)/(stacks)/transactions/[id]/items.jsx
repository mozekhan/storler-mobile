import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useTransactionStore from "../../../../../stores/transactionStore";
import { formatCurrency } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

export default function TransactionItems() {
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
  const items = currentTransaction.items || receiptData.items || [];
  const releasedItems = currentTransaction.itemsReleased || receiptData.releasedItems || [];

  const allItems = [...items, ...releasedItems];

  return (
    <View style={styles.container}>
      <CustomHeader title="Transaction Items" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={allItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemIndex}>#{index + 1}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name || "Item"}</Text>
                <Text style={styles.itemSku}>SKU: {item.sku || "N/A"}</Text>
                <Text style={styles.itemMeta}>
                  Qty: {item.quantity || 0} × {formatCurrency(item.unitPrice || 0)}
                </Text>
              </View>
            </View>
            <Text style={styles.itemTotal}>
              {formatCurrency(item.totalPrice || item.unitPrice * item.quantity || 0)}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in this transaction</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  itemInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  itemIndex: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray400,
    width: 30,
  },
  itemDetails: { flex: 1 },
  itemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  itemSku: { fontSize: Typography.xs, color: Colors.gray500 },
  itemMeta: { fontSize: Typography.xs, color: Colors.gray500 },
  itemTotal: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500 },
});