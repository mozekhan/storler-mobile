// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   Dimensions
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Download, Share2, Calendar } from 'lucide-react-native';
// import api from '../../../../services/api';
// import { formatCurrency, formatDate } from '../../../../utils/formatters';

// const screenWidth = Dimensions.get('window').width - 32;

// export default function ReportDetail() {
//   const router = useRouter();
//   const { type } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const [period, setPeriod] = useState('30days');

//   useEffect(() => {
//     fetchReport();
//   }, [type, period]);

//   const fetchReport = async () => {
//     try {
//       const endDate = new Date().toISOString().split('T')[0];
//       const startDate = new Date();
      
//       if (period === '7days') {
//         startDate.setDate(startDate.getDate() - 7);
//       } else if (period === '30days') {
//         startDate.setDate(startDate.getDate() - 30);
//       } else if (period === '90days') {
//         startDate.setDate(startDate.getDate() - 90);
//       }
      
//       const start = startDate.toISOString().split('T')[0];

//       let response;
//       if (type === 'sales') {
//         response = await api.get('/reports/sales', { params: { startDate: start, endDate } });
//       } else if (type === 'inventory') {
//         response = await api.get('/reports/inventory');
//       } else if (type === 'financial') {
//         response = await api.get('/reports/financial', { params: { startDate: start, endDate } });
//       }
      
