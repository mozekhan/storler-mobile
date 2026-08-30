// import React, { useState, useEffect } from "react";
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
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   Store,
//   Plus,
//   Edit,
//   Trash2,
//   MapPin,
//   Phone,
//   Mail,
//   Search,
//   X,
// } from "lucide-react-native";
// import StoreService from "../../../services/storeService";
// import { formatDate } from "../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";

// export default function AdminStoreManagement() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stores, setStores] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingStore, setEditingStore] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     code: "",
//     address: { street: "", city: "", state: "", country: "", zipCode: "" },
//     phone: "",
//     email: "",
//     taxRate: "0",
//     currency: "NGN",
//   });

//   useEffect(() => {
//     fetchStores();
//   }, [searchTerm]);

//   const fetchStores = async () => {
//     try {
//       const result = await StoreService.getStores({ search: searchTerm });
//       setStores(result.stores || []);
//     } catch (error) {
//       Alert.alert("Error", "Failed to load stores");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchStores();
//   };

//   const handleSave = async () => {
//     if (!formData.name || !formData.code) {
//       Alert.alert("Error", "Please fill in all required fields");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       if (editingStore) {
//         await StoreService.updateStore(editingStore._id, formData);
//         Alert.alert("Success", "Store updated successfully");
//       } else {
//         await StoreService.createStore(formData);
//         Alert.alert("Success", "Store created successfully");
//       }
//       setShowModal(false);
//       setEditingStore(null);
//       resetForm();
//       fetchStores();
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to save store",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       code: "",
//       address: { street: "", city: "", state: "", country: "", zipCode: "" },
//       phone: "",
//       email: "",
//       taxRate: "0",
//       currency: "USD",
//     });
//   };

//   const handleEdit = (store) => {
//     setEditingStore(store);
//     setFormData({
//       name: store.name,
//       code: store.code,
//       address: store.address || {
//         street: "",
//         city: "",
//         state: "",
//         country: "",
//         zipCode: "",
//       },
//       phone: store.phone || "",
//       email: store.email || "",
//       taxRate: String(store.taxRate || 0),
//       currency: store.currency || "USD",
//     });
//     setShowModal(true);
//   };

//   const handleDelete = (id) => {
//     Alert.alert(
//       "Delete Store",
//       "Are you sure you want to delete this store? This action cannot be undone.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await StoreService.deleteStore(id);
//               Alert.alert("Success", "Store deleted");
//               fetchStores();
//             } catch (error) {
//               Alert.alert("Error", "Failed to delete store");
//             }
//           },
//         },
//       ],
//     );
//   };

//   const renderStore = ({ item }) => (
//     <TouchableOpacity
//       style={styles.storeItem}
//       onPress={() => router.push(`/(admin)/stores/${item._id}`)}
//       activeOpacity={0.7}
//     >
//       {/* <View style={styles.storeItem}> */}
//       <View style={styles.storeItemRow}>
//         <View style={styles.storeIcon}>
//           <Store size={24} color={Colors.primary} />
//         </View>
//         <View style={styles.storeItemInfo}>
//           <Text style={styles.storeItemName}>{item.name}</Text>
//           <Text style={styles.storeItemCode}>Code: {item.code}</Text>
//         </View>
//         <View
//           style={[
//             styles.statusBadge,
//             item.isActive ? styles.statusActive : styles.statusInactive,
//           ]}
//         >
//           <Text
//             style={[
//               styles.statusText,
//               item.isActive
//                 ? styles.statusActiveText
//                 : styles.statusInactiveText,
//             ]}
//           >
//             {item.isActive ? "Active" : "Inactive"}
//           </Text>
//         </View>
//       </View>

//       {item.address && (
//         <View style={styles.storeAddress}>
//           <MapPin size={14} color={Colors.gray500} />
//           <Text style={styles.storeAddressText}>
//             {[
//               item.address.street,
//               item.address.city,
//               item.address.state,
//               item.address.country,
//             ]
//               .filter(Boolean)
//               .join(", ")}
//           </Text>
//         </View>
//       )}
//       {item.phone && (
//         <View style={styles.storeContact}>
//           <Phone size={14} color={Colors.gray500} />
//           <Text style={styles.storeContactText}>{item.phone}</Text>
//         </View>
//       )}
//       {item.email && (
//         <View style={styles.storeContact}>
//           <Mail size={14} color={Colors.gray500} />
//           <Text style={styles.storeContactText}>{item.email}</Text>
//         </View>
//       )}

