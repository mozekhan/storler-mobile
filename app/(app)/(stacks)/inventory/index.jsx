import React, { useState, useEffect, useCallback } from "react";
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
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  Plus,
  Package,
  Edit,
  Filter,
  X,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react-native";
import InventoryService from "../../../../services/inventoryService";
import ProductService from "../../../../services/productService";
import { formatCurrency } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function InventoryManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalReserved: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterOutOfStock, setFilterOutOfStock] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [bulkAdjustModal, setBulkAdjustModal] = useState(false);
  const [bulkAdjustments, setBulkAdjustments] = useState([]);
  const [sortBy, setSortBy] = useState("quantity");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchInventory();
    fetchInventorySummary();
  }, [searchTerm, filterLowStock, filterOutOfStock, sortBy, sortOrder]);

  const fetchInventory = async (page = 1) => {
    try {
      const params = {
        page,
        limit: 20,
        search: searchTerm || undefined,
        lowStock: filterLowStock ? "true" : undefined,
        outOfStock: filterOutOfStock ? "true" : undefined,
        sortBy,
        sortOrder,
      };
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined) delete params[key];
      });

      const result = await InventoryService.getInventory(params);
      setInventory(result.inventory || []);
      setPagination(result.pagination || {});
    } catch (error) {
      Alert.alert("Error", "Failed to load inventory");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchInventorySummary = async () => {
    try {
      const summary = await InventoryService.getInventorySummary();
      setStats(summary);
    } catch (error) {
      console.error("Failed to fetch inventory summary:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory(1);
    fetchInventorySummary();
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchInventory(pagination.page + 1);
    }
  };

  const handleAdjustStock = async () => {
    if (adjustmentQuantity === 0) {
      Alert.alert("Error", "Please enter a quantity");
      return;
    }
    if (!adjustmentReason.trim()) {
      Alert.alert("Error", "Please enter a reason");
      return;
    }

    setLoading(true);
    try {
      const result = await InventoryService.adjustStock(
        selectedItem.productId._id,
        adjustmentQuantity,
        adjustmentReason.trim(),
      );

      Alert.alert(
        "Success",
        `Stock adjusted from ${result.previousQuantity} to ${result.newQuantity}`,
        [
          {
            text: "OK",
            onPress: () => {
              setShowAdjustModal(false);
              setSelectedItem(null);
              setAdjustmentQuantity(0);
              setAdjustmentReason("");
              fetchInventory();
              fetchInventorySummary();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to adjust stock",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdjust = async () => {
    const validAdjustments = bulkAdjustments.filter(
      (a) => a.quantity !== 0 && a.reason.trim(),
    );
    if (validAdjustments.length === 0) {
      Alert.alert("Error", "No valid adjustments to process");
      return;
    }

    setLoading(true);
    try {
      const result = await InventoryService.bulkAdjustStock(validAdjustments);

      Alert.alert(
        "Bulk Adjustment Complete",
        `Processed: ${result.totalProcessed}\nErrors: ${result.totalErrors}`,
        [
          {
            text: "View Details",
            onPress: () => {
              let message = "Results:\n";
              result.results.forEach((r) => {
                message += `\n${r.productName}: ${r.previousQuantity} → ${r.newQuantity} (${r.adjustment})`;
              });
              if (result.errors.length > 0) {
                message += "\n\nErrors:\n";
                result.errors.forEach((e) => {
                  message += `\n${e.productId}: ${e.error}`;
                });
              }
              Alert.alert("Bulk Adjustment Results", message);
            },
          },
          {
            text: "OK",
            onPress: () => {
              setBulkAdjustModal(false);
              setBulkAdjustments([]);
              fetchInventory();
              fetchInventorySummary();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to process bulk adjustment",
      );
    } finally {
      setLoading(false);
    }
  };

  const addBulkAdjustment = () => {
    setBulkAdjustments([
      ...bulkAdjustments,
      { productId: "", quantity: 0, reason: "" },
    ]);
  };

  const updateBulkAdjustment = (index, field, value) => {
    const updated = [...bulkAdjustments];
    updated[index][field] = value;
    setBulkAdjustments(updated);
  };

  const removeBulkAdjustment = (index) => {
    setBulkAdjustments(bulkAdjustments.filter((_, i) => i !== index));
  };

  const getStockStatus = (item) => {
    const quantity = item.quantity || 0;
    const reorderPoint = item.reorderPoint || 5;

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        container: styles.stockOut,
        text: styles.stockOutText,
        icon: X,
        color: Colors.error,
      };
    } else if (quantity <= reorderPoint) {
      return {
        label: "Low Stock",
        container: styles.stockLow,
        text: styles.stockLowText,
        icon: AlertTriangle,
        color: Colors.warning,
      };
    } else {
      return {
        label: "In Stock",
        container: styles.stockIn,
        text: styles.stockInText,
        icon: CheckCircle,
        color: Colors.success,
      };
    }
  };

  const renderInventoryItem = ({ item }) => {
    const status = getStockStatus(item);
    const StatusIcon = status.icon;
    const available = (item.quantity || 0) - (item.reservedQuantity || 0);

    return (
      <TouchableOpacity
        style={styles.inventoryItem}
        onPress={() => {
          setSelectedItem(item);
          setAdjustmentQuantity(0);
          setAdjustmentReason("");
          setShowAdjustModal(true);
        }}
      >
        <View style={styles.inventoryItemHeader}>
          <View style={styles.inventoryItemInfo}>
            <Text style={styles.inventoryItemName}>
              {item.productId?.name || "Unknown Product"}
            </Text>
            <Text style={styles.inventoryItemSku}>
              SKU: {item.productId?.sku || "N/A"}
            </Text>
          </View>
          <View style={[styles.stockBadge, status.container]}>
            <StatusIcon size={12} color={status.color} />
            <Text style={[styles.stockBadgeText, status.text]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.inventoryItemDetails}>
          <View style={styles.inventoryItemStat}>
            <Text style={styles.inventoryItemStatLabel}>Quantity</Text>
            <Text style={styles.inventoryItemStatValue}>
              {item.quantity || 0}
            </Text>
          </View>
          <View style={styles.inventoryItemStat}>
            <Text style={styles.inventoryItemStatLabel}>Reserved</Text>
            <Text style={styles.inventoryItemStatValue}>
              {item.reservedQuantity || 0}
            </Text>
          </View>
          <View style={styles.inventoryItemStat}>
            <Text style={styles.inventoryItemStatLabel}>Available</Text>
            <Text
              style={[styles.inventoryItemStatValue, styles.availableValue]}
            >
              {available}
            </Text>
          </View>
          <View style={styles.inventoryItemStat}>
            <Text style={styles.inventoryItemStatLabel}>Reorder Point</Text>
            <Text style={styles.inventoryItemStatValue}>
              {item.reorderPoint || 5}
            </Text>
          </View>
        </View>

        <View style={styles.inventoryItemFooter}>
          <Text style={styles.inventoryItemLocation}>
            📍 {item.warehouseLocation?.aisle || "N/A"} -{" "}
            {item.warehouseLocation?.shelf || "N/A"} -{" "}
            {item.warehouseLocation?.bin || "N/A"}
          </Text>
          <Text style={styles.inventoryItemPrice}>
            {formatCurrency(item.productId?.unitPrice || 0)}
          </Text>
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
      <CustomHeader
        title="Inventory Management"
        showBack={true}
        rightComponent={
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setBulkAdjustModal(true)}
          >
            <Upload size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
      />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerActions}>
            {/* <TouchableOpacity style={styles.headerButton} onPress={onRefresh}>
              <RefreshCw size={20} color={Colors.gray500} />
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statValue}>{stats.totalItems || 0}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRight]}>
            <Text style={styles.statLabel}>Reserved</Text>
            <Text style={styles.statValue}>{stats.totalReserved || 0}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <Text style={styles.statLabel}>Low Stock</Text>
            <Text style={[styles.statValue, styles.warningValue]}>
              {stats.lowStockCount || 0}
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardRight]}>
            <Text style={styles.statLabel}>Out of Stock</Text>
            <Text style={[styles.statValue, styles.errorValue]}>
              {stats.outOfStockCount || 0}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.filterBar}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterChip, filterLowStock && styles.filterChipActive]}
          onPress={() => setFilterLowStock(!filterLowStock)}
        >
          <Text
            style={[
              styles.filterChipText,
              filterLowStock && styles.filterChipTextActive,
            ]}
          >
            Low Stock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filterOutOfStock && styles.filterChipActive,
          ]}
          onPress={() => setFilterOutOfStock(!filterOutOfStock)}
        >
          <Text
            style={[
              styles.filterChipText,
              filterOutOfStock && styles.filterChipTextActive,
            ]}
          >
            Out of Stock
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[
            styles.sortChip,
            sortBy === "quantity" && styles.sortChipActive,
          ]}
          onPress={() => {
            setSortBy("quantity");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
        >
          <Text
            style={[
              styles.sortChipText,
              sortBy === "quantity" && styles.sortChipTextActive,
            ]}
          >
            Quantity{" "}
            {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortChip,
            sortBy === "productId.name" && styles.sortChipActive,
          ]}
          onPress={() => {
            setSortBy("productId.name");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
        >
          <Text
            style={[
              styles.sortChipText,
              sortBy === "productId.name" && styles.sortChipTextActive,
            ]}
          >
            Name{" "}
            {sortBy === "productId.name" && (sortOrder === "asc" ? "↑" : "↓")}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={inventory}
        keyExtractor={(item) => item._id}
        renderItem={renderInventoryItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Package size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>No inventory items found</Text>
          </View>
        )}
      />

      {/* Single Item Adjust Modal */}
      <Modal visible={showAdjustModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Stock</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAdjustModal(false);
                  setSelectedItem(null);
                  setAdjustmentQuantity(0);
                  setAdjustmentReason("");
                }}
              >
                <X size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={styles.modalBodyContent}
              >
                <View style={styles.productInfoCard}>
                  <Text style={styles.productInfoName}>
                    {selectedItem.productId?.name}
                  </Text>
                  <Text style={styles.productInfoSku}>
                    SKU: {selectedItem.productId?.sku}
                  </Text>
                  <View style={styles.productInfoStats}>
                    <View style={styles.productInfoStat}>
                      <Text style={styles.productInfoStatLabel}>
                        Current Stock
                      </Text>
                      <Text style={styles.productInfoStatValue}>
                        {selectedItem.quantity || 0}
                      </Text>
                    </View>
                    <View style={styles.productInfoStat}>
                      <Text style={styles.productInfoStatLabel}>Reserved</Text>
                      <Text style={styles.productInfoStatValue}>
                        {selectedItem.reservedQuantity || 0}
                      </Text>
                    </View>
                    <View style={styles.productInfoStat}>
                      <Text style={styles.productInfoStatLabel}>Available</Text>
                      <Text
                        style={[
                          styles.productInfoStatValue,
                          styles.availableValue,
                        ]}
                      >
                        {(selectedItem.quantity || 0) -
                          (selectedItem.reservedQuantity || 0)}
                      </Text>
                    </View>
                    <View style={styles.productInfoStat}>
                      <Text style={styles.productInfoStatLabel}>
                        Unit Price
                      </Text>
                      <Text style={styles.productInfoStatValue}>
                        {formatCurrency(selectedItem.productId?.unitPrice || 0)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Adjustment Quantity</Text>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setAdjustmentQuantity((prev) => prev - 1)}
                    >
                      <Minus size={20} color={Colors.gray500} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      keyboardType="numeric"
                      value={String(adjustmentQuantity)}
                      onChangeText={(text) =>
                        setAdjustmentQuantity(parseInt(text) || 0)
                      }
                    />
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setAdjustmentQuantity((prev) => prev + 1)}
                    >
                      <Plus size={20} color={Colors.gray500} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.helperText}>
                    Positive to add, negative to remove
                  </Text>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Reason</Text>
                  <TextInput
                    style={styles.reasonInput}
                    placeholder="Enter reason for adjustment"
                    value={adjustmentReason}
                    onChangeText={setAdjustmentReason}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor={Colors.gray400}
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setShowAdjustModal(false);
                      setSelectedItem(null);
                      setAdjustmentQuantity(0);
                      setAdjustmentReason("");
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.submitButton,
                      loading && styles.buttonDisabled,
                    ]}
                    onPress={handleAdjustStock}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Text style={styles.submitButtonText}>Adjust Stock</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Bulk Adjust Modal */}
      <Modal visible={bulkAdjustModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.bulkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bulk Stock Adjustment</Text>
              <TouchableOpacity
                onPress={() => {
                  setBulkAdjustModal(false);
                  setBulkAdjustments([]);
                }}
              >
                <X size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
            >
              <Text style={styles.bulkHelpText}>
                Add multiple products to adjust their stock levels in one go.
              </Text>

              {bulkAdjustments.map((adjustment, index) => (
                <View key={index} style={styles.bulkItem}>
                  <View style={styles.bulkItemHeader}>
                    <Text style={styles.bulkItemNumber}>#{index + 1}</Text>
                    <TouchableOpacity
                      onPress={() => removeBulkAdjustment(index)}
                    >
                      <X size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bulkItemFields}>
                    <View style={styles.bulkItemField}>
                      <Text style={styles.bulkItemLabel}>Product ID</Text>
                      <TextInput
                        style={styles.bulkItemInput}
                        placeholder="Enter product ID"
                        value={adjustment.productId}
                        onChangeText={(text) =>
                          updateBulkAdjustment(index, "productId", text)
                        }
                        placeholderTextColor={Colors.gray400}
                      />
                    </View>
                    <View
                      style={[styles.bulkItemField, styles.bulkItemFieldSmall]}
                    >
                      <Text style={styles.bulkItemLabel}>Qty</Text>
                      <TextInput
                        style={styles.bulkItemInput}
                        placeholder="0"
                        keyboardType="numeric"
                        value={String(adjustment.quantity)}
                        onChangeText={(text) =>
                          updateBulkAdjustment(
                            index,
                            "quantity",
                            parseInt(text) || 0,
                          )
                        }
                        placeholderTextColor={Colors.gray400}
                      />
                    </View>
                  </View>
                  <View style={styles.bulkItemField}>
                    <Text style={styles.bulkItemLabel}>Reason</Text>
                    <TextInput
                      style={styles.bulkItemInput}
                      placeholder="Reason for adjustment"
                      value={adjustment.reason}
                      onChangeText={(text) =>
                        updateBulkAdjustment(index, "reason", text)
                      }
                      placeholderTextColor={Colors.gray400}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addBulkButton}
                onPress={addBulkAdjustment}
              >
                <Plus size={20} color={Colors.primary} />
                <Text style={styles.addBulkButtonText}>Add Product</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setBulkAdjustModal(false);
                    setBulkAdjustments([]);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.submitButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleBulkAdjust}
                  disabled={loading || bulkAdjustments.length === 0}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Process All</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: Colors.white, padding: Spacing.md, ...Shadows.sm },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  headerActions: { flexDirection: "row", gap: Spacing.sm },
  headerButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
  },
  statsRow: { flexDirection: "row", marginBottom: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
  },
  statCardLeft: { marginRight: Spacing.sm },
  statCardRight: { marginLeft: Spacing.sm },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  warningValue: { color: Colors.warning },
  errorValue: { color: Colors.error },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    flexWrap: "wrap",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
    minWidth: 120,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.sm,
    marginBottom: 2,
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipText: { fontSize: Typography.xs, color: Colors.gray700 },
  filterChipTextActive: { color: Colors.white },
  sortBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  sortLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginRight: Spacing.sm,
  },
  sortChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  sortChipActive: { backgroundColor: Colors.primary + "15" },
  sortChipText: { fontSize: Typography.xs, color: Colors.gray600 },
  sortChipTextActive: { color: Colors.primary, fontWeight: "500" },
  list: { flex: 1 },
  listContent: { padding: Spacing.md },
  inventoryItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  inventoryItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  inventoryItemInfo: { flex: 1 },
  inventoryItemName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  inventoryItemSku: { fontSize: Typography.sm, color: Colors.gray500 },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  stockBadgeText: { fontSize: Typography.xs, fontWeight: "500" },
  stockIn: { backgroundColor: Colors.success + "20" },
  stockInText: { color: Colors.success },
  stockLow: { backgroundColor: Colors.warning + "20" },
  stockLowText: { color: Colors.warning },
  stockOut: { backgroundColor: Colors.error + "20" },
  stockOutText: { color: Colors.error },
  inventoryItemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  inventoryItemStat: { alignItems: "center" },
  inventoryItemStatLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  inventoryItemStatValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  availableValue: { color: Colors.primary },
  inventoryItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  inventoryItemLocation: { fontSize: Typography.xs, color: Colors.gray500 },
  inventoryItemPrice: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["3xl"],
    borderTopRightRadius: BorderRadius["3xl"],
    padding: Spacing["2xl"],
    maxHeight: "90%",
  },
  bulkModalContent: { maxHeight: "95%" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalBody: {},
  modalBodyContent: { paddingBottom: Spacing.md },
  productInfoCard: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  productInfoName: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  productInfoSku: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginBottom: Spacing.sm,
  },
  productInfoStats: { flexDirection: "row", flexWrap: "wrap" },
  productInfoStat: { width: "50%", paddingVertical: 2 },
  productInfoStatLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  productInfoStatValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  field: { marginBottom: Spacing.md },
  label: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.xl,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  helperText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: "600", color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
  bulkHelpText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  bulkItem: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bulkItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  bulkItemNumber: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray700,
  },
  bulkItemFields: { flexDirection: "row", gap: Spacing.sm },
  bulkItemField: { flex: 1 },
  bulkItemFieldSmall: { flex: 0.4 },
  bulkItemLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginBottom: 2,
  },
  bulkItemInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sm,
    backgroundColor: Colors.white,
  },
  addBulkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  addBulkButtonText: {
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: Spacing.sm,
  },
});