//       setData(response.data.data);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderSalesReport = () => {
//     if (!data) return null;
//     return (
//       <View>
//         <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
//           <Text className="text-lg font-semibold text-gray-900 mb-2">Summary</Text>
//           <View className="flex-row flex-wrap">
//             <View className="w-1/2 mb-2">
//               <Text className="text-sm text-gray-500">Total Revenue</Text>
//               <Text className="text-xl font-bold text-green-600">
//                 {formatCurrency(data.summary?.totalRevenue || 0)}
//               </Text>
//             </View>
//             <View className="w-1/2 mb-2">
//               <Text className="text-sm text-gray-500">Transactions</Text>
//               <Text className="text-xl font-bold text-gray-900">
//                 {data.summary?.totalTransactions || 0}
//               </Text>
//             </View>
//             <View className="w-1/2">
//               <Text className="text-sm text-gray-500">Avg. Order Value</Text>
//               <Text className="text-xl font-bold text-primary">
//                 {formatCurrency(data.summary?.averageOrderValue || 0)}
//               </Text>
//             </View>
//             <View className="w-1/2">
//               <Text className="text-sm text-gray-500">Total Items</Text>
//               <Text className="text-xl font-bold text-gray-900">
//                 {data.summary?.totalItems || 0}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View className="bg-white rounded-lg p-4 shadow-sm">
//           <Text className="text-lg font-semibold text-gray-900 mb-3">Top Products</Text>
//           {data.productPerformance?.slice(0, 5).map((product, index) => (
//             <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
//               <Text className="text-sm text-gray-700 flex-1">
//                 {product.product?.name || 'Unknown'}
//               </Text>
//               <Text className="text-sm font-medium text-gray-900">
//                 {formatCurrency(product.totalRevenue || 0)}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderInventoryReport = () => {
//     if (!data) return null;
//     return (
//       <View>
//         <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
//           <Text className="text-lg font-semibold text-gray-900 mb-2">Summary</Text>
//           <View className="flex-row flex-wrap">
//             <View className="w-1/2 mb-2">
//               <Text className="text-sm text-gray-500">Total Products</Text>
//               <Text className="text-xl font-bold text-gray-900">
//                 {data.summary?.totalProducts || 0}
//               </Text>
//             </View>
//             <View className="w-1/2 mb-2">
//               <Text className="text-sm text-gray-500">Total Stock</Text>
//               <Text className="text-xl font-bold text-gray-900">
//                 {data.summary?.totalStock || 0}
//               </Text>
//             </View>
//             <View className="w-1/2">
//               <Text className="text-sm text-gray-500">Low Stock</Text>
//               <Text className="text-xl font-bold text-yellow-600">
//                 {data.summary?.lowStock || 0}
//               </Text>
//             </View>
//             <View className="w-1/2">
//               <Text className="text-sm text-gray-500">Out of Stock</Text>
//               <Text className="text-xl font-bold text-red-600">
//                 {data.summary?.outOfStock || 0}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View className="bg-white rounded-lg p-4 shadow-sm">
//           <Text className="text-lg font-semibold text-gray-900 mb-3">Category Breakdown</Text>
//           {Object.entries(data.categoryBreakdown || {}).map(([category, catData]) => (
//             <View key={category} className="flex-row justify-between py-2 border-b border-gray-100">
//               <Text className="text-sm text-gray-700">{category}</Text>
//               <Text className="text-sm font-medium text-gray-900">
//                 {catData.totalStock || 0} items
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderFinancialReport = () => {
//     if (!data) return null;
//     return (
//       <View>
//         <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
//           <Text className="text-lg font-semibold text-gray-900 mb-2">Financial Summary</Text>
//           <View className="flex-row flex-wrap">
//             <View className="w-1/2 mb-2">
//               <Text className="text-sm text-gray-500">Total Revenue</Text>
//               <Text className="text-xl font-bold text-green-600">
//                 {formatCurrency(data.summary?.totalRevenue || 0)}
//               </Text>
//             </View>
//             <View className="w-1/2 mb-2">
//               <Text className="text-sm text-gray-500">Total Tax</Text>
//               <Text className="text-xl font-bold text-gray-900">
//                 {formatCurrency(data.summary?.totalTax || 0)}
//               </Text>
//             </View>
//             <View className="w-1/2">
//               <Text className="text-sm text-gray-500">Refunds</Text>
//               <Text className="text-xl font-bold text-red-600">
//                 {formatCurrency(data.refunds?.totalRefunded || 0)}
//               </Text>
//             </View>
//             <View className="w-1/2">
//               <Text className="text-sm text-gray-500">Avg. Order</Text>
//               <Text className="text-xl font-bold text-primary">
//                 {formatCurrency(data.summary?.averageOrderValue || 0)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View className="bg-white rounded-lg p-4 shadow-sm">
//           <Text className="text-lg font-semibold text-gray-900 mb-3">Payment Methods</Text>
//           {data.paymentFinancials?.map((method) => (
//             <View key={method._id} className="flex-row justify-between py-2 border-b border-gray-100">
//               <Text className="text-sm text-gray-700">{method._id}</Text>
//               <View className="flex-row items-center">
//                 <Text className="text-sm text-gray-500 mr-2">{method.count} txns</Text>
//                 <Text className="text-sm font-medium text-gray-900">
//                   {formatCurrency(method.totalAmount || 0)}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#3b82f6" />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white p-4 shadow-sm">
//         <Text className="text-xl font-bold text-gray-900">
//           {type.charAt(0).toUpperCase() + type.slice(1)} Report
//         </Text>
//         <View className="flex-row mt-2">
//           <TouchableOpacity
//             className="mr-2 px-3 py-1 rounded-full bg-gray-200"
//             onPress={() => setPeriod('7days')}
//           >
//             <Text className={`text-xs ${period === '7days' ? 'text-primary' : 'text-gray-700'}`}>
//               7 Days
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className="mr-2 px-3 py-1 rounded-full bg-gray-200"
//             onPress={() => setPeriod('30days')}
//           >
//             <Text className={`text-xs ${period === '30days' ? 'text-primary' : 'text-gray-700'}`}>
//               30 Days
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className="mr-2 px-3 py-1 rounded-full bg-gray-200"
//             onPress={() => setPeriod('90days')}
//           >
//             <Text className={`text-xs ${period === '90days' ? 'text-primary' : 'text-gray-700'}`}>
//               90 Days
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView className="flex-1 p-4">
//         {type === 'sales' && renderSalesReport()}
//         {type === 'inventory' && renderInventoryReport()}
//         {type === 'financial' && renderFinancialReport()}
//       </ScrollView>

//       {/* Footer Actions */}
//       <View className="bg-white border-t border-gray-200 p-4 flex-row">
//         <TouchableOpacity
//           className="flex-1 bg-gray-200 py-3 rounded-lg mr-2 flex-row items-center justify-center"
//         >
//           <Download size={20} color="#374151" />
//           <Text className="text-gray-700 font-semibold ml-2">Export</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="flex-1 bg-primary py-3 rounded-lg ml-2 flex-row items-center justify-center"
//         >
//           <Share2 size={20} color="white" />
//           <Text className="text-white font-semibold ml-2">Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }


















import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Download, Share2, Calendar } from 'lucide-react-native';
import api from '../../../../services/api';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../constants/theme';