//       <View style={styles.storeItemFooter}>
//         <Text style={styles.storeItemMeta}>
//           Tax: {item.taxRate}% • Currency: {item.currency}
//         </Text>
//         <View style={styles.storeItemActions}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => handleEdit(item)}
//           >
//             <Edit size={18} color={Colors.primary} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => handleDelete(item._id)}
//           >
//             <Trash2 size={18} color={Colors.error} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//     // </View>
//   );

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
//             placeholder="Search stores..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => {
//             resetForm();
//             setEditingStore(null);
//             setShowModal(true);
//           }}
//         >
//           <Plus size={20} color={Colors.white} />
//         </TouchableOpacity>
//       </View>

//       {/* <FlatList
//         style={styles.list}
//         contentContainerStyle={styles.listContent}
//         data={stores}
//         keyExtractor={(item) => item._id}
//         renderItem={renderStore}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Store size={48} color={Colors.gray300} />
//             <Text style={styles.emptyText}>No stores found</Text>
//           </View>
//         )}
//       /> */}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={styles.listContent}
//         data={stores}
//         keyExtractor={(item) => item._id}
//         renderItem={renderStore}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Store size={48} color={Colors.gray300} />
//             <Text style={styles.emptyText}>No stores found</Text>
//           </View>
//         )}
//       />

//       <Modal visible={showModal} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>
//                 {editingStore ? "Edit Store" : "Add Store"}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowModal(false);
//                   setEditingStore(null);
//                   resetForm();
//                 }}
//               >
//                 <X size={24} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               style={styles.modalForm}
//               contentContainerStyle={styles.modalFormContent}
//             >
//               <View style={styles.formField}>
//                 <Text style={styles.formLabel}>Store Name *</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   value={formData.name}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, name: text })
//                   }
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.formField}>
//                 <Text style={styles.formLabel}>Store Code *</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   value={formData.code}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, code: text.toUpperCase() })
//                   }
//                   placeholder="MAIN"
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.formField}>
//                 <Text style={styles.formLabel}>Phone</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   value={formData.phone}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, phone: text })
//                   }
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.formField}>
//                 <Text style={styles.formLabel}>Email</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   value={formData.email}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, email: text.toLowerCase() })
//                   }
//                   autoCapitalize="none"
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.formField}>
//                 <Text style={styles.formLabel}>Address</Text>
//                 <TextInput
//                   style={[styles.formInput, styles.formInputMargin]}
//                   placeholder="Street"
//                   value={formData.address.street}
//                   onChangeText={(text) =>
//                     setFormData({
//                       ...formData,
//                       address: { ...formData.address, street: text },
//                     })
//                   }
//                   placeholderTextColor={Colors.gray400}
//                 />
//                 <View style={styles.formRow}>
//                   <View style={[styles.formField, styles.halfField]}>
//                     <TextInput
//                       style={styles.formInput}
//                       placeholder="City"
//                       value={formData.address.city}
//                       onChangeText={(text) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, city: text },
//                         })
//                       }
//                       placeholderTextColor={Colors.gray400}
//                     />
//                   </View>
//                   <View style={[styles.formField, styles.halfField]}>
//                     <TextInput
//                       style={styles.formInput}
//                       placeholder="State"
//                       value={formData.address.state}
//                       onChangeText={(text) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, state: text },
//                         })
//                       }
//                       placeholderTextColor={Colors.gray400}
//                     />
//                   </View>
//                 </View>
//                 <View style={styles.formRow}>
//                   <View style={[styles.formField, styles.halfField]}>
//                     <TextInput
//                       style={styles.formInput}
//                       placeholder="Country"
//                       value={formData.address.country}
//                       onChangeText={(text) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, country: text },
//                         })
//                       }
//                       placeholderTextColor={Colors.gray400}
//                     />
//                   </View>
//                   <View style={[styles.formField, styles.halfField]}>
//                     <TextInput
//                       style={styles.formInput}
//                       placeholder="Zip Code"
//                       value={formData.address.zipCode}
//                       onChangeText={(text) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, zipCode: text },
//                         })
//                       }
//                       placeholderTextColor={Colors.gray400}
//                     />
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.formRow}>
//                 <View style={[styles.formField, styles.halfField]}>
//                   <Text style={styles.formLabel}>Tax Rate %</Text>
//                   <TextInput
//                     style={styles.formInput}
//                     value={formData.taxRate}
//                     onChangeText={(text) =>
//                       setFormData({ ...formData, taxRate: text })
//                     }
//                     keyboardType="decimal-pad"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//                 <View style={[styles.formField, styles.halfField]}>
//                   <Text style={styles.formLabel}>Currency</Text>
//                   <TextInput
//                     style={styles.formInput}
//                     value={formData.currency}
//                     onChangeText={(text) =>
//                       setFormData({ ...formData, currency: text.toUpperCase() })
//                     }
//                     placeholder="USD"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//               </View>

