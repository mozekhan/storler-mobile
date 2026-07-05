import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye } from 'lucide-react-native';
import { formatDateTime } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const AuditLogCard = ({ log, onPress }) => {
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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getActionIcon(log.action)}</Text>
        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.action}>{log.action}</Text>
            <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
              <Text style={[styles.severityText, { color: severityColor }]}>
                {log.severity}
              </Text>
            </View>
          </View>
          <Text style={styles.user}>
            {log.actorId?.firstName} {log.actorId?.lastName}
          </Text>
          <Text style={styles.meta}>
            {log.resourceType} • {formatDateTime(log.timestamp)}
          </Text>
          {log.details?.metadata?.reason && (
            <Text style={styles.reason}>Reason: {log.details.metadata.reason}</Text>
          )}
        </View>
        <Eye size={18} color={Colors.gray400} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: Typography['2xl'],
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  action: {
    fontSize: Typography.md,
    fontWeight: '500',
    color: Colors.gray900,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  severityText: {
    fontSize: Typography.xs,
    fontWeight: '500',
  },
  user: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  meta: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: Spacing.xs,
  },
  reason: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
});

export default AuditLogCard;