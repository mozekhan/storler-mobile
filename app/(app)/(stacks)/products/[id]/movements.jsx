import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Package } from "lucide-react-native";
import InventoryService from "../../../../../services/inventoryService";
import { formatDateTime } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";

export default function ProductMovements() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    fetchMovements();
  }, [id]);

  const fetchMovements = async () => {
    try {
      const data = await InventoryService.getInventoryByProduct(id);
      setMovements(data?.movements || []);
    } catch (error) {
      console.error("Failed to fetch movements:", error);
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
      data={movements}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.movementItem}>
          <View style={styles.movementHeader}>
            <Text style={styles.movementIcon}>
              {getActionIcon(item.action)}
            </Text>
            <Text
              style={[
                styles.movementAction,
                { color: getActionColor(item.action) },
              ]}
            >
              {item.action}
            </Text>
            <Text style={styles.movementTime}>
              {formatDateTime(item.timestamp)}
            </Text>
          </View>
          <View style={styles.movementDetails}>
            <Text style={styles.movementUser}>
              {item.actorId?.firstName} {item.actorId?.lastName}
            </Text>
            {item.details?.after?.quantity !== undefined && (
              <Text style={styles.movementQuantity}>
                {item.details?.before?.quantity || 0} →{" "}
                {item.details?.after?.quantity}
              </Text>
            )}
            {item.details?.metadata?.reason && (
              <Text style={styles.movementReason}>
                Reason: {item.details.metadata.reason}
              </Text>
            )}
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Package size={48} color={Colors.gray300} />
          <Text style={styles.emptyText}>No movements recorded</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  movementItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  movementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  movementIcon: { fontSize: Typography.lg, marginRight: Spacing.sm },
  movementAction: { fontSize: Typography.sm, fontWeight: "600", flex: 1 },
  movementTime: { fontSize: Typography.xs, color: Colors.gray400 },
  movementDetails: { marginLeft: Spacing["2xl"] },
  movementUser: { fontSize: Typography.sm, color: Colors.gray500 },
  movementQuantity: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  movementReason: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
});
