import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Store, MapPin, Phone, Mail, DollarSign, Users, Package, ShoppingBag } from 'lucide-react-native';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const StoreDetailView = ({ store, stats }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Store size={24} color={Colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeCode}>Code: {store.code}</Text>
          </View>
          <Badge variant={store.isActive !== false ? 'success' : 'error'}>
            {store.isActive !== false ? 'Active' : 'Inactive'}
          </Badge>
        </View>
        <Text style={styles.currencyText}>Currency: {store.currency}</Text>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.users || 0}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statCard}>
            <Package size={20} color={Colors.success} />
            <Text style={styles.statValue}>{stats.products || 0}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <ShoppingBag size={20} color={Colors.warning} />
            <Text style={styles.statValue}>{stats.transactions?.total || 0}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign size={20} color={Colors.primary} />
            <Text style={[styles.statValue, styles.revenueValue]}>
              {formatCurrency(stats.revenue?.total || 0)}
            </Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>
      )}

      {/* Address */}
      {store.address && (store.address.street || store.address.city) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.addressContainer}>
            <MapPin size={16} color={Colors.gray500} />
            <Text style={styles.addressText}>
              {[store.address.street, store.address.city, store.address.state, store.address.country].filter(Boolean).join(', ')}
            </Text>
          </View>
        </View>
      )}

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        {store.phone && (
          <View style={styles.contactRow}>
            <Phone size={16} color={Colors.gray500} />
            <Text style={styles.contactText}>{store.phone}</Text>
          </View>
        )}
        {store.email && (
          <View style={styles.contactRow}>
            <Mail size={16} color={Colors.gray500} />
            <Text style={styles.contactText}>{store.email}</Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tax Rate</Text>
          <Text style={styles.detailValue}>{store.taxRate || 0}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Currency</Text>
          <Text style={styles.detailValue}>{store.currency}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timezone</Text>
          <Text style={styles.detailValue}>{store.timezone || 'UTC'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created</Text>
          <Text style={styles.detailValue}>{new Date(store.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Revenue Breakdown */}
      {stats && stats.revenue && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>Today</Text>
            <Text style={styles.revenueValue}>{formatCurrency(stats.revenue.today || 0)}</Text>
          </View>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueLabel}>This Month</Text>
            <Text style={styles.revenueValue}>{formatCurrency(stats.revenue.thisMonth || 0)}</Text>
          </View>
          <View style={[styles.revenueRow, styles.revenueTotal]}>
            <Text style={styles.revenueTotalLabel}>All Time</Text>
            <Text style={styles.revenueTotalValue}>{formatCurrency(stats.revenue.total || 0)}</Text>
          </View>
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
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: { flex: 1 },
  storeName: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  storeCode: { fontSize: Typography.sm, color: Colors.gray500 },
  currencyText: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.xs },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
  statCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  statValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900, marginTop: Spacing.xs },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  revenueValue: { color: Colors.primary },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.sm },
  addressContainer: { flexDirection: 'row', alignItems: 'center' },
  addressText: { fontSize: Typography.sm, color: Colors.gray700, marginLeft: Spacing.sm, flex: 1 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  contactText: { fontSize: Typography.sm, color: Colors.gray700, marginLeft: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  revenueRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  revenueLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  revenueValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  revenueTotal: { borderTopWidth: 2, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  revenueTotalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  revenueTotalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
});

export default StoreDetailView;