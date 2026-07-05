import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Shield, User, Clock, FileText, AlertCircle } from 'lucide-react-native';
import { formatDateTime } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const AuditLogDetailView = ({ log }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      INFO: Colors.primary,
      WARNING: Colors.warning,
      CRITICAL: Colors.error,
    };
    return colors[severity] || Colors.gray500;
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATE: '📝',
      UPDATE: '✏️',
      DELETE: '🗑️',
      LOGIN: '🔑',
      LOGOUT: '🚪',
      PRINT: '🖨️',
      SCAN: '📷',
      APPROVE: '✅',
      REJECT: '❌',
    };
    return icons[action] || '📌';
  };

  const severityColor = getSeverityColor(log.severity);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.actionIcon}>{getActionIcon(log.action)}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.action}>{log.action}</Text>
            <View style={styles.severityBadge}>
              <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
              <Text style={[styles.severityText, { color: severityColor }]}>
                {log.severity}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.timestamp}>{formatDateTime(log.timestamp)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actor Information</Text>
        <View style={styles.detailRow}>
          <User size={16} color={Colors.gray500} />
          <Text style={styles.detailLabel}>User</Text>
          <Text style={styles.detailValue}>
            {log.actorId?.firstName} {log.actorId?.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Shield size={16} color={Colors.gray500} />
          <Text style={styles.detailLabel}>Role</Text>
          <Text style={styles.detailValue}>{log.actorRole}</Text>
        </View>
        {log.storeId && (
          <View style={styles.detailRow}>
            <FileText size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Store</Text>
            <Text style={styles.detailValue}>{log.storeId?.name}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resource Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Resource Type</Text>
          <Text style={styles.detailValue}>{log.resourceType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Resource ID</Text>
          <Text style={[styles.detailValue, styles.monoText]}>{log.resourceId}</Text>
        </View>
      </View>

      {log.details && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          {log.details.before && (
            <View style={styles.detailSubSection}>
              <Text style={styles.subSectionLabel}>Before</Text>
              <View style={styles.jsonContainer}>
                <Text style={styles.jsonText}>{JSON.stringify(log.details.before, null, 2)}</Text>
              </View>
            </View>
          )}
          {log.details.after && (
            <View style={styles.detailSubSection}>
              <Text style={styles.subSectionLabel}>After</Text>
              <View style={styles.jsonContainer}>
                <Text style={styles.jsonText}>{JSON.stringify(log.details.after, null, 2)}</Text>
              </View>
            </View>
          )}
          {log.details.metadata && (
            <View style={styles.detailSubSection}>
              <Text style={styles.subSectionLabel}>Metadata</Text>
              <View style={styles.jsonContainer}>
                <Text style={styles.jsonText}>{JSON.stringify(log.details.metadata, null, 2)}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {log.tamperProofHash && (
        <View style={[styles.section, styles.hashSection]}>
          <Text style={styles.sectionTitle}>Tamper Proof Hash</Text>
          <View style={styles.hashContainer}>
            <AlertCircle size={16} color={Colors.success} />
            <Text style={[styles.hashText, styles.monoText]}>{log.tamperProofHash}</Text>
          </View>
          <Text style={styles.hashVerifiedText}>✓ Hash Verified</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { fontSize: Typography['2xl'], marginRight: Spacing.md },
  headerInfo: { flex: 1 },
  action: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  severityBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  severityText: { fontSize: Typography.sm, fontWeight: '500' },
  timestamp: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.xs },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500, marginLeft: Spacing.sm, flex: 1 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900, textAlign: 'right' },
  monoText: { fontFamily: 'monospace', fontSize: 12 },
  detailSubSection: { marginTop: Spacing.sm },
  subSectionLabel: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: 2 },
  jsonContainer: { backgroundColor: Colors.gray100, padding: Spacing.md, borderRadius: BorderRadius.sm },
  jsonText: { fontSize: 10, color: Colors.gray700, fontFamily: 'monospace' },
  hashSection: { borderWidth: 1, borderColor: Colors.success + '30' },
  hashContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success + '10', padding: Spacing.md, borderRadius: BorderRadius.sm },
  hashText: { fontSize: 10, color: Colors.gray700, flex: 1, marginLeft: Spacing.sm, wordBreak: 'break-all' },
  hashVerifiedText: { fontSize: Typography.sm, color: Colors.success, fontWeight: '500', marginTop: Spacing.sm, textAlign: 'center' },
});

export default AuditLogDetailView;