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
// import { Download, Share2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react-native';
// import ReportService from '../../../services/reportService';
// import { formatCurrency, formatDate } from '../../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';

// export default function FinancialReport() {
//   const router = useRouter();
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

//       switch (period) {
//         case '7days':
//           start.setDate(now.getDate() - 7);
//           break;
//         case '30days':
//           start.setDate(now.getDate() - 30);
//           break;
//         case '90days':
//           start.setDate(now.getDate() - 90);
//           break;
//         default:
//           start.setDate(now.getDate() - 30);
//       }

//       const result = await ReportService.getFinancialReport(
//         start.toISOString().split('T')[0],
//         end
//       );
//       setData(result);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load financial report');
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
//         <Text style={styles.headerTitle}>Financial Report</Text>
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
//           <Text style={styles.sectionTitle}>Financial Summary</Text>
//           <View style={styles.summaryGrid}>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Revenue</Text>
//               <Text style={[styles.summaryValue, styles.revenueValue]}>
//                 {formatCurrency(data?.summary?.totalRevenue || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Tax</Text>
//               <Text style={styles.summaryValue}>
//                 {formatCurrency(data?.summary?.totalTax || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Subtotal</Text>
//               <Text style={styles.summaryValue}>
//                 {formatCurrency(data?.summary?.totalSubtotal || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Transactions</Text>
//               <Text style={styles.summaryValue}>
//                 {data?.summary?.transactionCount || 0}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Avg. Order Value</Text>
//               <Text style={[styles.summaryValue, styles.primaryValue]}>
//                 {formatCurrency(data?.summary?.averageOrderValue || 0)}
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Refunds</Text>
//               <Text style={[styles.summaryValue, styles.errorValue]}>
//                 {formatCurrency(data?.refunds?.totalRefunded || 0)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.paymentCard}>
//           <Text style={styles.sectionTitle}>Payment Methods</Text>
//           {data?.paymentFinancials?.map((method, index) => (
//             <View key={index} style={styles.paymentRow}>
//               <Text style={styles.paymentMethod}>{method._id || 'Unknown'}</Text>
//               <View style={styles.paymentStats}>
//                 <Text style={styles.paymentCount}>{method.count} transactions</Text>
//                 <Text style={styles.paymentAmount}>
//                   {formatCurrency(method.totalAmount || 0)}
//                 </Text>
//                 <Text style={styles.paymentAverage}>
//                   Avg: {formatCurrency(method.averageAmount || 0)}
//                 </Text>
//               </View>
//             </View>
//           ))}
//           {(!data?.paymentFinancials || data.paymentFinancials.length === 0) && (
//             <Text style={styles.noDataText}>No payment data available</Text>
//           )}
//         </View>

//         <View style={styles.dailyCard}>
//           <Text style={styles.sectionTitle}>Daily Breakdown</Text>
//           {data?.dailyBreakdown?.slice(0, 10).map((day, index) => (
//             <View key={index} style={styles.dailyRow}>
//               <Text style={styles.dailyDate}>
//                 {day._id?.year}-{String(day._id?.month).padStart(2, '0')}-{String(day._id?.day).padStart(2, '0')}
//               </Text>
//               <View style={styles.dailyStats}>
//                 <Text style={styles.dailyTransactions}>{day.transactions || 0} txns</Text>
//                 <Text style={styles.dailyRevenue}>
//                   {formatCurrency(day.revenue || 0)}
//                 </Text>
//               </View>
//             </View>
//           ))}
//           {(!data?.dailyBreakdown || data.dailyBreakdown.length === 0) && (
//             <Text style={styles.noDataText}>No daily data available</Text>
//           )}
//         </View>

