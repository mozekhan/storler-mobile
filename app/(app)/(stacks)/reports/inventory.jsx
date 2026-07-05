// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Download, Share2, Package, AlertCircle, CheckCircle } from 'lucide-react-native';
// import ReportService from '../../../services/reportService';
// import { formatCurrency } from '../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';

// export default function InventoryReport() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetchReport();
//   }, []);

//   const fetchReport = async () => {
//     try {
//       const result = await ReportService.getInventoryReport();
//       setData(result);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load inventory report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Inventory Report</Text>
//         <Text style={styles.headerSubtitle}>Current stock overview</Text>
//       </View>

//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         <View style={styles.summaryCard}>
//           <Text style={styles.sectionTitle}>Summary</Text>
//           <View style={styles.summaryGrid}>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Products</Text>
//               <Text style={styles.summaryValue}>
//                 {data?.summary?.totalProducts || 0}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Stock</Text>
//               <Text style={styles.summaryValue}>
//                 {data?.summary?.totalStock || 0}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Value</Text>
//               <Text style={[styles.summaryValue, styles.revenueValue]}>
//                 {formatCurrency(data?.summary?.totalValue || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Low Stock</Text>
//               <Text style={[styles.summaryValue, styles.warningValue]}>
//                 {data?.summary?.lowStock || 0}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Out of Stock</Text>
//               <Text style={[styles.summaryValue, styles.errorValue]}>
//                 {data?.summary?.outOfStock || 0}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.categoryCard}>
//           <Text style={styles.sectionTitle}>Category Breakdown</Text>
//           {Object.entries(data?.categoryBreakdown || {}).map(([category, catData]) => (
//             <View key={category} style={styles.categoryRow}>
//               <View style={styles.categoryInfo}>
//                 <Text style={styles.categoryName}>{category}</Text>
//                 <Text style={styles.categoryCount}>{catData.count || 0} products</Text>
//               </View>
//               <View style={styles.categoryStats}>
//                 <Text style={styles.categoryStock}>{catData.totalStock || 0} units</Text>
//                 <Text style={styles.categoryValue}>
//                   {formatCurrency(catData.totalValue || 0)}
//                 </Text>
//               </View>
//             </View>
//           ))}
//           {(!data?.categoryBreakdown || Object.keys(data.categoryBreakdown).length === 0) && (
//             <Text style={styles.noDataText}>No category data available</Text>
//           )}
//         </View>

