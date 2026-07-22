// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Download, Share2, Calendar, TrendingUp } from 'lucide-react-native';
// import ReportService from '../../../../services/reportService';
// import { formatCurrency, formatDate } from '../../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';

// const { width } = Dimensions.get('window');

// export default function SalesReport() {
//   const router = useRouter();
//   const { startDate, endDate } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const [period, setPeriod] = useState('30days');

//   useEffect(() => {
//     fetchReport();
//   }, [period]);

//   const fetchReport = async () => {
//     try {
//       const now = new Date();
//       let start = new Date();
//       const end = now.toISOString().split('T')[0];

//       if (startDate && endDate) {
//         start = new Date(startDate);
//       } else {
//         switch (period) {
//           case '7days':
//             start.setDate(now.getDate() - 7);
//             break;
//           case '30days':
//             start.setDate(now.getDate() - 30);
//             break;
//           case '90days':
//             start.setDate(now.getDate() - 90);
//             break;
//           default:
//             start.setDate(now.getDate() - 30);
//         }
//       }

//       const result = await ReportService.getSalesReport(
//         start.toISOString().split('T')[0],
//         end
//       );
//       setData(result);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load sales report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Sales Report</Text>
//         <View style={styles.periodContainer}>
//           {['7days', '30days', '90days'].map((p) => (
//             <TouchableOpacity
//               key={p}
//               style={[styles.periodChip, period === p && styles.periodChipActive]}
//               onPress={() => setPeriod(p)}
//             >
//               <Text style={[styles.periodChipText, period === p && styles.periodChipTextActive]}>
//                 {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : '90 Days'}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         <View style={styles.summaryCard}>
//           <Text style={styles.sectionTitle}>Summary</Text>
//           <View style={styles.summaryGrid}>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Revenue</Text>
//               <Text style={[styles.summaryValue, styles.revenueValue]}>
//                 {formatCurrency(data?.summary?.totalRevenue || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Transactions</Text>
//               <Text style={styles.summaryValue}>{data?.summary?.totalTransactions || 0}</Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Avg. Order Value</Text>
//               <Text style={[styles.summaryValue, styles.primaryValue]}>
//                 {formatCurrency(data?.summary?.averageOrderValue || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Items</Text>
//               <Text style={styles.summaryValue}>{data?.summary?.totalItems || 0}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.paymentCard}>
//           <Text style={styles.sectionTitle}>Payment Methods</Text>
//           {data?.paymentBreakdown?.map((method, index) => (
//             <View key={index} style={styles.paymentRow}>
//               <Text style={styles.paymentMethod}>{method._id || 'Unknown'}</Text>
//               <View style={styles.paymentStats}>
//                 <Text style={styles.paymentCount}>{method.count} transactions</Text>
//                 <Text style={styles.paymentAmount}>{formatCurrency(method.totalAmount || 0)}</Text>
//               </View>
//             </View>
//           ))}
//           {(!data?.paymentBreakdown || data.paymentBreakdown.length === 0) && (
//             <Text style={styles.noDataText}>No payment data available</Text>
//           )}
//         </View>

//         <View style={styles.productsCard}>
//           <Text style={styles.sectionTitle}>Top Products</Text>
//           {data?.productPerformance?.slice(0, 10).map((product, index) => (
//             <View key={index} style={styles.productRow}>
//               <Text style={styles.productRank}>#{index + 1}</Text>
//               <View style={styles.productInfo}>
//                 <Text style={styles.productName}>
//                   {product.product?.name || 'Unknown Product'}
//                 </Text>
//                 <Text style={styles.productQuantity}>{product.totalQuantity || 0} units sold</Text>
//               </View>
//               <Text style={styles.productRevenue}>{formatCurrency(product.totalRevenue || 0)}</Text>
//             </View>
//           ))}
//           {(!data?.productPerformance || data.productPerformance.length === 0) && (
//             <Text style={styles.noDataText}>No product data available</Text>
//           )}
//         </View>