//               <View style={styles.formButtons}>
//                 <TouchableOpacity
//                   style={[styles.formButton, styles.cancelButton]}
//                   onPress={() => {
//                     setShowModal(false);
//                     setEditingStore(null);
//                     resetForm();
//                   }}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.formButton,
//                     styles.submitButton,
//                     submitting && styles.buttonDisabled,
//                   ]}
//                   onPress={handleSave}
//                   disabled={submitting}
//                 >
//                   {submitting ? (
//                     <ActivityIndicator color={Colors.white} size="small" />
//                   ) : (
//                     <Text style={styles.submitButtonText}>
//                       {editingStore ? "Update" : "Create"}
//                     </Text>
//                   )}
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
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     flexDirection: "row",
//     alignItems: "center",
//     ...Shadows.sm,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
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
//   addButton: {
//     marginLeft: Spacing.sm,
//     backgroundColor: Colors.primary,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   list: { flex: 1 },
//   listContent: { padding: Spacing.md },
//   storeItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   storeItemRow: { flexDirection: "row", alignItems: "center" },
//   storeIcon: {
//     width: 48,
//     height: 48,
//     backgroundColor: Colors.primary + "10",
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   storeItemInfo: { flex: 1, marginLeft: Spacing.md },
//   storeItemName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   storeItemCode: { fontSize: Typography.sm, color: Colors.gray500 },
//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//   },
//   statusActive: { backgroundColor: Colors.success + "20" },
//   statusActiveText: { color: Colors.success },
//   statusInactive: { backgroundColor: Colors.error + "20" },
//   statusInactiveText: { color: Colors.error },
//   statusText: { fontSize: Typography.xs, fontWeight: "500" },
//   storeAddress: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: Spacing.sm,
//   },
//   storeAddressText: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginLeft: Spacing.xs,
//     flex: 1,
//   },
//   storeContact: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: Spacing.xs,
//   },
//   storeContactText: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginLeft: Spacing.xs,
//   },
//   storeItemFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: Spacing.sm,
//     paddingTop: Spacing.sm,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//   },
//   storeItemMeta: { fontSize: Typography.xs, color: Colors.gray500 },
//   storeItemActions: { flexDirection: "row" },
//   actionButton: { padding: Spacing.sm },
//   emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
//   emptyText: { color: Colors.gray500 },
//   modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
//   modalContent: {
//     flex: 1,
//     marginTop: 40,
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius["3xl"],
//     borderTopRightRadius: BorderRadius["3xl"],
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray200,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalForm: { flex: 1 },
//   modalFormContent: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },
//   formField: { marginBottom: Spacing.md },
//   halfField: { flex: 1 },
//   formRow: { flexDirection: "row", gap: Spacing.sm },
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
//   formInputMargin: { marginBottom: Spacing.sm },
//   formButtons: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
//   formButton: {
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
// });
































import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Store, Plus, Edit, Trash2, MapPin, Phone, Mail, Users, Search, X, ChevronRight } from 'lucide-react-native';
import StoreService from '../../../services/storeService';
import { formatDate } from '../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import CustomHeader from '../../../components/ui/CustomHeader';

