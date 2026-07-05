// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Modal,
//   ScrollView,
//   StyleSheet
// } from 'react-native';
// import { Search, Eye, Calendar, AlertCircle } from 'lucide-react-native';
// import api from '../../services/api';
// import { formatDateTime } from '../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

// export default function AuditLogs() {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [logs, setLogs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchLogs();
//   }, [searchTerm]);

//   const fetchLogs = async () => {
//     try {
//       const response = await api.get('/admin/audit-logs', {
//         params: { search: searchTerm, limit: 50 }
//       });
//       setLogs(response.data.data.logs || []);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load audit logs');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchLogs();
//   };

//   const getSeverityColor = (severity) => {
//     const colors = {
//       'INFO': styles.severityInfo,
//       'WARNING': styles.severityWarning,
//       'CRITICAL': styles.severityCritical
//     };
//     return colors[severity] || styles.severityDefault;
//   };

//   const getActionIcon = (action) => {
//     const icons = {
//       'CREATE': '📝',
//       'UPDATE': '✏️',
//       'DELETE': '🗑️',
//       'LOGIN': '🔑',
//       'LOGOUT': '🚪',
//       'PRINT': '🖨️',
//       'SCAN': '📷'
//     };
//     return icons[action] || '📌';
//   };

//   const renderLog = ({ item }) => {
//     const severityStyle = getSeverityColor(item.severity);
//     return (
//       <TouchableOpacity
//         style={styles.logItem}
//         onPress={() => {
//           setSelectedLog(item);
//           setShowModal(true);
//         }}
//       >
//         <View style={styles.logItemRow}>
//           <Text style={styles.logIcon}>{getActionIcon(item.action)}</Text>
//           <View style={styles.logItemInfo}>
//             <View style={styles.logItemHeader}>
//               <Text style={styles.logItemAction}>{item.action}</Text>
//               <View style={[styles.severityBadge, severityStyle]}>
//                 <Text style={styles.severityText}>{item.severity}</Text>
//               </View>
//             </View>
//             <Text style={styles.logItemUser}>
//               {item.actorId?.firstName} {item.actorId?.lastName}
//             </Text>
//             <Text style={styles.logItemMeta}>
//               {item.resourceType} • {formatDateTime(item.timestamp)}
//             </Text>
//             {item.details?.metadata?.reason && (
//               <Text style={styles.logItemReason}>
//                 Reason: {item.details.metadata.reason}
//               </Text>
//             )}
//           </View>
//           <Eye size={18} color={Colors.gray500} />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const criticalCount = logs.filter(l => l.severity === 'CRITICAL').length;

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search audit logs..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>
//       </View>

//       <View style={styles.statsRow}>
//         <View style={[styles.statCard, styles.statCardLeft]}>
//           <Text style={styles.statLabel}>Total Logs</Text>
//           <Text style={styles.statValue}>{logs.length}</Text>
//         </View>
//         <View style={[styles.statCard, styles.statCardRight]}>
//           <Text style={styles.statLabel}>Critical</Text>
//           <Text style={[styles.statValue, styles.criticalValue]}>{criticalCount}</Text>
//         </View>
//       </View>

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={styles.listContent}
//         data={logs}
//         keyExtractor={(item) => item._id}
//         renderItem={renderLog}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <AlertCircle size={48} color={Colors.gray300} />
//             <Text style={styles.emptyText}>No audit logs found</Text>
//           </View>
//         )}
//       />

//       <Modal
//         visible={showModal}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Audit Log Details</Text>
//               <TouchableOpacity onPress={() => {
//                 setShowModal(false);
//                 setSelectedLog(null);
//               }}>
//                 <Text style={styles.modalCloseText}>Close</Text>
//               </TouchableOpacity>
//             </View>

//             {selectedLog && (
//               <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Action</Text>
//                   <Text style={styles.detailValue}>{selectedLog.action}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Severity</Text>
//                   <View style={[styles.severityBadge, getSeverityColor(selectedLog.severity)]}>
//                     <Text style={styles.severityText}>{selectedLog.severity}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>User</Text>
//                   <Text style={styles.detailValue}>
//                     {selectedLog.actorId?.firstName} {selectedLog.actorId?.lastName}
//                   </Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Role</Text>
//                   <Text style={styles.detailValue}>{selectedLog.actorRole}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Resource</Text>
//                   <Text style={styles.detailValue}>{selectedLog.resourceType}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Resource ID</Text>
//                   <Text style={styles.detailValue}>{selectedLog.resourceId}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Timestamp</Text>
//                   <Text style={styles.detailValue}>
//                     {formatDateTime(selectedLog.timestamp)}
//                   </Text>
//                 </View>

