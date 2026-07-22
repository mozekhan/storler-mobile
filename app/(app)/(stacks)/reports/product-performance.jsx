// app/reports/product-performance.jsx
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
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Download,
  Share2,
  Filter,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  BarChart3,
  ChevronRight,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import ReportService from "../../../../services/reportService";
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

const { width } = Dimensions.get("window");

export default function ProductPerformanceReport() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [period, setPeriod] = useState("30days");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("revenue");
  const [sortOrder, setSortOrder] = useState("desc");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    storeId: "",
    category: "",
  });

  useEffect(() => {
    fetchReport();
  }, [period, filters.startDate, filters.endDate, sortBy, sortOrder]);

  const fetchReport = async () => {
    try {
      let startDate = filters.startDate;
      let endDate = filters.endDate;

      if (!startDate || !endDate) {
        const range = ReportService.getDateRangeFromPeriod(period);
        startDate = range.startDate;
        endDate = range.endDate;
      }

      const reportData = await ReportService.getProductPerformanceReport({
        startDate,
        endDate,
        storeId: filters.storeId || undefined,
        category: filters.category || undefined,
      });

      setData(reportData);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(reportData.map((p) => p.product?.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to load product performance report",
      );
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
      let startDate = filters.startDate;
      let endDate = filters.endDate;

      if (!startDate || !endDate) {
        const range = ReportService.getDateRangeFromPeriod(period);
        startDate = range.startDate;
        endDate = range.endDate;
      }

      const params = {
        startDate,
        endDate,
        storeId: filters.storeId || undefined,
        category: filters.category || undefined,
      };

      const fileUri = await ReportService.downloadProductPerformancePDF(params);
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
      startDate: "",
      endDate: "",
      storeId: "",
      category: "",
    });
    setPeriod("30days");
    setCategoryFilter("");
    setSortBy("revenue");
    setSortOrder("desc");
    fetchReport();
  };

  const getFilteredAndSortedProducts = () => {
    if (!data) return [];

    let products = [...data];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.product?.name?.toLowerCase().includes(query) ||
          p.product?.sku?.toLowerCase().includes(query),
      );
    }

    // Filter by category
    if (categoryFilter) {
      products = products.filter((p) => p.product?.category === categoryFilter);
    }

    // Sort
    products.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "revenue":
          aVal = a.totalRevenue || 0;
          bVal = b.totalRevenue || 0;
          break;
        case "quantity":
          aVal = a.totalQuantity || 0;
          bVal = b.totalQuantity || 0;
          break;
        case "transactions":
          aVal = a.transactionCount || 0;
          bVal = b.transactionCount || 0;
          break;
        case "avgPrice":
          aVal = a.averagePrice || 0;
          bVal = b.averagePrice || 0;
          break;
        case "inventory":
          aVal = a.inventory?.quantity || 0;
          bVal = b.inventory?.quantity || 0;
          break;
        default:
          aVal = a.totalRevenue || 0;
          bVal = b.totalRevenue || 0;
      }
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    return products;
  };

  const getPerformanceLevel = (revenue, maxRevenue) => {
    const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
    if (percentage >= 80) return "excellent";
    if (percentage >= 50) return "good";
    if (percentage >= 25) return "average";
    return "poor";
  };

  const getPerformanceColor = (level) => {
    switch (level) {
      case "excellent":
        return Colors.success;
      case "good":
        return Colors.primary;
      case "average":
        return Colors.warning;
      case "poor":
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const products = getFilteredAndSortedProducts();
  const maxRevenue =
    products.length > 0
      ? Math.max(...products.map((p) => p.totalRevenue || 0))
      : 0;

  return (
    <View style={styles.container}>
      {/* Header */}

      <CustomHeader
        title="Product Performance"
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

      <View style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["7days", "30days", "this_month", "this_quarter", "this_year"].map(
            (p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodChip,
                  period === p && styles.periodChipActive,
                ]}
                onPress={() => setPeriod(p)}
              >
                <Text
                  style={[
                    styles.periodChipText,
                    period === p && styles.periodChipTextActive,
                  ]}
                >
                  {p === "7days"
                    ? "7 Days"
                    : p === "30days"
                      ? "30 Days"
                      : p === "this_month"
                        ? "This Month"
                        : p === "this_quarter"
                          ? "This Quarter"
                          : "This Year"}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.gray500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X size={16} color={Colors.gray500} />
          </TouchableOpacity>
        )}
      </View>

      {/* Report Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Summary Stats */}
        {data && data.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Products</Text>
                <Text style={styles.statValue}>{data.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Revenue</Text>
                <Text style={[styles.statValue, styles.revenueValue]}>
                  {formatCurrency(
                    data.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
                  )}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Units Sold</Text>
                <Text style={styles.statValue}>
                  {formatNumber(
                    data.reduce((sum, p) => sum + (p.totalQuantity || 0), 0),
                  )}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Price</Text>
                <Text style={[styles.statValue, styles.primaryValue]}>
                  {formatCurrency(
                    data.reduce((sum, p) => sum + (p.averagePrice || 0), 0) /
                      (data.length || 1),
                  )}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <View style={styles.categoryChips}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  !categoryFilter && styles.categoryChipActive,
                ]}
                onPress={() => setCategoryFilter("")}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    !categoryFilter && styles.categoryChipTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    categoryFilter === category && styles.categoryChipActive,
                  ]}
                  onPress={() =>
                    setCategoryFilter(
                      category === categoryFilter ? "" : category,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      categoryFilter === category &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Sort Controls */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { label: "Revenue", value: "revenue" },
              { label: "Units Sold", value: "quantity" },
              { label: "Transactions", value: "transactions" },
              { label: "Avg Price", value: "avgPrice" },
              { label: "Inventory", value: "inventory" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortChip,
                  sortBy === option.value && styles.sortChipActive,
                ]}
                onPress={() => {
                  if (sortBy === option.value) {
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                  } else {
                    setSortBy(option.value);
                    setSortOrder("desc");
                  }
                }}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === option.value && styles.sortChipTextActive,
                  ]}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <Text> {sortOrder === "desc" ? "↓" : "↑"}</Text>
                  )}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product List */}
        <View style={styles.productList}>
          <Text style={styles.sectionTitle}>Products ({products.length})</Text>
          {products.map((product, index) => {
            const performanceLevel = getPerformanceLevel(
              product.totalRevenue || 0,
              maxRevenue,
            );
            const performanceColor = getPerformanceColor(performanceLevel);

            return (
              <TouchableOpacity
                key={index}
                style={styles.productCard}
                // onPress={() =>
                //   router.push(
                //     `/reports/product-detail?id=${product.product?._id}`,
                //   )
                // }
                activeOpacity={0.7}
              >
                <View style={styles.productHeader}>
                  <View style={styles.productRank}>
                    <Text style={styles.productRankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {product.product?.name || "Unknown Product"}
                    </Text>
                    <Text style={styles.productSku}>
                      SKU: {product.product?.sku || "N/A"}
                    </Text>
                    <Text style={styles.productCategory}>
                      {product.product?.category || "Uncategorized"}
                    </Text>
                  </View>
                  <View style={styles.productPerformance}>
                    <View
                      style={[
                        styles.performanceDot,
                        { backgroundColor: performanceColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.performanceText,
                        { color: performanceColor },
                      ]}
                    >
                      {performanceLevel.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.productMetrics}>
                  <View style={styles.metricItem}>
                    <DollarSign size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Revenue</Text>
                    <Text style={[styles.metricValue, styles.revenueValue]}>
                      {formatCurrency(product.totalRevenue || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Package size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Units</Text>
                    <Text style={styles.metricValue}>
                      {formatNumber(product.totalQuantity || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <BarChart3 size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Transactions</Text>
                    <Text style={styles.metricValue}>
                      {formatNumber(product.transactionCount || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Star size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Avg Price</Text>
                    <Text style={[styles.metricValue, styles.primaryValue]}>
                      {formatCurrency(product.averagePrice || 0)}
                    </Text>
                  </View>
                </View>

                <View style={styles.productFooter}>
                  <View style={styles.inventoryInfo}>
                    <Package size={12} color={Colors.gray400} />
                    <Text style={styles.inventoryText}>
                      Stock: {product.inventory?.quantity || 0} units
                    </Text>
                    {product.inventory?.quantity <=
                      (product.inventory?.reorderPoint || 0) && (
                      <AlertCircle size={12} color={Colors.warning} />
                    )}
                  </View>
                  <View style={styles.revenueBar}>
                    <View
                      style={[
                        styles.revenueFill,
                        {
                          width: `${maxRevenue > 0 ? ((product.totalRevenue || 0) / maxRevenue) * 100 : 0}%`,
                          backgroundColor: performanceColor,
                        },
                      ]}
                    />
                  </View>
                  <ChevronRight size={16} color={Colors.gray400} />
                </View>
              </TouchableOpacity>
            );
          })}
          {products.length === 0 && (
            <View style={styles.emptyState}>
              <Package size={48} color={Colors.gray300} />
              <Text style={styles.emptyStateTitle}>No Products Found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your filters or search query
              </Text>
            </View>
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
  periodContainer: {
    flexDirection: "row",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  periodChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.sm,
  },
  periodChipActive: {
    backgroundColor: Colors.primary,
  },
  periodChipText: {
    fontSize: Typography.xs,
    color: Colors.gray700,
  },
  periodChipTextActive: {
    color: Colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: Spacing.md,
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

  // Stats
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statItem: {
    width: "50%",
    paddingVertical: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  revenueValue: { color: Colors.success },
  primaryValue: { color: Colors.primary },

  // Category Chips
  categoryChips: {
    marginBottom: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },

  // Sort Controls
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sortLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginRight: Spacing.sm,
  },
  sortChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.sm,
  },
  sortChipActive: {
    backgroundColor: Colors.primary,
  },
  sortChipText: {
    fontSize: Typography.xs,
    color: Colors.gray700,
  },
  sortChipTextActive: {
    color: Colors.white,
  },

  // Product List
  productList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  productCard: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  productRank: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  productRankText: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray600,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  productSku: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  productCategory: {
    fontSize: Typography.xs,
    color: Colors.primary,
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  productPerformance: {
    alignItems: "center",
  },
  performanceDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginBottom: 2,
  },
  performanceText: {
    fontSize: Typography.xs,
    fontWeight: "500",
  },
  productMetrics: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  metricValue: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  inventoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inventoryText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  revenueBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.sm,
    overflow: "hidden",
  },
  revenueFill: {
    height: "100%",
    borderRadius: BorderRadius.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  emptyStateTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray700,
    marginTop: Spacing.md,
  },
  emptyStateText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.sm,
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
