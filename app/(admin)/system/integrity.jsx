import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react-native";
import AdminService from "../../../services/adminService";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";

export default function SystemIntegrity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runVerification = async () => {
    setLoading(true);
    try {
      const data = await AdminService.verifySystemIntegrity();
      setResults(data);
    } catch (error) {
      Alert.alert("Error", "Failed to verify system integrity");
    } finally {
      setLoading(false);
    }
  };

  const IntegritySection = ({ title, data }) => {
    if (!data) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {data.valid ? (
            <CheckCircle size={20} color={Colors.success} />
          ) : (
            <XCircle size={20} color={Colors.error} />
          )}
        </View>
        <View style={styles.sectionStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Checked</Text>
            <Text style={styles.statValue}>{data.checked || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Issues Found</Text>
            <Text
              style={[
                styles.statValue,
                data.corrupted > 0 && styles.errorValue,
              ]}
            >
              {data.corrupted || 0}
            </Text>
          </View>
        </View>
        {data.details && data.details.length > 0 && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Details:</Text>
            {data.details.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.detailItem}>
                <AlertCircle size={14} color={Colors.warning} />
                <Text style={styles.detailText}>{JSON.stringify(item)}</Text>
              </View>
            ))}
            {data.details.length > 5 && (
              <Text style={styles.moreText}>
                + {data.details.length - 5} more issues
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Shield size={32} color={Colors.primary} />
        <Text style={styles.headerTitle}>System Integrity</Text>
        <Text style={styles.headerSubtitle}>
          Verify the integrity of your system data
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, loading && styles.buttonDisabled]}
        onPress={runVerification}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <RefreshCw size={20} color={Colors.white} />
            <Text style={styles.verifyButtonText}>Run Verification</Text>
          </>
        )}
      </TouchableOpacity>

      {results && (
        <View style={styles.resultsContainer}>
          <View style={styles.overallStatus}>
            <View style={styles.statusIcon}>
              {results.auditLogs?.valid &&
              results.transactions?.orphanedTransactions === 0 &&
              results.inventory?.negativeInventory === 0 ? (
                <CheckCircle size={48} color={Colors.success} />
              ) : (
                <XCircle size={48} color={Colors.error} />
              )}
            </View>
            <Text style={styles.statusTitle}>
              {results.auditLogs?.valid &&
              results.transactions?.orphanedTransactions === 0 &&
              results.inventory?.negativeInventory === 0
                ? "System is Healthy"
                : "Issues Found"}
            </Text>
            <Text style={styles.statusSubtitle}>
              {new Date(results.timestamp).toLocaleString()}
            </Text>
          </View>

          <IntegritySection title="Audit Logs" data={results.auditLogs} />
          <IntegritySection title="Transactions" data={results.transactions} />
          <IntegritySection title="Inventory" data={results.inventory} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },
  header: { alignItems: "center", marginBottom: Spacing["2xl"] },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.sm,
  },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
  verifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing["2xl"],
  },
  verifyButtonText: {
    color: Colors.white,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  buttonDisabled: { opacity: 0.7 },
  resultsContainer: { gap: Spacing.md },
  overallStatus: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    ...Shadows.sm,
  },
  statusIcon: { marginBottom: Spacing.sm },
  statusTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  statusSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  sectionStats: { flexDirection: "row", gap: Spacing["2xl"] },
  statItem: { flex: 1 },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  errorValue: { color: Colors.error },
  detailsContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  detailsTitle: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  detailText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  moreText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
});
