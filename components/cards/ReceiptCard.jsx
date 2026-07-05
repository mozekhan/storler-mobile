import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, CheckCircle, Printer } from 'lucide-react-native';
import { formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const ReceiptCard = ({ receipt, onPress, compact = false }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(receipt);
    } else {
      router.push(`/receipts/${receipt._id}`);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      SALES: '📄',
      PAYMENT: '💰',
      INVOICE: '📋',
    };
    return icons[type] || '📄';
  };

  const getTypeColor = (type) => {
    const colors = {
      SALES: Colors.primary,
      PAYMENT: Colors.success,
      INVOICE: Colors.warning,
    };
    return colors[type] || Colors.gray500;
  };

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactCard, styles.card]} onPress={handlePress}>
        <View style={styles.compactRow}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactNumber}>{receipt.receiptNumber}</Text>
            <Text style={styles.compactType}>{getTypeIcon(receipt.type)} {receipt.type}</Text>
          </View>
          <Badge variant={receipt.printed ? 'success' : 'warning'}>
            {receipt.printed ? 'Printed' : 'Not Printed'}
          </Badge>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getTypeColor(receipt.type) + '15' }]}>
          <FileText size={20} color={getTypeColor(receipt.type)} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.number}>{receipt.receiptNumber}</Text>
          <Text style={styles.type}>{getTypeIcon(receipt.type)} {receipt.type}</Text>
        </View>
        <Badge variant={receipt.printed ? 'success' : 'warning'}>
          {receipt.printed ? 'Printed' : 'Not Printed'}
        </Badge>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction</Text>
          <Text style={styles.detailValue}>{receipt.transactionId?.transactionNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Store</Text>
          <Text style={styles.detailValue}>{receipt.storeId?.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(receipt.createdAt)}</Text>
        </View>
        {receipt.printed && receipt.printedAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Printed At</Text>
            <Text style={styles.detailValue}>{formatDate(receipt.printedAt)}</Text>
          </View>
        )}
        {receipt.fileSize && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>File Size</Text>
            <Text style={styles.detailValue}>{(receipt.fileSize / 1024).toFixed(1)} KB</Text>
          </View>
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
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
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
  type: {
    fontSize: Typography.sm,
    color: Colors.gray500,
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
  compactType: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
});

export default ReceiptCard;