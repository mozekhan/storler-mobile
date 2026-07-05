// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Download, Share2, Calendar, TrendingUp } from 'lucide-react-native';
// import ReportService from '../../../services/reportService';
// import { formatCurrency, formatDate } from '../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';

// const { width } = Dimensions.get('window');

// export default function SalesReport() {
//   const router = useRouter();
//   const { startDate, endDate } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const [period, setPeriod] = useState('30days');

//   useEffect(() => {
//     fetchReport();
//   }, [period]);

//   const fetchReport = async () => {
//     try {
//       const now = new Date();
//       let start = new Date();
//       const end = now.toISOString().split('T')[0];

//       if (startDate && endDate) {
//         start = new Date(startDate);
//       } else {
//         switch (period) {
//           case '7days':
//             start.setDate(now.getDate() - 7);
//             break;
//           case '30days':
//             start.setDate(now.getDate() - 30);
//             break;
//           case '90days':
//             start.setDate(now.getDate() - 90);
//             break;
//           default:
//             start.setDate(now.getDate() - 30);
//         }
//       }

//       const result = await ReportService.getSalesReport(
//         start.toISOString().split('T')[0],
//         end
//       );
//       setData(result);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load sales report');
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
//         <Text style={styles.headerTitle}>Sales Report</Text>
//         <View style={styles.periodContainer}>
//           {['7days', '30days', '90days'].map((p) => (
//             <TouchableOpacity
//               key={p}
//               style={[styles.periodChip, period === p && styles.periodChipActive]}
//               onPress={() => setPeriod(p)}
//             >
//               <Text style={[styles.periodChipText, period === p && styles.periodChipTextActive]}>
//                 {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : '90 Days'}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         <View style={styles.summaryCard}>
//           <Text style={styles.sectionTitle}>Summary</Text>
//           <View style={styles.summaryGrid}>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Revenue</Text>
//               <Text style={[styles.summaryValue, styles.revenueValue]}>
//                 {formatCurrency(data?.summary?.totalRevenue || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Transactions</Text>
//               <Text style={styles.summaryValue}>
//                 {data?.summary?.totalTransactions || 0}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Avg. Order Value</Text>
//               <Text style={[styles.summaryValue, styles.primaryValue]}>
//                 {formatCurrency(data?.summary?.averageOrderValue || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Items</Text>
//               <Text style={styles.summaryValue}>
//                 {data?.summary?.totalItems || 0}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.paymentCard}>
//           <Text style={styles.sectionTitle}>Payment Methods</Text>
//           {data?.paymentBreakdown?.map((method, index) => (
//             <View key={index} style={styles.paymentRow}>
//               <Text style={styles.paymentMethod}>{method._id || 'Unknown'}</Text>
//               <View style={styles.paymentStats}>
//                 <Text style={styles.paymentCount}>{method.count} transactions</Text>
//                 <Text style={styles.paymentAmount}>
//                   {formatCurrency(method.totalAmount || 0)}
//                 </Text>
//               </View>
//             </View>
//           ))}
//           {(!data?.paymentBreakdown || data.paymentBreakdown.length === 0) && (
//             <Text style={styles.noDataText}>No payment data available</Text>
//           )}
//         </View>

//         <View style={styles.productsCard}>
//           <Text style={styles.sectionTitle}>Top Products</Text>
//           {data?.productPerformance?.slice(0, 10).map((product, index) => (
//             <View key={index} style={styles.productRow}>
//               <Text style={styles.productRank}>#{index + 1}</Text>
//               <View style={styles.productInfo}>
//                 <Text style={styles.productName}>
//                   {product.product?.name || 'Unknown Product'}
//                 </Text>
//                 <Text style={styles.productQuantity}>
//                   {product.totalQuantity || 0} units sold
//                 </Text>
//               </View>
//               <Text style={styles.productRevenue}>
//                 {formatCurrency(product.totalRevenue || 0)}
//               </Text>
//             </View>
//           ))}
//           {(!data?.productPerformance || data.productPerformance.length === 0) && (
//             <Text style={styles.noDataText}>No product data available</Text>
//           )}
//         </View>