//         <View style={styles.refundCard}>
//           <Text style={styles.sectionTitle}>Refund Summary</Text>
//           <View style={styles.refundStats}>
//             <View style={styles.refundItem}>
//               <Text style={styles.refundLabel}>Total Refunded</Text>
//               <Text style={[styles.refundValue, styles.errorValue]}>
//                 {formatCurrency(data?.refunds?.totalRefunded || 0)}
//               </Text>
//             </View>
//             <View style={styles.refundItem}>
//               <Text style={styles.refundLabel}>Refund Count</Text>
//               <Text style={styles.refundValue}>
//                 {data?.refunds?.count || 0}
//               </Text>
//             </View>
//             <View style={styles.refundItem}>
//               <Text style={styles.refundLabel}>Avg. Refund</Text>
//               <Text style={styles.refundValue}>
//                 {formatCurrency((data?.refunds?.totalRefunded || 0) / (data?.refunds?.count || 1))}
//               </Text>
//             </View>
//           </View>
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
//   errorValue: {
//     color: Colors.error,
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
//     fontWeight: '500',
//     color: Colors.gray700,
//     flex: 1,
//   },
//   paymentStats: {
//     alignItems: 'flex-end',
//   },
//   paymentCount: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   paymentAmount: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   paymentAverage: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },
//   dailyCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   dailyRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   dailyDate: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//   },
//   dailyStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.md,
//   },
//   dailyTransactions: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   dailyRevenue: {
//     fontSize: Typography.sm,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   refundCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   refundStats: {
//     flexDirection: 'row',
//   },
//   refundItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   refundLabel: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   refundValue: {
//     fontSize: Typography.md,
//     fontWeight: 'bold',
//     color: Colors.gray900,
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
import { Download, Share2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react-native';
import ReportService from '../../../../services/reportService';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';

export default function FinancialReport() {
  const router = useRouter();
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

      const result = await ReportService.getFinancialReport(
        start.toISOString().split('T')[0],
        end
      );
      setData(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to load financial report');
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
        <Text style={styles.headerTitle}>Financial Report</Text>
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
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={[styles.summaryValue, styles.revenueValue]}>
                {formatCurrency(data?.summary?.totalRevenue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Tax</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(data?.summary?.totalTax || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(data?.summary?.totalSubtotal || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>
                {data?.summary?.transactionCount || 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg. Order Value</Text>
              <Text style={[styles.summaryValue, styles.primaryValue]}>
                {formatCurrency(data?.summary?.averageOrderValue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Refunds</Text>
              <Text style={[styles.summaryValue, styles.errorValue]}>
                {formatCurrency(data?.refunds?.totalRefunded || 0)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {data?.paymentFinancials?.map((method, index) => (
            <View key={index} style={styles.paymentRow}>
              <Text style={styles.paymentMethod}>{method._id || 'Unknown'}</Text>
              <View style={styles.paymentStats}>
                <Text style={styles.paymentCount}>{method.count} transactions</Text>
                <Text style={styles.paymentAmount}>
                  {formatCurrency(method.totalAmount || 0)}
                </Text>
                <Text style={styles.paymentAverage}>
                  Avg: {formatCurrency(method.averageAmount || 0)}
                </Text>
              </View>
            </View>
          ))}
          {(!data?.paymentFinancials || data.paymentFinancials.length === 0) && (
            <Text style={styles.noDataText}>No payment data available</Text>
          )}
        </View>

        <View style={styles.dailyCard}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          {data?.dailyBreakdown?.slice(0, 10).map((day, index) => (
            <View key={index} style={styles.dailyRow}>
              <Text style={styles.dailyDate}>
                {day._id?.year}-{String(day._id?.month).padStart(2, '0')}-{String(day._id?.day).padStart(2, '0')}
              </Text>
              <View style={styles.dailyStats}>
                <Text style={styles.dailyTransactions}>{day.transactions || 0} txns</Text>
                <Text style={styles.dailyRevenue}>
                  {formatCurrency(day.revenue || 0)}
                </Text>
              </View>
            </View>
          ))}
          {(!data?.dailyBreakdown || data.dailyBreakdown.length === 0) && (
            <Text style={styles.noDataText}>No daily data available</Text>
          )}
        </View>

        <View style={styles.refundCard}>
          <Text style={styles.sectionTitle}>Refund Summary</Text>
          <View style={styles.refundStats}>
            <View style={styles.refundItem}>
              <Text style={styles.refundLabel}>Total Refunded</Text>
              <Text style={[styles.refundValue, styles.errorValue]}>
                {formatCurrency(data?.refunds?.totalRefunded || 0)}
              </Text>
            </View>
            <View style={styles.refundItem}>
              <Text style={styles.refundLabel}>Refund Count</Text>
              <Text style={styles.refundValue}>
                {data?.refunds?.count || 0}
              </Text>
            </View>
            <View style={styles.refundItem}>
              <Text style={styles.refundLabel}>Avg. Refund</Text>
              <Text style={styles.refundValue}>
                {formatCurrency((data?.refunds?.totalRefunded || 0) / (data?.refunds?.count || 1))}
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
  errorValue: { color: Colors.error },
  paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  paymentMethod: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, flex: 1 },
  paymentStats: { alignItems: 'flex-end' },
  paymentCount: { fontSize: Typography.xs, color: Colors.gray500 },
  paymentAmount: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.gray900 },
  paymentAverage: { fontSize: Typography.xs, color: Colors.gray400 },
  dailyCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  dailyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  dailyDate: { fontSize: Typography.sm, color: Colors.gray700 },
  dailyStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  dailyTransactions: { fontSize: Typography.xs, color: Colors.gray500 },
  dailyRevenue: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.primary },
  refundCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  refundStats: { flexDirection: 'row' },
  refundItem: { flex: 1, alignItems: 'center' },
  refundLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  refundValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  noDataText: { fontSize: Typography.sm, color: Colors.gray500, textAlign: 'center', paddingVertical: Spacing.md },
  footer: { flexDirection: 'row', backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200, padding: Spacing.md, gap: Spacing.sm },
  footerButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  exportButton: { backgroundColor: Colors.gray200 },
  exportButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  shareButton: { backgroundColor: Colors.primary },
  shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
});