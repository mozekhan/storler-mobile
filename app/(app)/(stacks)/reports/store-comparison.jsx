// app/reports/store-comparison.jsx
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
} from "react-native";
import { useRouter } from "expo-router";
import {
  Download,
  Share2,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  Store,
  DollarSign,
  Package,
  Users,
  BarChart3,
  CheckCircle,
} from "lucide-react-native";
import ReportService from "../../../../services/reportService";
import { formatCurrency, formatDate } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function StoreComparisonReport() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [selectedStores, setSelectedStores] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);
  const [period, setPeriod] = useState("30days");
  const [showStoreSelector, setShowStoreSelector] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStores.length > 0) {
      fetchReport();
    }
  }, [selectedStores, period]);

  const fetchStores = async () => {
    try {
      const response = await ReportService.getAvailableStores();

      // Normalize id -> _id
      const stores = (response?.stores || []).map((store) => ({
        ...store,
        _id: store._id || store.id,
      }));

      setAvailableStores(stores);

      if (stores.length > 0) {
        setSelectedStores(stores.map((store) => store._id));
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      setAvailableStores([]);
    }
  };

  const fetchReport = async () => {
    if (selectedStores.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const range = ReportService.getDateRangeFromPeriod(period);
      const reportData = await ReportService.getStoreComparisonReport({
        storeIds: selectedStores,
        startDate: range.startDate,
        endDate: range.endDate,
        metrics: ["revenue", "transactions", "inventory", "profit"],
      });

      setData(reportData);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to load store comparison report",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReport();
  }, [selectedStores]);

  const handleDownloadPDF = async () => {
    try {
      const range = ReportService.getDateRangeFromPeriod(period);
      const params = {
        storeIds: selectedStores,
        startDate: range.startDate,
        endDate: range.endDate,
      };

      const fileUri = await ReportService.downloadStoreComparisonPDF(params);
      Alert.alert("Success", "Report downloaded and ready to share");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to download report");
    }
  };

  const handleShare = async () => {
    Alert.alert("Share", "Share functionality coming soon");
  };

  const toggleStore = (storeId) => {
    setSelectedStores((prev) => {
      if (prev.includes(storeId)) {
        return prev.filter((_id) => _id !== storeId);
      } else {
        return [...prev, storeId];
      }
    });
  };

  const applyStoreSelection = () => {
    setShowStoreSelector(false);
    fetchReport();
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
      {/* Header */}

      <CustomHeader
        title="Store Comparison"
        showBack={true}
        rightComponent={
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowStoreSelector(true)}
          >
            <Store size={20} color={Colors.gray700} />
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

      <View style={styles.selectedStores}>
        {selectedStores.map((_id) => {
          const store = availableStores.find((s) => s._id === _id);
          return (
            <View key={_id} style={styles.selectedStoreChip}>
              <Text style={styles.selectedStoreText}>
                {store?.name || "Unknown"}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Report Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Comparative Summary */}
        {data?.comparativeSummary && (
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Comparative Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Revenue</Text>
                <Text style={[styles.summaryValue, styles.revenueValue]}>
                  {formatCurrency(data.comparativeSummary.totalRevenue || 0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Transactions</Text>
                <Text style={styles.summaryValue}>
                  {data.comparativeSummary.totalTransactions || 0}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Avg Revenue per Store</Text>
                <Text style={[styles.summaryValue, styles.primaryValue]}>
                  {formatCurrency(
                    data.comparativeSummary.averageRevenuePerStore || 0,
                  )}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Best Performing Store</Text>
                <Text style={[styles.summaryValue, styles.successValue]}>
                  {data.comparativeSummary.bestPerformingStore?.storeName ||
                    "N/A"}
                </Text>
                <Text style={styles.summarySubtext}>
                  {formatCurrency(
                    data.comparativeSummary.bestPerformingStore?.revenue || 0,
                  )}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Store Performance Cards */}
        {data?.reports && data.reports.length > 0 && (
          <View style={styles.storesCard}>
            <Text style={styles.sectionTitle}>Store Performance</Text>
            {data.reports.map((store, index) => (
              <View key={index} style={styles.storeCard}>
                <View style={styles.storeHeader}>
                  <Text style={styles.storeName}>{store.storeName}</Text>
                  <Text style={styles.storeCode}>{store.storeCode}</Text>
                  <View
                    style={[
                      styles.storeRank,
                      index === 0
                        ? styles.storeRankFirst
                        : index === 1
                          ? styles.storeRankSecond
                          : index === 2
                            ? styles.storeRankThird
                            : styles.storeRankOther,
                    ]}
                  >
                    <Text style={styles.storeRankText}>#{index + 1}</Text>
                  </View>
                </View>

                <View style={styles.storeMetrics}>
                  <View style={styles.metricItem}>
                    <DollarSign size={16} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Revenue</Text>
                    <Text style={[styles.metricValue, styles.revenueValue]}>
                      {formatCurrency(store.keyMetrics?.revenue || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <BarChart3 size={16} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Transactions</Text>
                    <Text style={styles.metricValue}>
                      {store.keyMetrics?.transactions || 0}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Package size={16} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Avg Order</Text>
                    <Text style={[styles.metricValue, styles.primaryValue]}>
                      {formatCurrency(store.keyMetrics?.averageOrderValue || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <TrendingUp size={16} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Profit Margin</Text>
                    <Text
                      style={[
                        styles.metricValue,
                        (store.keyMetrics?.profitMargin || 0) > 20
                          ? styles.successValue
                          : (store.keyMetrics?.profitMargin || 0) > 10
                            ? styles.warningValue
                            : styles.errorValue,
                      ]}
                    >
                      {(store.keyMetrics?.profitMargin || 0).toFixed(1)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.storeDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Inventory Value</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(store.keyMetrics?.inventoryValue || 0)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Low Stock Items</Text>
                    <Text style={[styles.detailValue, styles.warningValue]}>
                      {store.keyMetrics?.lowStockItems || 0}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total Items</Text>
                    <Text style={styles.detailValue}>
                      {store.keyMetrics?.totalItems || 0}
                    </Text>
                  </View>
                </View>

                {/* Performance Indicator */}
                <View style={styles.performanceBar}>
                  <View
                    style={[
                      styles.performanceFill,
                      {
                        width: `${Math.min(
                          ((store.keyMetrics?.revenue || 0) /
                            Math.max(
                              ...data.reports.map(
                                (s) => s.keyMetrics?.revenue || 0,
                              ),
                            )) *
                            100,
                          100,
                        )}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Comparison Chart (Simplified) */}
        {data?.reports && data.reports.length > 1 && (
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Revenue Comparison</Text>
            {data.reports.map((store, index) => {
              const maxRevenue = Math.max(
                ...data.reports.map((s) => s.keyMetrics?.revenue || 0),
              );
              const percentage =
                maxRevenue > 0
                  ? ((store.keyMetrics?.revenue || 0) / maxRevenue) * 100
                  : 0;

              return (
                <View key={index} style={styles.chartRow}>
                  <Text style={styles.chartLabel}>{store.storeName}</Text>
                  <View style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        { width: `${percentage}%` },
                        index === 0
                          ? styles.chartBarFirst
                          : index === 1
                            ? styles.chartBarSecond
                            : index === 2
                              ? styles.chartBarThird
                              : styles.chartBarOther,
                      ]}
                    />
                  </View>
                  <Text style={styles.chartValue}>
                    {formatCurrency(store.keyMetrics?.revenue || 0)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
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

      {/* Store Selector Modal */}
      <Modal
        visible={showStoreSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStoreSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Stores</Text>
              <TouchableOpacity onPress={() => setShowStoreSelector(false)}>
                <X size={24} color={Colors.gray700} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSubtext}>
                Select stores to compare (2-5 stores recommended)
              </Text>
              {availableStores.map((store) => (
                <TouchableOpacity
                  key={store._id}
                  style={[
                    styles.storeSelectorItem,
                    selectedStores.includes(store._id) &&
                      styles.storeSelectorItemActive,
                  ]}
                  onPress={() => toggleStore(store._id)}
                >
                  <View style={styles.storeSelectorInfo}>
                    <Store
                      size={20}
                      color={
                        selectedStores.includes(store._id)
                          ? Colors.primary
                          : Colors.gray500
                      }
                    />
                    <Text
                      style={[
                        styles.storeSelectorName,
                        selectedStores.includes(store._id) &&
                          styles.storeSelectorNameActive,
                      ]}
                    >
                      {store.name}
                    </Text>
                  </View>
                  <Text style={styles.storeSelectorCode}>{store.code}</Text>
                  {selectedStores.includes(store._id) && (
                    <View style={styles.storeSelectorCheck}>
                      <CheckCircle size={20} color={Colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.resetButton]}
                onPress={() => {
                  setSelectedStores(
                    availableStores.slice(0, 3).map((s) => s._id),
                  );
                }}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyStoreSelection}
                disabled={selectedStores.length < 2}
              >
                <Text style={styles.applyButtonText}>
                  Compare {selectedStores.length} Stores
                </Text>
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
  selectedStores: {
    flexDirection: "row",
    marginTop: Spacing.sm,
    flexWrap: "wrap",
  },
  selectedStoreChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary + "20",
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  selectedStoreText: {
    fontSize: Typography.xs,
    color: Colors.primary,
  },

  // Scroll View
  scrollView: { flex: 1 },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },

  // Summary
  summaryCard: {
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  summaryItem: {
    width: "50%",
    marginBottom: Spacing.sm,
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
  summarySubtext: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: 2,
  },
  revenueValue: { color: Colors.success },
  primaryValue: { color: Colors.primary },
  successValue: { color: Colors.success },
  warningValue: { color: Colors.warning },
  errorValue: { color: Colors.error },

  // Store Cards
  storesCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  storeCard: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  storeName: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    flex: 1,
  },
  storeCode: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginRight: Spacing.sm,
  },
  storeRank: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  storeRankFirst: {
    backgroundColor: Colors.success + "20",
  },
  storeRankSecond: {
    backgroundColor: Colors.primary + "20",
  },
  storeRankThird: {
    backgroundColor: Colors.warning + "20",
  },
  storeRankOther: {
    backgroundColor: Colors.gray200,
  },
  storeRankText: {
    fontSize: Typography.xs,
    fontWeight: "bold",
    color: Colors.gray700,
  },
  storeMetrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.sm,
  },
  metricItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  metricLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  metricValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  storeDetails: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.sm,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  performanceBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  performanceFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },

  // Chart
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  chartLabel: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    width: 80,
  },
  chartBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.sm,
    overflow: "hidden",
  },
  chartBar: {
    height: "100%",
    borderRadius: BorderRadius.sm,
  },
  chartBarFirst: { backgroundColor: Colors.success },
  chartBarSecond: { backgroundColor: Colors.primary },
  chartBarThird: { backgroundColor: Colors.warning },
  chartBarOther: { backgroundColor: Colors.gray400 },
  chartValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    width: 80,
    textAlign: "right",
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
  modalSubtext: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginBottom: Spacing.md,
  },
  storeSelectorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  storeSelectorItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  storeSelectorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  storeSelectorName: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    marginLeft: Spacing.sm,
  },
  storeSelectorNameActive: {
    color: Colors.primary,
    fontWeight: "500",
  },
  storeSelectorCode: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginRight: Spacing.sm,
  },
  storeSelectorCheck: {
    marginLeft: Spacing.sm,
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
