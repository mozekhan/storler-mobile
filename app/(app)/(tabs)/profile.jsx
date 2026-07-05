// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Switch,
//   StyleSheet,
//   Modal,
//   FlatList,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../../hooks/useAuth';
// import { useRole } from '../../../hooks/useRole';
// import {
//   User,
//   LogOut,
//   Shield,
//   Bell,
//   Lock,
//   Smartphone,
//   ChevronRight,
//   Store,
//   Check,
//   Package,
//   CreditCard,
//   ShoppingBag,
//   Settings,
//   HelpCircle,
//   Mail,
//   Phone,
//   Calendar,
// } from 'lucide-react-native';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';

// export default function Profile() {
//   const { user, logout, currentStore, accessibleStores, switchStore } = useAuth();
//   const { role, isSuperAdmin, isAdmin } = useRole();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [biometrics, setBiometrics] = useState(false);
//   const [showStoreSelector, setShowStoreSelector] = useState(false);

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             setLoading(true);
//             await logout();
//             router.replace('/(auth)/login');
//             setLoading(false);
//           },
//         },
//       ]
//     );
//   };

//   const getInitials = () => {
//     if (!user) return '?';
//     return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
//   };

//   const getRoleLabel = (role) => {
//     const labels = {
//       SUPER_ADMIN: 'Super Admin',
//       ADMIN: 'Admin',
//       SALES_MANAGER: 'Sales Manager',
//       SALES_ATTENDANT: 'Sales Attendant',
//       FINANCE_MANAGER: 'Finance Manager',
//       FINANCE_CASHIER: 'Finance Cashier',
//       WAREHOUSE_MANAGER: 'Warehouse Manager',
//       WAREHOUSE_STAFF: 'Warehouse Staff',
//     };
//     return labels[role] || role;
//   };

