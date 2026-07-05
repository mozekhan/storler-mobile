import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Printer, Share2, Download, X } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { usePrinter } from '../../hooks/usePrinter';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

const PrintPreview = ({ transaction, store, type = 'sales', onClose, onPrint }) => {
  const [loading, setLoading] = useState(false);
  const { printReceipt, isBluetoothAvailable } = usePrinter();

  const generateReceiptHTML = () => {
    const itemsHTML = transaction.items?.map(item => `
      <div class="row item">
        <span>${item.name} x${item.quantity}</span>
        <span>${formatCurrency(item.totalPrice)}</span>
      </div>
    `).join('') || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; background: #fff; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1f2937; }
            .subtitle { font-size: 16px; color: #6b7280; margin-top: 4px; }
            .divider { border-top: 1px dashed #d1d5db; margin: 15px 0; }
            .row { display: flex; justify-content: space-between; padding: 4px 0; }
            .item { padding: 3px 0; }
            .total { font-weight: bold; font-size: 18px; color: #1f2937; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${store?.name || 'Store'}</div>
            <div class="subtitle">${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</div>
          </div>
          <div class="divider"></div>
          <div class="row"><span>Transaction</span><span>${transaction.transactionNumber}</span></div>
          <div class="row"><span>Date</span><span>${formatDateTime(transaction.createdAt)}</span></div>
          <div class="divider"></div>
          ${itemsHTML}
          <div class="divider"></div>
          <div class="row"><span>Subtotal</span><span>${formatCurrency(transaction.subtotal)}</span></div>
          <div class="row"><span>Tax</span><span>${formatCurrency(transaction.taxTotal)}</span></div>
          <div class="row total"><span>Total</span><span>${formatCurrency(transaction.totalAmount)}</span></div>
          <div class="divider"></div>
          <div class="footer">${store?.receiptFooter || 'Thank you for your purchase!'}</div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    setLoading(true);
    try {
      if (isBluetoothAvailable) {
        await printReceipt(transaction, store, type);
        Alert.alert('Success', 'Printing started');
        if (onPrint) onPrint();
      } else {
        const html = generateReceiptHTML();
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Receipt',
        });
        if (onPrint) onPrint();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to print receipt');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const html = generateReceiptHTML();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Receipt',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share receipt');
    }
  };

  const handleDownload = async () => {
    try {
      const html = generateReceiptHTML();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Receipt',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to download receipt');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Receipt Preview</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>{store?.name || 'Store'}</Text>
          <Text style={styles.receiptSubtitle}>{type.charAt(0).toUpperCase() + type.slice(1)} Receipt</Text>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction</Text>
            <Text style={styles.detailValue}>{transaction.transactionNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDateTime(transaction.createdAt)}</Text>
          </View>

          <View style={styles.divider} />

          {transaction.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(transaction.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>{formatCurrency(transaction.taxTotal)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(transaction.totalAmount)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footerText}>{store?.receiptFooter || 'Thank you for your purchase!'}</Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.shareAction]} onPress={handleShare} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} size="small" /> : <Share2 size={18} color={Colors.white} />}
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.downloadAction]} onPress={handleDownload} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} size="small" /> : <Download size={18} color={Colors.white} />}
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.printAction]} onPress={handlePrint} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} size="small" /> : <Printer size={18} color={Colors.white} />}
          <Text style={styles.actionText}>Print</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900 },
  closeButton: { padding: Spacing.sm },
  scrollView: { flex: 1 },
  content: { padding: Spacing.md },
  receiptCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  receiptTitle: { textAlign: 'center', fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  receiptSubtitle: { textAlign: 'center', fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
  divider: { borderTopWidth: 1, borderTopColor: Colors.gray200, marginVertical: Spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.gray50 },
  itemName: { fontSize: Typography.sm, color: Colors.gray900 },
  itemPrice: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  totalLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  totalValue: { fontSize: Typography.sm, color: Colors.gray900 },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  grandTotalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  grandTotalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
  footerText: { textAlign: 'center', fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.md },
  actions: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  shareAction: { backgroundColor: Colors.primary },
  downloadAction: { backgroundColor: Colors.success },
  printAction: { backgroundColor: Colors.warning },
  actionText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.xs },
});

export default PrintPreview;