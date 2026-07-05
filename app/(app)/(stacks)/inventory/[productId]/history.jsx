import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Package, Clock } from "lucide-react-native";
import InventoryService from "../../../../../services/inventoryService";
import { formatDateTime } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";

export default function InventoryHistory() {
  const { productId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [productId]);

  const fetchHistory = async () => {
    try {
      const data = await InventoryService.getInventoryByProduct(productId);
      setHistory(data?.movements || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: Colors.success,
      UPDATE: Colors.primary,
      DELETE: Colors.error,
      ADJUST: Colors.warning,
    };
    return colors[action] || Colors.gray500;
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATE: "➕",
      UPDATE: "✏️",
      DELETE: "🗑️",
      ADJUST: "📊",
    };
    return icons[action] || "📌";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={history}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyIcon}>{getActionIcon(item.action)}</Text>
            <Text
              style={[
                styles.historyAction,
                { color: getActionColor(item.action) },
              ]}
            >
              {item.action}
            </Text>
            <Text style={styles.historyTime}>
              {formatDateTime(item.timestamp)}
            </Text>
          </View>
          <View style={styles.historyDetails}>
            <Text style={styles.historyUser}>
              {item.actorId?.firstName} {item.actorId?.lastName}
            </Text>
            {item.details?.after?.quantity !== undefined && (
              <View style={styles.historyQuantityRow}>
                <Text style={styles.historyQuantityLabel}>Quantity:</Text>
                <Text style={styles.historyQuantityOld}>
                  {item.details?.before?.quantity || 0}
                </Text>
                <Text style={styles.historyQuantityArrow}>→</Text>
                <Text style={styles.historyQuantityNew}>
                  {item.details?.after?.quantity}
                </Text>
              </View>
            )}
            {item.details?.metadata?.reason && (
              <Text style={styles.historyReason}>
                Reason: {item.details.metadata.reason}
              </Text>
            )}
            {item.details?.metadata?.adjustment && (
              <Text style={styles.historyAdjustment}>
                Adjustment: {item.details.metadata.adjustment > 0 ? "+" : ""}
                {item.details.metadata.adjustment}
              </Text>
            )}
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Clock size={48} color={Colors.gray300} />
          <Text style={styles.emptyText}>No history recorded</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  historyItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  historyIcon: { fontSize: Typography.lg, marginRight: Spacing.sm },
  historyAction: { fontSize: Typography.sm, fontWeight: "600", flex: 1 },
  historyTime: { fontSize: Typography.xs, color: Colors.gray400 },
  historyDetails: { marginLeft: Spacing["2xl"] },
  historyUser: { fontSize: Typography.sm, color: Colors.gray500 },
  historyQuantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  historyQuantityLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  historyQuantityOld: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginLeft: Spacing.sm,
    textDecorationLine: "line-through",
  },
  historyQuantityArrow: {
    fontSize: Typography.sm,
    color: Colors.gray400,
    marginHorizontal: 4,
  },
  historyQuantityNew: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.success,
  },
  historyReason: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  historyAdjustment: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: 2,
  },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
});
