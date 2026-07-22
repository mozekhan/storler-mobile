
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   TrendingUp,
//   Package,
//   DollarSign,
//   BarChart3,
//   Calendar,
// } from "lucide-react-native";
// import ReportService from "../../../services/reportService";
// import { formatCurrency } from "../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";

// export default function Reports() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [salesData, setSalesData] = useState(null);
//   const [inventoryData, setInventoryData] = useState(null);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       const endDate = new Date().toISOString().split("T")[0];
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - 30);
//       const start = startDate.toISOString().split("T")[0];

//       const [sales, inventory] = await Promise.all([
//         ReportService.getSalesReport(start, endDate),
//         ReportService.getInventoryReport(),
//       ]);

//       setSalesData(sales);
//       setInventoryData(inventory);
//     } catch (error) {
//       Alert.alert("Error", "Failed to load reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ReportCard = ({ title, icon: Icon, onPress, color, summary }) => (
//     <TouchableOpacity style={styles.reportCard} onPress={onPress}>
//       <View style={styles.reportCardContent}>
//         <View style={[styles.reportCardIcon, { backgroundColor: color }]}>
//           <Icon size={24} color={Colors.white} />
//         </View>
//         <View style={styles.reportCardInfo}>
//           <Text style={styles.reportCardTitle}>{title}</Text>
//           {summary && <Text style={styles.reportCardSummary}>{summary}</Text>}
//         </View>
//         <BarChart3 size={20} color={Colors.gray400} />
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.header}>
//         <Text style={styles.pageTitle}>Reports</Text>
//         <Text style={styles.pageSubtitle}>Analytics and insights</Text>
//       </View>

//       <View style={styles.summaryRow}>
//         <View style={[styles.summaryCard, styles.summaryCardLeft]}>
//           <Text style={styles.summaryLabel}>Total Revenue</Text>
//           <Text style={[styles.summaryValue, styles.revenueValue]}>
//             {formatCurrency(salesData?.summary?.totalRevenue || 0)}
//           </Text>
//         </View>
//         <View style={[styles.summaryCard, styles.summaryCardRight]}>
//           <Text style={styles.summaryLabel}>Transactions</Text>
//           <Text style={styles.summaryValue}>
//             {salesData?.summary?.totalTransactions || 0}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.summaryRow}>
//         <View style={[styles.summaryCard, styles.summaryCardLeft]}>
//           <Text style={styles.summaryLabel}>Total Items</Text>
//           <Text style={styles.summaryValue}>
//             {inventoryData?.summary?.totalProducts || 0}
//           </Text>
//         </View>
//         <View style={[styles.summaryCard, styles.summaryCardRight]}>
//           <Text style={styles.summaryLabel}>Low Stock</Text>
//           <Text style={[styles.summaryValue, styles.warningValue]}>
//             {inventoryData?.summary?.lowStock || 0}
//           </Text>
//         </View>
//       </View>

//       <ReportCard
//         title="Sales Report"
//         icon={TrendingUp}
//         color={Colors.primary}
//         summary={`${salesData?.summary?.totalTransactions || 0} transactions, ${formatCurrency(salesData?.summary?.totalRevenue || 0)}`}
//         onPress={() => router.push("/reports/sales")}
//       />

//       <ReportCard
//         title="Inventory Report"
//         icon={Package}
//         color={Colors.success}
//         summary={`${inventoryData?.summary?.totalProducts || 0} products, ${inventoryData?.summary?.lowStock || 0} low stock`}
//         onPress={() => router.push("/reports/inventory")}
//       />

//       <ReportCard
//         title="Financial Report"
//         icon={DollarSign}
//         color="#8B5CF6"
//         summary={`Revenue: ${formatCurrency(salesData?.summary?.totalRevenue || 0)}`}
//         onPress={() => router.push("/reports/financial")}
//       />

//       <View style={styles.filterCard}>
//         <Text style={styles.filterTitle}>Quick Filters</Text>
//         <View style={styles.filterContainer}>
//           {["Today", "Yesterday", "This Week", "Last 7 Days", "This Month"].map(
//             (period) => (
//               <TouchableOpacity
//                 key={period}
//                 style={styles.filterChip}
//                 onPress={() => {
//                   const now = new Date();
//                   let startDate = new Date();
//                   const endDate = now.toISOString().split("T")[0];

//                   switch (period) {
//                     case "Today":
//                       startDate = now;
//                       break;
//                     case "Yesterday":
//                       startDate.setDate(now.getDate() - 1);
//                       break;
//                     case "This Week":
//                       startDate.setDate(now.getDate() - 7);
//                       break;
//                     case "Last 7 Days":
//                       startDate.setDate(now.getDate() - 7);
//                       break;
//                     case "This Month":
//                       startDate = new Date(
//                         now.getFullYear(),
//                         now.getMonth(),
//                         1,
//                       );
//                       break;
//                   }

//                   const start = startDate.toISOString().split("T")[0];
//                   router.push(
//                     `/reports/sales?startDate=${start}&endDate=${endDate}`,
//                   );
//                 }}
//               >
//                 <Text style={styles.filterChipText}>{period}</Text>
//               </TouchableOpacity>
//             ),
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   content: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: { marginBottom: Spacing.md },
//   pageTitle: {
//     fontSize: Typography["2xl"],
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   pageSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
//   summaryRow: { flexDirection: "row", marginBottom: Spacing.sm },
//   summaryCard: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   summaryCardLeft: { marginRight: Spacing.sm },
//   summaryCardRight: { marginLeft: Spacing.sm },
//   summaryLabel: { fontSize: Typography.xs, color: Colors.gray500 },
//   summaryValue: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     marginTop: Spacing.xs,
//   },
//   revenueValue: { color: Colors.success },
//   warningValue: { color: Colors.warning },
//   reportCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   reportCardContent: { flexDirection: "row", alignItems: "center" },
//   reportCardIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   reportCardInfo: { flex: 1, marginLeft: Spacing.md },
//   reportCardTitle: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   reportCardSummary: { fontSize: Typography.sm, color: Colors.gray500 },
//   filterCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginTop: Spacing.xs,
//     ...Shadows.sm,
//   },
//   filterTitle: {
//     fontSize: Typography.sm,
//     fontWeight: "600",
//     color: Colors.gray700,
//     marginBottom: Spacing.md,
//   },
//   filterContainer: { flexDirection: "row", flexWrap: "wrap" },
//   filterChip: {
//     backgroundColor: Colors.gray100,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.full,
//     marginRight: Spacing.sm,
//     marginBottom: Spacing.sm,
//   },
//   filterChipText: { fontSize: Typography.sm, color: Colors.gray700 },
// });