const screenWidth = Dimensions.get('window').width - 32;

export default function ReportDetail() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('30days');

  useEffect(() => {
    fetchReport();
  }, [type, period]);

  const fetchReport = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      
      if (period === '7days') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === '30days') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (period === '90days') {
        startDate.setDate(startDate.getDate() - 90);
      }
      
      const start = startDate.toISOString().split('T')[0];

      let response;
      if (type === 'sales') {
        response = await api.get('/reports/sales', { params: { startDate: start, endDate } });
      } else if (type === 'inventory') {
        response = await api.get('/reports/inventory');
      } else if (type === 'financial') {
        response = await api.get('/reports/financial', { params: { startDate: start, endDate } });
      }
      
      setData(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const renderSalesReport = () => {
    if (!data) return null;
    return (
      <View>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={[styles.summaryValue, styles.revenueValue]}>
                {formatCurrency(data.summary?.totalRevenue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Transactions</Text>
              <Text style={styles.summaryValue}>
                {data.summary?.totalTransactions || 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg. Order Value</Text>
              <Text style={[styles.summaryValue, styles.primaryValue]}>
                {formatCurrency(data.summary?.averageOrderValue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>
                {data.summary?.totalItems || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.productsCard}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          {data.productPerformance?.slice(0, 5).map((product, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.productName}>
                {product.product?.name || 'Unknown'}
              </Text>
              <Text style={styles.productRevenue}>
                {formatCurrency(product.totalRevenue || 0)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderInventoryReport = () => {
    if (!data) return null;
    return (
      <View>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Products</Text>
              <Text style={styles.summaryValue}>
                {data.summary?.totalProducts || 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Stock</Text>
              <Text style={styles.summaryValue}>
                {data.summary?.totalStock || 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Low Stock</Text>
              <Text style={[styles.summaryValue, styles.warningValue]}>
                {data.summary?.lowStock || 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Out of Stock</Text>
              <Text style={[styles.summaryValue, styles.errorValue]}>
                {data.summary?.outOfStock || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.productsCard}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {Object.entries(data.categoryBreakdown || {}).map(([category, catData]) => (
            <View key={category} style={styles.productRow}>
              <Text style={styles.productName}>{category}</Text>
              <Text style={styles.productRevenue}>
                {catData.totalStock || 0} items
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFinancialReport = () => {
    if (!data) return null;
    return (
      <View>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={[styles.summaryValue, styles.revenueValue]}>
                {formatCurrency(data.summary?.totalRevenue || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Tax</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(data.summary?.totalTax || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Refunds</Text>
              <Text style={[styles.summaryValue, styles.errorValue]}>
                {formatCurrency(data.refunds?.totalRefunded || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg. Order</Text>
              <Text style={[styles.summaryValue, styles.primaryValue]}>
                {formatCurrency(data.summary?.averageOrderValue || 0)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.productsCard}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {data.paymentFinancials?.map((method) => (
            <View key={method._id} style={styles.productRow}>
              <Text style={styles.productName}>{method._id}</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentCount}>{method.count} txns</Text>
                <Text style={styles.productRevenue}>
                  {formatCurrency(method.totalAmount || 0)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Report
        </Text>
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
        {type === 'sales' && renderSalesReport()}
        {type === 'inventory' && renderInventoryReport()}
        {type === 'financial' && renderFinancialReport()}
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
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  periodContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  periodChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.sm,
  },
  periodChipActive: {
    backgroundColor: Colors.primary,
  },
  periodChipText: {
    fontSize: Typography.xs,
    color: Colors.gray700,
  },
  periodChipTextActive: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '50%',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  summaryValue: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  revenueValue: {
    color: Colors.success,
  },
  warningValue: {
    color: Colors.warning,
  },
  errorValue: {
    color: Colors.error,
  },
  primaryValue: {
    color: Colors.primary,
  },
  productsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  productName: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    flex: 1,
  },
  productRevenue: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentCount: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginRight: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  footerButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButton: {
    backgroundColor: Colors.gray200,
  },
  exportButtonText: {
    color: Colors.gray700,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  shareButton: {
    backgroundColor: Colors.primary,
  },
  shareButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});