//         <View style={styles.staffCard}>
//           <Text style={styles.sectionTitle}>Staff Performance</Text>
//           {data?.staffPerformance?.slice(0, 5).map((staff, index) => (
//             <View key={index} style={styles.staffRow}>
//               <Text style={styles.staffRank}>#{index + 1}</Text>
//               <View style={styles.staffInfo}>
//                 <Text style={styles.staffName}>
//                   {staff.staff?.firstName} {staff.staff?.lastName || 'Unknown'}
//                 </Text>
//                 <Text style={styles.staffTransactions}>
//                   {staff.totalTransactions || 0} transactions
//                 </Text>
//               </View>
//               <Text style={styles.staffRevenue}>
//                 {formatCurrency(staff.totalSales || 0)}
//               </Text>
//             </View>
//           ))}
//           {(!data?.staffPerformance || data.staffPerformance.length === 0) && (
//             <Text style={styles.noDataText}>No staff data available</Text>
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
//   periodContainer: {
//     flexDirection: 'row',
//     marginTop: Spacing.sm,
//   },
//   periodChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.gray200,
//     marginRight: Spacing.sm,
//   },
//   periodChipActive: {
//     backgroundColor: Colors.primary,
//   },
//   periodChipText: {
//     fontSize: Typography.xs,
//     color: Colors.gray700,
//   },
//   periodChipTextActive: {
//     color: Colors.white,
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
//   primaryValue: {
//     color: Colors.primary,
//   },
//   paymentCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   paymentMethod: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//     flex: 1,
//   },
//   paymentStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   paymentCount: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginRight: Spacing.sm,
//   },
//   paymentAmount: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   productsCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   productRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   productRank: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.gray400,
//     width: 30,
//   },
//   productInfo: {
//     flex: 1,
//     marginLeft: Spacing.sm,
//   },
//   productName: {
//     fontSize: Typography.sm,
//     color: Colors.gray900,
//   },
//   productQuantity: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   productRevenue: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   staffCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   staffRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   staffRank: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.gray400,
//     width: 30,
//   },
//   staffInfo: {
//     flex: 1,
//     marginLeft: Spacing.sm,
//   },
//   staffName: {
//     fontSize: Typography.sm,
//     color: Colors.gray900,
//   },
//   staffTransactions: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   staffRevenue: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.primary,
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
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Download, Share2, Calendar, TrendingUp } from 'lucide-react-native';
import ReportService from '../../../../services/reportService';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';

const { width } = Dimensions.get('window');

