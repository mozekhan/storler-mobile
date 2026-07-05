import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Search, Plus, Package, Edit, Filter, X } from "lucide-react-native";
import ProductService from "../../../../services/productService";
import { formatCurrency } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function Products() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const result = await ProductService.getProducts({
        search: searchTerm,
        category: filterCategory || undefined,
        limit: 50,
      });
      setProducts(result.products || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await ProductService.getCategories();
      setCategories(result || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const getStockStatus = (item) => {
    const quantity = item.inventory?.quantity || 0;
    const minStock = item.minStockLevel || 5;

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        container: styles.stockOut,
        text: styles.stockOutText,
      };
    } else if (quantity <= minStock) {
      return {
        label: "Low Stock",
        container: styles.stockLow,
        text: styles.stockLowText,
      };
    } else {
      return {
        label: "In Stock",
        container: styles.stockIn,
        text: styles.stockInText,
      };
    }
  };

  const renderProduct = ({ item }) => {
    const stock = getStockStatus(item);

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          console.log('Navigating to product:', item._id);
          router.push(`/products/${item._id}`)}}
      >
        <View style={styles.productRow}>
          <View style={styles.productInfo}>
            <View style={styles.productIcon}>
              <Package size={20} color={Colors.primary} />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productSku}>SKU: {item.sku}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.productRight}>
            <Text style={styles.productPrice}>
              {formatCurrency(item.unitPrice)}
            </Text>
            <View style={[styles.stockBadge, stock.container]}>
              <Text style={[styles.stockBadgeText, stock.text]}>
                {stock.label}
              </Text>
            </View>
            <Text style={styles.productQuantity}>
              Qty: {item.inventory?.quantity || 0}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Products" />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={Colors.gray400}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            Alert.alert("Filter by Category", "Select a category", [
              ...categories.map((cat) => ({
                text: cat.category || "Uncategorized",
                onPress: () => {
                  setFilterCategory(cat.category || "");
                  fetchProducts();
                },
              })),
              {
                text: "Clear Filter",
                style: "cancel",
                onPress: () => {
                  setFilterCategory("");
                  fetchProducts();
                },
              },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
        >
          <Filter
            size={20}
            color={filterCategory ? Colors.primary : Colors.gray400}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/products/new")}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {filterCategory && (
        <View style={styles.filterChipContainer}>
          <Text style={styles.filterChipText}>Category: {filterCategory}</Text>
          <TouchableOpacity
            onPress={() => {
              setFilterCategory("");
              fetchProducts();
            }}
          >
            <Text style={styles.filterChipClear}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Package size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>No products found</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push("/products/new")}
            >
              <Text style={styles.emptyButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...Shadows.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.md,
  },
  filterButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    marginLeft: Spacing.sm,
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  filterChipText: { fontSize: Typography.sm, color: Colors.primary, flex: 1 },
  filterChipClear: {
    fontSize: Typography.md,
    color: Colors.gray500,
    paddingHorizontal: Spacing.sm,
  },
  list: { flex: 1 },
  listContent: { padding: Spacing.md },
  productItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productInfo: { flex: 1, flexDirection: "row", alignItems: "center" },
  productIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary + "10",
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  productDetails: { marginLeft: Spacing.md, flex: 1 },
  productName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  productSku: { fontSize: Typography.sm, color: Colors.gray500 },
  productCategory: { fontSize: Typography.xs, color: Colors.gray400 },
  productRight: { alignItems: "flex-end" },
  productPrice: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.primary,
  },
  stockBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  stockBadgeText: { fontSize: Typography.xs, fontWeight: "500" },
  stockIn: { backgroundColor: Colors.success + "20" },
  stockInText: { color: Colors.success },
  stockLow: { backgroundColor: Colors.warning + "20" },
  stockLowText: { color: Colors.warning },
  stockOut: { backgroundColor: Colors.error + "20" },
  stockOutText: { color: Colors.error },
  productQuantity: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  emptyContainer: { paddingVertical: Spacing["4xl"], alignItems: "center" },
  emptyText: { color: Colors.gray500, marginTop: Spacing.sm },
  emptyButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: { color: Colors.white, fontWeight: "600" },
});
