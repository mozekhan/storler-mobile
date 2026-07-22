import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import WarehouseService from "../../../services/warehouseService";
import TransactionService from "../../../services/transactionService";
import InventoryService from "../../../services/inventoryService";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Scan,
  Search,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  QrCode,
  Printer,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";
import { formatCurrency } from "../../../utils/formatters";

export default function Warehouse() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [releaseQueue, setReleaseQueue] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [warehouseStats, setWarehouseStats] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [releaseModal, setReleaseModal] = useState(false);
  const [releasedItems, setReleasedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryModal, setInventoryModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [releaseResult, setReleaseResult] = useState(null);
  const [scannedTransaction, setScannedTransaction] = useState(null);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    fetchData();
    // Check if coming from QR scan
    if (params.transactionId && params.mode === "release") {
      handleQRScanResult(params);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchReleaseQueue(), fetchInventory(), fetchStats()]);
    } catch (error) {
      console.error("Failed to fetch warehouse data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchReleaseQueue = async () => {
    try {
      const result = await WarehouseService.getReleaseQueue();
      setReleaseQueue(result.transactions || []);
    } catch (error) {
      console.error("Failed to fetch release queue:", error);
    }
  };

  const fetchInventory = async () => {
    try {
      const result = await InventoryService.getInventory({
        limit: 20,
        sortBy: "quantity",
        sortOrder: "asc",
      });
      setInventory(result.inventory || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await WarehouseService.getStats();
      console.log("Stats received:", stats);
      setWarehouseStats(stats);
    } catch (error) {
      console.error("Failed to fetch warehouse stats:", error);
      // Set default values to prevent crash
      setWarehouseStats({
        pendingReleases: 0,
        totalProducts: 0,
        totalInventory: 0,
        totalInventoryValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        recentTransactions: [],
        releaseQueue: [],
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleQRScanResult = async (params) => {
    try {
      const result = await TransactionService.scanPaymentQR(params.qrData);

      if (result && result.isValid) {
        setScannedTransaction(result.transaction);
        setQrData(params.qrData);
        setSelectedTransaction(result.transaction);
        setReleaseModal(true);

        // Initialize released items with zeros
        const initialItems = {};
        result.transaction.items?.forEach((item) => {
          initialItems[item.productId?._id] = 0;
        });
        setReleasedItems(initialItems);
        setReleaseResult(null);

        Alert.alert(
          "Payment QR Scanned",
          `Transaction: ${result.transaction.transactionNumber}\nTotal: $${result.transaction.totalAmount?.toFixed(2)}\nItems: ${result.transaction.items?.length || 0}`,
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      // catch (error) {
      //   Alert.alert("Error", "Failed to scan QR code");
      // }
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to scan QR code",
      );
    }
  };

  const processRelease = async () => {
    if (!selectedTransaction) return;

    const items = Object.entries(releasedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (items.length === 0) {
      Alert.alert("Error", "Please specify quantities to release");
      return;
    }

    setLoading(true);
    try {
      const result = await TransactionService.releaseStock(
        selectedTransaction._id,
        items,
      );

      setReleaseResult(result);

      Alert.alert(
        "Release Successful",
        `Items released successfully\n` +
          `Invoice: ${result.invoiceNumber}\n` +
          `Items: ${result.releaseResults?.length || 0} released\n` +
          `Errors: ${result.releaseErrors?.length || 0}`,
        [
          {
            text: "View Release QR",
            onPress: () => {
              if (result.releaseQR) {
                router.push({
                  pathname: "/(app)/(modals)/receipt-preview",
                  params: {
                    transactionId: selectedTransaction._id,
                    qrData: result.releaseQR,
                    qrType: "RELEASE",
                    invoiceNumber: result.invoiceNumber,
                    mode: "release",
                  },
                });
              }
            },
          },
          {
            text: "View Invoice QR",
            onPress: () => {
              if (result.transaction.invoiceQR) {
                router.push({
                  pathname: "/(app)/(modals)/receipt-preview",
                  params: {
                    transactionId: selectedTransaction._id,
                    qrData: result.transaction.invoiceQR,
                    qrType: "INVOICE",
                    invoiceNumber: result.invoiceNumber,
                    mode: "invoice",
                  },
                });
              }
            },
          },
          {
            text: "Done",
            onPress: () => {
              setReleaseModal(false);
              setSelectedTransaction(null);
              setReleasedItems({});
              setReleaseResult(null);
              setScannedTransaction(null);
              setQrData(null);
              fetchData();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to release items",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async () => {
    if (!selectedInventoryItem) return;
    if (adjustmentQuantity === 0) {
      Alert.alert("Error", "Please enter a quantity");
      return;
    }
    if (!adjustmentReason.trim()) {
      Alert.alert("Error", "Please enter a reason");
      return;
    }

    setLoading(true);
    try {
      await InventoryService.adjustStock(
        selectedInventoryItem.productId._id,
        adjustmentQuantity,
        adjustmentReason.trim(),
      );
      Alert.alert("Success", "Stock adjusted successfully");
      setInventoryModal(false);
      setSelectedInventoryItem(null);
      setAdjustmentQuantity(0);
      setAdjustmentReason("");
      fetchInventory();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to adjust stock",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (item) => {
    const quantity = item.quantity || 0;
    const reorderPoint = item.reorderPoint || 5;

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        container: styles.stockOut,
        text: styles.stockOutText,
        icon: XCircle,
      };
    } else if (quantity <= reorderPoint) {
      return {
        label: "Low Stock",
        container: styles.stockLow,
        text: styles.stockLowText,
        icon: AlertTriangle,
      };
    } else {
      return {
        label: "In Stock",
        container: styles.stockIn,
        text: styles.stockInText,
        icon: CheckCircle,
      };
    }
  };

  const renderReleaseItem = ({ item }) => {
    const hasInventory = item.items?.some((i) =>
      inventory.some((inv) => inv.productId?._id === i.productId?._id),
    );

    return (
      <TouchableOpacity
        style={styles.releaseItem}
        onPress={() => {
          setSelectedTransaction(item);
          setReleaseModal(true);
          const initialItems = {};
          item.items?.forEach((i) => {
            initialItems[i.productId?._id] = 0;
          });
          setReleasedItems(initialItems);
          setReleaseResult(null);
        }}
      >
        <View style={styles.releaseItemRow}>
          <View style={styles.releaseItemInfo}>
            <Text style={styles.releaseItemNumber}>
              {item.transactionNumber}
            </Text>
            <Text style={styles.releaseItemCount}>
              {item.items?.length || 0} items
            </Text>
            <Text style={styles.releaseItemAmount}>
              {formatCurrency(item.totalAmount)}
            </Text>
            {item.paymentQR && (
              <Text style={styles.releaseItemQR}>✅ Payment Verified</Text>
            )}
          </View>
          <View style={styles.releaseItemRight}>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>
                {hasInventory ? "Ready for Release" : "Pending Stock"}
              </Text>
            </View>
            <Clock
              size={16}
              color={hasInventory ? Colors.success : Colors.warning}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderInventoryItem = ({ item }) => {
    const status = getStockStatus(item);
    const StatusIcon = status.icon;
    const available = (item.quantity || 0) - (item.reservedQuantity || 0);

    return (
      <TouchableOpacity
        style={styles.inventoryItem}
        onPress={() => {
          setSelectedInventoryItem(item);
          setAdjustmentQuantity(0);
          setAdjustmentReason("");
          setInventoryModal(true);
        }}
      >
        <View style={styles.inventoryItemRow}>
          <View style={styles.inventoryItemInfo}>
            <Text style={styles.inventoryItemName}>
              {item.productId?.name || "Unknown Product"}
            </Text>
            <Text style={styles.inventoryItemSku}>
              SKU: {item.productId?.sku || "N/A"}
            </Text>
            <Text style={styles.inventoryItemLocation}>
              📍 {item.warehouseLocation?.aisle || "N/A"} -{" "}
              {item.warehouseLocation?.shelf || "N/A"} -{" "}
              {item.warehouseLocation?.bin || "N/A"}
            </Text>
          </View>
          <View style={styles.inventoryItemRight}>
            <Text style={styles.inventoryItemQuantity}>{item.quantity}</Text>
            <Text style={styles.inventoryItemAvailable}>
              Available: {available}
            </Text>
            <View style={[styles.stockBadge, status.container]}>
              <StatusIcon size={12} />
              <Text style={[styles.stockBadgeText, status.text]}>
                {status.label}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId?.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Warehouse</Text>
          <Text style={styles.headerSubtitle}>
            Manage inventory and releases
          </Text>
        </View>

        {warehouseStats && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardLeft]}>
              <Text style={styles.statLabel}>Pending Releases</Text>
              <Text style={styles.statValue}>
                {warehouseStats.pendingReleases || 0}
              </Text>
            </View>
            <View style={[styles.statCard, styles.statCardRight]}>
              <Text style={styles.statLabel}>Low Stock Items</Text>
              <Text style={[styles.statValue, styles.warningValue]}>
                {warehouseStats.lowStockItems || 0}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, styles.scanAction]}
            onPress={() => router.push("/(app)/(tabs)/scan")}
          >
            <Scan size={20} color={Colors.white} />
            <Text style={styles.scanActionText}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, styles.refreshAction]}
            onPress={onRefresh}
          >
            <RefreshCw size={20} color={Colors.gray700} />
            <Text style={styles.refreshActionText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Release Queue ({releaseQueue.length})
          </Text>
          {releaseQueue.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Truck size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>No pending releases</Text>
            </View>
          ) : (
            <FlatList
              data={releaseQueue}
              keyExtractor={(item) => item._id}
              renderItem={renderReleaseItem}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.inventoryHeader}>
            <Text style={styles.sectionTitle}>Inventory Overview</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/(app)/(stacks)/inventory")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search inventory..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={Colors.gray400}
            />
          </View>

          {filteredInventory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Package size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>No inventory items found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredInventory.slice(0, 10)}
              keyExtractor={(item) => item._id}
              renderItem={renderInventoryItem}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Release Modal */}
      <Modal visible={releaseModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Process Release</Text>
              <TouchableOpacity
                onPress={() => {
                  setReleaseModal(false);
                  setSelectedTransaction(null);
                  setReleasedItems({});
                  setReleaseResult(null);
                  setScannedTransaction(null);
                  setQrData(null);
                }}
              >
                <XCircle size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <>
                <View style={styles.modalTransaction}>
                  <Text style={styles.modalTransactionLabel}>Transaction</Text>
                  <Text style={styles.modalTransactionNumber}>
                    {selectedTransaction.transactionNumber || "Loading..."}
                  </Text>
                  <Text style={styles.modalTransactionTotal}>
                    Total:{" "}
                    {formatCurrency(selectedTransaction.totalAmount || 0)}
                  </Text>
                  {selectedTransaction.paymentQR && (
                    <Text style={styles.modalPaymentVerified}>
                      ✅ Payment Verified
                    </Text>
                  )}
                </View>

                {releaseResult ? (
                  <View style={styles.releaseSuccessContainer}>
                    <CheckCircle size={48} color={Colors.success} />
                    <Text style={styles.releaseSuccessTitle}>
                      Release Complete!
                    </Text>
                    <Text style={styles.releaseSuccessSubtitle}>
                      Invoice: {releaseResult.invoiceNumber}
                    </Text>
                    <Text style={styles.releaseSuccessSubtitle}>
                      Items Released:{" "}
                      {releaseResult.releaseResults?.length || 0}
                    </Text>
                    {releaseResult.releaseErrors?.length > 0 && (
                      <Text style={styles.releaseSuccessError}>
                        Errors: {releaseResult.releaseErrors.length}
                      </Text>
                    )}
                    {releaseResult.releaseQR && (
                      <TouchableOpacity
                        style={styles.viewQRButton}
                        onPress={() => {
                          router.push({
                            pathname: "/(app)/(modals)/receipt-preview",
                            params: {
                              transactionId: selectedTransaction._id,
                              qrData: releaseResult.releaseQR,
                              qrType: "RELEASE",
                              invoiceNumber: releaseResult.invoiceNumber,
                              mode: "release",
                            },
                          });
                        }}
                      >
                        <QrCode size={16} color={Colors.white} />
                        <Text style={styles.viewQRText}>
                          View Release Receipt
                        </Text>
                      </TouchableOpacity>
                    )}
                    {selectedTransaction.invoiceQR && (
                      <TouchableOpacity
                        style={[styles.viewQRButton, styles.viewInvoiceButton]}
                        onPress={() => {
                          router.push({
                            pathname: "/(app)/(modals)/receipt-preview",
                            params: {
                              transactionId: selectedTransaction._id,
                              qrData: selectedTransaction.invoiceQR,
                              qrType: "INVOICE",
                              invoiceNumber: releaseResult.invoiceNumber,
                              mode: "invoice",
                            },
                          });
                        }}
                      >
                        <Printer size={16} color={Colors.white} />
                        <Text style={styles.viewQRText}>View Invoice</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.releaseDoneButton}
                      onPress={() => {
                        setReleaseModal(false);
                        setSelectedTransaction(null);
                        setReleasedItems({});
                        setReleaseResult(null);
                        setScannedTransaction(null);
                        setQrData(null);
                        fetchData();
                      }}
                    >
                      <Text style={styles.releaseDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <ScrollView style={styles.modalItemList}>
                      {selectedTransaction.items?.map((item) => (
                        <View key={item._id} style={styles.modalItem}>
                          <View style={styles.modalItemInfo}>
                            <Text style={styles.modalItemName}>
                              {item.name}
                            </Text>
                            <Text style={styles.modalItemQuantity}>
                              Ordered: {item.quantity}
                            </Text>
                            {inventory.find(
                              (inv) =>
                                inv.productId?._id === item.productId?._id,
                            ) && (
                              <Text style={styles.modalItemAvailable}>
                                Available:{" "}
                                {inventory.find(
                                  (inv) =>
                                    inv.productId?._id === item.productId?._id,
                                )?.quantity || 0}
                              </Text>
                            )}
                          </View>
                          <View style={styles.modalItemActions}>
                            <TouchableOpacity
                              style={styles.modalItemButton}
                              onPress={() => {
                                const current =
                                  releasedItems[item.productId?._id] || 0;
                                setReleasedItems((prev) => ({
                                  ...prev,
                                  [item.productId?._id]: Math.max(
                                    0,
                                    current - 1,
                                  ),
                                }));
                              }}
                            >
                              <Minus size={16} color={Colors.gray500} />
                            </TouchableOpacity>
                            <Text style={styles.modalItemInput}>
                              {releasedItems[item.productId?._id] || 0}
                            </Text>
                            <TouchableOpacity
                              style={styles.modalItemButton}
                              onPress={() => {
                                const current =
                                  releasedItems[item.productId?._id] || 0;
                                const maxQty = item.quantity || 0;
                                setReleasedItems((prev) => ({
                                  ...prev,
                                  [item.productId?._id]: Math.min(
                                    current + 1,
                                    maxQty,
                                  ),
                                }));
                              }}
                            >
                              <Plus size={16} color={Colors.gray500} />
                            </TouchableOpacity>
                            <Text style={styles.modalItemMax}>
                              / {item.quantity}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>

                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalCancelButton]}
                        onPress={() => {
                          setReleaseModal(false);
                          setSelectedTransaction(null);
                          setReleasedItems({});
                          setReleaseResult(null);
                        }}
                      >
                        <Text style={styles.modalCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.modalButton,
                          styles.modalReleaseButton,
                          loading && styles.buttonDisabled,
                        ]}
                        onPress={processRelease}
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator
                            color={Colors.white}
                            size="small"
                          />
                        ) : (
                          <Text style={styles.modalReleaseText}>
                            Release Items
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Inventory Adjust Modal */}
      <Modal visible={inventoryModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.adjustModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Stock</Text>
              <TouchableOpacity
                onPress={() => {
                  setInventoryModal(false);
                  setSelectedInventoryItem(null);
                  setAdjustmentQuantity(0);
                  setAdjustmentReason("");
                }}
              >
                <XCircle size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            {selectedInventoryItem && (
              <>
                <View style={styles.modalTransaction}>
                  <Text style={styles.modalTransactionLabel}>Product</Text>
                  <Text style={styles.modalTransactionNumber}>
                    {selectedInventoryItem.productId?.name}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>
                    Current Stock
                  </Text>
                  <Text style={styles.modalTransactionAmount}>
                    {selectedInventoryItem.quantity}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>Reserved</Text>
                  <Text style={styles.modalTransactionAmount}>
                    {selectedInventoryItem.reservedQuantity || 0}
                  </Text>
                  <Text style={styles.modalTransactionLabel}>SKU</Text>
                  <Text style={styles.modalTransactionNumber}>
                    {selectedInventoryItem.productId?.sku}
                  </Text>
                </View>

                <View style={styles.adjustField}>
                  <Text style={styles.adjustLabel}>Adjustment Quantity</Text>
                  <View style={styles.adjustRow}>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => setAdjustmentQuantity((prev) => prev - 1)}
                    >
                      <Minus size={20} color={Colors.gray500} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.adjustInput}
                      keyboardType="numeric"
                      value={String(adjustmentQuantity)}
                      onChangeText={(text) =>
                        setAdjustmentQuantity(parseInt(text) || 0)
                      }
                    />
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => setAdjustmentQuantity((prev) => prev + 1)}
                    >
                      <Plus size={20} color={Colors.gray500} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.adjustHelp}>
                    Positive to add, negative to remove
                  </Text>
                </View>

                <View style={styles.adjustField}>
                  <Text style={styles.adjustLabel}>Reason</Text>
                  <TextInput
                    style={styles.adjustReasonInput}
                    placeholder="Enter reason for adjustment"
                    value={adjustmentReason}
                    onChangeText={setAdjustmentReason}
                    multiline
                    numberOfLines={2}
                    placeholderTextColor={Colors.gray400}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={() => {
                      setInventoryModal(false);
                      setSelectedInventoryItem(null);
                      setAdjustmentQuantity(0);
                      setAdjustmentReason("");
                    }}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.modalProcessButton,
                      loading && styles.buttonDisabled,
                    ]}
                    onPress={handleAdjustStock}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Text style={styles.modalProcessText}>Adjust Stock</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingVertical: Spacing.md },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
  statsRow: { flexDirection: "row", marginBottom: Spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statCardLeft: { marginRight: Spacing.sm },
  statCardRight: { marginLeft: Spacing.sm },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  warningValue: { color: Colors.warning },
  quickActions: { flexDirection: "row", marginBottom: Spacing.md },
  quickAction: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanAction: { backgroundColor: Colors.primary, marginRight: Spacing.sm },
  scanActionText: {
    color: Colors.white,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  refreshAction: { backgroundColor: Colors.gray200, marginLeft: Spacing.sm },
  refreshActionText: {
    color: Colors.gray700,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  inventoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  viewAllButton: { padding: Spacing.sm },
  viewAllText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.md,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["3xl"],
    alignItems: "center",
    ...Shadows.sm,
  },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
  releaseItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  releaseItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  releaseItemInfo: { flex: 1 },
  releaseItemNumber: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  releaseItemCount: { fontSize: Typography.sm, color: Colors.gray500 },
  releaseItemAmount: {
    fontSize: Typography.sm,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  releaseItemQR: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: "500",
    marginTop: 2,
  },
  releaseItemRight: { alignItems: "flex-end" },
  readyBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  readyBadgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "500",
  },
  inventoryItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  inventoryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inventoryItemInfo: { flex: 1 },
  inventoryItemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  inventoryItemSku: { fontSize: Typography.xs, color: Colors.gray500 },
  inventoryItemLocation: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
  inventoryItemRight: { alignItems: "flex-end" },
  inventoryItemQuantity: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  inventoryItemAvailable: {
    fontSize: Typography.sm,
    color: Colors.primary,
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  stockBadgeText: { fontSize: Typography.xs, marginLeft: Spacing.xs },
  stockIn: { backgroundColor: Colors.success + "20" },
  stockInText: { color: Colors.success },
  stockLow: { backgroundColor: Colors.warning + "20" },
  stockLowText: { color: Colors.warning },
  stockOut: { backgroundColor: Colors.error + "20" },
  stockOutText: { color: Colors.error },
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
    maxHeight: "80%",
  },
  adjustModalContent: { maxHeight: "85%" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalTransaction: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  modalTransactionLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  modalTransactionNumber: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  modalTransactionTotal: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  modalTransactionAmount: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  modalPaymentVerified: {
    fontSize: Typography.sm,
    color: Colors.success,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  modalItemList: { maxHeight: 240 },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalItemInfo: { flex: 1 },
  modalItemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  modalItemQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
  modalItemAvailable: { fontSize: Typography.xs, color: Colors.success },
  modalItemActions: { flexDirection: "row", alignItems: "center" },
  modalItemButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemInput: {
    width: 40,
    textAlign: "center",
    fontSize: Typography.md,
    fontWeight: "500",
  },
  modalItemMax: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
  },
  releaseSuccessContainer: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  releaseSuccessTitle: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.md,
  },
  releaseSuccessSubtitle: {
    fontSize: Typography.md,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  releaseSuccessError: {
    fontSize: Typography.md,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  viewQRButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  viewInvoiceButton: {
    backgroundColor: Colors.success,
  },
  viewQRText: {
    color: Colors.white,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  releaseDoneButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.gray200,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  releaseDoneText: {
    fontWeight: "600",
    color: Colors.gray700,
  },
  adjustField: { marginBottom: Spacing.md },
  adjustLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  adjustRow: { flexDirection: "row", alignItems: "center" },
  adjustButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  adjustInput: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.xl,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  adjustHelp: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  adjustReasonInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 60,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButton: { backgroundColor: Colors.gray200 },
  modalCancelText: { fontWeight: "600", color: Colors.gray700 },
  modalReleaseButton: { backgroundColor: Colors.primary },
  modalReleaseText: { fontWeight: "600", color: Colors.white },
  modalProcessButton: { backgroundColor: Colors.primary },
  modalProcessText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});
