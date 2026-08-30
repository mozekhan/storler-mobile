// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { Package, Clock } from "lucide-react-native";
// import InventoryService from "../../../../../services/inventoryService";
// import { formatDateTime } from "../../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
// } from "../../../../../constants/theme";

// export default function InventoryHistory() {
//   const { productId } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     fetchHistory();
//   }, [productId]);

//   const fetchHistory = async () => {
//     try {
//       const data = await InventoryService.getInventoryByProduct(productId);
//       setHistory(data?.movements || []);
//     } catch (error) {
//       console.error("Failed to fetch history:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getActionColor = (action) => {
//     const colors = {
//       CREATE: Colors.success,
//       UPDATE: Colors.primary,
//       DELETE: Colors.error,
//       ADJUST: Colors.warning,
//     };
//     return colors[action] || Colors.gray500;
//   };

//   const getActionIcon = (action) => {
//     const icons = {
//       CREATE: "➕",
//       UPDATE: "✏️",
//       DELETE: "🗑️",
//       ADJUST: "📊",
//     };
//     return icons[action] || "📌";
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       data={history}
//       keyExtractor={(item) => item._id}
//       renderItem={({ item }) => (
//         <View style={styles.historyItem}>
//           <View style={styles.historyHeader}>
//             <Text style={styles.historyIcon}>{getActionIcon(item.action)}</Text>
//             <Text
//               style={[
//                 styles.historyAction,
//                 { color: getActionColor(item.action) },
//               ]}
//             >
//               {item.action}
//             </Text>
//             <Text style={styles.historyTime}>
//               {formatDateTime(item.timestamp)}
//             </Text>
//           </View>
//           <View style={styles.historyDetails}>
//             <Text style={styles.historyUser}>
//               {item.actorId?.firstName} {item.actorId?.lastName}
//             </Text>
//             {item.details?.after?.quantity !== undefined && (
//               <View style={styles.historyQuantityRow}>
//                 <Text style={styles.historyQuantityLabel}>Quantity:</Text>
//                 <Text style={styles.historyQuantityOld}>
//                   {item.details?.before?.quantity || 0}
//                 </Text>
//                 <Text style={styles.historyQuantityArrow}>→</Text>
//                 <Text style={styles.historyQuantityNew}>
//                   {item.details?.after?.quantity}
//                 </Text>
//               </View>
//             )}
//             {item.details?.metadata?.reason && (
//               <Text style={styles.historyReason}>
//                 Reason: {item.details.metadata.reason}
//               </Text>
//             )}
//             {item.details?.metadata?.adjustment && (
//               <Text style={styles.historyAdjustment}>
//                 Adjustment: {item.details.metadata.adjustment > 0 ? "+" : ""}
//                 {item.details.metadata.adjustment}
//               </Text>
//             )}
//           </View>
//         </View>
//       )}
//       ListEmptyComponent={() => (
//         <View style={styles.emptyContainer}>
//           <Clock size={48} color={Colors.gray300} />
//           <Text style={styles.emptyText}>No history recorded</Text>
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   content: { padding: Spacing.md },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   historyItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   historyHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: Spacing.xs,
//   },
//   historyIcon: { fontSize: Typography.lg, marginRight: Spacing.sm },
//   historyAction: { fontSize: Typography.sm, fontWeight: "600", flex: 1 },
//   historyTime: { fontSize: Typography.xs, color: Colors.gray400 },
//   historyDetails: { marginLeft: Spacing["2xl"] },
//   historyUser: { fontSize: Typography.sm, color: Colors.gray500 },
//   historyQuantityRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 2,
//   },
//   historyQuantityLabel: { fontSize: Typography.sm, color: Colors.gray500 },
//   historyQuantityOld: {
//     fontSize: Typography.sm,
//     color: Colors.error,
//     marginLeft: Spacing.sm,
//     textDecorationLine: "line-through",
//   },
//   historyQuantityArrow: {
//     fontSize: Typography.sm,
//     color: Colors.gray400,
//     marginHorizontal: 4,
//   },
//   historyQuantityNew: {
//     fontSize: Typography.sm,
//     fontWeight: "bold",
//     color: Colors.success,
//   },
//   historyReason: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   historyAdjustment: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//     marginTop: 2,
//   },
//   emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
//   emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
// });



























