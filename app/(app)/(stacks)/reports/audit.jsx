// app/reports/audit.jsx
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
  Filter,
  X,
  Search,
  Clock,
  Shield,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react-native";
import ReportService from "../../../../services/reportService";
import { formatDate, formatTime } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function AuditReport() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    action: "",
    resourceType: "",
    severity: "",
    search: "",
  });

  const [actionOptions] = useState([
    "CREATE",
    "UPDATE",
    "DELETE",
    "LOGIN",
    "LOGOUT",
    "PRINT",
    "SCAN",
    "APPROVE",
    "REJECT",
  ]);
  const [resourceOptions] = useState([
    "Transaction",
    "Product",
    "User",
    "Payment",
    "Inventory",
    "Store",
  ]);
  const [severityOptions] = useState(["INFO", "WARNING", "CRITICAL"]);

  useEffect(() => {
    const range = ReportService.getDateRangeFromPeriod("30days");
    setFilters((prev) => ({
      ...prev,
      startDate: range.startDate,
      endDate: range.endDate,
    }));
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const reportData = await ReportService.getAuditReport({
        startDate: filters.startDate,
        endDate: filters.endDate,
        action: filters.action || undefined,
        resourceType: filters.resourceType || undefined,
        severity: filters.severity || undefined,
        limit: 20,
      });

      setData(reportData);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load audit report");
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
        startDate: filters.startDate,
        endDate: filters.endDate,
        action: filters.action || undefined,
        resourceType: filters.resourceType || undefined,
        severity: filters.severity || undefined,
      };

      const fileUri = await ReportService.downloadAuditReportPDF(params);
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
    const range = ReportService.getDateRangeFromPeriod("30days");
    setFilters({
      startDate: range.startDate,
      endDate: range.endDate,
      action: "",
      resourceType: "",
      severity: "",
      search: "",
    });
    fetchReport();
  };

  const getFilteredLogs = () => {
    if (!data?.logs) return [];
    let logs = data.logs;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.action?.toLowerCase().includes(searchLower) ||
          log.resourceType?.toLowerCase().includes(searchLower) ||
          log.actorId?.firstName?.toLowerCase().includes(searchLower) ||
          log.actorId?.lastName?.toLowerCase().includes(searchLower),
      );
    }

    return logs;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return Colors.error;
      case "WARNING":
        return Colors.warning;
      case "INFO":
        return Colors.primary;
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

  const filteredLogs = getFilteredLogs();

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeader
        title="Audit Report"
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
          placeholder="Search audit logs..."
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
        {/* Summary Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Audit Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Actions</Text>
              <Text style={styles.statValue}>
                {data?.summary?.totalCount || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Unique Actors</Text>
              <Text style={styles.statValue}>
                {data?.summary?.topActors?.length || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Breakdown */}
        {data?.summary?.actionBreakdown &&
          data.summary.actionBreakdown.length > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.sectionTitle}>Actions by Type</Text>
              {data.summary.actionBreakdown.map((item, index) => (
                <View key={index} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{item._id}</Text>
                  <View style={styles.breakdownBarContainer}>
                    <View
                      style={[
                        styles.breakdownBar,
                        {
                          width: `${(item.count / data.summary.totalCount) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          )}

        {/* Severity Breakdown */}
        {data?.summary?.severityBreakdown &&
          data.summary.severityBreakdown.length > 0 && (
            <View style={styles.severityCard}>
              <Text style={styles.sectionTitle}>Actions by Severity</Text>
              {data.summary.severityBreakdown.map((item, index) => (
                <View key={index} style={styles.severityRow}>
                  <View
                    style={[
                      styles.severityDot,
                      { backgroundColor: getSeverityColor(item._id) },
                    ]}
                  />
                  <Text style={styles.severityLabel}>{item._id}</Text>
                  <Text style={styles.severityCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          )}

        {/* Resource Breakdown */}
        {data?.summary?.resourceBreakdown &&
          data.summary.resourceBreakdown.length > 0 && (
            <View style={styles.resourceCard}>
              <Text style={styles.sectionTitle}>Resources Affected</Text>
              {data.summary.resourceBreakdown.map((item, index) => (
                <View key={index} style={styles.resourceRow}>
                  <Text style={styles.resourceLabel}>{item._id}</Text>
                  <Text style={styles.resourceCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          )}

        {/* Top Actors */}
        {data?.summary?.topActors && data.summary.topActors.length > 0 && (
          <View style={styles.actorsCard}>
            <Text style={styles.sectionTitle}>Top Actors</Text>
            {data.summary.topActors.map((actor, index) => (
              <View key={index} style={styles.actorRow}>
                <View style={styles.actorInfo}>
                  <Text style={styles.actorName}>
                    {actor.actorName || "Unknown"}
                  </Text>
                  <Text style={styles.actorRole}>
                    {actor.actorRole || "N/A"}
                  </Text>
                </View>
                <Text style={styles.actorCount}>
                  {actor.actionCount} actions
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Audit Logs */}
        <View style={styles.logsCard}>
          <Text style={styles.sectionTitle}>
            Audit Logs ({filteredLogs.length})
          </Text>
          {filteredLogs.slice(0, 50).map((log, index) => (
            <View key={index} style={styles.logRow}>
              <View style={styles.logHeader}>
                <View style={styles.logTimestamp}>
                  <Clock size={14} color={Colors.gray500} />
                  <Text style={styles.logDate}>
                    {formatDate(log.timestamp)}
                  </Text>
                  <Text style={styles.logTime}>
                    {formatTime(log.timestamp)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.logSeverity,
                    { backgroundColor: getSeverityColor(log.severity) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.logSeverityText,
                      { color: getSeverityColor(log.severity) },
                    ]}
                  >
                    {log.severity || "INFO"}
                  </Text>
                </View>
              </View>
              <View style={styles.logBody}>
                <View style={styles.logAction}>
                  <Text style={styles.logActionText}>
                    {log.action || "Unknown"}
                  </Text>
                  <Text style={styles.logResource}>
                    {log.resourceType || "Unknown"}
                  </Text>
                </View>
                <Text style={styles.logActor}>
                  {log.actorId?.firstName} {log.actorId?.lastName} (
                  {log.actorId?.role || "Unknown"})
                </Text>
                {log.details?.metadata?.reason && (
                  <Text style={styles.logReason}>
                    Reason: {log.details.metadata.reason}
                  </Text>
                )}
              </View>
            </View>
          ))}
          {filteredLogs.length === 0 && (
            <Text style={styles.noDataText}>No audit logs found</Text>
          )}
          {filteredLogs.length > 50 && (
            <Text style={styles.showMoreText}>
              + {filteredLogs.length - 50} more logs
            </Text>
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
              {/* Action Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Action</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      !filters.action && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, action: "" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        !filters.action && styles.filterOptionTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {actionOptions.map((action) => (
                    <TouchableOpacity
                      key={action}
                      style={[
                        styles.filterOption,
                        filters.action === action && styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, action }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.action === action &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {action}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Resource Type Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Resource Type</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      !filters.resourceType && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, resourceType: "" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        !filters.resourceType && styles.filterOptionTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {resourceOptions.map((resource) => (
                    <TouchableOpacity
                      key={resource}
                      style={[
                        styles.filterOption,
                        filters.resourceType === resource &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          resourceType: resource,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.resourceType === resource &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {resource}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Severity Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Severity</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      !filters.severity && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, severity: "" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        !filters.severity && styles.filterOptionTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {severityOptions.map((severity) => (
                    <TouchableOpacity
                      key={severity}
                      style={[
                        styles.filterOption,
                        filters.severity === severity &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, severity }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.severity === severity &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {severity}
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
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray50,
    justifyContent: "center",
    alignItems: "center",
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
  },
  statItem: {
    flex: 1,
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

  // Breakdowns
  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  breakdownLabel: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    width: 80,
  },
  breakdownBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.sm,
    overflow: "hidden",
  },
  breakdownBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  breakdownCount: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    width: 30,
    textAlign: "right",
  },

  // Severity
  severityCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  severityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  severityLabel: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    flex: 1,
  },
  severityCount: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray900,
  },

  // Resource
  resourceCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  resourceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  resourceLabel: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  resourceCount: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.gray900,
  },

  // Actors
  actorsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  actorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  actorInfo: {
    flex: 1,
  },
  actorName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  actorRole: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  actorCount: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },

  // Logs
  logsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  logRow: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  logTimestamp: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  logDate: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  logTime: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  logSeverity: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  logSeverityText: {
    fontSize: Typography.xs,
    fontWeight: "500",
  },
  logBody: {
    marginLeft: Spacing.sm,
  },
  logAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  logActionText: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  logResource: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  logActor: {
    fontSize: Typography.xs,
    color: Colors.gray600,
    marginTop: 2,
  },
  logReason: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
    fontStyle: "italic",
  },
  noDataText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
    paddingVertical: Spacing.md,
  },
  showMoreText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
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