//                 {selectedLog.details && (
//                   <View style={styles.detailSection}>
//                     <Text style={styles.detailSectionTitle}>Details</Text>
//                     <View style={styles.detailJson}>
//                       <Text style={styles.detailJsonText}>
//                         {JSON.stringify(selectedLog.details, null, 2)}
//                       </Text>
//                     </View>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
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
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     padding: Spacing.md,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   statCardLeft: {
//     marginRight: Spacing.sm,
//   },
//   statCardRight: {
//     marginLeft: Spacing.sm,
//   },
//   statLabel: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   statValue: {
//     fontSize: Typography.lg,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   criticalValue: {
//     color: Colors.error,
//   },
//   list: {
//     flex: 1,
//   },
//   listContent: {
//     padding: Spacing.md,
//   },
//   logItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   logItemRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   logIcon: {
//     fontSize: Typography['2xl'],
//     marginRight: Spacing.md,
//   },
//   logItemInfo: {
//     flex: 1,
//   },
//   logItemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   logItemAction: {
//     fontSize: Typography.md,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   logItemUser: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   logItemMeta: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: Spacing.xs,
//   },
//   logItemReason: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   severityBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   severityText: {
//     fontSize: Typography.xs,
//     fontWeight: '500',
//   },
//   severityInfo: {
//     backgroundColor: Colors.primary + '20',
//   },
//   severityInfoText: {
//     color: Colors.primary,
//   },
//   severityWarning: {
//     backgroundColor: Colors.warning + '20',
//   },
//   severityWarningText: {
//     color: Colors.warning,
//   },
//   severityCritical: {
//     backgroundColor: Colors.error + '20',
//   },
//   severityCriticalText: {
//     color: Colors.error,
//   },
//   severityDefault: {
//     backgroundColor: Colors.gray200,
//   },
//   severityDefaultText: {
//     color: Colors.gray700,
//   },
//   emptyContainer: {
//     paddingVertical: Spacing['4xl'],
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: Colors.gray500,
//     marginTop: Spacing.sm,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     flex: 1,
//     marginTop: 80,
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius['3xl'],
//     borderTopRightRadius: BorderRadius['3xl'],
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//   },
//   modalCloseText: {
//     color: Colors.gray500,
//   },
//   modalBody: {
//     flex: 1,
//   },
//   modalBodyContent: {
//     padding: Spacing.md,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   detailLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   detailValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   detailSection: {
//     marginTop: Spacing.md,
//   },
//   detailSectionTitle: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   detailJson: {
//     backgroundColor: Colors.gray100,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   detailJsonText: {
//     fontSize: Typography.xs,
//     color: Colors.gray700,
//     fontFamily: 'monospace',
//   },
// });























// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Modal,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import { Search, Eye, Calendar, AlertCircle, Filter, X } from 'lucide-react-native';
// import AdminService from '../../services/adminService';
// import { formatDateTime } from '../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

// export default function AuditLogs() {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [logs, setLogs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [filterModal, setFilterModal] = useState(false);
//   const [filters, setFilters] = useState({
//     action: '',
//     resourceType: '',
//     severity: '',
//     startDate: '',
//     endDate: '',
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 50,
//     total: 0,
//     pages: 0,
//   });

//   useEffect(() => {
//     fetchLogs();
//   }, [searchTerm]);

//   const fetchLogs = async (page = 1) => {
//     try {
//       const params = {
//         page,
//         limit: 50,
//         search: searchTerm,
//         ...filters,
//       };
//       // Remove empty filters
//       Object.keys(params).forEach(key => {
//         if (!params[key]) delete params[key];
//       });

//       const result = await AdminService.getActivityLogs(params);
//       setLogs(result.logs || []);
//       setPagination(result.pagination || {});
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load audit logs');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchLogs(1);
//   };

//   const loadMore = () => {
//     if (pagination.page < pagination.pages) {
//       fetchLogs(pagination.page + 1);
//     }
//   };

//   const applyFilters = () => {
//     setFilterModal(false);
//     fetchLogs(1);
//   };

//   const clearFilters = () => {
//     setFilters({
//       action: '',
//       resourceType: '',
//       severity: '',
//       startDate: '',
//       endDate: '',
//     });
//     setFilterModal(false);
//     fetchLogs(1);
//   };

//   const getSeverityColor = (severity) => {
//     const colors = {
//       INFO: styles.severityInfo,
//       WARNING: styles.severityWarning,
//       CRITICAL: styles.severityCritical,
//     };
//     return colors[severity] || styles.severityDefault;
//   };

//   const getSeverityTextColor = (severity) => {
//     const colors = {
//       INFO: styles.severityInfoText,
//       WARNING: styles.severityWarningText,
//       CRITICAL: styles.severityCriticalText,
//     };
//     return colors[severity] || styles.severityDefaultText;
//   };

//   const getActionIcon = (action) => {
//     const icons = {
//       CREATE: '📝',
//       UPDATE: '✏️',
//       DELETE: '🗑️',
//       LOGIN: '🔑',
//       LOGOUT: '🚪',
//       PRINT: '🖨️',
//       SCAN: '📷',
//       APPROVE: '✅',
//       REJECT: '❌',
//     };
//     return icons[action] || '📌';
//   };

//   const renderLog = ({ item }) => {
//     const severityStyle = getSeverityColor(item.severity);
//     const severityTextStyle = getSeverityTextColor(item.severity);
    
//     return (
//       <TouchableOpacity
//         style={styles.logItem}
//         onPress={() => {
//           setSelectedLog(item);
//           setShowModal(true);
//         }}
//       >
//         <View style={styles.logItemRow}>
//           <Text style={styles.logIcon}>{getActionIcon(item.action)}</Text>
//           <View style={styles.logItemInfo}>
//             <View style={styles.logItemHeader}>
//               <Text style={styles.logItemAction}>{item.action}</Text>
//               <View style={[styles.severityBadge, severityStyle]}>
//                 <Text style={[styles.severityText, severityTextStyle]}>
//                   {item.severity}
//                 </Text>
//               </View>
//             </View>
//             <Text style={styles.logItemUser}>
//               {item.actorId?.firstName} {item.actorId?.lastName}
//             </Text>
//             <Text style={styles.logItemMeta}>
//               {item.resourceType} • {formatDateTime(item.timestamp)}
//             </Text>
//             {item.details?.metadata?.reason && (
//               <Text style={styles.logItemReason}>
//                 Reason: {item.details.metadata.reason}
//               </Text>
//             )}
//           </View>
//           <Eye size={18} color={Colors.gray500} />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const criticalCount = logs.filter(l => l.severity === 'CRITICAL').length;

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search audit logs..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>
//         <TouchableOpacity
//           style={styles.filterButton}
//           onPress={() => setFilterModal(true)}
//         >
//           <Filter size={20} color={Colors.gray500} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statsRow}>
//         <View style={[styles.statCard, styles.statCardLeft]}>
//           <Text style={styles.statLabel}>Total Logs</Text>
//           <Text style={styles.statValue}>{pagination.total || 0}</Text>
//         </View>
//         <View style={[styles.statCard, styles.statCardRight]}>
//           <Text style={styles.statLabel}>Critical</Text>
//           <Text style={[styles.statValue, styles.criticalValue]}>{criticalCount}</Text>
//         </View>
//       </View>

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={styles.listContent}
//         data={logs}
//         keyExtractor={(item) => item._id}
//         renderItem={renderLog}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <AlertCircle size={48} color={Colors.gray300} />
//             <Text style={styles.emptyText}>No audit logs found</Text>
//           </View>
//         )}
//         ListFooterComponent={() => (
//           pagination.page < pagination.pages && (
//             <View style={styles.loadMoreContainer}>
//               <ActivityIndicator size="small" color={Colors.primary} />
//             </View>
//           )
//         )}
//       />

//       {/* Log Detail Modal */}
//       <Modal
//         visible={showModal}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Audit Log Details</Text>
//               <TouchableOpacity onPress={() => {
//                 setShowModal(false);
//                 setSelectedLog(null);
//               }}>
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             {selectedLog && (
//               <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Action</Text>
//                   <Text style={styles.detailValue}>{selectedLog.action}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Severity</Text>
//                   <View style={[styles.severityBadge, getSeverityColor(selectedLog.severity)]}>
//                     <Text style={[styles.severityText, getSeverityTextColor(selectedLog.severity)]}>
//                       {selectedLog.severity}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>User</Text>
//                   <Text style={styles.detailValue}>
//                     {selectedLog.actorId?.firstName} {selectedLog.actorId?.lastName}
//                   </Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Role</Text>
//                   <Text style={styles.detailValue}>{selectedLog.actorRole}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Resource</Text>
//                   <Text style={styles.detailValue}>{selectedLog.resourceType}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Resource ID</Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {selectedLog.resourceId}
//                   </Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Store</Text>
//                   <Text style={styles.detailValue}>
//                     {selectedLog.storeId?.name || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Timestamp</Text>
//                   <Text style={styles.detailValue}>
//                     {formatDateTime(selectedLog.timestamp)}
//                   </Text>
//                 </View>

//                 {selectedLog.details && (
//                   <View style={styles.detailSection}>
//                     <Text style={styles.detailSectionTitle}>Details</Text>
//                     <View style={styles.detailJson}>
//                       <Text style={styles.detailJsonText}>
//                         {JSON.stringify(selectedLog.details, null, 2)}
//                       </Text>
//                     </View>
//                   </View>
//                 )}

//                 {selectedLog.tamperProofHash && (
//                   <View style={styles.detailSection}>
//                     <Text style={styles.detailSectionTitle}>Tamper Proof Hash</Text>
//                     <View style={styles.detailJson}>
//                       <Text style={[styles.detailJsonText, styles.hashText]}>
//                         {selectedLog.tamperProofHash}
//                       </Text>
//                     </View>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Filter Modal */}
//       <Modal
//         visible={filterModal}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, styles.filterModalContent]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Filter Logs</Text>
//               <TouchableOpacity onPress={() => setFilterModal(false)}>
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody} contentContainerStyle={styles.filterBodyContent}>
//               <View style={styles.filterField}>
//                 <Text style={styles.filterLabel}>Action</Text>
//                 <TextInput
//                   style={styles.filterInput}
//                   placeholder="e.g., CREATE, UPDATE, DELETE"
//                   value={filters.action}
//                   onChangeText={(text) => setFilters({ ...filters, action: text })}
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.filterField}>
//                 <Text style={styles.filterLabel}>Resource Type</Text>
//                 <TextInput
//                   style={styles.filterInput}
//                   placeholder="e.g., Transaction, User, Product"
//                   value={filters.resourceType}
//                   onChangeText={(text) => setFilters({ ...filters, resourceType: text })}
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.filterField}>
//                 <Text style={styles.filterLabel}>Severity</Text>
//                 <View style={styles.severityFilterRow}>
//                   {['INFO', 'WARNING', 'CRITICAL'].map((sev) => (
//                     <TouchableOpacity
//                       key={sev}
//                       style={[
//                         styles.severityFilterChip,
//                         filters.severity === sev && styles.severityFilterChipActive,
//                       ]}
//                       onPress={() => setFilters({ 
//                         ...filters, 
//                         severity: filters.severity === sev ? '' : sev 
//                       })}
//                     >
//                       <Text style={[
//                         styles.severityFilterText,
//                         filters.severity === sev && styles.severityFilterTextActive,
//                       ]}>
//                         {sev}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View style={styles.filterField}>
//                 <Text style={styles.filterLabel}>Start Date</Text>
//                 <TextInput
//                   style={styles.filterInput}
//                   placeholder="YYYY-MM-DD"
//                   value={filters.startDate}
//                   onChangeText={(text) => setFilters({ ...filters, startDate: text })}
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.filterField}>
//                 <Text style={styles.filterLabel}>End Date</Text>
//                 <TextInput
//                   style={styles.filterInput}
//                   placeholder="YYYY-MM-DD"
//                   value={filters.endDate}
//                   onChangeText={(text) => setFilters({ ...filters, endDate: text })}
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.filterButtons}>
//                 <TouchableOpacity
//                   style={[styles.filterButtonAction, styles.clearFilterButton]}
//                   onPress={clearFilters}
//                 >
//                   <Text style={styles.clearFilterText}>Clear All</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.filterButtonAction, styles.applyFilterButton]}
//                   onPress={applyFilters}
//                 >
//                   <Text style={styles.applyFilterText}>Apply Filters</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
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
//     flexDirection: 'row',
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   filterButton: {
//     marginLeft: Spacing.sm,
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     padding: Spacing.md,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   statCardLeft: {
//     marginRight: Spacing.sm,
//   },
//   statCardRight: {
//     marginLeft: Spacing.sm,
//   },
//   statLabel: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   statValue: {
//     fontSize: Typography.lg,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//     marginTop: Spacing.xs,
//   },
//   criticalValue: {
//     color: Colors.error,
//   },
//   list: {
//     flex: 1,
//   },
//   listContent: {
//     padding: Spacing.md,
//   },
//   logItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   logItemRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   logIcon: {
//     fontSize: Typography['2xl'],
//     marginRight: Spacing.md,
//   },
//   logItemInfo: {
//     flex: 1,
//   },
//   logItemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   logItemAction: {
//     fontSize: Typography.md,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   logItemUser: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   logItemMeta: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: Spacing.xs,
//   },
//   logItemReason: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   severityBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   severityText: {
//     fontSize: Typography.xs,
//     fontWeight: '500',
//   },
//   severityInfo: {
//     backgroundColor: Colors.primary + '20',
//   },
//   severityInfoText: {
//     color: Colors.primary,
//   },
//   severityWarning: {
//     backgroundColor: Colors.warning + '20',
//   },
//   severityWarningText: {
//     color: Colors.warning,
//   },
//   severityCritical: {
//     backgroundColor: Colors.error + '20',
//   },
//   severityCriticalText: {
//     color: Colors.error,
//   },
//   severityDefault: {
//     backgroundColor: Colors.gray200,
//   },
//   severityDefaultText: {
//     color: Colors.gray700,
//   },
//   emptyContainer: {
//     paddingVertical: Spacing['4xl'],
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: Colors.gray500,
//     marginTop: Spacing.sm,
//   },
//   loadMoreContainer: {
//     paddingVertical: Spacing.md,
//     alignItems: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     flex: 1,
//     marginTop: 60,
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius['3xl'],
//     borderTopRightRadius: BorderRadius['3xl'],
//   },
//   filterModalContent: {
//     marginTop: 40,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//   },
//   modalBody: {
//     flex: 1,
//   },
//   modalBodyContent: {
//     padding: Spacing.md,
//   },
//   filterBodyContent: {
//     padding: Spacing.md,
//     paddingBottom: Spacing['3xl'],
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   detailLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   detailValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//     flexShrink: 1,
//     textAlign: 'right',
//     marginLeft: Spacing.md,
//   },
//   detailSection: {
//     marginTop: Spacing.md,
//   },
//   detailSectionTitle: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   detailJson: {
//     backgroundColor: Colors.gray100,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   detailJsonText: {
//     fontSize: Typography.xs,
//     color: Colors.gray700,
//     fontFamily: 'monospace',
//   },
//   hashText: {
//     fontSize: 10,
//     wordBreak: 'break-all',
//   },
//   filterField: {
//     marginBottom: Spacing.md,
//   },
//   filterLabel: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray700,
//     marginBottom: Spacing.xs,
//   },
//   filterInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   severityFilterRow: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   severityFilterChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.sm,
//     backgroundColor: Colors.gray100,
//     flex: 1,
//     alignItems: 'center',
//   },
//   severityFilterChipActive: {
//     backgroundColor: Colors.primary,
//   },
//   severityFilterText: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//   },
//   severityFilterTextActive: {
//     color: Colors.white,
//   },
//   filterButtons: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//     marginTop: Spacing.md,
//   },
//   filterButtonAction: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   clearFilterButton: {
//     backgroundColor: Colors.gray200,
//   },
//   clearFilterText: {
//     fontWeight: '600',
//     color: Colors.gray700,
//   },
//   applyFilterButton: {
//     backgroundColor: Colors.primary,
//   },
//   applyFilterText: {
//     fontWeight: '600',
//     color: Colors.white,
//   },
// });