export default function AdminStoreManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: { street: '', city: '', state: '', country: '', zipCode: '' },
    phone: '',
    email: '',
    taxRate: '0',
    currency: 'NGN',
  });

  useEffect(() => {
    fetchStores();
  }, [searchTerm]);

  const fetchStores = async () => {
    try {
      const result = await StoreService.getStores({ search: searchTerm });
      setStores(result.stores || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load stores');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStores();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingStore) {
        await StoreService.updateStore(editingStore._id, formData);
        Alert.alert('Success', 'Store updated successfully');
      } else {
        await StoreService.createStore(formData);
        Alert.alert('Success', 'Store created successfully');
      }
      setShowModal(false);
      setEditingStore(null);
      resetForm();
      fetchStores();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save store');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address: { street: '', city: '', state: '', country: '', zipCode: '' },
      phone: '',
      email: '',
      taxRate: '0',
      currency: 'USD',
    });
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      code: store.code,
      address: store.address || { street: '', city: '', state: '', country: '', zipCode: '' },
      phone: store.phone || '',
      email: store.email || '',
      taxRate: String(store.taxRate || 0),
      currency: store.currency || 'USD',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Store',
      'Are you sure you want to delete this store? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StoreService.deleteStore(id);
              Alert.alert('Success', 'Store deleted');
              fetchStores();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete store');
            }
          },
        },
      ]
    );
  };

  const formatStoreAddress = (address) => {
    if (!address) return 'No address';
    const parts = [address.street, address.city, address.state, address.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address';
  };

  // UPDATED: renderStore now wraps everything in TouchableOpacity
  const renderStore = ({ item }) => (
    <TouchableOpacity
      style={styles.storeItem}
      onPress={() => router.push(`/(admin)/stores/${item._id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.storeItemRow}>
        <View style={styles.storeIcon}>
          <Store size={24} color={Colors.primary} />
        </View>
        <View style={styles.storeItemInfo}>
          <Text style={styles.storeItemName}>{item.name}</Text>
          <Text style={styles.storeItemCode}>Code: {item.code}</Text>
        </View>
        <View style={[styles.statusBadge, item.isActive ? styles.statusActive : styles.statusInactive]}>
          <Text style={[styles.statusText, item.isActive ? styles.statusActiveText : styles.statusInactiveText]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      {item.address && (
        <View style={styles.storeAddress}>
          <MapPin size={14} color={Colors.gray500} />
          <Text style={styles.storeAddressText} numberOfLines={1}>
            {formatStoreAddress(item.address)}
          </Text>
        </View>
      )}
      
      <View style={styles.storeContactRow}>
        {item.phone && (
          <View style={styles.storeContact}>
            <Phone size={14} color={Colors.gray500} />
            <Text style={styles.storeContactText}>{item.phone}</Text>
          </View>
        )}
        {item.email && (
          <View style={styles.storeContact}>
            <Mail size={14} color={Colors.gray500} />
            <Text style={styles.storeContactText} numberOfLines={1}>{item.email}</Text>
          </View>
        )}
      </View>

       {/* Add Staff Count */}
      <View style={styles.storeStaffCount}>
        <Users size={14} color={Colors.gray500} />
        <Text style={styles.storeStaffCountText}>
          {item.stats?.users || 0} Staff Members
        </Text>
      </View>

      <View style={styles.storeItemFooter}>
        <Text style={styles.storeItemMeta}>
          Tax: {item.taxRate || 0}% • Currency: {item.currency || 'NGN'}
        </Text>
        <View style={styles.storeItemActions}>
          {/* Edit button - stops propagation to prevent navigation */}
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={(e) => {
              e.stopPropagation();
              handleEdit(item);
            }}
          >
            <Edit size={18} color={Colors.primary} />
          </TouchableOpacity>
          {/* Delete button - stops propagation to prevent navigation */}
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(item._id);
            }}
          >
            <Trash2 size={18} color={Colors.error} />
          </TouchableOpacity>
          <ChevronRight size={18} color={Colors.gray400} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Store Management" showBack={true} />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setEditingStore(null);
            setShowModal(true);
          }}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={stores}
        keyExtractor={(item) => item._id}
        renderItem={renderStore}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Store size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>No stores found</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first store</Text>
          </View>
        )}
      />

      {/* Modal - Create/Edit Store */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingStore ? 'Edit Store' : 'Add Store'}</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setEditingStore(null); resetForm(); }}>
                <X size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} contentContainerStyle={styles.modalFormContent}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Store Name *</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={formData.name} 
                  onChangeText={(text) => setFormData({ ...formData, name: text })} 
                  placeholderTextColor={Colors.gray400}
                  placeholder="Enter store name"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Store Code *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.code}
                  onChangeText={(text) => setFormData({ ...formData, code: text.toUpperCase() })}
                  placeholder="MAIN"
                  placeholderTextColor={Colors.gray400}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={formData.phone} 
                  onChangeText={(text) => setFormData({ ...formData, phone: text })} 
                  placeholderTextColor={Colors.gray400}
                  placeholder="Enter phone number"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase() })}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.gray400}
                  placeholder="email@example.com"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMargin]}
                  placeholder="Street"
                  value={formData.address.street}
                  onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, street: text } })}
                  placeholderTextColor={Colors.gray400}
                />
                <View style={styles.formRow}>
                  <View style={[styles.formField, styles.halfField]}>
                    <TextInput 
                      style={styles.formInput} 
                      placeholder="City" 
                      value={formData.address.city} 
                      onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, city: text } })} 
                      placeholderTextColor={Colors.gray400}
                    />
                  </View>
                  <View style={[styles.formField, styles.halfField]}>
                    <TextInput 
                      style={styles.formInput} 
                      placeholder="State" 
                      value={formData.address.state} 
                      onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, state: text } })} 
                      placeholderTextColor={Colors.gray400}
                    />
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={[styles.formField, styles.halfField]}>
                    <TextInput 
                      style={styles.formInput} 
                      placeholder="Country" 
                      value={formData.address.country} 
                      onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, country: text } })} 
                      placeholderTextColor={Colors.gray400}
                    />
                  </View>
                  <View style={[styles.formField, styles.halfField]}>
                    <TextInput 
                      style={styles.formInput} 
                      placeholder="Zip Code" 
                      value={formData.address.zipCode} 
                      onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, zipCode: text } })} 
                      placeholderTextColor={Colors.gray400}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formField, styles.halfField]}>
                  <Text style={styles.formLabel}>Tax Rate %</Text>
                  <TextInput 
                    style={styles.formInput} 
                    value={formData.taxRate} 
                    onChangeText={(text) => setFormData({ ...formData, taxRate: text })} 
                    keyboardType="decimal-pad" 
                    placeholderTextColor={Colors.gray400}
                    placeholder="0"
                  />
                </View>
                <View style={[styles.formField, styles.halfField]}>
                  <Text style={styles.formLabel}>Currency</Text>
                  <TextInput 
                    style={styles.formInput} 
                    value={formData.currency} 
                    onChangeText={(text) => setFormData({ ...formData, currency: text.toUpperCase() })} 
                    placeholder="USD" 
                    placeholderTextColor={Colors.gray400}
                  />
                </View>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelButton]} 
                  onPress={() => { setShowModal(false); setEditingStore(null); resetForm(); }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.formButton, styles.submitButton, submitting && styles.buttonDisabled]} 
                  onPress={handleSave} 
                  disabled={submitting}
                >
                  {submitting ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.submitButtonText}>{editingStore ? 'Update' : 'Create'}</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header
  header: { 
    backgroundColor: Colors.white, 
    padding: Spacing.md, 
    flexDirection: 'row', 
    alignItems: 'center', 
    ...Shadows.sm 
  },
  searchContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.gray100, 
    borderRadius: BorderRadius.lg, 
    paddingHorizontal: Spacing.md 
  },
  searchInput: { 
    flex: 1, 
    paddingVertical: Spacing.sm, 
    paddingHorizontal: Spacing.sm, 
    fontSize: Typography.md 
  },
  addButton: { 
    marginLeft: Spacing.sm, 
    backgroundColor: Colors.primary, 
    padding: Spacing.md, 
    borderRadius: BorderRadius.lg 
  },
  
  // List
  list: { flex: 1 },
  listContent: { padding: Spacing.md },
  
  // Store Item - Updated for TouchableOpacity
  storeItem: { 
    backgroundColor: Colors.white, 
    borderRadius: BorderRadius.lg, 
    padding: Spacing.md, 
    marginBottom: Spacing.md, 
    ...Shadows.sm 
  },
  storeItemRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  storeIcon: { 
    width: 48, 
    height: 48, 
    backgroundColor: Colors.primary + '10', 
    borderRadius: BorderRadius.full, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  storeItemInfo: { 
    flex: 1, 
    marginLeft: Spacing.md 
  },
  storeItemName: { 
    fontSize: Typography.md, 
    fontWeight: '500', 
    color: Colors.gray900 
  },
  storeItemCode: { 
    fontSize: Typography.sm, 
    color: Colors.gray500 
  },
  
  // Status Badges
  statusBadge: { 
    paddingHorizontal: Spacing.sm, 
    paddingVertical: 2, 
    borderRadius: BorderRadius.sm 
  },
  statusActive: { 
    backgroundColor: Colors.success + '20' 
  },
  statusActiveText: { 
    color: Colors.success 
  },
  statusInactive: { 
    backgroundColor: Colors.error + '20' 
  },
  statusInactiveText: { 
    color: Colors.error 
  },
  statusText: { 
    fontSize: Typography.xs, 
    fontWeight: '500' 
  },
  
  // Address & Contact
  storeAddress: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: Spacing.sm 
  },
  storeAddressText: { 
    fontSize: Typography.xs, 
    color: Colors.gray500, 
    marginLeft: Spacing.xs, 
    flex: 1 
  },
  storeContactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  storeContact: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: Spacing.xs,
    marginRight: Spacing.md,
  },
  storeContactText: { 
    fontSize: Typography.xs, 
    color: Colors.gray500, 
    marginLeft: Spacing.xs 
  },

  storeStaffCount: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: Spacing.xs,
  gap: Spacing.xs,
},
storeStaffCountText: {
  fontSize: Typography.xs,
  color: Colors.gray500,
},
  
  // Footer
  storeItemFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: Spacing.sm, 
    paddingTop: Spacing.sm, 
    borderTopWidth: 1, 
    borderTopColor: Colors.gray100 
  },
  storeItemMeta: { 
    fontSize: Typography.xs, 
    color: Colors.gray500 
  },
  storeItemActions: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  actionButton: { 
    padding: Spacing.sm 
  },
  
  // Empty State
  emptyContainer: { 
    paddingVertical: Spacing['4xl'], 
    alignItems: 'center' 
  },
  emptyText: { 
    color: Colors.gray500,
    fontSize: Typography.lg,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
  emptySubtext: {
    color: Colors.gray400,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
  
  // Modal
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    flex: 1, 
    marginTop: 40, 
    backgroundColor: Colors.white, 
    borderTopLeftRadius: BorderRadius['3xl'], 
    borderTopRightRadius: BorderRadius['3xl'] 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: Spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.gray200 
  },
  modalTitle: { 
    fontSize: Typography.lg, 
    fontWeight: '600', 
    color: Colors.gray900 
  },
  modalForm: { 
    flex: 1 
  },
  modalFormContent: { 
    padding: Spacing.md, 
    paddingBottom: Spacing['3xl'] 
  },
  formField: { 
    marginBottom: Spacing.md 
  },
  halfField: { 
    flex: 1 
  },
  formRow: { 
    flexDirection: 'row', 
    gap: Spacing.sm 
  },
  formLabel: { 
    fontSize: Typography.sm, 
    fontWeight: '500', 
    color: Colors.gray700, 
    marginBottom: Spacing.xs 
  },
  formInput: { 
    borderWidth: 1, 
    borderColor: Colors.gray300, 
    borderRadius: BorderRadius.lg, 
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.sm, 
    fontSize: Typography.md 
  },
  formInputMargin: { 
    marginBottom: Spacing.sm 
  },
  formButtons: { 
    flexDirection: 'row', 
    gap: Spacing.sm, 
    marginTop: Spacing.md 
  },
  formButton: { 
    flex: 1, 
    paddingVertical: Spacing.md, 
    borderRadius: BorderRadius.lg, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cancelButton: { 
    backgroundColor: Colors.gray200 
  },
  cancelButtonText: { 
    fontWeight: '600', 
    color: Colors.gray700 
  },
  submitButton: { 
    backgroundColor: Colors.primary 
  },
  submitButtonText: { 
    fontWeight: '600', 
    color: Colors.white 
  },
  buttonDisabled: { 
    opacity: 0.7 
  },
});