//         <View style={styles.staffCard}>
//           <Text style={styles.sectionTitle}>Staff Performance</Text>
//           {data?.staffPerformance?.slice(0, 5).map((staff, index) => (
//             <View key={index} style={styles.staffRow}>
//               <Text style={styles.staffRank}>#{index + 1}</Text>
//               <View style={styles.staffInfo}>
//                 <Text style={styles.staffName}>
//                   {staff.staff?.firstName} {staff.staff?.lastName || 'Unknown'}
//                 </Text>
//                 <Text style={styles.staffTransactions}>{staff.totalTransactions || 0} transactions</Text>
//               </View>
//               <Text style={styles.staffRevenue}>{formatCurrency(staff.totalSales || 0)}</Text>
//             </View>
//           ))}
//           {(!data?.staffPerformance || data.staffPerformance.length === 0) && (
//             <Text style={styles.noDataText}>No staff data available</Text>
//           )}
//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity style={[styles.footerButton, styles.exportButton]}>
//           <Download size={20} color={Colors.gray700} />
//           <Text style={styles.exportButtonText}>Export</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.footerButton, styles.shareButton]}>
//           <Share2 size={20} color={Colors.white} />
//           <Text style={styles.shareButtonText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { backgroundColor: Colors.white, padding: Spacing.md, ...Shadows.sm },
//   headerTitle: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
//   periodContainer: { flexDirection: 'row', marginTop: Spacing.sm },
//   periodChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: Colors.gray200, marginRight: Spacing.sm },
//   periodChipActive: { backgroundColor: Colors.primary },
//   periodChipText: { fontSize: Typography.xs, color: Colors.gray700 },
//   periodChipTextActive: { color: Colors.white },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: Spacing.md, paddingBottom: Spacing['3xl'] },
//   summaryCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
//   summaryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
//   summaryItem: { width: '50%', marginBottom: Spacing.sm },
//   summaryLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   summaryValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
//   revenueValue: { color: Colors.success },
//   primaryValue: { color: Colors.primary },
//   paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   paymentMethod: { fontSize: Typography.sm, color: Colors.gray700, flex: 1 },
//   paymentStats: { flexDirection: 'row', alignItems: 'center' },
//   paymentCount: { fontSize: Typography.xs, color: Colors.gray500, marginRight: Spacing.sm },
//   paymentAmount: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.gray900 },
//   productsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   productRank: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.gray400, width: 30 },
//   productInfo: { flex: 1, marginLeft: Spacing.sm },
//   productName: { fontSize: Typography.sm, color: Colors.gray900 },
//   productQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
//   productRevenue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.primary },
//   staffCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
//   staffRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
//   staffRank: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.gray400, width: 30 },
//   staffInfo: { flex: 1, marginLeft: Spacing.sm },
//   staffName: { fontSize: Typography.sm, color: Colors.gray900 },
//   staffTransactions: { fontSize: Typography.xs, color: Colors.gray500 },
//   staffRevenue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.primary },
//   noDataText: { fontSize: Typography.sm, color: Colors.gray500, textAlign: 'center', paddingVertical: Spacing.md },
//   footer: { flexDirection: 'row', backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200, padding: Spacing.md, gap: Spacing.sm },
//   footerButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
//   exportButton: { backgroundColor: Colors.gray200 },
//   exportButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
//   shareButton: { backgroundColor: Colors.primary },
//   shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
// });

// app/reports/sales.jsx
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
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Download,
  Share2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  ChevronDown,
  BarChart3,
  PieChart,
  Users,
  Package,
  DollarSign,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

