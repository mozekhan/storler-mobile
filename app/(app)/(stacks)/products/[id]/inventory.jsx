import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus, Minus, Package } from "lucide-react-native";
import InventoryService from "../../../../../services/inventoryService";
import ProductService from "../../../../../services/productService";
import { formatCurrency } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

export default function ProductInventory() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [inv, prod] = await Promise.all([
        InventoryService.getInventoryByProduct(id),
        ProductService.getProduct(id),
      ]);
      setInventory(inv);
      setProduct(prod);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = () => {
    const quantity = inventory?.quantity || 0;
    const reorderPoint = inventory?.reorderPoint || 5;

    if (quantity === 0) return { label: "Out of Stock", color: Colors.error };
    if (quantity <= reorderPoint)
      return { label: "Low Stock", color: Colors.warning };
    return { label: "In Stock", color: Colors.success };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!inventory || !product) {
    return (
      <View style={styles.emptyContainer}>
        <Package size={48} color={Colors.gray300} />
        <Text style={styles.emptyText}>No inventory data available</Text>
      </View>
    );
  }

  const status = getStockStatus();
  const available =
    (inventory.quantity || 0) - (inventory.reservedQuantity || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomHeader title="Product Inventory" />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productSku}>SKU: {product.sku}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current Stock</Text>
          <Text style={styles.statValue}>{inventory.quantity || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Reserved</Text>
          <Text style={styles.statValue}>
            {inventory.reservedQuantity || 0}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Available</Text>
          <Text style={[styles.statValue, styles.availableValue]}>
            {available}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Status</Text>
          <Text style={[styles.statValue, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Inventory Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reorder Point</Text>
          <Text style={styles.detailValue}>{inventory.reorderPoint || 5}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Unit Price</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(product.unitPrice)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Value</Text>
          <Text style={[styles.detailValue, styles.totalValue]}>
            {formatCurrency(
              (inventory.quantity || 0) * (product.unitPrice || 0),
            )}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Counted</Text>
          <Text style={styles.detailValue}>
            {inventory.lastCounted
              ? new Date(inventory.lastCounted).toLocaleDateString()
              : "Never"}
          </Text>
        </View>
      </View>

      <View style={styles.locationCard}>
        <Text style={styles.sectionTitle}>Warehouse Location</Text>
        <View style={styles.locationGrid}>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Aisle</Text>
            <Text style={styles.locationValue}>
              {inventory.warehouseLocation?.aisle || "N/A"}
            </Text>
          </View>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Shelf</Text>
            <Text style={styles.locationValue}>
              {inventory.warehouseLocation?.shelf || "N/A"}
            </Text>
          </View>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Bin</Text>
            <Text style={styles.locationValue}>
              {inventory.warehouseLocation?.bin || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.adjustButton}
        onPress={() =>
          router.push({
            pathname: "/(app)/(modals)/inventory-adjust",
            params: {
              productId: product._id,
              productName: product.name,
              currentStock: inventory.quantity,
            },
          })
        }
      >
        <Text style={styles.adjustButtonText}>Adjust Stock</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["3xl"],
  },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
  productInfo: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  productName: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  productSku: { fontSize: Typography.sm, color: Colors.gray500 },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  statCard: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: "center",
  },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
  availableValue: { color: Colors.primary },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  totalValue: { color: Colors.primary },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  locationGrid: { flexDirection: "row", justifyContent: "space-around" },
  locationItem: { alignItems: "center" },
  locationLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  locationValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  adjustButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  adjustButtonText: { color: Colors.white, fontWeight: "600" },
});