export default function SalesReport() {
  const router = useRouter();
  const { startDate, endDate } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('30days');

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    try {
      const now = new Date();
      let start = new Date();
      const end = now.toISOString().split('T')[0];

      if (startDate && endDate) {
        start = new Date(startDate);
      } else {
        switch (period) {
          case '7days':
            start.setDate(now.getDate() - 7);
            break;
          case '30days':
            start.setDate(now.getDate() - 30);
            break;
          case '90days':
            start.setDate(now.getDate() - 90);
            break;
          default:
            start.setDate(now.getDate() - 30);
        }
      }

      const result = await ReportService.getSalesReport(
        start.toISOString().split('T')[0],
        end
      );
      setData(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sales report');
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
        <Text style={styles.headerTitle}>Sales Report</Text>
        <View style={styles.periodContainer}>
          {['7days', '30days', '90days'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, period === p && styles.periodChipActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodChipText, period === p && styles.periodChipTextActive]}>
                {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : '90 Days'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={[styles.summaryValue, styles.revenueValue]}>
                {formatCurrency(data?.summary?.totalRevenue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>{data?.summary?.totalTransactions || 0}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg. Order Value</Text>
              <Text style={[styles.summaryValue, styles.primaryValue]}>
                {formatCurrency(data?.summary?.averageOrderValue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>{data?.summary?.totalItems || 0}</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {data?.paymentBreakdown?.map((method, index) => (
            <View key={index} style={styles.paymentRow}>
              <Text style={styles.paymentMethod}>{method._id || 'Unknown'}</Text>
              <View style={styles.paymentStats}>
                <Text style={styles.paymentCount}>{method.count} transactions</Text>
                <Text style={styles.paymentAmount}>{formatCurrency(method.totalAmount || 0)}</Text>
              </View>
            </View>
          ))}
          {(!data?.paymentBreakdown || data.paymentBreakdown.length === 0) && (
            <Text style={styles.noDataText}>No payment data available</Text>
          )}
        </View>

        <View style={styles.productsCard}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          {data?.productPerformance?.slice(0, 10).map((product, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.productRank}>#{index + 1}</Text>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {product.product?.name || 'Unknown Product'}
                </Text>
                <Text style={styles.productQuantity}>{product.totalQuantity || 0} units sold</Text>
              </View>
              <Text style={styles.productRevenue}>{formatCurrency(product.totalRevenue || 0)}</Text>
            </View>
          ))}
          {(!data?.productPerformance || data.productPerformance.length === 0) && (
            <Text style={styles.noDataText}>No product data available</Text>
          )}
        </View>

        <View style={styles.staffCard}>
          <Text style={styles.sectionTitle}>Staff Performance</Text>
          {data?.staffPerformance?.slice(0, 5).map((staff, index) => (
            <View key={index} style={styles.staffRow}>
              <Text style={styles.staffRank}>#{index + 1}</Text>
              <View style={styles.staffInfo}>
                <Text style={styles.staffName}>
                  {staff.staff?.firstName} {staff.staff?.lastName || 'Unknown'}
                </Text>
                <Text style={styles.staffTransactions}>{staff.totalTransactions || 0} transactions</Text>
              </View>
              <Text style={styles.staffRevenue}>{formatCurrency(staff.totalSales || 0)}</Text>
            </View>
          ))}
          {(!data?.staffPerformance || data.staffPerformance.length === 0) && (
            <Text style={styles.noDataText}>No staff data available</Text>
          )}
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
  periodContainer: { flexDirection: 'row', marginTop: Spacing.sm },
  periodChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: Colors.gray200, marginRight: Spacing.sm },
  periodChipActive: { backgroundColor: Colors.primary },
  periodChipText: { fontSize: Typography.xs, color: Colors.gray700 },
  periodChipTextActive: { color: Colors.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing['3xl'] },
  summaryCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  summaryItem: { width: '50%', marginBottom: Spacing.sm },
  summaryLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  summaryValue: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  revenueValue: { color: Colors.success },
  primaryValue: { color: Colors.primary },
  paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  paymentMethod: { fontSize: Typography.sm, color: Colors.gray700, flex: 1 },
  paymentStats: { flexDirection: 'row', alignItems: 'center' },
  paymentCount: { fontSize: Typography.xs, color: Colors.gray500, marginRight: Spacing.sm },
  paymentAmount: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.gray900 },
  productsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  productRank: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.gray400, width: 30 },
  productInfo: { flex: 1, marginLeft: Spacing.sm },
  productName: { fontSize: Typography.sm, color: Colors.gray900 },
  productQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
  productRevenue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.primary },
  staffCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  staffRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  staffRank: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.gray400, width: 30 },
  staffInfo: { flex: 1, marginLeft: Spacing.sm },
  staffName: { fontSize: Typography.sm, color: Colors.gray900 },
  staffTransactions: { fontSize: Typography.xs, color: Colors.gray500 },
  staffRevenue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.primary },
  noDataText: { fontSize: Typography.sm, color: Colors.gray500, textAlign: 'center', paddingVertical: Spacing.md },
  footer: { flexDirection: 'row', backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200, padding: Spacing.md, gap: Spacing.sm },
  footerButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  exportButton: { backgroundColor: Colors.gray200 },
  exportButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  shareButton: { backgroundColor: Colors.primary },
  shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
});