// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   StyleSheet,
//   RefreshControl,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   ArrowLeft,
//   Save,
//   User,
//   Mail,
//   Phone,
//   Store,
//   Shield,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Edit,
//   Trash2,
//   Key,
//   Calendar,
//   Activity,
// } from "lucide-react-native";
// import UserService from "../../../../services/userService";
// import StoreService from "../../../../services/storeService";
// import { formatDate } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import { Roles } from "../../../../constants/roles";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// export default function StaffDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [user, setUser] = useState(null);
//   const [stores, setStores] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     role: "",
//     storeId: "",
//     isActive: true,
//   });

//   useEffect(() => {
//     fetchData();
//   }, [id]);

//   const fetchData = async () => {
//     try {
//       const [userData, storesData] = await Promise.all([
//         UserService.getUser(id),
//         StoreService.getStoreOptions(),
//       ]);
//       setUser(userData);
//       setStores(storesData);
//       setFormData({
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         email: userData.email,
//         phone: userData.phone || "",
//         role: userData.role,
//         storeId: userData.storeId?._id || userData.storeId || "",
//         isActive: userData.isActive !== false,
//       });
//     } catch (error) {
//       Alert.alert("Error", "Failed to load staff details");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   const handleSave = async () => {
//     if (!formData.firstName || !formData.lastName || !formData.email) {
//       Alert.alert("Error", "Please fill in all required fields");
//       return;
//     }

//     setSaving(true);
//     try {
//       await UserService.updateUser(id, {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phone: formData.phone,
//         role: formData.role,
//         storeId: formData.storeId,
//         isActive: formData.isActive,
//       });
//       Alert.alert("Success", "Staff updated successfully");
//       setIsEditing(false);
//       fetchData();
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to update staff"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleToggleStatus = () => {
//     const newStatus = !formData.isActive;
//     Alert.alert(
//       newStatus ? "Activate Staff" : "Deactivate Staff",
//       newStatus
//         ? "Are you sure you want to activate this staff member?"
//         : "Are you sure you want to deactivate this staff member?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: newStatus ? "Activate" : "Deactivate",
//           style: newStatus ? "default" : "destructive",
//           onPress: async () => {
//             try {
//               await UserService.updateUser(id, { isActive: newStatus });
//               Alert.alert("Success", `Staff ${newStatus ? "activated" : "deactivated"}`);
//               fetchData();
//             } catch (error) {
//               Alert.alert("Error", "Failed to update staff status");
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getRoleColor = (role) => {
//     const colors = {
//       SUPER_ADMIN: styles.roleSuperAdmin,
//       ADMIN: styles.roleAdmin,
//       SALES_MANAGER: styles.roleSalesManager,
//       SALES_ATTENDANT: styles.roleSalesAttendant,
//       FINANCE_MANAGER: styles.roleFinanceManager,
//       FINANCE_CASHIER: styles.roleFinanceCashier,
//       WAREHOUSE_MANAGER: styles.roleWarehouseManager,
//       WAREHOUSE_STAFF: styles.roleWarehouseStaff,
//     };
//     return colors[role] || styles.roleDefault;
//   };

//   const getRoleTextColor = (role) => {
//     const colors = {
//       SUPER_ADMIN: styles.roleSuperAdminText,
//       ADMIN: styles.roleAdminText,
//       SALES_MANAGER: styles.roleSalesManagerText,
//       SALES_ATTENDANT: styles.roleSalesAttendantText,
//       FINANCE_MANAGER: styles.roleFinanceManagerText,
//       FINANCE_CASHIER: styles.roleFinanceCashierText,
//       WAREHOUSE_MANAGER: styles.roleWarehouseManagerText,
//       WAREHOUSE_STAFF: styles.roleWarehouseStaffText,
//     };
//     return colors[role] || styles.roleDefaultText;
//   };

//   const getStoreName = (storeId) => {
//     const store = stores.find((s) => s.value === storeId);
//     return store ? store.label : "No Store Assigned";
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Staff member not found</Text>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <ArrowLeft size={20} color={Colors.gray700} />
//           <Text style={styles.backButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const roleStyle = getRoleColor(user.role);
//   const roleTextStyle = getRoleTextColor(user.role);

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Staff Details" showBack={true} />

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.content}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Staff Header Card */}
//         <View style={styles.headerCard}>
//           <View style={styles.headerRow}>
//             <View style={styles.avatarContainer}>
//               <Text style={styles.avatarText}>
//                 {user.firstName?.[0]}
//                 {user.lastName?.[0]}
//               </Text>
//             </View>
//             <View style={styles.userInfo}>
//               <Text style={styles.userName}>
//                 {user.firstName} {user.lastName}
//               </Text>
//               <View style={[styles.roleBadge, roleStyle]}>
//                 <Text style={[styles.roleBadgeText, roleTextStyle]}>
//                   {user.role.replace("_", " ")}
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity
//               style={styles.editButton}
//               onPress={() => setIsEditing(!isEditing)}
//             >
//               <Edit size={20} color={isEditing ? Colors.primary : Colors.gray500} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.statusContainer}>
//             <View
//               style={[
//                 styles.statusBadge,
//                 user.isActive !== false ? styles.statusActive : styles.statusInactive,
//               ]}
//             >
//               {user.isActive !== false ? (
//                 <CheckCircle size={14} color={Colors.success} />
//               ) : (
//                 <XCircle size={14} color={Colors.error} />
//               )}
//               <Text
//                 style={[
//                   styles.statusText,
//                   user.isActive !== false
//                     ? styles.statusActiveText
//                     : styles.statusInactiveText,
//                 ]}
//               >
//                 {user.isActive !== false ? "Active" : "Inactive"}
//               </Text>
//             </View>
//             <Text style={styles.userEmail}>{user.email}</Text>
//           </View>
//         </View>