//   const handleSwitchStore = async (storeId) => {
//     setLoading(true);
//     try {
//       const result = await switchStore(storeId);
//       if (result.success) {
//         setShowStoreSelector(false);
//         Alert.alert('Success', `Switched to ${result.store.name}`);
//       } else {
//         Alert.alert('Error', result.error || 'Failed to switch store');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to switch store');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const MenuItem = ({ icon: Icon, title, subtitle, onPress, right, badge }) => (
//     <TouchableOpacity
//       style={styles.menuItem}
//       onPress={onPress}
//       disabled={!onPress}
//     >
//       <View style={styles.menuItemIcon}>
//         <Icon size={20} color={Colors.gray500} />
//       </View>
//       <View style={styles.menuItemInfo}>
//         <View style={styles.menuItemHeader}>
//           <Text style={styles.menuItemTitle}>{title}</Text>
//           {badge && (
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{badge}</Text>
//             </View>
//           )}
//         </View>
//         {subtitle && (
//           <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
//         )}
//       </View>
//       {right || <ChevronRight size={20} color={Colors.gray400} />}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         <View style={styles.profileHeader}>
//           <View style={styles.avatarContainer}>
//             <Text style={styles.avatarText}>
//               {getInitials()}
//             </Text>
//           </View>
//           <Text style={styles.userName}>
//             {user?.firstName} {user?.lastName}
//           </Text>
//           <View style={styles.roleBadge}>
//             <Text style={styles.roleBadgeText}>
//               {getRoleLabel(role)}
//             </Text>
//           </View>
//           <Text style={styles.userEmail}>{user?.email}</Text>
//           <TouchableOpacity
//             style={styles.userStore}
//             onPress={() => {
//               if (accessibleStores?.length > 1 || isSuperAdmin) {
//                 setShowStoreSelector(true);
//               }
//             }}
//           >
//             <Store size={14} color={Colors.gray400} />
//             <Text style={styles.userStoreText}>
//               {currentStore?.name || user?.storeId?.name || 'No Store'}
//             </Text>
//             {(accessibleStores?.length > 1 || isSuperAdmin) && (
//               <ChevronRight size={14} color={Colors.gray400} />
//             )}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Account Information</Text>
//           <View style={styles.infoRow}>
//             <Phone size={16} color={Colors.gray400} />
//             <Text style={styles.infoLabel}>Phone</Text>
//             <Text style={styles.infoValue}>
//               {user?.phone || 'N/A'}
//             </Text>
//           </View>
//           <View style={[styles.infoRow, styles.infoRowBorder]}>
//             <Calendar size={16} color={Colors.gray400} />
//             <Text style={styles.infoLabel}>Member Since</Text>
//             <Text style={styles.infoValue}>
//               {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//             </Text>
//           </View>
//           {(isSuperAdmin || isAdmin) && (
//             <View style={[styles.infoRow, styles.infoRowBorder]}>
//               <Shield size={16} color={Colors.gray400} />
//               <Text style={styles.infoLabel}>Access Level</Text>
//               <Text style={styles.infoValue}>Full Admin</Text>
//             </View>
//           )}
//           <View style={[styles.infoRow, styles.infoRowBorder]}>
//             <Store size={16} color={Colors.gray400} />
//             <Text style={styles.infoLabel}>Current Store</Text>
//             <Text style={styles.infoValue}>
//               {currentStore?.name || user?.storeId?.name || 'N/A'}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Settings</Text>
//           <MenuItem
//             icon={Bell}
//             title="Notifications"
//             subtitle="Push notifications"
//             onPress={() => setNotifications(!notifications)}
//             right={
//               <Switch
//                 value={notifications}
//                 onValueChange={setNotifications}
//                 trackColor={{ false: Colors.gray300, true: Colors.primary }}
//               />
//             }
//           />
//           <MenuItem
//             icon={Lock}
//             title="Change Password"
//             subtitle="Update your password"
//             onPress={() => router.push('/(auth)/change-password')}
//           />
//           <MenuItem
//             icon={Smartphone}
//             title="Biometric Login"
//             subtitle="Use fingerprint or face ID"
//             onPress={() => setBiometrics(!biometrics)}
//             right={
//               <Switch
//                 value={biometrics}
//                 onValueChange={setBiometrics}
//                 trackColor={{ false: Colors.gray300, true: Colors.primary }}
//               />
//             }
//           />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Quick Access</Text>
//           <MenuItem
//             icon={ShoppingBag}
//             title="My Transactions"
//             subtitle="View your transaction history"
//             onPress={() => router.push('/(app)/(stacks)/transactions')}
//           />
//           <MenuItem
//             icon={Package}
//             title="Products"
//             subtitle="Browse product catalog"
//             onPress={() => router.push('/(app)/(stacks)/products')}
//           />
//           {isSuperAdmin && (
//             <MenuItem
//               icon={Settings}
//               title="Admin Dashboard"
//               subtitle="System administration"
//               onPress={() => router.push('/(admin)')}
//               badge="Admin"
//             />
//           )}
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Support</Text>
//           <MenuItem
//             icon={HelpCircle}
//             title="Help Center"
//             subtitle="FAQs and guides"
//             onPress={() => Alert.alert('Help Center', 'Help content coming soon')}
//           />
//           <MenuItem
//             icon={Mail}
//             title="Contact Support"
//             subtitle="Get help from our team"
//             onPress={() => Alert.alert('Support', 'support@store.com')}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.logoutButton}
//           onPress={handleLogout}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color={Colors.error} />
//           ) : (
//             <>
//               <LogOut size={20} color={Colors.error} />
//               <Text style={styles.logoutButtonText}>Logout</Text>
//             </>
//           )}
//         </TouchableOpacity>

//         <Text style={styles.versionText}>
//           Version 1.0.0 • Store Management System
//         </Text>
//       </ScrollView>