// app/(stacks)/inventory/[productId]/history.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Package, Clock, Store, CheckCircle, X, ChevronDown } from "lucide-react-native";
import InventoryService from "../../../../../services/inventoryService";
import StoreService from "../../../../../services/storeService";
import { getCurrentUser } from "../../../../../services/authService";
import { formatDateTime } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

export default function InventoryHistory() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [productName, setProductName] = useState("");

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    loadUserAndStores();
  }, []);

  useEffect(() => {
    if (user && (selectedStoreId || !isSuperAdmin)) {
      fetchHistory();
    }
  }, [selectedStoreId]);

  const loadUserAndStores = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser.role === "SUPER_ADMIN") {
        const storesData = await StoreService.getStoreOptions();
        setStores(storesData);
        
        const currentStoreId = currentUser.currentStoreId?._id || currentUser.currentStoreId;
        if (currentStoreId) {
          setSelectedStoreId(currentStoreId);
        } else if (storesData.length === 1) {
          setSelectedStoreId(storesData[0].value);
        }
      } else {
        const storeId = currentUser.storeId?._id || currentUser.storeId;
        setSelectedStoreId(storeId);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to load user/stores:", error);
      Alert.alert("Error", "Failed to load user data");
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const storeId = isSuperAdmin ? selectedStoreId : null;
      const data = await InventoryService.getInventoryByProduct(productId, storeId);
      setHistory(data?.movements || []);
      setProductName(data?.product?.name || "");
    } catch (error) {
      console.error("Failed to fetch history:", error);
      Alert.alert("Error", error.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.value === storeId);
    return store ? store.label : "Unknown Store";
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: Colors.success,
      UPDATE: Colors.primary,
      DELETE: Colors.error,
      ADJUST: Colors.warning,
      LOGIN: Colors.primary,
      LOGOUT: Colors.gray500,
      PRINT: Colors.primary,
      SCAN: Colors.success,
    };
    return colors[action] || Colors.gray500;
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATE: "➕",
      UPDATE: "✏️",
      DELETE: "🗑️",
      ADJUST: "📊",
      LOGIN: "🔐",
      LOGOUT: "🚪",
      PRINT: "🖨️",
      SCAN: "📷",
    };
    return icons[action] || "📌";
  };

  const renderStoreModal = () => (
    <Modal
      visible={showStoreModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowStoreModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Store</Text>
            <TouchableOpacity onPress={() => setShowStoreModal(false)}>
              <X size={24} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={stores}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.storeItem,
                  selectedStoreId === item.value && styles.storeItemSelected,
                ]}
                onPress={() => {
                  setSelectedStoreId(item.value);
                  setShowStoreModal(false);
                }}
              >
                <Store size={20} color={selectedStoreId === item.value ? Colors.white : Colors.gray500} />
                <Text
                  style={[
                    styles.storeItemText,
                    selectedStoreId === item.value && styles.storeItemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {selectedStoreId === item.value && (
                  <CheckCircle size={16} color={Colors.white} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No stores available</Text>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Stock History" 
        showBack={true}
        rightComponent={
          isSuperAdmin && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowStoreModal(true)}
            >
              <Store size={20} color={Colors.primary} />
            </TouchableOpacity>
          )
        }
      />

      {/* Store Selector for Super Admin */}
      {isSuperAdmin && (
        <View style={styles.storeSelectorBar}>
          <Store size={16} color={Colors.primary} />
          <Text style={styles.storeSelectorText}>
            {selectedStoreId ? getStoreName(selectedStoreId) : 'Select a store...'}
          </Text>
          {selectedStoreId && (
            <TouchableOpacity
              style={styles.storeSelectorChange}
              onPress={() => setShowStoreModal(true)}
            >
              <Text style={styles.storeSelectorChangeText}>Change</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {productName && (
        <View style={styles.productInfoBar}>
          <Package size={16} color={Colors.gray500} />
          <Text style={styles.productInfoText}>{productName}</Text>
        </View>
      )}

      {!selectedStoreId && isSuperAdmin ? (
        <View style={styles.selectStoreContainer}>
          <Store size={48} color={Colors.gray300} />
          <Text style={styles.selectStoreTitle}>Select a Store</Text>
          <Text style={styles.selectStoreSubtext}>
            Please select a store to view its inventory history
          </Text>
          <TouchableOpacity
            style={styles.selectStoreButton}
            onPress={() => setShowStoreModal(true)}
          >
            <Text style={styles.selectStoreButtonText}>Select Store</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.content}
          data={history}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => {
            const actionColor = getActionColor(item.action);
            return (
              <View style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyIcon}>{getActionIcon(item.action)}</Text>
                  <Text style={[styles.historyAction, { color: actionColor }]}>
                    {item.action}
                  </Text>
                  <Text style={styles.historyTime}>
                    {formatDateTime(item.timestamp)}
                  </Text>
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyUser}>
                    {item.actorId?.firstName} {item.actorId?.lastName}
                  </Text>
                  {item.details?.after?.quantity !== undefined && (
                    <View style={styles.historyQuantityRow}>
                      <Text style={styles.historyQuantityLabel}>Quantity:</Text>
                      <Text style={styles.historyQuantityOld}>
                        {item.details?.before?.quantity || 0}
                      </Text>
                      <Text style={styles.historyQuantityArrow}>→</Text>
                      <Text style={styles.historyQuantityNew}>
                        {item.details?.after?.quantity}
                      </Text>
                    </View>
                  )}
                  {item.details?.metadata?.reason && (
                    <Text style={styles.historyReason}>
                      Reason: {item.details.metadata.reason}
                    </Text>
                  )}
                  {item.details?.metadata?.adjustment && (
                    <Text style={styles.historyAdjustment}>
                      Adjustment: {item.details.metadata.adjustment > 0 ? "+" : ""}
                      {item.details.metadata.adjustment}
                    </Text>
                  )}
                  {item.details?.metadata?.productName && (
                    <Text style={styles.historyProductName}>
                      Product: {item.details.metadata.productName}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Clock size={48} color={Colors.gray300} />
              <Text style={styles.emptyTitle}>No History Recorded</Text>
              <Text style={styles.emptySubtext}>
                No inventory movements found for this product
              </Text>
            </View>
          )}
        />
      )}

      {renderStoreModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  headerButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
  },

  // Store Selector
  storeSelectorBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  storeSelectorText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    fontWeight: "500",
  },
  storeSelectorChange: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  storeSelectorChangeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "600",
  },

  // Product Info
  productInfoBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  productInfoText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
    marginLeft: Spacing.sm,
    fontWeight: "500",
  },

  // Select Store State
  selectStoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  selectStoreTitle: {
    fontSize: Typography.xl,
    fontWeight: "600",
    color: Colors.gray700,
    marginTop: Spacing.md,
  },
  selectStoreSubtext: {
    fontSize: Typography.md,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: Spacing.sm,
    maxWidth: "80%",
  },
  selectStoreButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  selectStoreButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },

  // List
  list: { flex: 1 },
  content: { padding: Spacing.md },

  // History Item
  historyItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  historyIcon: {
    fontSize: Typography.lg,
    marginRight: Spacing.sm,
  },
  historyAction: {
    fontSize: Typography.sm,
    fontWeight: "600",
    flex: 1,
  },
  historyTime: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  historyDetails: {
    marginLeft: Spacing["2xl"],
  },
  historyUser: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  historyQuantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  historyQuantityLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  historyQuantityOld: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginLeft: Spacing.sm,
    textDecorationLine: "line-through",
  },
  historyQuantityArrow: {
    fontSize: Typography.sm,
    color: Colors.gray400,
    marginHorizontal: 4,
  },
  historyQuantityNew: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.success,
  },
  historyReason: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  historyAdjustment: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: 2,
  },
  historyProductName: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },

  // Empty State
  emptyContainer: {
    paddingVertical: Spacing["4xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray700,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: Typography.md,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: Spacing.sm,
    maxWidth: "80%",
  },

  // Store Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["3xl"],
    borderTopRightRadius: BorderRadius["3xl"],
    padding: Spacing["2xl"],
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    gap: Spacing.md,
  },
  storeItemSelected: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  storeItemText: {
    fontSize: Typography.md,
    color: Colors.gray900,
    flex: 1,
  },
  storeItemTextSelected: {
    color: Colors.white,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray500,
    padding: Spacing["2xl"],
  },
});