//         {/* Quick Info Cards */}
//         <View style={styles.quickInfoContainer}>
//           <View style={styles.quickInfoCard}>
//             <Mail size={16} color={Colors.gray500} />
//             <Text style={styles.quickInfoLabel}>Email</Text>
//             <Text style={styles.quickInfoValue}>{user.email}</Text>
//           </View>
//           <View style={styles.quickInfoCard}>
//             <Phone size={16} color={Colors.gray500} />
//             <Text style={styles.quickInfoLabel}>Phone</Text>
//             <Text style={styles.quickInfoValue}>{user.phone || "N/A"}</Text>
//           </View>
//           <View style={styles.quickInfoCard}>
//             <Store size={16} color={Colors.gray500} />
//             <Text style={styles.quickInfoLabel}>Store</Text>
//             <Text style={styles.quickInfoValue}>
//               {user.storeId?.name || "No Store"}
//             </Text>
//           </View>
//           <View style={styles.quickInfoCard}>
//             <Calendar size={16} color={Colors.gray500} />
//             <Text style={styles.quickInfoLabel}>Joined</Text>
//             <Text style={styles.quickInfoValue}>
//               {formatDate(user.createdAt)}
//             </Text>
//           </View>
//         </View>

//         {/* Edit Form or Details */}
//         {isEditing ? (
//           <View style={styles.editCard}>
//             <Text style={styles.sectionTitle}>Edit Staff</Text>
//             <View style={styles.formRow}>
//               <View style={[styles.formField, styles.halfField]}>
//                 <Text style={styles.formLabel}>First Name *</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   value={formData.firstName}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, firstName: text })
//                   }
//                 />
//               </View>
//               <View style={[styles.formField, styles.halfField]}>
//                 <Text style={styles.formLabel}>Last Name *</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   value={formData.lastName}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, lastName: text })
//                   }
//                 />
//               </View>
//             </View>
//             <View style={styles.formField}>
//               <Text style={styles.formLabel}>Email *</Text>
//               <TextInput
//                 style={styles.formInput}
//                 value={formData.email}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, email: text.toLowerCase() })
//                 }
//                 autoCapitalize="none"
//               />
//             </View>
//             <View style={styles.formField}>
//               <Text style={styles.formLabel}>Phone</Text>
//               <TextInput
//                 style={styles.formInput}
//                 value={formData.phone}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, phone: text })
//                 }
//               />
//             </View>
//             <View style={styles.formField}>
//               <Text style={styles.formLabel}>Role</Text>
//               <View style={styles.rolePicker}>
//                 {Object.values(Roles).map((role) => (
//                   <TouchableOpacity
//                     key={role}
//                     style={[
//                       styles.roleOption,
//                       formData.role === role && styles.roleOptionActive,
//                     ]}
//                     onPress={() => setFormData({ ...formData, role })}
//                   >
//                     <Text
//                       style={[
//                         styles.roleOptionText,
//                         formData.role === role && styles.roleOptionTextActive,
//                       ]}
//                     >
//                       {role.replace("_", " ")}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//             <View style={styles.formField}>
//               <Text style={styles.formLabel}>Store</Text>
//               {stores.length === 0 ? (
//                 <Text style={styles.noStoreText}>No stores available</Text>
//               ) : stores.length === 1 ? (
//                 <Text style={styles.singleStoreText}>
//                   {stores[0].label} (Auto-assigned)
//                 </Text>
//               ) : (
//                 <View style={styles.storePicker}>
//                   {stores.map((store) => (
//                     <TouchableOpacity
//                       key={store.value}
//                       style={[
//                         styles.storeOption,
//                         formData.storeId === store.value &&
//                           styles.storeOptionActive,
//                       ]}
//                       onPress={() =>
//                         setFormData({ ...formData, storeId: store.value })
//                       }
//                     >
//                       <Text
//                         style={[
//                           styles.storeOptionText,
//                           formData.storeId === store.value &&
//                             styles.storeOptionTextActive,
//                         ]}
//                       >
//                         {store.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </View>
//             <View style={styles.formField}>
//               <Text style={styles.formLabel}>Status</Text>
//               <View style={styles.statusPicker}>
//                 <TouchableOpacity
//                   style={[
//                     styles.statusOption,
//                     formData.isActive && styles.statusOptionActive,
//                   ]}
//                   onPress={() => setFormData({ ...formData, isActive: true })}
//                 >
//                   <Text
//                     style={[
//                       styles.statusOptionText,
//                       formData.isActive && styles.statusOptionTextActive,
//                     ]}
//                   >
//                     Active
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.statusOption,
//                     !formData.isActive && styles.statusOptionActive,
//                   ]}
//                   onPress={() => setFormData({ ...formData, isActive: false })}
//                 >
//                   <Text
//                     style={[
//                       styles.statusOptionText,
//                       !formData.isActive && styles.statusOptionTextActive,
//                     ]}
//                   >
//                     Inactive
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.buttonRow}>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={() => {
//                   setIsEditing(false);
//                   fetchData();
//                 }}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.button,
//                   styles.submitButton,
//                   saving && styles.buttonDisabled,
//                 ]}
//                 onPress={handleSave}
//                 disabled={saving}
//               >
//                 <Text style={styles.submitButtonText}>
//                   {saving ? "Saving..." : "Save Changes"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.detailsCard}>
//             <Text style={styles.sectionTitle}>Staff Information</Text>

//             <View style={styles.detailRow}>
//               <View style={styles.detailIcon}>
//                 <User size={16} color={Colors.gray500} />
//               </View>
//               <Text style={styles.detailLabel}>Full Name</Text>
//               <Text style={styles.detailValue}>
//                 {user.firstName} {user.lastName}
//               </Text>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.detailIcon}>
//                 <Mail size={16} color={Colors.gray500} />
//               </View>
//               <Text style={styles.detailLabel}>Email</Text>
//               <Text style={styles.detailValue}>{user.email}</Text>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.detailIcon}>
//                 <Phone size={16} color={Colors.gray500} />
//               </View>
//               <Text style={styles.detailLabel}>Phone</Text>
//               <Text style={styles.detailValue}>{user.phone || "N/A"}</Text>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.detailIcon}>
//                 <Shield size={16} color={Colors.gray500} />
//               </View>
//               <Text style={styles.detailLabel}>Role</Text>
//               <View style={[styles.detailRoleBadge, roleStyle]}>
//                 <Text style={[styles.detailRoleText, roleTextStyle]}>
//                   {user.role.replace("_", " ")}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.detailIcon}>
//                 <Store size={16} color={Colors.gray500} />
//               </View>
//               <Text style={styles.detailLabel}>Store</Text>
//               <Text style={styles.detailValue}>
//                 {user.storeId?.name || "No Store Assigned"}
//               </Text>
//             </View>

//             {user.storeId?.code && (
//               <View style={styles.detailRow}>
//                 <View style={styles.detailIcon}>
//                   <Text style={styles.detailCodeIcon}>#</Text>
//                 </View>
//                 <Text style={styles.detailLabel}>Store Code</Text>
//                 <Text style={styles.detailValue}>{user.storeId.code}</Text>
//               </View>
//             )}

//             <View style={styles.detailRow}>
//               <View style={styles.detailIcon}>
//                 <Clock size={16} color={Colors.gray500} />
//               </View>
//               <Text style={styles.detailLabel}>Joined</Text>
//               <Text style={styles.detailValue}>
//                 {formatDate(user.createdAt)}
//               </Text>
//             </View>

//             {user.lastLogin && (
//               <View style={styles.detailRow}>
//                 <View style={styles.detailIcon}>
//                   <Activity size={16} color={Colors.gray500} />
//                 </View>
//                 <Text style={styles.detailLabel}>Last Login</Text>
//                 <Text style={styles.detailValue}>
//                   {formatDate(user.lastLogin)}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Action Buttons */}
//         {!isEditing && (
//           <View style={styles.actionButtons}>
//             <TouchableOpacity
//               style={[
//                 styles.actionButton,
//                 user.isActive !== false
//                   ? styles.deactivateButton
//                   : styles.activateButton,
//               ]}
//               onPress={handleToggleStatus}
//             >
//               <Text
//                 style={[
//                   styles.actionButtonText,
//                   user.isActive !== false
//                     ? styles.deactivateButtonText
//                     : styles.activateButtonText,
//                 ]}
//               >
//                 {user.isActive !== false ? "Deactivate Staff" : "Activate Staff"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   errorText: { color: Colors.gray500, fontSize: Typography.lg },
//   scrollView: { flex: 1 },
//   content: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },

//   // Header Card
//   headerCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatarContainer: {
//     width: 56,
//     height: 56,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.white,
//   },
//   userInfo: {
//     flex: 1,
//     marginLeft: Spacing.md,
//   },
//   userName: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//   },
//   roleBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     marginTop: 2,
//   },
//   roleBadgeText: {
//     fontSize: Typography.xs,
//     fontWeight: "500",
//   },
//   roleSuperAdmin: { backgroundColor: "#8B5CF6" + "20" },
//   roleSuperAdminText: { color: "#8B5CF6" },
//   roleAdmin: { backgroundColor: Colors.primary + "20" },
//   roleAdminText: { color: Colors.primary },
//   roleSalesManager: { backgroundColor: Colors.success + "20" },
//   roleSalesManagerText: { color: Colors.success },
//   roleSalesAttendant: { backgroundColor: "#14B8A6" + "20" },
//   roleSalesAttendantText: { color: "#14B8A6" },
//   roleFinanceManager: { backgroundColor: "#8B5CF6" + "20" },
//   roleFinanceManagerText: { color: "#8B5CF6" },
//   roleFinanceCashier: { backgroundColor: "#06B6D4" + "20" },
//   roleFinanceCashierText: { color: "#06B6D4" },
//   roleWarehouseManager: { backgroundColor: "#F59E0B" + "20" },
//   roleWarehouseManagerText: { color: "#F59E0B" },
//   roleWarehouseStaff: { backgroundColor: "#FCD34D" + "20" },
//   roleWarehouseStaffText: { color: "#92400E" },
//   roleDefault: { backgroundColor: Colors.gray200 },
//   roleDefaultText: { color: Colors.gray700 },

//   editButton: {
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.gray100,
//   },
//   statusContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: Spacing.md,
//     paddingTop: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   statusText: {
//     fontSize: Typography.xs,
//     fontWeight: "500",
//     marginLeft: 4,
//   },
//   statusActive: { backgroundColor: Colors.success + "20" },
//   statusActiveText: { color: Colors.success },
//   statusInactive: { backgroundColor: Colors.error + "20" },
//   statusInactiveText: { color: Colors.error },
//   userEmail: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginLeft: Spacing.md,
//   },

//   // Quick Info
//   quickInfoContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: Spacing.md,
//     gap:Spacing.sm
//   },
//   quickInfoCard: {
//     width: "48%",
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     alignItems: "center",
//     ...Shadows.sm,
//   },
//   quickInfoLabel: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   quickInfoValue: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//     textAlign: "center",
//   },

//   // Details
//   detailsCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   sectionTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//     marginBottom: Spacing.md,
//   },
//   detailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   detailIcon: {
//     width: 24,
//     alignItems: "center",
//   },
//   detailCodeIcon: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "bold",
//   },
//   detailLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//     marginLeft: Spacing.sm,
//     width: 80,
//   },
//   detailValue: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray900,
//     flex: 1,
//     textAlign: "right",
//   },
//   detailRoleBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   detailRoleText: {
//     fontSize: Typography.xs,
//     fontWeight: "500",
//   },

//   // Edit Form
//   editCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   formField: { marginBottom: Spacing.md },
//   formLabel: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray700,
//     marginBottom: Spacing.xs,
//   },
//   formInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     fontSize: Typography.md,
//   },
//   formRow: { flexDirection: "row", gap: Spacing.sm },
//   halfField: { flex: 1 },
//   rolePicker: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
//   roleOption: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.sm,
//     backgroundColor: Colors.gray100,
//     minWidth: "30%",
//     alignItems: "center",
//   },
//   roleOptionActive: { backgroundColor: Colors.primary },
//   roleOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
//   roleOptionTextActive: { color: Colors.white },
//   storePicker: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
//   storeOption: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.sm,
//     backgroundColor: Colors.gray100,
//     minWidth: "45%",
//     alignItems: "center",
//   },
//   storeOptionActive: { backgroundColor: Colors.primary },
//   storeOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
//   storeOptionTextActive: { color: Colors.white },
//   noStoreText: { fontSize: Typography.sm, color: Colors.error },
//   singleStoreText: {
//     fontSize: Typography.sm,
//     color: Colors.primary,
//     fontWeight: "500",
//   },
//   statusPicker: { flexDirection: "row", gap: Spacing.sm },
//   statusOption: {
//     flex: 1,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.sm,
//     backgroundColor: Colors.gray100,
//     alignItems: "center",
//   },
//   statusOptionActive: { backgroundColor: Colors.primary },
//   statusOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
//   statusOptionTextActive: { color: Colors.white },
//   buttonRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
//   button: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelButton: { backgroundColor: Colors.gray200 },
//   cancelButtonText: { fontWeight: "600", color: Colors.gray700 },
//   submitButton: { backgroundColor: Colors.primary },
//   submitButtonText: { fontWeight: "600", color: Colors.white },
//   buttonDisabled: { opacity: 0.7 },

//   // Action Buttons
//   actionButtons: {
//     marginBottom: Spacing.md,
//   },
//   actionButton: {
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   deactivateButton: {
//     backgroundColor: Colors.error + "10",
//     borderWidth: 1,
//     borderColor: Colors.error,
//   },
//   activateButton: {
//     backgroundColor: Colors.success + "10",
//     borderWidth: 1,
//     borderColor: Colors.success,
//   },
//   actionButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//   },
//   deactivateButtonText: { color: Colors.error },
//   activateButtonText: { color: Colors.success },

//   // Back Button
//   backButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     backgroundColor: Colors.gray200,
//     borderRadius: BorderRadius.lg,
//     marginTop: Spacing.sm,
//   },
//   backButtonText: {
//     color: Colors.gray700,
//     fontWeight: "600",
//     marginLeft: Spacing.sm,
//   },
// });























// app/(admin)/staff/[id]/index.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Store,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Key,
  Calendar,
  Activity,
} from "lucide-react-native";
import UserService from "../../../../services/userService";
import StoreService from "../../../../services/storeService";
import { formatDate } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import { Roles } from "../../../../constants/roles";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    storeId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [userData, storesData] = await Promise.all([
        UserService.getUser(id),
        StoreService.getStoreOptions(),
      ]);
      setUser(userData);
      setStores(storesData);
      const isSuperAdminRole = userData.role === Roles.SUPER_ADMIN;
      setIsSuperAdmin(isSuperAdminRole);
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || "",
        role: userData.role,
        storeId: isSuperAdminRole ? "" : (userData.storeId?._id || userData.storeId || ""),
        isActive: userData.isActive !== false,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load staff details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Validate store selection for non-super-admin roles
    if (formData.role !== Roles.SUPER_ADMIN && !formData.storeId) {
      Alert.alert("Error", "Please select a store for this user");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive,
      };

      // Only include storeId for non-super-admin roles
      if (formData.role !== Roles.SUPER_ADMIN) {
        payload.storeId = formData.storeId;
      }

      await UserService.updateUser(id, payload);
      Alert.alert("Success", "Staff updated successfully");
      setIsEditing(false);
      fetchData();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update staff"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = !formData.isActive;
    Alert.alert(
      newStatus ? "Activate Staff" : "Deactivate Staff",
      newStatus
        ? "Are you sure you want to activate this staff member?"
        : "Are you sure you want to deactivate this staff member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: newStatus ? "Activate" : "Deactivate",
          style: newStatus ? "default" : "destructive",
          onPress: async () => {
            try {
              await UserService.updateUser(id, { isActive: newStatus });
              Alert.alert("Success", `Staff ${newStatus ? "activated" : "deactivated"}`);
              fetchData();
            } catch (error) {
              Alert.alert("Error", "Failed to update staff status");
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role) => {
    const colors = {
      SUPER_ADMIN: styles.roleSuperAdmin,
      ADMIN: styles.roleAdmin,
      SALES_MANAGER: styles.roleSalesManager,
      SALES_ATTENDANT: styles.roleSalesAttendant,
      FINANCE_MANAGER: styles.roleFinanceManager,
      FINANCE_CASHIER: styles.roleFinanceCashier,
      WAREHOUSE_MANAGER: styles.roleWarehouseManager,
      WAREHOUSE_STAFF: styles.roleWarehouseStaff,
    };
    return colors[role] || styles.roleDefault;
  };

  const getRoleTextColor = (role) => {
    const colors = {
      SUPER_ADMIN: styles.roleSuperAdminText,
      ADMIN: styles.roleAdminText,
      SALES_MANAGER: styles.roleSalesManagerText,
      SALES_ATTENDANT: styles.roleSalesAttendantText,
      FINANCE_MANAGER: styles.roleFinanceManagerText,
      FINANCE_CASHIER: styles.roleFinanceCashierText,
      WAREHOUSE_MANAGER: styles.roleWarehouseManagerText,
      WAREHOUSE_STAFF: styles.roleWarehouseStaffText,
    };
    return colors[role] || styles.roleDefaultText;
  };

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.value === storeId);
    return store ? store.label : "No Store Assigned";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Staff member not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.gray700} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const roleStyle = getRoleColor(user.role);
  const roleTextStyle = getRoleTextColor(user.role);
  const isSuperAdminUser = user.role === Roles.SUPER_ADMIN;

  return (
    <View style={styles.container}>
      <CustomHeader title="Staff Details" showBack={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Staff Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
              <View style={[styles.roleBadge, roleStyle]}>
                <Text style={[styles.roleBadgeText, roleTextStyle]}>
                  {user.role.replace("_", " ")}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit size={20} color={isEditing ? Colors.primary : Colors.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                user.isActive !== false ? styles.statusActive : styles.statusInactive,
              ]}
            >
              {user.isActive !== false ? (
                <CheckCircle size={14} color={Colors.success} />
              ) : (
                <XCircle size={14} color={Colors.error} />
              )}
              <Text
                style={[
                  styles.statusText,
                  user.isActive !== false
                    ? styles.statusActiveText
                    : styles.statusInactiveText,
                ]}
              >
                {user.isActive !== false ? "Active" : "Inactive"}
              </Text>
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoCard}>
            <Mail size={16} color={Colors.gray500} />
            <Text style={styles.quickInfoLabel}>Email</Text>
            <Text style={styles.quickInfoValue}>{user.email}</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <Phone size={16} color={Colors.gray500} />
            <Text style={styles.quickInfoLabel}>Phone</Text>
            <Text style={styles.quickInfoValue}>{user.phone || "N/A"}</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <Store size={16} color={Colors.gray500} />
            <Text style={styles.quickInfoLabel}>Store</Text>
            {isSuperAdminUser ? (
              <View style={styles.allStoresBadge}>
                <Shield size={14} color={Colors.primary} />
                <Text style={styles.allStoresText}>All Stores</Text>
              </View>
            ) : (
              <Text style={styles.quickInfoValue}>
                {user.storeId?.name || "No Store"}
              </Text>
            )}
          </View>
          <View style={styles.quickInfoCard}>
            <Calendar size={16} color={Colors.gray500} />
            <Text style={styles.quickInfoLabel}>Joined</Text>
            <Text style={styles.quickInfoValue}>
              {formatDate(user.createdAt)}
            </Text>
          </View>
        </View>

        {/* Edit Form or Details */}
        {isEditing ? (
          <View style={styles.editCard}>
            <Text style={styles.sectionTitle}>Edit Staff</Text>
            <View style={styles.formRow}>
              <View style={[styles.formField, styles.halfField]}>
                <Text style={styles.formLabel}>First Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.firstName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, firstName: text })
                  }
                />
              </View>
              <View style={[styles.formField, styles.halfField]}>
                <Text style={styles.formLabel}>Last Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.lastName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, lastName: text })
                  }
                />
              </View>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text.toLowerCase() })
                }
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
              />
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Role *</Text>
              <View style={styles.rolePicker}>
                {Object.values(Roles).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      formData.role === role && styles.roleOptionActive,
                    ]}
                    onPress={() => {
                      setFormData({ 
                        ...formData, 
                        role,
                        storeId: role === Roles.SUPER_ADMIN ? "" : formData.storeId
                      });
                      setIsSuperAdmin(role === Roles.SUPER_ADMIN);
                    }}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        formData.role === role && styles.roleOptionTextActive,
                      ]}
                    >
                      {role.replace("_", " ")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>
                {formData.role === Roles.SUPER_ADMIN ? "Store Access" : "Store *"}
              </Text>
              {formData.role === Roles.SUPER_ADMIN ? (
                <View style={styles.allStoresContainer}>
                  <Shield size={20} color={Colors.primary} />
                  <Text style={styles.allStoresInfo}>
                    Super Admin has access to <Text style={styles.allStoresHighlight}>ALL stores</Text>
                  </Text>
                </View>
              ) : stores.length === 0 ? (
                <Text style={styles.noStoreText}>No stores available. Please create a store first.</Text>
              ) : stores.length === 1 ? (
                <Text style={styles.singleStoreText}>
                  {stores[0].label} (Auto-assigned)
                </Text>
              ) : (
                <View style={styles.storePicker}>
                  {stores.map((store) => (
                    <TouchableOpacity
                      key={store.value}
                      style={[
                        styles.storeOption,
                        formData.storeId === store.value &&
                          styles.storeOptionActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, storeId: store.value })
                      }
                    >
                      <Text
                        style={[
                          styles.storeOptionText,
                          formData.storeId === store.value &&
                            styles.storeOptionTextActive,
                        ]}
                      >
                        {store.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Status</Text>
              <View style={styles.statusPicker}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    formData.isActive && styles.statusOptionActive,
                  ]}
                  onPress={() => setFormData({ ...formData, isActive: true })}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      formData.isActive && styles.statusOptionTextActive,
                    ]}
                  >
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    !formData.isActive && styles.statusOptionActive,
                  ]}
                  onPress={() => setFormData({ ...formData, isActive: false })}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      !formData.isActive && styles.statusOptionTextActive,
                    ]}
                  >
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  fetchData();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  saving && styles.buttonDisabled,
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.submitButtonText}>
                  {saving ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Staff Information</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <User size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>
                {user.firstName} {user.lastName}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Mail size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{user.email}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Phone size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user.phone || "N/A"}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Shield size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Role</Text>
              <View style={[styles.detailRoleBadge, roleStyle]}>
                <Text style={[styles.detailRoleText, roleTextStyle]}>
                  {user.role.replace("_", " ")}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Store size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Store</Text>
              {isSuperAdminUser ? (
                <View style={styles.allStoresBadge}>
                  <Shield size={14} color={Colors.primary} />
                  <Text style={styles.allStoresText}>All Stores</Text>
                </View>
              ) : (
                <Text style={styles.detailValue}>
                  {user.storeId?.name || "No Store Assigned"}
                </Text>
              )}
            </View>

            {user.storeId?.code && !isSuperAdminUser && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text style={styles.detailCodeIcon}>#</Text>
                </View>
                <Text style={styles.detailLabel}>Store Code</Text>
                <Text style={styles.detailValue}>{user.storeId.code}</Text>
              </View>
            )}

            {isSuperAdminUser && user.assignedStores && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Store size={16} color={Colors.gray500} />
                </View>
                <Text style={styles.detailLabel}>Assigned Stores</Text>
                <Text style={styles.detailValue}>
                  {user.assignedStores?.length || 0} stores
                </Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Clock size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Joined</Text>
              <Text style={styles.detailValue}>
                {formatDate(user.createdAt)}
              </Text>
            </View>

            {user.lastLogin && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Activity size={16} color={Colors.gray500} />
                </View>
                <Text style={styles.detailLabel}>Last Login</Text>
                <Text style={styles.detailValue}>
                  {formatDate(user.lastLogin)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                user.isActive !== false
                  ? styles.deactivateButton
                  : styles.activateButton,
              ]}
              onPress={handleToggleStatus}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  user.isActive !== false
                    ? styles.deactivateButtonText
                    : styles.activateButtonText,
                ]}
              >
                {user.isActive !== false ? "Deactivate Staff" : "Activate Staff"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: Colors.gray500, fontSize: Typography.lg },
  scrollView: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },

  // Header Card
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: Typography.xs,
    fontWeight: "500",
  },
  roleSuperAdmin: { backgroundColor: "#8B5CF6" + "20" },
  roleSuperAdminText: { color: "#8B5CF6" },
  roleAdmin: { backgroundColor: Colors.primary + "20" },
  roleAdminText: { color: Colors.primary },
  roleSalesManager: { backgroundColor: Colors.success + "20" },
  roleSalesManagerText: { color: Colors.success },
  roleSalesAttendant: { backgroundColor: "#14B8A6" + "20" },
  roleSalesAttendantText: { color: "#14B8A6" },
  roleFinanceManager: { backgroundColor: "#8B5CF6" + "20" },
  roleFinanceManagerText: { color: "#8B5CF6" },
  roleFinanceCashier: { backgroundColor: "#06B6D4" + "20" },
  roleFinanceCashierText: { color: "#06B6D4" },
  roleWarehouseManager: { backgroundColor: "#F59E0B" + "20" },
  roleWarehouseManagerText: { color: "#F59E0B" },
  roleWarehouseStaff: { backgroundColor: "#FCD34D" + "20" },
  roleWarehouseStaffText: { color: "#92400E" },
  roleDefault: { backgroundColor: Colors.gray200 },
  roleDefaultText: { color: Colors.gray700 },

  editButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: "500",
    marginLeft: 4,
  },
  statusActive: { backgroundColor: Colors.success + "20" },
  statusActiveText: { color: Colors.success },
  statusInactive: { backgroundColor: Colors.error + "20" },
  statusInactiveText: { color: Colors.error },
  userEmail: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginLeft: Spacing.md,
  },

  // Quick Info
  quickInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  quickInfoCard: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: "center",
    ...Shadows.sm,
  },
  quickInfoLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  quickInfoValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    textAlign: "center",
  },

  // All Stores Badge
  allStoresBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
    marginTop: 2,
  },
  allStoresText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: "500",
  },
  allStoresContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  allStoresInfo: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    flex: 1,
  },
  allStoresHighlight: {
    color: Colors.primary,
    fontWeight: "600",
  },

  // Details
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailIcon: {
    width: 24,
    alignItems: "center",
  },
  detailCodeIcon: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: "bold",
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    width: 80,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    flex: 1,
    textAlign: "right",
  },
  detailRoleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  detailRoleText: {
    fontSize: Typography.xs,
    fontWeight: "500",
  },

  // Edit Form
  editCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  formField: { marginBottom: Spacing.md },
  formLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.md,
  },
  formRow: { flexDirection: "row", gap: Spacing.sm },
  halfField: { flex: 1 },
  rolePicker: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  roleOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray100,
    minWidth: "30%",
    alignItems: "center",
  },
  roleOptionActive: { backgroundColor: Colors.primary },
  roleOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
  roleOptionTextActive: { color: Colors.white },
  storePicker: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  storeOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray100,
    minWidth: "45%",
    alignItems: "center",
  },
  storeOptionActive: { backgroundColor: Colors.primary },
  storeOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
  storeOptionTextActive: { color: Colors.white },
  noStoreText: { fontSize: Typography.sm, color: Colors.error },
  singleStoreText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: "500",
  },
  statusPicker: { flexDirection: "row", gap: Spacing.sm },
  statusOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray100,
    alignItems: "center",
  },
  statusOptionActive: { backgroundColor: Colors.primary },
  statusOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
  statusOptionTextActive: { color: Colors.white },
  buttonRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: "600", color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },

  // Action Buttons
  actionButtons: {
    marginBottom: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  deactivateButton: {
    backgroundColor: Colors.error + "10",
    borderWidth: 1,
    borderColor: Colors.error,
  },
  activateButton: {
    backgroundColor: Colors.success + "10",
    borderWidth: 1,
    borderColor: Colors.success,
  },
  actionButtonText: {
    fontSize: Typography.md,
    fontWeight: "600",
  },
  deactivateButtonText: { color: Colors.error },
  activateButtonText: { color: Colors.success },

  // Back Button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  backButtonText: {
    color: Colors.gray700,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
});