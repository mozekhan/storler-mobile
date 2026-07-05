import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const PaymentCard = ({ payment, onPress, compact = false }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(payment);
    } else {
      router.push(`/payments/${payment._id}`);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      COMPLETED: CheckCircle,
      FAILED: XCircle,
      REFUNDED: XCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: Colors.warning,
      COMPLETED: Colors.success,
      FAILED: Colors.error,
      REFUNDED: Colors.warning,
    };
    return colors[status] || Colors.gray500;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      CASH: '💵',
      CARD: '💳',
      TRANSFER: '🏦',
      MOBILE_MONEY: '📱',
      CREDIT: '💳',
    };
    return icons[method] || '💰';
  };

  const StatusIcon = getStatusIcon(payment.status);
  const statusColor = getStatusColor(payment.status);

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactCard, styles.card]} onPress={handlePress}>
        <View style={styles.compactRow}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactNumber}>{payment.paymentNumber}</Text>
            <Text style={styles.compactMethod}>{getPaymentMethodIcon(payment.method)} {payment.method}</Text>
          </View>
          <Text style={styles.compactAmount}>{formatCurrency(payment.amount)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <CreditCard size={20} color={Colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.number}>{payment.paymentNumber}</Text>
          <Text style={styles.method}>{getPaymentMethodIcon(payment.method)} {payment.method}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <StatusIcon size={12} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>{payment.status}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>{formatCurrency(payment.amount)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reference</Text>
          <Text style={styles.detailValue}>{payment.reference}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Processed By</Text>
          <Text style={styles.detailValue}>
            {payment.processedBy?.firstName} {payment.processedBy?.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(payment.processedAt)}</Text>
        </View>
      </View>

      {payment.change > 0 && (
        <View style={styles.footer}>
          <Text style={styles.changeText}>Change: {formatCurrency(payment.change)}</Text>
        </View>
      )}
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
  compactCard: {
    padding: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: { flex: 1 },
  number: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
  },
  method: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: '500',
  },
  details: {
    gap: Spacing.xs,
    marginLeft: Spacing['2xl'],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  footer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: Typography.sm,
    color: Colors.success,
    fontWeight: '500',
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactInfo: { flex: 1 },
  compactNumber: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  compactMethod: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  compactAmount: {
    fontSize: Typography.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default PaymentCard;