//       {/* Store Selector Modal */}
//       <Modal
//         visible={showStoreSelector}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowStoreSelector(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Switch Store</Text>
//               <TouchableOpacity onPress={() => setShowStoreSelector(false)}>
//                 <Text style={styles.modalClose}>Close</Text>
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={accessibleStores}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => {
//                 const isSelected = item._id === currentStore?._id;
//                 return (
//                   <TouchableOpacity
//                     style={[styles.storeItem, isSelected && styles.storeItemSelected]}
//                     onPress={() => handleSwitchStore(item._id)}
//                     disabled={loading}
//                   >
//                     <View style={styles.storeItemLeft}>
//                       <Store size={20} color={isSelected ? Colors.primary : Colors.gray500} />
//                       <View style={styles.storeItemInfo}>
//                         <Text style={[styles.storeItemName, isSelected && styles.storeItemNameSelected]}>
//                           {item.name}
//                         </Text>
//                         <Text style={styles.storeItemCode}>Code: {item.code}</Text>
//                       </View>
//                     </View>
//                     {isSelected && <Check size={20} color={Colors.primary} />}
//                   </TouchableOpacity>
//                 );
//               }}
//               contentContainerStyle={styles.storeList}
//               ListEmptyComponent={() => (
//                 <Text style={styles.emptyText}>No stores available</Text>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing['3xl'],
//   },
//   profileHeader: {
//     alignItems: 'center',
//     paddingVertical: Spacing['2xl'],
//   },
//   avatarContainer: {
//     width: 96,
//     height: 96,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.primary + '15',
//     alignItems: 'center',
//     justifyContent: 'center',
//     ...Shadows.sm,
//   },
//   avatarText: {
//     fontSize: Typography['3xl'],
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   userName: {
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//     marginTop: Spacing.md,
//   },
//   roleBadge: {
//     backgroundColor: Colors.primary + '10',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//     marginTop: Spacing.xs,
//   },
//   roleBadgeText: {
//     color: Colors.primary,
//     fontSize: Typography.sm,
//     fontWeight: '500',
//   },
//   userEmail: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   userStore: {
//     fontSize: Typography.sm,
//     color: Colors.gray400,
//     marginTop: Spacing.xs,
//   },
//   section: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   sectionTitle: {
//     fontSize: Typography.xs,
//     fontWeight: '600',
//     color: Colors.gray500,
//     textTransform: 'uppercase',
//     marginBottom: Spacing.sm,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//   },
//   infoRowBorder: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//   },
//   infoLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//     marginLeft: Spacing.sm,
//     flex: 1,
//   },
//   infoValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   menuItemIcon: {
//     width: 40,
//     height: 40,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.full,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   menuItemInfo: {
//     flex: 1,
//     marginLeft: Spacing.md,
//   },
//   menuItemHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   menuItemTitle: {
//     fontSize: Typography.md,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   menuItemSubtitle: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   badge: {
//     backgroundColor: Colors.primary + '15',
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 1,
//     borderRadius: BorderRadius.sm,
//     marginLeft: Spacing.sm,
//   },
//   badgeText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     fontWeight: '500',
//   },
//   logoutButton: {
//     backgroundColor: Colors.error + '10',
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: Spacing.md,
//   },
//   logoutButtonText: {
//     color: Colors.error,
//     fontWeight: '600',
//     marginLeft: Spacing.sm,
//   },
//   versionText: {
//     textAlign: 'center',
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//   },

//   // Store badge in header
//   userStore: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: Spacing.xs,
//     padding: Spacing.xs,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.sm,
//     paddingHorizontal: Spacing.md,
//   },
//   userStoreText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//     marginLeft: Spacing.xs,
//     marginRight: Spacing.xs,
//   },

//   // Modal styles for store selector
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius['3xl'],
//     borderTopRightRadius: BorderRadius['3xl'],
//     maxHeight: '70%',
//     minHeight: 200,
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
//   modalClose: {
//     color: Colors.primary,
//     fontWeight: '500',
//     fontSize: Typography.md,
//   },
//   storeList: {
//     padding: Spacing.md,
//   },
//   storeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   storeItemSelected: {
//     backgroundColor: Colors.primary + '05',
//     borderRadius: BorderRadius.lg,
//   },
//   storeItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   storeItemInfo: {
//     marginLeft: Spacing.md,
//     flex: 1,
//   },
//   storeItemName: {
//     fontSize: Typography.md,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   storeItemNameSelected: {
//     color: Colors.primary,
//   },
//   storeItemCode: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: Colors.gray500,
//     paddingVertical: Spacing['2xl'],
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { useRole } from "../../../hooks/useRole";
import {
  User,
  LogOut,
  Shield,
  Bell,
  Lock,
  Smartphone,
  ChevronRight,
  Store,
  Check,
  Package,
  CreditCard,
  ShoppingBag,
  Settings,
  HelpCircle,
  Mail,
  Phone,
  Calendar,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";

export default function Profile() {
  const { user, logout, currentStore, accessibleStores, switchStore } =
    useAuth();
  const { role, isSuperAdmin, isAdmin } = useRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          await logout();
          router.replace("/(auth)/login");
          setLoading(false);
        },
      },
    ]);
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const getRoleLabel = (role) => {
    const labels = {
      SUPER_ADMIN: "Super Admin",
      ADMIN: "Admin",
      SALES_MANAGER: "Sales Manager",
      SALES_ATTENDANT: "Sales Attendant",
      FINANCE_MANAGER: "Finance Manager",
      FINANCE_CASHIER: "Finance Cashier",
      WAREHOUSE_MANAGER: "Warehouse Manager",
      WAREHOUSE_STAFF: "Warehouse Staff",
    };
    return labels[role] || role;
  };

  const handleSwitchStore = async (storeId) => {
    setLoading(true);
    try {
      const result = await switchStore(storeId);
      if (result.success) {
        setShowStoreSelector(false);
        Alert.alert("Success", `Switched to ${result.store.name}`);
      } else {
        Alert.alert("Error", result.error || "Failed to switch store");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to switch store");
    } finally {
      setLoading(false);
    }
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, right, badge }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuItemIcon}>
        <Icon size={20} color={Colors.gray500} />
      </View>
      <View style={styles.menuItemInfo}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
      {right || <ChevronRight size={20} color={Colors.gray400} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{getRoleLabel(role)}</Text>
          </View>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.userStore}
            onPress={() => {
              if (accessibleStores?.length > 1 || isSuperAdmin) {
                setShowStoreSelector(true);
              }
            }}
          >
            <Store size={14} color={Colors.gray400} />
            <Text style={styles.userStoreText}>
              {currentStore?.name || user?.storeId?.name || "No Store"}
            </Text>
            {(accessibleStores?.length > 1 || isSuperAdmin) && (
              <ChevronRight size={14} color={Colors.gray400} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Phone size={16} color={Colors.gray400} />
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.phone || "N/A"}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Calendar size={16} color={Colors.gray400} />
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
          {(isSuperAdmin || isAdmin) && (
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Shield size={16} color={Colors.gray400} />
              <Text style={styles.infoLabel}>Access Level</Text>
              <Text style={styles.infoValue}>Full Admin</Text>
            </View>
          )}
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Store size={16} color={Colors.gray400} />
            <Text style={styles.infoLabel}>Current Store</Text>
            <Text style={styles.infoValue}>
              {currentStore?.name || user?.storeId?.name || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MenuItem
            icon={Bell}
            title="Notifications"
            subtitle="Push notifications"
            onPress={() => setNotifications(!notifications)}
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.gray300, true: Colors.primary }}
              />
            }
          />
          <MenuItem
            icon={Lock}
            title="Change Password"
            subtitle="Update your password"
            onPress={() => router.push("/(auth)/change-password")}
          />
          <MenuItem
            icon={Smartphone}
            title="Biometric Login"
            subtitle="Use fingerprint or face ID"
            onPress={() => setBiometrics(!biometrics)}
            right={
              <Switch
                value={biometrics}
                onValueChange={setBiometrics}
                trackColor={{ false: Colors.gray300, true: Colors.primary }}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <MenuItem
            icon={ShoppingBag}
            title="My Transactions"
            subtitle="View your transaction history"
            onPress={() => router.push("/(app)/(stacks)/transactions")}
          />
          <MenuItem
            icon={Package}
            title="Products"
            subtitle="Browse product catalog"
            onPress={() => router.push("/(app)/(stacks)/products")}
          />
          {isSuperAdmin && (
            <MenuItem
              icon={Settings}
              title="Admin Dashboard"
              subtitle="System administration"
              onPress={() => router.push("/(admin)")}
              badge="Admin"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem
            icon={HelpCircle}
            title="Help Center"
            subtitle="FAQs and guides"
            onPress={() =>
              Alert.alert("Help Center", "Help content coming soon")
            }
          />
          <MenuItem
            icon={Mail}
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={() => Alert.alert("Support", "support@store.com")}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.error} />
          ) : (
            <>
              <LogOut size={20} color={Colors.error} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Version 1.0.0 • Store Management System
        </Text>
      </ScrollView>

      {/* Store Selector Modal */}
      <Modal
        visible={showStoreSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStoreSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Store</Text>
              <TouchableOpacity onPress={() => setShowStoreSelector(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={accessibleStores}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isSelected = item._id === currentStore?._id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.storeItem,
                      isSelected && styles.storeItemSelected,
                    ]}
                    onPress={() => handleSwitchStore(item._id)}
                    disabled={loading}
                  >
                    <View style={styles.storeItemLeft}>
                      <Store
                        size={20}
                        color={isSelected ? Colors.primary : Colors.gray500}
                      />
                      <View style={styles.storeItemInfo}>
                        <Text
                          style={[
                            styles.storeItemName,
                            isSelected && styles.storeItemNameSelected,
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.storeItemCode}>
                          Code: {item.code}
                        </Text>
                      </View>
                    </View>
                    {isSelected && <Check size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.storeList}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>No stores available</Text>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },
  profileHeader: { alignItems: "center", paddingVertical: Spacing["2xl"] },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  avatarText: {
    fontSize: Typography["3xl"],
    fontWeight: "bold",
    color: Colors.primary,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.md,
  },
  roleBadge: {
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  roleBadgeText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: "500",
  },
  userEmail: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  userStore: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
    padding: Spacing.xs,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
  },
  userStoreText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    marginLeft: Spacing.xs,
    marginRight: Spacing.xs,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: "600",
    color: Colors.gray500,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  infoLabel: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  infoValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemInfo: { flex: 1, marginLeft: Spacing.md },
  menuItemHeader: { flexDirection: "row", alignItems: "center" },
  menuItemTitle: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  menuItemSubtitle: { fontSize: Typography.xs, color: Colors.gray500 },
  badge: {
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: Colors.error + "10",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  logoutButtonText: {
    color: Colors.error,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  versionText: {
    textAlign: "center",
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["3xl"],
    borderTopRightRadius: BorderRadius["3xl"],
    maxHeight: "70%",
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
  },
  modalClose: {
    color: Colors.primary,
    fontWeight: "500",
    fontSize: Typography.md,
  },
  storeList: { padding: Spacing.md },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  storeItemSelected: {
    backgroundColor: Colors.primary + "05",
    borderRadius: BorderRadius.lg,
  },
  storeItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  storeItemInfo: { marginLeft: Spacing.md, flex: 1 },
  storeItemName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  storeItemNameSelected: { color: Colors.primary },
  storeItemCode: { fontSize: Typography.xs, color: Colors.gray500 },
  emptyText: {
    textAlign: "center",
    color: Colors.gray500,
    paddingVertical: Spacing["2xl"],
  },
});
