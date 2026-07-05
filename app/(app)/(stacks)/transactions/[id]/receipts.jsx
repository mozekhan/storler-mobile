import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FileText, Eye } from "lucide-react-native";
import ReceiptService from "../../../../../services/receiptService";
import { formatDate } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

export default function TransactionReceipts() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    fetchReceipts();
  }, [id]);

  const fetchReceipts = async () => {
    try {
      const data = await ReceiptService.getReceiptsByTransaction(id);
      setReceipts(data || []);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      SALES: "📄",
      PAYMENT: "💰",
      INVOICE: "📋",
    };
    return icons[type] || "📄";
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
      <CustomHeader title="Transaction Receipt" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={receipts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.receiptItem}
            onPress={() => router.push(`/receipts/${item._id}`)}
          >
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptIcon}>{getTypeIcon(item.type)}</Text>
              <View style={styles.receiptInfo}>
                <Text style={styles.receiptNumber}>{item.receiptNumber}</Text>
                <Text style={styles.receiptType}>{item.type}</Text>
              </View>
              <View style={styles.receiptActions}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => router.push(`/receipts/${item._id}`)}
                >
                  <Eye size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.receiptFooter}>
              <Text style={styles.receiptDate}>
                {formatDate(item.createdAt)}
              </Text>
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
                  {item.printed ? "Printed" : "Not Printed"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
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
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  receiptItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  receiptHeader: { flexDirection: "row", alignItems: "center" },
  receiptIcon: { fontSize: Typography.xl, marginRight: Spacing.md },
  receiptInfo: { flex: 1 },
  receiptNumber: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  receiptType: { fontSize: Typography.sm, color: Colors.gray500 },
  receiptActions: { flexDirection: "row" },
  viewButton: { padding: Spacing.sm },
  receiptFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  receiptDate: { fontSize: Typography.xs, color: Colors.gray400 },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: { fontSize: Typography.xs, fontWeight: "500" },
  statusPrinted: { backgroundColor: Colors.success + "20" },
  statusPrintedText: { color: Colors.success },
  statusNotPrinted: { backgroundColor: Colors.warning + "20" },
  statusNotPrintedText: { color: Colors.warning },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
});
