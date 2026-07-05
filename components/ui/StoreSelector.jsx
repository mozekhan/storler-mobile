// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Modal,
//   Alert,
//   StyleSheet,
//   FlatList,
// } from "react-native";
// import { Store, ChevronDown, Check } from "lucide-react-native";
// import { useAuth } from "../../hooks/useAuth";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../constants/theme";

// export default function StoreSelector() {
//   const { user, currentStore, accessibleStores, switchStore } = useAuth();

//   console.log("User:", user);
//   console.log("Current Store:", currentStore);
//   console.log("Accessible Stores:", accessibleStores);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [switching, setSwitching] = useState(false);

//   // Only show if user has multiple stores or is super admin
//   if (user?.role !== "SUPER_ADMIN" && accessibleStores?.length <= 1) {
//     return null;
//   }

//   const handleStoreSelect = async (storeId) => {
//     if (storeId === currentStore?._id) {
//       setModalVisible(false);
//       return;
//     }

//     setSwitching(true);
//     try {
//       const result = await switchStore(storeId);
//       if (result.success) {
//         setModalVisible(false);
//       } else {
//         Alert.alert("Error", result.error || "Failed to switch store");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to switch store");
//     } finally {
//       setSwitching(false);
//     }
//   };

//   const renderStoreItem = ({ item }) => {
//     const isSelected = item._id === currentStore?._id;
//     return (
//       <TouchableOpacity
//         style={[styles.storeItem, isSelected && styles.storeItemSelected]}
//         onPress={() => handleStoreSelect(item._id)}
//         disabled={switching}
//       >
//         <View style={styles.storeItemLeft}>
//           <Store
//             size={20}
//             color={isSelected ? Colors.primary : Colors.gray500}
//           />
//           <View style={styles.storeItemInfo}>
//             <Text
//               style={[
//                 styles.storeItemName,
//                 isSelected && styles.storeItemNameSelected,
//               ]}
//             >
//               {item.name}
//             </Text>
//             <Text style={styles.storeItemCode}>Code: {item.code}</Text>
//           </View>
//         </View>
//         {isSelected && <Check size={20} color={Colors.primary} />}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <>
//       <TouchableOpacity
//         style={styles.selectorButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Store size={18} color={Colors.gray600} />
//         <Text style={styles.selectorText} numberOfLines={1}>
//           {currentStore?.name || "Select Store"}
//         </Text>
//         <ChevronDown size={18} color={Colors.gray400} />
//       </TouchableOpacity>

//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Switch Store</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Text style={styles.modalClose}>Close</Text>
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={accessibleStores}
//               keyExtractor={(item) => item._id}
//               renderItem={renderStoreItem}
//               contentContainerStyle={styles.storeList}
//               ListEmptyComponent={() => (
//                 <Text style={styles.emptyText}>No stores available</Text>
//               )}
//             />

//             {switching && (
//               <View style={styles.loadingOverlay}>
//                 <ActivityIndicator size="large" color={Colors.primary} />
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   selectorButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     marginHorizontal: Spacing.sm,
//   },
//   selectorText: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//     marginHorizontal: Spacing.sm,
//     maxWidth: 150,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius["3xl"],
//     borderTopRightRadius: BorderRadius["3xl"],
//     maxHeight: "70%",
//     minHeight: 200,
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
//   modalClose: {
//     color: Colors.primary,
//     fontWeight: "500",
//   },
//   storeList: {
//     padding: Spacing.md,
//   },
//   storeItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   storeItemSelected: {
//     backgroundColor: Colors.primary + "05",
//   },
//   storeItemLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   storeItemInfo: {
//     marginLeft: Spacing.md,
//     flex: 1,
//   },
//   storeItemName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
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
//     textAlign: "center",
//     color: Colors.gray500,
//     paddingVertical: Spacing["2xl"],
//   },
//   loadingOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

















import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  StyleSheet,
  FlatList,
} from "react-native";
import { Store, ChevronDown, Check } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import { Colors, Spacing, Typography, BorderRadius, Shadows } from "../../constants/theme";

export default function StoreSelector() {
  const { user, currentStore, accessibleStores, switchStore } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (user?.role !== "SUPER_ADMIN" && accessibleStores?.length <= 1) {
    return null;
  }

  const handleStoreSelect = async (storeId) => {
    if (storeId === currentStore?._id) {
      setModalVisible(false);
      return;
    }

    setSwitching(true);
    try {
      const result = await switchStore(storeId);
      if (result.success) {
        setModalVisible(false);
      } else {
        Alert.alert("Error", result.error || "Failed to switch store");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to switch store");
    } finally {
      setSwitching(false);
    }
  };

  const renderStoreItem = ({ item }) => {
    const isSelected = item._id === currentStore?._id;
    return (
      <TouchableOpacity
        style={[styles.storeItem, isSelected && styles.storeItemSelected]}
        onPress={() => handleStoreSelect(item._id)}
        disabled={switching}
      >
        <View style={styles.storeItemLeft}>
          <Store size={20} color={isSelected ? Colors.primary : Colors.gray500} />
          <View style={styles.storeItemInfo}>
            <Text style={[styles.storeItemName, isSelected && styles.storeItemNameSelected]}>
              {item.name}
            </Text>
            <Text style={styles.storeItemCode}>Code: {item.code}</Text>
          </View>
        </View>
        {isSelected && <Check size={20} color={Colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.selectorButton} onPress={() => setModalVisible(true)}>
        <Store size={18} color={Colors.gray600} />
        <Text style={styles.selectorText} numberOfLines={1}>
          {currentStore?.name || "Select Store"}
        </Text>
        <ChevronDown size={18} color={Colors.gray400} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Store</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={accessibleStores}
              keyExtractor={(item) => item._id}
              renderItem={renderStoreItem}
              contentContainerStyle={styles.storeList}
              ListEmptyComponent={() => <Text style={styles.emptyText}>No stores available</Text>}
            />

            {switching && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.sm,
  },
  selectorText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    marginHorizontal: Spacing.sm,
    maxWidth: 150,
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
  },
  storeList: {
    padding: Spacing.md,
  },
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
  },
  storeItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  storeItemInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  storeItemName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  storeItemNameSelected: {
    color: Colors.primary,
  },
  storeItemCode: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray500,
    paddingVertical: Spacing["2xl"],
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
});