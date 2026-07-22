// app/reports/user-performance.jsx
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
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Star,
  Award,
  Clock,
  Calendar,
  ChevronRight,
  Package,
} from "lucide-react-native";
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

export default function UserPerformanceReport() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [period, setPeriod] = useState("30days");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("sales");
  const [sortOrder, setSortOrder] = useState("desc");
  const [roleFilter, setRoleFilter] = useState("");
  const [roles, setRoles] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    storeId: "",
    role: "",
  });

  useEffect(() => {
    fetchReport();
  }, [period, filters.startDate, filters.endDate, sortBy, sortOrder]);

  const fetchReport = async () => {
    try {
      setLoading(true);

      let startDate = filters.startDate;
      let endDate = filters.endDate;

      if (!startDate || !endDate) {
        const range = ReportService.getDateRangeFromPeriod(period);
        startDate = range.startDate;
        endDate = range.endDate;
      }

      const reportData = await ReportService.getUserPerformanceReport({
        startDate,
        endDate,
        storeId: filters.storeId || undefined,
      });

      setData(reportData);

      if (Array.isArray(reportData)) {
        const uniqueRoles = [
          ...new Set(reportData.map((s) => s.user?.role).filter(Boolean)),
        ];
        setRoles(uniqueRoles);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error("User Performance Error:", error);

      if (error.response) {
        console.log(
          "Backend Error:",
          JSON.stringify(error.response.data, null, 2),
        );
      }

      Alert.alert(
        "Error",
        error.message || "Failed to load staff performance report",
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
      };

      const fileUri = await ReportService.downloadUserPerformancePDF(params);
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
      role: "",
    });
    setPeriod("30days");
    setRoleFilter("");
    setSortBy("sales");
    setSortOrder("desc");
    fetchReport();
  };

  const getFilteredAndSortedStaff = () => {
    if (!data) return [];

    let staff = [...data];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      staff = staff.filter(
        (s) =>
          s.user?.firstName?.toLowerCase().includes(query) ||
          s.user?.lastName?.toLowerCase().includes(query) ||
          s.user?.email?.toLowerCase().includes(query),
      );
    }

    // Filter by role
    if (roleFilter) {
      staff = staff.filter((s) => s.user?.role === roleFilter);
    }

    // Sort
    staff.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "sales":
          aVal = a.totalSales || 0;
          bVal = b.totalSales || 0;
          break;
        case "transactions":
          aVal = a.transactionCount || 0;
          bVal = b.transactionCount || 0;
          break;
        case "avgOrder":
          aVal = a.averageOrderValue || 0;
          bVal = b.averageOrderValue || 0;
          break;
        case "items":
          aVal = a.totalItems || 0;
          bVal = b.totalItems || 0;
          break;
        default:
          aVal = a.totalSales || 0;
          bVal = b.totalSales || 0;
      }
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    return staff;
  };

  const getPerformanceLevel = (sales, maxSales) => {
    const percentage = maxSales > 0 ? (sales / maxSales) * 100 : 0;
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

  const getRoleIcon = (role) => {
    switch (role) {
      case "SALES_MANAGER":
        return <Star size={16} color={Colors.primary} />;
      case "SALES_ATTENDANT":
        return <Users size={16} color={Colors.primary} />;
      case "FINANCE_MANAGER":
        return <DollarSign size={16} color={Colors.primary} />;
      case "FINANCE_CASHIER":
        return <DollarSign size={16} color={Colors.primary} />;
      case "WAREHOUSE_MANAGER":
        return <Package size={16} color={Colors.primary} />;
      case "WAREHOUSE_STAFF":
        return <Package size={16} color={Colors.primary} />;
      default:
        return <Users size={16} color={Colors.primary} />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const staff = getFilteredAndSortedStaff();
  const maxSales =
    staff.length > 0 ? Math.max(...staff.map((s) => s.totalSales || 0)) : 0;

  return (
    <View style={styles.container}>
      {/* Header */}

      <CustomHeader
        title="Staff Performance"
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
          placeholder="Search staff..."
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
            <Text style={styles.sectionTitle}>Team Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Staff</Text>
                <Text style={styles.statValue}>{data.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Sales</Text>
                <Text style={[styles.statValue, styles.revenueValue]}>
                  {formatCurrency(
                    data.reduce((sum, s) => sum + (s.totalSales || 0), 0),
                  )}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Transactions</Text>
                <Text style={styles.statValue}>
                  {formatNumber(
                    data.reduce((sum, s) => sum + (s.transactionCount || 0), 0),
                  )}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Order Value</Text>
                <Text style={[styles.statValue, styles.primaryValue]}>
                  {formatCurrency(
                    data.reduce(
                      (sum, s) => sum + (s.averageOrderValue || 0),
                      0,
                    ) / (data.length || 1),
                  )}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Role Filter Chips */}
        {roles.length > 0 && (
          <View style={styles.roleChips}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.roleChip, !roleFilter && styles.roleChipActive]}
                onPress={() => setRoleFilter("")}
              >
                <Text
                  style={[
                    styles.roleChipText,
                    !roleFilter && styles.roleChipTextActive,
                  ]}
                >
                  All Roles
                </Text>
              </TouchableOpacity>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleChip,
                    roleFilter === role && styles.roleChipActive,
                  ]}
                  onPress={() => setRoleFilter(role === roleFilter ? "" : role)}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      roleFilter === role && styles.roleChipTextActive,
                    ]}
                  >
                    {role.replace("_", " ")}
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
              { label: "Sales", value: "sales" },
              { label: "Transactions", value: "transactions" },
              { label: "Avg Order", value: "avgOrder" },
              { label: "Items Sold", value: "items" },
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

        {/* Staff List */}
        <View style={styles.staffList}>
          <Text style={styles.sectionTitle}>Staff ({staff.length})</Text>
          {staff.map((staffMember, index) => {
            const performanceLevel = getPerformanceLevel(
              staffMember.totalSales || 0,
              maxSales,
            );
            const performanceColor = getPerformanceColor(performanceLevel);
            const isTopPerformer = index === 0 && staff.length > 1;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.staffCard,
                  isTopPerformer && styles.staffCardTop,
                ]}
                // onPress={() =>
                //   router.push(
                //     `/reports/staff-detail?id=${staffMember.user?._id}`,
                //   )
                // }
                activeOpacity={0.7}
              >
                {isTopPerformer && (
                  <View style={styles.topPerformerBadge}>
                    <Award size={16} color={Colors.white} />
                    <Text style={styles.topPerformerText}>Top Performer</Text>
                  </View>
                )}

                <View style={styles.staffHeader}>
                  <View style={styles.staffRank}>
                    <Text style={styles.staffRankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.staffAvatar}>
                    <Text style={styles.staffAvatarText}>
                      {staffMember.user?.firstName?.charAt(0) || "?"}
                      {staffMember.user?.lastName?.charAt(0) || ""}
                    </Text>
                  </View>
                  <View style={styles.staffInfo}>
                    <View style={styles.staffNameRow}>
                      <Text style={styles.staffName}>
                        {staffMember.user?.firstName}{" "}
                        {staffMember.user?.lastName}
                      </Text>
                      {getRoleIcon(staffMember.user?.role)}
                    </View>
                    <Text style={styles.staffRole}>
                      {staffMember.user?.role?.replace("_", " ") ||
                        "Unknown Role"}
                    </Text>
                    <Text style={styles.staffEmail}>
                      {staffMember.user?.email || "No email"}
                    </Text>
                  </View>
                  <View style={styles.staffPerformance}>
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

                <View style={styles.staffMetrics}>
                  <View style={styles.metricItem}>
                    <DollarSign size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Sales</Text>
                    <Text style={[styles.metricValue, styles.revenueValue]}>
                      {formatCurrency(staffMember.totalSales || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <BarChart3 size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Transactions</Text>
                    <Text style={styles.metricValue}>
                      {formatNumber(staffMember.transactionCount || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <TrendingUp size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Avg Order</Text>
                    <Text style={[styles.metricValue, styles.primaryValue]}>
                      {formatCurrency(staffMember.averageOrderValue || 0)}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Package size={14} color={Colors.gray500} />
                    <Text style={styles.metricLabel}>Items</Text>
                    <Text style={styles.metricValue}>
                      {formatNumber(staffMember.totalItems || 0)}
                    </Text>
                  </View>
                </View>

                <View style={styles.staffDetails}>
                  <View style={styles.detailItem}>
                    <Clock size={12} color={Colors.gray400} />
                    <Text style={styles.detailText}>
                      Items/Transaction:{" "}
                      {(staffMember.itemsPerTransaction || 0).toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Users size={12} color={Colors.gray400} />
                    <Text style={styles.detailText}>
                      Unique Customers: {staffMember.uniqueCustomerCount || 0}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <TrendingUp size={12} color={Colors.gray400} />
                    <Text style={styles.detailText}>
                      Max: {formatCurrency(staffMember.maxTransaction || 0)}
                    </Text>
                  </View>
                </View>

                <View style={styles.salesBar}>
                  <View
                    style={[
                      styles.salesFill,
                      {
                        width: `${maxSales > 0 ? ((staffMember.totalSales || 0) / maxSales) * 100 : 0}%`,
                        backgroundColor: performanceColor,
                      },
                    ]}
                  />
                </View>

                <ChevronRight
                  size={16}
                  color={Colors.gray400}
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            );
          })}
          {staff.length === 0 && (
            <View style={styles.emptyState}>
              <Users size={48} color={Colors.gray300} />
              <Text style={styles.emptyStateTitle}>No Staff Found</Text>
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
              {/* Role Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Role</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      !filters.role && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, role: "" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        !filters.role && styles.filterOptionTextActive,
                      ]}
                    >
                      All Roles
                    </Text>
                  </TouchableOpacity>
                  {roles.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.filterOption,
                        filters.role === role && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilters((prev) => ({ ...prev, role }))}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.role === role &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {role.replace("_", " ")}
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

  // Role Chips
  roleChips: {
    marginBottom: Spacing.md,
  },
  roleChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.sm,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
  },
  roleChipText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  roleChipTextActive: {
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

  // Staff List
  staffList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  staffCard: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
    position: "relative",
  },
  staffCardTop: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  topPerformerBadge: {
    position: "absolute",
    top: -1,
    right: -1,
    backgroundColor: Colors.success,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderTopRightRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  topPerformerText: {
    fontSize: Typography.xs,
    color: Colors.white,
    fontWeight: "600",
    marginLeft: 2,
  },
  staffHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  staffRank: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  staffRankText: {
    fontSize: Typography.xs,
    fontWeight: "bold",
    color: Colors.gray600,
  },
  staffAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  staffAvatarText: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.white,
  },
  staffInfo: {
    flex: 1,
  },
  staffNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  staffName: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  staffRole: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  staffEmail: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  staffPerformance: {
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
  staffMetrics: {
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
  staffDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: Spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  salesBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  salesFill: {
    height: "100%",
    borderRadius: BorderRadius.sm,
  },
  chevronIcon: {
    position: "absolute",
    right: Spacing.sm,
    top: Spacing.sm,
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
