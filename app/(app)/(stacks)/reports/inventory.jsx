import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Download,
  Share2,
  Package,
  AlertCircle,
  CheckCircle,
  Filter,
  X,
  Search,
} from "lucide-react-native";
import ReportService from "../../../../services/reportService";
import { formatCurrency } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function InventoryReport() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    lowStockOnly: false,
    outOfStockOnly: false,
    sortBy: "quantity",
    sortOrder: "asc",
    search: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchReport = async () => {
    try {
      const params = {
        lowStockOnly: filters.lowStockOnly,
        outOfStockOnly: filters.outOfStockOnly,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 100,
      };

      if (filters.category) {
        params.category = filters.category;
      }

      const reportData = await ReportService.getInventoryReport(params);

      setData(reportData);

      // Extract unique categories for filter
      if (reportData.categoryBreakdown) {
        setCategories(Object.keys(reportData.categoryBreakdown));
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load inventory report");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReport();
  }, []);

  const handleDownloadPDF = async () => {
    try {
      const params = {
        lowStockOnly: filters.lowStockOnly,
        outOfStockOnly: filters.outOfStockOnly,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.category) {
        params.category = filters.category;
      }

      const fileUri = await ReportService.downloadInventoryReportPDF(params);
      Alert.alert("Success", "Report downloaded and ready to share");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to download report");
    }
  };

  const handleShare = async () => {
    Alert.alert("Share", "Share functionality coming soon");
  };

  const applyFilters = () => {
    setShowFilters(false);
    fetchReport();
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      lowStockOnly: false,
      outOfStockOnly: false,
      sortBy: "quantity",
      sortOrder: "asc",
      search: "",
    });
    fetchReport();
  };

  const getFilteredInventory = () => {
    if (!data?.inventory) return [];
    let items = data.inventory;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.product?.name?.toLowerCase().includes(searchLower) ||
          item.product?.sku?.toLowerCase().includes(searchLower),
      );
    }

    return items;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const filteredInventory = getFilteredInventory();

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Inventory Report</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color={Colors.gray700} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray500} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={filters.search}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, search: text }))
            }
          />
        </View>
      </View> */}

      <CustomHeader
        title="Inventory Report"
        showBack={true}
        rightComponent={
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color={Colors.gray700} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.gray500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={filters.search}
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, search: text }))
          }
        />
      </View>

      {/* Report Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Products</Text>
                <Text style={styles.summaryValue}>
                  {data?.summary?.totalProducts || 0}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Stock</Text>
                <Text style={styles.summaryValue}>
                  {data?.summary?.totalStock || 0}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Value</Text>
                <Text style={[styles.summaryValue, styles.revenueValue]}>
                  {formatCurrency(data?.summary?.totalValue || 0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Avg Stock Value</Text>
                <Text style={[styles.summaryValue, styles.primaryValue]}>
                  {formatCurrency(data?.summary?.averageStockValue || 0)}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Low Stock</Text>
                <Text style={[styles.summaryValue, styles.warningValue]}>
                  {data?.summary?.lowStock || 0}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Out of Stock</Text>
                <Text style={[styles.summaryValue, styles.errorValue]}>
                  {data?.summary?.outOfStock || 0}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Over Stock</Text>
                <Text style={[styles.summaryValue, styles.primaryValue]}>
                  {data?.summary?.overStock || 0}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Cost Value</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data?.summary?.totalCostValue || 0)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stock Status Distribution */}
        {data?.stockStatusDistribution && (
          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>Stock Status Distribution</Text>
            <View style={styles.statusGrid}>
              <View style={[styles.statusItem, styles.statusInStock]}>
                <CheckCircle size={24} color={Colors.success} />
                <Text style={styles.statusLabel}>In Stock</Text>
                <Text style={styles.statusValue}>
                  {data.stockStatusDistribution.inStock || 0}
                </Text>
              </View>
              <View style={[styles.statusItem, styles.statusLowStock]}>
                <AlertCircle size={24} color={Colors.warning} />
                <Text style={styles.statusLabel}>Low Stock</Text>
                <Text style={[styles.statusValue, styles.warningValue]}>
                  {data.stockStatusDistribution.lowStock || 0}
                </Text>
              </View>
              <View style={[styles.statusItem, styles.statusOutStock]}>
                <AlertCircle size={24} color={Colors.error} />
                <Text style={styles.statusLabel}>Out of Stock</Text>
                <Text style={[styles.statusValue, styles.errorValue]}>
                  {data.stockStatusDistribution.outOfStock || 0}
                </Text>
              </View>
              <View style={[styles.statusItem, styles.statusOverStock]}>
                <Package size={24} color={Colors.primary} />
                <Text style={styles.statusLabel}>Over Stock</Text>
                <Text style={[styles.statusValue, styles.primaryValue]}>
                  {data.stockStatusDistribution.overStock || 0}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Breakdown */}
        {data?.categoryBreakdown &&
          Object.keys(data.categoryBreakdown).length > 0 && (
            <View style={styles.categoryCard}>
              <Text style={styles.sectionTitle}>Category Breakdown</Text>
              {Object.entries(data.categoryBreakdown).map(
                ([category, catData]) => (
                  <View key={category} style={styles.categoryRow}>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <Text style={styles.categoryCount}>
                        {catData.count} products
                      </Text>
                    </View>
                    <View style={styles.categoryStats}>
                      <Text style={styles.categoryStock}>
                        {catData.totalStock} units
                      </Text>
                      <Text style={styles.categoryValue}>
                        {formatCurrency(catData.totalValue || 0)}
                      </Text>
                      {catData.lowStockItems > 0 && (
                        <Text style={styles.categoryWarning}>
                          {catData.lowStockItems} low stock
                        </Text>
                      )}
                    </View>
                  </View>
                ),
              )}
            </View>
          )}

        {/* Brand Breakdown */}
        {data?.brandBreakdown &&
          Object.keys(data.brandBreakdown).length > 0 && (
            <View style={styles.brandCard}>
              <Text style={styles.sectionTitle}>Brand Breakdown</Text>
              {Object.entries(data.brandBreakdown)
                .slice(0, 10)
                .map(([brand, brandData]) => (
                  <View key={brand} style={styles.brandRow}>
                    <Text style={styles.brandName}>{brand}</Text>
                    <View style={styles.brandStats}>
                      <Text style={styles.brandCount}>
                        {brandData.count} products
                      </Text>
                      <Text style={styles.brandValue}>
                        {formatCurrency(brandData.totalValue || 0)}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )}

        {/* Value Distribution */}
        {data?.valueDistribution && (
          <View style={styles.valueCard}>
            <Text style={styles.sectionTitle}>Value Distribution</Text>
            {Object.entries(data.valueDistribution).map(([range, count]) => (
              <View key={range} style={styles.valueRow}>
                <Text style={styles.valueRange}>{range}</Text>
                <View style={styles.valueBarContainer}>
                  <View
                    style={[
                      styles.valueBar,
                      {
                        width: `${(count / (data.summary?.totalProducts || 1)) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.valueCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Inventory List */}
        <View style={styles.inventoryList}>
          <Text style={styles.sectionTitle}>
            Inventory Items ({filteredInventory.length})
          </Text>
          {filteredInventory.slice(0, 30).map((item, index) => (
            <View key={index} style={styles.inventoryRow}>
              <View style={styles.inventoryInfo}>
                <Text style={styles.inventoryName}>
                  {item.product?.name || "Unknown"}
                </Text>
                <Text style={styles.inventorySku}>
                  SKU: {item.product?.sku || "N/A"}
                </Text>
                <Text style={styles.inventoryLocation}>
                  Location: {item.warehouseLocation?.aisle || "N/A"}
                </Text>
              </View>
              <View style={styles.inventoryStats}>
                <Text style={styles.inventoryQuantity}>
                  {item.quantity || 0}
                </Text>
                <Text style={styles.inventoryValue}>
                  {formatCurrency(item.value || 0)}
                </Text>
                <View
                  style={[
                    styles.inventoryStatus,
                    item.status === "OUT_OF_STOCK" && styles.inventoryStatusOut,
                    item.status === "LOW_STOCK" && styles.inventoryStatusLow,
                    item.status === "IN_STOCK" && styles.inventoryStatusIn,
                    item.status === "OVER_STOCK" && styles.inventoryStatusOver,
                  ]}
                >
                  <Text
                    style={[
                      styles.inventoryStatusText,
                      item.status === "OUT_OF_STOCK" &&
                        styles.inventoryStatusOutText,
                      item.status === "LOW_STOCK" &&
                        styles.inventoryStatusLowText,
                      item.status === "IN_STOCK" &&
                        styles.inventoryStatusInText,
                      item.status === "OVER_STOCK" &&
                        styles.inventoryStatusOverText,
                    ]}
                  >
                    {item.status?.replace("_", " ") || "Unknown"}
                  </Text>
                </View>
                {item.daysUntilReorder !== undefined && (
                  <Text style={styles.inventoryReorder}>
                    {item.daysUntilReorder > 0
                      ? `${item.daysUntilReorder} days until reorder`
                      : "Reorder now!"}
                  </Text>
                )}
              </View>
            </View>
          ))}
          {filteredInventory.length > 30 && (
            <Text style={styles.showMoreText}>
              + {filteredInventory.length - 30} more items
            </Text>
          )}
          {filteredInventory.length === 0 && (
            <Text style={styles.noDataText}>No inventory items found</Text>
          )}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.exportButton]}
          onPress={handleDownloadPDF}
        >
          <Download size={20} color={Colors.gray700} />
          <Text style={styles.exportButtonText}>Export PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Share2 size={20} color={Colors.white} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={Colors.gray700} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Category Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Category</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      !filters.category && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, category: "" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        !filters.category && styles.filterOptionTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterOption,
                        filters.category === category &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, category }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.category === category &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status Filters */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Stock Status</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.lowStockOnly && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        lowStockOnly: !prev.lowStockOnly,
                        outOfStockOnly: false,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.lowStockOnly && styles.filterOptionTextActive,
                      ]}
                    >
                      Low Stock Only
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.outOfStockOnly && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        outOfStockOnly: !prev.outOfStockOnly,
                        lowStockOnly: false,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.outOfStockOnly && styles.filterOptionTextActive,
                      ]}
                    >
                      Out of Stock Only
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sort By */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.filterOptions}>
                  {[
                    { label: "Quantity", value: "quantity" },
                    { label: "Value", value: "value" },
                    { label: "Reorder Point", value: "reorderPoint" },
                    { label: "Name", value: "name" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        filters.sortBy === option.value &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: option.value,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.sortBy === option.value &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sort Order */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort Order</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.sortOrder === "asc" && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, sortOrder: "asc" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.sortOrder === "asc" &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      Ascending
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.sortOrder === "desc" && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, sortOrder: "desc" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.sortOrder === "desc" &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      Descending
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.resetButton]}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadows.sm,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  filterButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.gray900,
  },

  // Scroll View
  scrollView: { flex: 1 },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },

  // Summary
  summaryGrid: {
    marginBottom: Spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  summaryValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  revenueValue: { color: Colors.success },
  primaryValue: { color: Colors.primary },
  warningValue: { color: Colors.warning },
  errorValue: { color: Colors.error },

  // Status
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statusItem: {
    width: "50%",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  statusInStock: { backgroundColor: Colors.success + "10" },
  statusLowStock: { backgroundColor: Colors.warning + "10" },
  statusOutStock: { backgroundColor: Colors.error + "10" },
  statusOverStock: { backgroundColor: Colors.primary + "10" },
  statusLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  statusValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },

  // Category
  categoryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  categoryCount: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  categoryStats: {
    alignItems: "flex-end",
  },
  categoryStock: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  categoryValue: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },
  categoryWarning: {
    fontSize: Typography.xs,
    color: Colors.warning,
  },

  // Brand
  brandCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  brandName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    flex: 1,
  },
  brandStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  brandCount: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  brandValue: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },

  // Value Distribution
  valueCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  valueRange: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    width: 60,
  },
  valueBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.sm,
    overflow: "hidden",
  },
  valueBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  valueCount: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    width: 30,
    textAlign: "right",
  },

  // Inventory List
  inventoryList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  inventoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  inventorySku: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  inventoryLocation: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  inventoryStats: {
    alignItems: "flex-end",
  },
  inventoryQuantity: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  inventoryValue: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  inventoryStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  inventoryStatusText: {
    fontSize: Typography.xs,
    fontWeight: "500",
  },
  inventoryStatusIn: { backgroundColor: Colors.success + "20" },
  inventoryStatusInText: { color: Colors.success },
  inventoryStatusLow: { backgroundColor: Colors.warning + "20" },
  inventoryStatusLowText: { color: Colors.warning },
  inventoryStatusOut: { backgroundColor: Colors.error + "20" },
  inventoryStatusOutText: { color: Colors.error },
  inventoryStatusOver: { backgroundColor: Colors.primary + "20" },
  inventoryStatusOverText: { color: Colors.primary },
  inventoryReorder: {
    fontSize: Typography.xs,
    color: Colors.warning,
    marginTop: 2,
  },
  showMoreText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  noDataText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
    paddingVertical: Spacing.md,
  },

  // Footer
  footer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  footerButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  exportButton: {
    backgroundColor: Colors.gray200,
  },
  exportButtonText: {
    color: Colors.gray700,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  shareButton: {
    backgroundColor: Colors.primary,
  },
  shareButtonText: {
    color: Colors.white,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalBody: {
    padding: Spacing.md,
  },
  filterGroup: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  filterOptionTextActive: {
    color: Colors.white,
  },
  modalFooter: {
    flexDirection: "row",
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: Colors.gray200,
  },
  resetButtonText: {
    color: Colors.gray700,
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: Colors.primary,
  },
  applyButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