export default function SalesReport() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("30days");

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    storeId: "",
    groupBy: "day",
    paymentMethods: [],
    minAmount: "",
    maxAmount: "",
    category: "",
    salesAttendantId: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // Available filter options
  const [paymentMethodOptions] = useState([
    "CASH",
    "CARD",
    "TRANSFER",
    "CREDIT",
    "MOBILE_MONEY",
  ]);
  const [groupByOptions] = useState([
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Quarter", value: "quarter" },
    { label: "Year", value: "year" },
  ]);
  const [sortByOptions] = useState([
    { label: "Date", value: "date" },
    { label: "Revenue", value: "revenue" },
    { label: "Transactions", value: "transactions" },
    { label: "Average Order Value", value: "avgOrderValue" },
  ]);

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    // Check if date params are passed from navigation
    if (params.startDate && params.endDate) {
      setFilters((prev) => ({
        ...prev,
        startDate: params.startDate,
        endDate: params.endDate,
      }));
      setPeriod("custom");
    }
    fetchReport();
  }, [period, filters.startDate, filters.endDate]);

  const fetchReport = async () => {
    try {
      let startDate = filters.startDate;
      let endDate = filters.endDate;

      if (period !== "custom" && !params.startDate) {
        const range = ReportService.getDateRangeFromPeriod(period);
        startDate = range.startDate;
        endDate = range.endDate;
      }

      const reportData = await ReportService.getSalesReport({
        startDate,
        endDate,
        storeId: filters.storeId || undefined,
        groupBy: filters.groupBy,
        paymentMethods:
          filters.paymentMethods.length > 0
            ? filters.paymentMethods
            : undefined,
        minAmount: filters.minAmount
          ? parseFloat(filters.minAmount)
          : undefined,
        maxAmount: filters.maxAmount
          ? parseFloat(filters.maxAmount)
          : undefined,
        category: filters.category || undefined,
        salesAttendantId: filters.salesAttendantId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 100,
      });

      setData(reportData);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load sales report");
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

      if (period !== "custom" && !params.startDate) {
        const range = ReportService.getDateRangeFromPeriod(period);
        startDate = range.startDate;
        endDate = range.endDate;
      }

      const downloadFilters = {
        startDate,
        endDate,
        storeId: filters.storeId || undefined,
        groupBy: filters.groupBy,
        paymentMethods:
          filters.paymentMethods.length > 0
            ? filters.paymentMethods
            : undefined,
        minAmount: filters.minAmount
          ? parseFloat(filters.minAmount)
          : undefined,
        maxAmount: filters.maxAmount
          ? parseFloat(filters.maxAmount)
          : undefined,
        category: filters.category || undefined,
        salesAttendantId: filters.salesAttendantId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const fileUri =
        await ReportService.downloadSalesReportPDF(downloadFilters);
      Alert.alert("Success", "Report downloaded and ready to share");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to download report");
    }
  };

  const handleShare = async () => {
    // Implement share functionality
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
      paymentMethods: [],
      minAmount: "",
      maxAmount: "",
      category: "",
      salesAttendantId: "",
      sortBy: "date",
      sortOrder: "desc",
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
      {/* <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Sales Report</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color={Colors.gray700} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.periodContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['today', 'yesterday', '7days', '30days', 'this_month', 'this_quarter', 'this_year', 'custom'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodChip, period === p && styles.periodChipActive]}
                onPress={() => {
                  setPeriod(p);
                  if (p !== 'custom') {
                    const range = ReportService.getDateRangeFromPeriod(p);
                    setFilters(prev => ({
                      ...prev,
                      startDate: range.startDate,
                      endDate: range.endDate
                    }));
                  }
                }}
              >
                <Text style={[styles.periodChipText, period === p && styles.periodChipTextActive]}>
                  {p === 'today' ? 'Today' :
                   p === 'yesterday' ? 'Yesterday' :
                   p === '7days' ? '7 Days' :
                   p === '30days' ? '30 Days' :
                   p === 'this_month' ? 'This Month' :
                   p === 'this_quarter' ? 'This Quarter' :
                   p === 'this_year' ? 'This Year' : 'Custom'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {period === 'custom' && (
          <View style={styles.customDateContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateInputText}>
                {filters.startDate ? formatDate(filters.startDate) : 'Start Date'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateSeparator}>to</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateInputText}>
                {filters.endDate ? formatDate(filters.endDate) : 'End Date'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View> */}

      <CustomHeader
        title="Sales Report"
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

      {period === "custom" && (
        <View style={styles.customDateContainer}>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateInputText}>
              {filters.startDate ? formatDate(filters.startDate) : "Start Date"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.dateSeparator}>to</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateInputText}>
              {filters.endDate ? formatDate(filters.endDate) : "End Date"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
          <View style={[styles.summaryCard, styles.summaryCardFull]}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Revenue</Text>
                <Text style={[styles.summaryValue, styles.revenueValue]}>
                  {formatCurrency(data?.summary?.totalRevenue || 0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Transactions</Text>
                <Text style={styles.summaryValue}>
                  {data?.summary?.totalTransactions || 0}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Avg. Order Value</Text>
                <Text style={[styles.summaryValue, styles.primaryValue]}>
                  {formatCurrency(data?.summary?.averageOrderValue || 0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Items Sold</Text>
                <Text style={styles.summaryValue}>
                  {data?.summary?.totalItemsSold || 0}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Unique Customers</Text>
                <Text style={styles.summaryValue}>
                  {data?.summary?.uniqueCustomerCount || 0}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Revenue Per Customer</Text>
                <Text style={[styles.summaryValue, styles.primaryValue]}>
                  {formatCurrency(data?.summary?.revenuePerCustomer || 0)}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Discount</Text>
                <Text style={[styles.summaryValue, styles.warningValue]}>
                  {formatCurrency(data?.summary?.totalDiscount || 0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Tax</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data?.summary?.totalTax || 0)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Growth Metrics */}
        {data?.growthMetrics && (
          <View style={styles.growthCard}>
            <Text style={styles.sectionTitle}>Growth Metrics</Text>
            <View style={styles.growthGrid}>
              <View style={styles.growthItem}>
                <Text style={styles.growthLabel}>
                  Period Over Period Growth
                </Text>
                <Text
                  style={[
                    styles.growthValue,
                    data.growthMetrics.periodOverPeriodGrowth > 0
                      ? styles.growthPositive
                      : styles.growthNegative,
                  ]}
                >
                  {(data.growthMetrics.periodOverPeriodGrowth * 100).toFixed(1)}
                  %
                </Text>
              </View>
              <View style={styles.growthItem}>
                <Text style={styles.growthLabel}>Average Growth Rate</Text>
                <Text
                  style={[
                    styles.growthValue,
                    data.growthMetrics.averageGrowthRate > 0
                      ? styles.growthPositive
                      : styles.growthNegative,
                  ]}
                >
                  {(data.growthMetrics.averageGrowthRate * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.growthItem}>
                <Text style={styles.growthLabel}>Trend</Text>
                <View style={styles.trendBadge}>
                  <Text
                    style={[
                      styles.trendText,
                      data.growthMetrics.trend === "growing"
                        ? styles.trendGrowing
                        : data.growthMetrics.trend === "declining"
                          ? styles.trendDeclining
                          : styles.trendStable,
                    ]}
                  >
                    {data.growthMetrics.trend?.toUpperCase() || "STABLE"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Time Series */}
        {data?.timeSeries && data.timeSeries.length > 0 && (
          <View style={styles.timeSeriesCard}>
            <Text style={styles.sectionTitle}>Time Series Analysis</Text>
            {data.timeSeries.slice(0, 15).map((item, index) => {
              const date = item._id
                ? `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`
                : "N/A";
              return (
                <View key={index} style={styles.timeSeriesRow}>
                  <Text style={styles.timeSeriesDate}>{date}</Text>
                  <View style={styles.timeSeriesStats}>
                    <Text style={styles.timeSeriesTransactions}>
                      {item.totalTransactions || 0} txns
                    </Text>
                    <Text style={styles.timeSeriesRevenue}>
                      {formatCurrency(item.totalRevenue || 0)}
                    </Text>
                    <Text style={styles.timeSeriesAvg}>
                      Avg: {formatCurrency(item.averageOrderValue || 0)}
                    </Text>
                  </View>
                </View>
              );
            })}
            {data.timeSeries.length > 15 && (
              <Text style={styles.showMoreText}>
                + {data.timeSeries.length - 15} more days
              </Text>
            )}
          </View>
        )}

        {/* Payment Methods */}
        {data?.paymentBreakdown && data.paymentBreakdown.length > 0 && (
          <View style={styles.paymentCard}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            {data.paymentBreakdown.map((method, index) => (
              <View key={index} style={styles.paymentRow}>
                <Text style={styles.paymentMethod}>
                  {method._id || "Unknown"}
                </Text>
                <View style={styles.paymentStats}>
                  <Text style={styles.paymentCount}>
                    {method.count} transactions
                  </Text>
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

        {/* Top Products */}
        {data?.topProducts && data.topProducts.length > 0 && (
          <View style={styles.productsCard}>
            <Text style={styles.sectionTitle}>Top Products</Text>
            {data.topProducts.slice(0, 10).map((product, index) => (
              <View key={index} style={styles.productRow}>
                <Text style={styles.productRank}>#{index + 1}</Text>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {product.productName || "Unknown Product"}
                  </Text>
                  <Text style={styles.productSku}>
                    SKU: {product.sku || "N/A"}
                  </Text>
                  <Text style={styles.productQuantity}>
                    {product.totalQuantity || 0} units sold
                  </Text>
                </View>
                <Text style={styles.productRevenue}>
                  {formatCurrency(product.totalRevenue || 0)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Staff Performance */}
        {data?.staffPerformance && data.staffPerformance.length > 0 && (
          <View style={styles.staffCard}>
            <Text style={styles.sectionTitle}>Staff Performance</Text>
            {data.staffPerformance.slice(0, 5).map((staff, index) => (
              <View key={index} style={styles.staffRow}>
                <Text style={styles.staffRank}>#{index + 1}</Text>
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>
                    {staff.staffName || "Unknown"}
                  </Text>
                  <Text style={styles.staffTransactions}>
                    {staff.transactionCount || 0} transactions
                  </Text>
                  <Text style={styles.staffAvgOrder}>
                    Avg: {formatCurrency(staff.averageOrderValue || 0)}
                  </Text>
                </View>
                <Text style={styles.staffRevenue}>
                  {formatCurrency(staff.totalSales || 0)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Customer Metrics */}
        {data?.customerMetrics && (
          <View style={styles.customerCard}>
            <Text style={styles.sectionTitle}>Customer Metrics</Text>
            <View style={styles.customerGrid}>
              <View style={styles.customerItem}>
                <Text style={styles.customerLabel}>New Customers</Text>
                <Text style={styles.customerValue}>
                  {data.customerMetrics.newCustomers || 0}
                </Text>
              </View>
              <View style={styles.customerItem}>
                <Text style={styles.customerLabel}>Returning Customers</Text>
                <Text style={styles.customerValue}>
                  {data.customerMetrics.returningCustomers || 0}
                </Text>
              </View>
              <View style={styles.customerItem}>
                <Text style={styles.customerLabel}>Retention Rate</Text>
                <Text style={styles.customerValue}>
                  {data.customerMetrics.customerRetentionRate?.toFixed(1) || 0}%
                </Text>
              </View>
              <View style={styles.customerItem}>
                <Text style={styles.customerLabel}>Avg Lifetime Value</Text>
                <Text style={[styles.customerValue, styles.primaryValue]}>
                  {formatCurrency(
                    data.customerMetrics.avgCustomerLifetimeValue || 0,
                  )}
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
                  {groupByOptions.map((option) => (
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

              {/* Sort By */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.filterOptions}>
                  {sortByOptions.map((option) => (
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

              {/* Payment Methods */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Payment Methods</Text>
                <View style={styles.filterOptions}>
                  {paymentMethodOptions.map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.filterOption,
                        filters.paymentMethods.includes(method) &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() => {
                        setFilters((prev) => ({
                          ...prev,
                          paymentMethods: prev.paymentMethods.includes(method)
                            ? prev.paymentMethods.filter((m) => m !== method)
                            : [...prev.paymentMethods, method],
                        }));
                      }}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.paymentMethods.includes(method) &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Amount Range */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Amount Range</Text>
                <View style={styles.amountRange}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={filters.minAmount}
                    onChangeText={(text) =>
                      setFilters((prev) => ({ ...prev, minAmount: text }))
                    }
                  />
                  <Text style={styles.amountRangeSeparator}>to</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={filters.maxAmount}
                    onChangeText={(text) =>
                      setFilters((prev) => ({ ...prev, maxAmount: text }))
                    }
                  />
                </View>
              </View>

              {/* Category */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Category</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter category"
                  value={filters.category}
                  onChangeText={(text) =>
                    setFilters((prev) => ({ ...prev, category: text }))
                  }
                />
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

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={filters.startDate ? new Date(filters.startDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setFilters((prev) => ({
                ...prev,
                startDate: selectedDate.toISOString().split("T")[0],
              }));
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={filters.endDate ? new Date(filters.endDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setFilters((prev) => ({
                ...prev,
                endDate: selectedDate.toISOString().split("T")[0],
              }));
            }
          }}
        />
      )}
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
  customDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  dateInput: {
    flex: 1,
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
  },
  dateInputText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  dateSeparator: {
    fontSize: Typography.sm,
    color: Colors.gray500,
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
  summaryCardFull: {
    width: "100%",
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

  // Growth
  growthCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  growthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  growthItem: {
    width: "33%",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  growthLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    textAlign: "center",
  },
  growthValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    marginTop: 2,
  },
  growthPositive: { color: Colors.success },
  growthNegative: { color: Colors.error },
  trendBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray100,
    marginTop: 2,
  },
  trendText: {
    fontSize: Typography.xs,
    fontWeight: "bold",
  },
  trendGrowing: { color: Colors.success },
  trendDeclining: { color: Colors.error },
  trendStable: { color: Colors.warning },

  // Time Series
  timeSeriesCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  timeSeriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  timeSeriesDate: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    width: 100,
  },
  timeSeriesStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  timeSeriesTransactions: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  timeSeriesRevenue: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },
  timeSeriesAvg: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  showMoreText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: Spacing.sm,
  },

  // Payment Methods
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

  // Products
  productsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  productRank: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray400,
    width: 30,
  },
  productInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  productName: {
    fontSize: Typography.sm,
    color: Colors.gray900,
  },
  productSku: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  productQuantity: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  productRevenue: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },

  // Staff
  staffCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  staffRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  staffRank: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray400,
    width: 30,
  },
  staffInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  staffName: {
    fontSize: Typography.sm,
    color: Colors.gray900,
  },
  staffTransactions: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  staffAvgOrder: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  staffRevenue: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },

  // Customer Metrics
  customerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  customerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  customerItem: {
    width: "50%",
    paddingVertical: Spacing.sm,
  },
  customerLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  customerValue: {
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
  amountRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.sm,
    fontSize: Typography.sm,
  },
  amountRangeSeparator: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  textInput: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.sm,
    fontSize: Typography.sm,
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