//         <View style={styles.statusCard}>
//           <Text style={styles.sectionTitle}>Stock Status</Text>
//           <View style={styles.statusGrid}>
//             <View style={[styles.statusItem, styles.statusInStock]}>
//               <CheckCircle size={24} color={Colors.success} />
//               <Text style={styles.statusLabel}>In Stock</Text>
//               <Text style={styles.statusValue}>
//                 {(data?.summary?.totalProducts || 0) - (data?.summary?.lowStock || 0) - (data?.summary?.outOfStock || 0)}
//               </Text>
//             </View>
//             <View style={[styles.statusItem, styles.statusLowStock]}>
//               <AlertCircle size={24} color={Colors.warning} />
//               <Text style={styles.statusLabel}>Low Stock</Text>
//               <Text style={[styles.statusValue, styles.warningValue]}>
//                 {data?.summary?.lowStock || 0}
//               </Text>
//             </View>
//             <View style={[styles.statusItem, styles.statusOutStock]}>
//               <AlertCircle size={24} color={Colors.error} />
//               <Text style={styles.statusLabel}>Out of Stock</Text>
//               <Text style={[styles.statusValue, styles.errorValue]}>
//                 {data?.summary?.outOfStock || 0}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.inventoryList}>
//           <Text style={styles.sectionTitle}>Inventory Items</Text>
//           {data?.inventory?.slice(0, 20).map((item, index) => (
//             <View key={index} style={styles.inventoryRow}>
//               <View style={styles.inventoryInfo}>
//                 <Text style={styles.inventoryName}>
//                   {item.product?.name || 'Unknown'}
//                 </Text>
//                 <Text style={styles.inventorySku}>
//                   SKU: {item.product?.sku || 'N/A'}
//                 </Text>
//               </View>
//               <View style={styles.inventoryStats}>
//                 <Text style={styles.inventoryQuantity}>{item.quantity || 0}</Text>
//                 <Text style={styles.inventoryValue}>
//                   {formatCurrency(item.value || 0)}
//                 </Text>
//                 <View style={[
//                   styles.inventoryStatus,
//                   item.status === 'OUT_OF_STOCK' && styles.inventoryStatusOut,
//                   item.status === 'LOW_STOCK' && styles.inventoryStatusLow,
//                   item.status === 'IN_STOCK' && styles.inventoryStatusIn,
//                 ]}>
//                   <Text style={[
//                     styles.inventoryStatusText,
//                     item.status === 'OUT_OF_STOCK' && styles.inventoryStatusOutText,
//                     item.status === 'LOW_STOCK' && styles.inventoryStatusLowText,
//                     item.status === 'IN_STOCK' && styles.inventoryStatusInText,
//                   ]}>
//                     {item.status?.replace('_', ' ') || 'Unknown'}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//           {(!data?.inventory || data.inventory.length === 0) && (
//             <Text style={styles.noDataText}>No inventory items available</Text>
//           )}
//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity style={[styles.footerButton, styles.exportButton]}>
//           <Download size={20} color={Colors.gray700} />
//           <Text style={styles.exportButtonText}>Export</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.footerButton, styles.shareButton]}>
//           <Share2 size={20} color={Colors.white} />
//           <Text style={styles.shareButtonText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   headerTitle: {
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   headerSubtitle: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: Spacing.md,
//     paddingBottom: Spacing['3xl'],
//   },
//   summaryCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   sectionTitle: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//     marginBottom: Spacing.md,
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   summaryItem: {
//     width: '50%',
//     marginBottom: Spacing.sm,
//   },
//   summaryLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   summaryValue: {
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   revenueValue: {
//     color: Colors.success,
//   },
//   warningValue: {
//     color: Colors.warning,
//   },
//   errorValue: {
//     color: Colors.error,
//   },
//   categoryCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   categoryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   categoryInfo: {
//     flex: 1,
//   },
//   categoryName: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   categoryCount: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   categoryStats: {
//     alignItems: 'flex-end',
//   },
//   categoryStock: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//   },
//   categoryValue: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   statusCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   statusGrid: {
//     flexDirection: 'row',
//   },
//   statusItem: {
//     flex: 1,
//     alignItems: 'center',
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     marginHorizontal: 2,
//   },
//   statusInStock: {
//     backgroundColor: Colors.success + '10',
//   },
//   statusLowStock: {
//     backgroundColor: Colors.warning + '10',
//   },
//   statusOutStock: {
//     backgroundColor: Colors.error + '10',
//   },
//   statusLabel: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   statusValue: {
//     fontSize: Typography.lg,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   inventoryList: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   inventoryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   inventoryInfo: {
//     flex: 1,
//   },
//   inventoryName: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   inventorySku: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   inventoryStats: {
//     alignItems: 'flex-end',
//   },
//   inventoryQuantity: {
//     fontSize: Typography.md,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   inventoryValue: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   inventoryStatus: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     marginTop: 2,
//   },
//   inventoryStatusText: {
//     fontSize: Typography.xs,
//     fontWeight: '500',
//   },
//   inventoryStatusIn: {
//     backgroundColor: Colors.success + '20',
//   },
//   inventoryStatusInText: {
//     color: Colors.success,
//   },
//   inventoryStatusLow: {
//     backgroundColor: Colors.warning + '20',
//   },
//   inventoryStatusLowText: {
//     color: Colors.warning,
//   },
//   inventoryStatusOut: {
//     backgroundColor: Colors.error + '20',
//   },
//   inventoryStatusOutText: {
//     color: Colors.error,
//   },
//   noDataText: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     textAlign: 'center',
//     paddingVertical: Spacing.md,
//   },
//   footer: {
//     flexDirection: 'row',
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     padding: Spacing.md,
//     gap: Spacing.sm,
//   },
//   footerButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   exportButton: {
//     backgroundColor: Colors.gray200,
//   },
//   exportButtonText: {
//     color: Colors.gray700,
//     fontWeight: '600',
//     marginLeft: Spacing.sm,
//   },
//   shareButton: {
//     backgroundColor: Colors.primary,
//   },
//   shareButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     marginLeft: Spacing.sm,
//   },
// });























import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Download, Share2, Package, AlertCircle, CheckCircle } from 'lucide-react-native';
import ReportService from '../../../../services/reportService';
import { formatCurrency } from '../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';

export default function InventoryReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const result = await ReportService.getInventoryReport();
      setData(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to load inventory report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Report</Text>
        <Text style={styles.headerSubtitle}>Current stock overview</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Products</Text>
              <Text style={styles.summaryValue}>{data?.summary?.totalProducts || 0}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Stock</Text>
              <Text style={styles.summaryValue}>{data?.summary?.totalStock || 0}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Value</Text>
              <Text style={[styles.summaryValue, styles.revenueValue]}>
                {formatCurrency(data?.summary?.totalValue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Low Stock</Text>
              <Text style={[styles.summaryValue, styles.warningValue]}>
                {data?.summary?.lowStock || 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Out of Stock</Text>
              <Text style={[styles.summaryValue, styles.errorValue]}>
                {data?.summary?.outOfStock || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {Object.entries(data?.categoryBreakdown || {}).map(([category, catData]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryCount}>{catData.count || 0} products</Text>
              </View>
              <View style={styles.categoryStats}>
                <Text style={styles.categoryStock}>{catData.totalStock || 0} units</Text>
                <Text style={styles.categoryValue}>{formatCurrency(catData.totalValue || 0)}</Text>
              </View>
            </View>
          ))}
          {(!data?.categoryBreakdown || Object.keys(data.categoryBreakdown).length === 0) && (
            <Text style={styles.noDataText}>No category data available</Text>
          )}
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Stock Status</Text>
          <View style={styles.statusGrid}>
            <View style={[styles.statusItem, styles.statusInStock]}>
              <CheckCircle size={24} color={Colors.success} />
              <Text style={styles.statusLabel}>In Stock</Text>
              <Text style={styles.statusValue}>
                {(data?.summary?.totalProducts || 0) - (data?.summary?.lowStock || 0) - (data?.summary?.outOfStock || 0)}
              </Text>
            </View>
            <View style={[styles.statusItem, styles.statusLowStock]}>
              <AlertCircle size={24} color={Colors.warning} />
              <Text style={styles.statusLabel}>Low Stock</Text>
              <Text style={[styles.statusValue, styles.warningValue]}>
                {data?.summary?.lowStock || 0}
              </Text>
            </View>
            <View style={[styles.statusItem, styles.statusOutStock]}>
              <AlertCircle size={24} color={Colors.error} />
              <Text style={styles.statusLabel}>Out of Stock</Text>
              <Text style={[styles.statusValue, styles.errorValue]}>
                {data?.summary?.outOfStock || 0}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.exportButton]}>
          <Download size={20} color={Colors.gray700} />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton, styles.shareButton]}>
          <Share2 size={20} color={Colors.white} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: Colors.white, padding: Spacing.md, ...Shadows.sm },
  headerTitle: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing['3xl'] },
  summaryCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  summaryItem: { width: '50%', marginBottom: Spacing.sm },
  summaryLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  summaryValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  revenueValue: { color: Colors.success },
  warningValue: { color: Colors.warning },
  errorValue: { color: Colors.error },
  categoryCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  categoryCount: { fontSize: Typography.xs, color: Colors.gray500 },
  categoryStats: { alignItems: 'flex-end' },
  categoryStock: { fontSize: Typography.sm, color: Colors.gray700 },
  categoryValue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.primary },
  statusCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  statusGrid: { flexDirection: 'row' },
  statusItem: { flex: 1, alignItems: 'center', padding: Spacing.sm, borderRadius: BorderRadius.lg, marginHorizontal: 2 },
  statusInStock: { backgroundColor: Colors.success + '10' },
  statusLowStock: { backgroundColor: Colors.warning + '10' },
  statusOutStock: { backgroundColor: Colors.error + '10' },
  statusLabel: { fontSize: Typography.xs, color: Colors.gray500, marginTop: 2 },
  statusValue: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  noDataText: { fontSize: Typography.sm, color: Colors.gray500, textAlign: 'center', paddingVertical: Spacing.md },
  footer: { flexDirection: 'row', backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200, padding: Spacing.md, gap: Spacing.sm },
  footerButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  exportButton: { backgroundColor: Colors.gray200 },
  exportButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  shareButton: { backgroundColor: Colors.primary },
  shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
});