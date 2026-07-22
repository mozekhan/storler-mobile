// app/reports/financial.jsx
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
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  PieChart,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
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

export default function FinancialReport() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("30days");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    storeId: "",
    groupBy: "day",
  });

  useEffect(() => {
    fetchReport();
  }, [period, filters.startDate, filters.endDate]);

  const fetchReport = async () => {
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
        groupBy: filters.groupBy,
      };

      if (filters.storeId) {
        params.storeId = filters.storeId;
      }

      const reportData = await ReportService.getFinancialReport(params);

      setData(reportData);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load financial report");
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
        groupBy: filters.groupBy,
      };

      if (filters.storeId) {
        params.storeId = filters.storeId;
      }

      const fileUri = await ReportService.downloadFinancialReportPDF(params);
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
      groupBy: "day",
    });
    setPeriod("30days");
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
        title="Financial Report"
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
          {[
            "today",
            "yesterday",
            "7days",
            "30days",
            "this_month",
            "this_quarter",
            "this_year",
            "custom",
          ].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodChip,
                period === p && styles.periodChipActive,
              ]}
              onPress={() => {
                setPeriod(p);
                if (p !== "custom") {
                  const range = ReportService.getDateRangeFromPeriod(p);
                  setFilters((prev) => ({
                    ...prev,
                    startDate: range.startDate,
                    endDate: range.endDate,
                  }));
                }
              }}
            >
              <Text
                style={[
                  styles.periodChipText,
                  period === p && styles.periodChipTextActive,
                ]}
              >
                {p === "today"
                  ? "Today"
                  : p === "yesterday"
                    ? "Yesterday"
                    : p === "7days"
                      ? "7 Days"
                      : p === "30days"
                        ? "30 Days"
                        : p === "this_month"
                          ? "This Month"
                          : p === "this_quarter"
                            ? "This Quarter"
                            : p === "this_year"
                              ? "This Year"
                              : "Custom"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Report Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Financial Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={[styles.summaryValue, styles.revenueValue]}>
                {formatCurrency(data?.summary?.totalRevenue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Revenue</Text>
              <Text style={[styles.summaryValue, styles.primaryValue]}>
                {formatCurrency(data?.summary?.netRevenue || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Gross Profit</Text>
              <Text style={[styles.summaryValue, styles.successValue]}>
                {formatCurrency(data?.summary?.grossProfit || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Gross Margin</Text>
              <Text style={[styles.summaryValue, styles.successValue]}>
                {(data?.summary?.grossMargin || 0).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Profit</Text>
              <Text
                style={[
                  styles.summaryValue,
                  data?.summary?.netProfit > 0
                    ? styles.successValue
                    : styles.errorValue,
                ]}
              >
                {formatCurrency(data?.summary?.netProfit || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Profit Margin</Text>
              <Text
                style={[
                  styles.summaryValue,
                  data?.summary?.netProfitMargin > 0
                    ? styles.successValue
                    : styles.errorValue,
                ]}
              >
                {(data?.summary?.netProfitMargin || 0).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Transactions</Text>
              <Text style={styles.summaryValue}>
                {data?.summary?.transactionCount || 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Order Value</Text>
              <Text style={[styles.summaryValue, styles.primaryValue]}>
                {formatCurrency(data?.summary?.averageOrderValue || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Tax</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(data?.summary?.totalTax || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Discount</Text>
              <Text style={[styles.summaryValue, styles.warningValue]}>
                {formatCurrency(data?.summary?.totalDiscount || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Financial Ratios */}
        {data?.financialRatios && (
          <View style={styles.ratiosCard}>
            <Text style={styles.sectionTitle}>Financial Ratios</Text>
            <View style={styles.ratiosGrid}>
              <View style={styles.ratioItem}>
                <Text style={styles.ratioLabel}>Gross Margin</Text>
                <Text style={[styles.ratioValue, styles.successValue]}>
                  {(data.financialRatios.grossMargin || 0).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.ratioItem}>
                <Text style={styles.ratioLabel}>Tax Rate</Text>
                <Text style={styles.ratioValue}>
                  {(data.financialRatios.taxRate || 0).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.ratioItem}>
                <Text style={styles.ratioLabel}>Discount Rate</Text>
                <Text style={[styles.ratioValue, styles.warningValue]}>
                  {(data.financialRatios.discountRate || 0).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.ratioItem}>
                <Text style={styles.ratioLabel}>Avg Transaction Value</Text>
                <Text style={[styles.ratioValue, styles.primaryValue]}>
                  {formatCurrency(
                    data.financialRatios.averageTransactionValue || 0,
                  )}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Profitability Metrics */}
        {data?.metrics?.profitability && (
          <View style={styles.profitabilityCard}>
            <Text style={styles.sectionTitle}>Profitability Analysis</Text>
            <View style={styles.profitabilityGrid}>
              <View style={styles.profitabilityItem}>
                <Text style={styles.profitabilityLabel}>
                  Profit per Transaction
                </Text>
                <Text style={[styles.profitabilityValue, styles.successValue]}>
                  {formatCurrency(
                    data.metrics.profitability.profitPerTransaction || 0,
                  )}
                </Text>
              </View>
              <View style={styles.profitabilityItem}>
                <Text style={styles.profitabilityLabel}>Gross Profit</Text>
                <Text style={[styles.profitabilityValue, styles.successValue]}>
                  {formatCurrency(data.metrics.profitability.grossProfit || 0)}
                </Text>
              </View>
              <View style={styles.profitabilityItem}>
                <Text style={styles.profitabilityLabel}>Net Profit</Text>
                <Text
                  style={[
                    styles.profitabilityValue,
                    data.metrics.profitability.netProfit > 0
                      ? styles.successValue
                      : styles.errorValue,
                  ]}
                >
                  {formatCurrency(data.metrics.profitability.netProfit || 0)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Payment Method Financials */}
        {data?.paymentFinancials && data.paymentFinancials.length > 0 && (
          <View style={styles.paymentCard}>
            <Text style={styles.sectionTitle}>Payment Method Financials</Text>
            {data.paymentFinancials.map((method, index) => (
              <View key={index} style={styles.paymentRow}>
                <Text style={styles.paymentMethod}>
                  {method._id || "Unknown"}
                </Text>
                <View style={styles.paymentStats}>
                  <Text style={styles.paymentCount}>{method.count} txns</Text>
                  <Text style={styles.paymentAmount}>
                    {formatCurrency(method.totalAmount || 0)}
                  </Text>
                  <Text style={styles.paymentPercentage}>
                    {method.percentage?.toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Refund Analysis */}
        {data?.refundAnalysis && (
          <View style={styles.refundCard}>
            <Text style={styles.sectionTitle}>Refund Analysis</Text>
            <View style={styles.refundGrid}>
              <View style={styles.refundItem}>
                <Text style={styles.refundLabel}>Total Refunded</Text>
                <Text style={[styles.refundValue, styles.errorValue]}>
                  {formatCurrency(data.refundAnalysis.totalRefunded || 0)}
                </Text>
              </View>
              <View style={styles.refundItem}>
                <Text style={styles.refundLabel}>Refund Count</Text>
                <Text style={styles.refundValue}>
                  {data.refundAnalysis.refundCount || 0}
                </Text>
              </View>
              <View style={styles.refundItem}>
                <Text style={styles.refundLabel}>Average Refund</Text>
                <Text style={styles.refundValue}>
                  {formatCurrency(data.refundAnalysis.averageRefund || 0)}
                </Text>
              </View>
              <View style={styles.refundItem}>
                <Text style={styles.refundLabel}>Refund Rate</Text>
                <Text
                  style={[
                    styles.refundValue,
                    data.refundAnalysis.refundRate > 5
                      ? styles.errorValue
                      : styles.warningValue,
                  ]}
                >
                  {(data.refundAnalysis.refundRate || 0).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Profitability */}
        {data?.categoryProfitability &&
          data.categoryProfitability.length > 0 && (
            <View style={styles.categoryProfitCard}>
              <Text style={styles.sectionTitle}>Category Profitability</Text>
              {data.categoryProfitability
                .slice(0, 10)
                .map((category, index) => (
                  <View key={index} style={styles.categoryProfitRow}>
                    <Text style={styles.categoryProfitName}>
                      {category._id || "Uncategorized"}
                    </Text>
                    <View style={styles.categoryProfitStats}>
                      <Text style={styles.categoryProfitRevenue}>
                        {formatCurrency(category.totalRevenue || 0)}
                      </Text>
                      <Text
                        style={[
                          styles.categoryProfitMargin,
                          category.margin > 30
                            ? styles.successValue
                            : category.margin > 15
                              ? styles.warningValue
                              : styles.errorValue,
                        ]}
                      >
                        {(category.margin || 0).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )}

        {/* Cash Flow */}
        {data?.cashFlow && data.cashFlow.length > 0 && (
          <View style={styles.cashFlowCard}>
            <Text style={styles.sectionTitle}>Cash Flow</Text>
            {data.cashFlow.slice(0, 12).map((flow, index) => {
              const date = flow._id
                ? `${flow._id.year}-${String(flow._id.month).padStart(2, "0")}`
                : "N/A";
              return (
                <View key={index} style={styles.cashFlowRow}>
                  <Text style={styles.cashFlowDate}>{date}</Text>
                  <View style={styles.cashFlowStats}>
                    <Text style={styles.cashFlowInflow}>
                      +{formatCurrency(flow.cashInflow || 0)}
                    </Text>
                    <Text style={styles.cashFlowOutflow}>
                      -{formatCurrency(flow.cashOutflow || 0)}
                    </Text>
                    <Text
                      style={[
                        styles.cashFlowNet,
                        (flow.netCashFlow || 0) > 0
                          ? styles.successValue
                          : styles.errorValue,
                      ]}
                    >
                      {formatCurrency(flow.netCashFlow || 0)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Customer Lifetime Value */}
        {data?.customerLTV && (
          <View style={styles.ltvCard}>
            <Text style={styles.sectionTitle}>Customer Lifetime Value</Text>
            <View style={styles.ltvGrid}>
              <View style={styles.ltvItem}>
                <Text style={styles.ltvLabel}>Avg Customer LTV</Text>
                <Text style={[styles.ltvValue, styles.primaryValue]}>
                  {formatCurrency(
                    data.customerLTV.avgCustomerLifetimeValue || 0,
                  )}
                </Text>
              </View>
              <View style={styles.ltvItem}>
                <Text style={styles.ltvLabel}>Avg Purchase Frequency</Text>
                <Text style={styles.ltvValue}>
                  {data.customerLTV.avgPurchaseFrequency?.toFixed(1) || 0}
                </Text>
              </View>
              <View style={styles.ltvItem}>
                <Text style={styles.ltvLabel}>Customer Retention Rate</Text>
                <Text
                  style={[
                    styles.ltvValue,
                    (data.customerLTV.customerRetentionRate || 0) > 50
                      ? styles.successValue
                      : styles.warningValue,
                  ]}
                >
                  {(data.customerLTV.customerRetentionRate || 0).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.ltvItem}>
                <Text style={styles.ltvLabel}>Total Customers</Text>
                <Text style={styles.ltvValue}>
                  {data.customerLTV.totalCustomers || 0}
                </Text>
              </View>
            </View>
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
              {/* Group By */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Group By</Text>
                <View style={styles.filterOptions}>
                  {[
                    { label: "Day", value: "day" },
                    { label: "Week", value: "week" },
                    { label: "Month", value: "month" },
                    { label: "Quarter", value: "quarter" },
                    { label: "Year", value: "year" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        filters.groupBy === option.value &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          groupBy: option.value,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.groupBy === option.value &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {option.label}
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
  successValue: { color: Colors.success },
  errorValue: { color: Colors.error },
  warningValue: { color: Colors.warning },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Spacing.sm,
  },

  // Ratios
  ratiosCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  ratiosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ratioItem: {
    width: "50%",
    paddingVertical: Spacing.sm,
  },
  ratioLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  ratioValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },

  // Profitability
  profitabilityCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  profitabilityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profitabilityItem: {
    width: "33%",
    paddingVertical: Spacing.sm,
  },
  profitabilityLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  profitabilityValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
  },

  // Payment
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  paymentMethod: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    flex: 1,
  },
  paymentStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  paymentCount: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  paymentAmount: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  paymentPercentage: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "500",
  },

  // Refund
  refundCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  refundGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  refundItem: {
    width: "50%",
    paddingVertical: Spacing.sm,
  },
  refundLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  refundValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },

  // Category Profitability
  categoryProfitCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  categoryProfitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  categoryProfitName: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    flex: 1,
  },
  categoryProfitStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  categoryProfitRevenue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  categoryProfitMargin: {
    fontSize: Typography.sm,
    fontWeight: "bold",
  },

  // Cash Flow
  cashFlowCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cashFlowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  cashFlowDate: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    width: 80,
  },
  cashFlowStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  cashFlowInflow: {
    fontSize: Typography.sm,
    color: Colors.success,
  },
  cashFlowOutflow: {
    fontSize: Typography.sm,
    color: Colors.error,
  },
  cashFlowNet: {
    fontSize: Typography.sm,
    fontWeight: "bold",
  },

  // LTV
  ltvCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  ltvGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ltvItem: {
    width: "50%",
    paddingVertical: Spacing.sm,
  },
  ltvLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  ltvValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
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
