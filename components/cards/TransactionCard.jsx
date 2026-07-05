import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, User, Calendar, DollarSign } from 'lucide-react-native';
import { formatCurrency, formatDate, getStatusBadgeVariant } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const TransactionCard = ({ transaction, onPress, compact = false }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(transaction);
    } else {
      router.push(`/transactions/${transaction._id}`);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactCard, styles.card]} onPress={handlePress}>
        <View style={styles.compactRow}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactNumber}>{transaction.transactionNumber}</Text>
            <Badge variant={getStatusBadgeVariant(transaction.status)}>
              {transaction.status}
            </Badge>
          </View>
          <Text style={styles.compactAmount}>{formatCurrency(transaction.totalAmount)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.number}>{transaction.transactionNumber}</Text>
        <Badge variant={getStatusBadgeVariant(transaction.status)}>
          {transaction.status}
        </Badge>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <ShoppingBag size={16} color={Colors.gray400} />
          <Text style={styles.detailText}>
            {transaction.items?.length || 0} items
          </Text>
        </View>
        <View style={styles.detailRow}>
          <User size={16} color={Colors.gray400} />
          <Text style={styles.detailText}>
            {transaction.salesAttendantId?.firstName} {transaction.salesAttendantId?.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.gray400} />
          <Text style={styles.detailText}>
            {formatDate(transaction.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(transaction.totalAmount)}</Text>
        </View>
        {transaction.paymentMethod && (
          <Badge variant="info">{transaction.paymentMethod}</Badge>
        )}
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
  compactCard: {
    padding: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  number: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
  },
  details: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginLeft: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginRight: Spacing.sm,
  },
  totalAmount: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compactNumber: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  compactAmount: {
    fontSize: Typography.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default TransactionCard;