import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Clock, ShoppingBag, LogIn, FileText } from 'lucide-react-native';
import AdminService from '../../../../../services/adminService';
import { formatDateTime } from '../../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius } from '../../../../../constants/theme';

export default function UserActivity() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const data = await AdminService.getUserActivity(id, 30);
      setActivity(data?.activities || []);
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
    } finally {
      setLoading(false);
    }
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
    };
    return icons[action] || '📌';
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: Colors.success,
      UPDATE: Colors.primary,
      DELETE: Colors.error,
      LOGIN: Colors.info,
      LOGOUT: Colors.warning,
      PRINT: Colors.primary,
      SCAN: Colors.info,
    };
    return colors[action] || Colors.gray500;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={activity}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.activityItem}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityIcon}>{getActionIcon(item.action)}</Text>
            <Text style={[styles.activityAction, { color: getActionColor(item.action) }]}>
              {item.action}
            </Text>
            <Text style={styles.activityTime}>{formatDateTime(item.timestamp)}</Text>
          </View>
          <View style={styles.activityDetails}>
            <Text style={styles.activityResource}>{item.resourceType}</Text>
            {item.details?.metadata?.reason && (
              <Text style={styles.activityReason}>Reason: {item.details.metadata.reason}</Text>
            )}
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Clock size={48} color={Colors.gray300} />
          <Text style={styles.emptyText}>No activity recorded</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  activityItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  activityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  activityIcon: { fontSize: Typography.lg, marginRight: Spacing.sm },
  activityAction: { fontSize: Typography.sm, fontWeight: '600', flex: 1 },
  activityTime: { fontSize: Typography.xs, color: Colors.gray400 },
  activityDetails: { marginLeft: Spacing['2xl'] },
  activityResource: { fontSize: Typography.sm, color: Colors.gray500 },
  activityReason: { fontSize: Typography.xs, color: Colors.gray500, marginTop: 2 },
  emptyContainer: { paddingVertical: Spacing['4xl'], alignItems: 'center' },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
});