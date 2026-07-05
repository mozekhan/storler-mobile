import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Check, X, Clock, AlertCircle, ShoppingBag, Package, CreditCard } from 'lucide-react-native';
import NotificationService from '../../../../services/notificationService';
import { formatTimeAgo } from '../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';

export default function Notifications() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async (page = 1) => {
    try {
      const result = await NotificationService.getNotifications({
        page,
        limit: 20,
      });
      setNotifications(result.notifications || []);
      setPagination(result.pagination || {});
    } catch (error) {
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const result = await NotificationService.getUnreadCount();
      setUnreadCount(result.count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(1);
    fetchUnreadCount();
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.deleteNotification(notificationId);
              setNotifications(prev =>
                prev.filter(n => n._id !== notificationId)
              );
              if (!notifications.find(n => n._id === notificationId)?.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      TRANSACTION: ShoppingBag,
      INVENTORY: Package,
      PAYMENT: CreditCard,
      SYSTEM: Bell,
      REPORT: AlertCircle,
    };
    return icons[type] || Bell;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: Colors.gray500,
      MEDIUM: Colors.primary,
      HIGH: Colors.warning,
      URGENT: Colors.error,
    };
    return colors[priority] || Colors.gray500;
  };

  const renderNotification = ({ item }) => {
    const Icon = getTypeIcon(item.type);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unread]}
        onPress={() => {
          if (!item.read) {
            handleMarkAsRead(item._id);
          }
        }}
      >
        <View style={styles.notificationRow}>
          <View style={[styles.iconContainer, { backgroundColor: priorityColor + '15' }]}>
            <Icon size={20} color={priorityColor} />
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <View style={styles.notificationFooter}>
              <Text style={styles.notificationTime}>
                {formatTimeAgo(item.createdAt)}
              </Text>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {item.priority}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item._id)}
          >
            <X size={16} color={Colors.gray400} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Check size={16} color={Colors.primary} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotification}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Bell size={48} color={Colors.gray300} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  unreadCountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    marginLeft: Spacing.sm,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCountText: { color: Colors.white, fontSize: Typography.xs, fontWeight: 'bold' },
  markAllButton: { flexDirection: 'row', alignItems: 'center' },
  markAllText: { color: Colors.primary, fontSize: Typography.sm, fontWeight: '500', marginLeft: Spacing.xs },
  list: { flex: 1 },
  listContent: { padding: Spacing.md },
  notificationItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notificationRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: { flex: 1 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center' },
  notificationTitle: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, flex: 1 },
  unreadTitle: { color: Colors.gray900, fontWeight: '600' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.xs,
  },
  notificationMessage: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2, lineHeight: 20 },
  notificationFooter: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  notificationTime: { fontSize: Typography.xs, color: Colors.gray400 },
  priorityBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 1, borderRadius: BorderRadius.sm, marginLeft: Spacing.sm },
  priorityText: { fontSize: Typography.xs, fontWeight: '500' },
  deleteButton: { padding: Spacing.sm },
  emptyContainer: { paddingVertical: Spacing['4xl'], alignItems: 'center' },
  emptyTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginTop: Spacing.md },
  emptyText: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.xs },
});