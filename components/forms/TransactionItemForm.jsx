import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import { X, Save, Search, Plus, Minus } from 'lucide-react-native';
import ProductService from '../../services/productService';
import { formatCurrency } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const TransactionItemForm = ({
  transactionId,
  onAddItem,
  onCancel,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    setSearching(true);
    try {
      const result = await ProductService.getProducts({
        search: searchTerm,
        limit: 20,
      });
      setProducts(result.products || []);
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;
    onAddItem(selectedProduct._id, quantity);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productItem, selectedProduct?._id === item._id && styles.productItemSelected]}
      onPress={() => {
        setSelectedProduct(item);
        setQuantity(1);
      }}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSku}>SKU: {item.sku}</Text>
      </View>
      <Text style={styles.productPrice}>{formatCurrency(item.unitPrice)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Item</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={Colors.gray400}
        />
      </View>

      <FlatList
        style={styles.productList}
        contentContainerStyle={styles.productListContent}
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchTerm.length >= 2 ? 'No products found' : 'Type to search'}
            </Text>
          </View>
        )}
      />

      {selectedProduct && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedName}>{selectedProduct.name}</Text>
          <Text style={styles.selectedPrice}>{formatCurrency(selectedProduct.unitPrice)} each</Text>
          <Text style={styles.selectedStock}>Available: {selectedProduct.inventory?.quantity || 0}</Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={20} color={Colors.gray500} />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={String(quantity)}
              onChangeText={(text) => setQuantity(parseInt(text) || 1)}
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Plus size={20} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setSelectedProduct(null);
                setQuantity(1);
              }}
            >
              <Text style={styles.cancelButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleAddItem}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Add to Cart</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    padding: Spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  closeButton: { padding: Spacing.sm },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, fontSize: Typography.md },
  productList: { maxHeight: 300 },
  productListContent: { paddingHorizontal: Spacing.sm },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  productItemSelected: {
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  productSku: { fontSize: Typography.xs, color: Colors.gray500 },
  productPrice: { fontSize: Typography.sm, fontWeight: 'bold', color: Colors.primary },
  emptyContainer: { paddingVertical: Spacing['2xl'], alignItems: 'center' },
  emptyText: { color: Colors.gray500 },
  selectedContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  selectedName: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  selectedPrice: { fontSize: Typography.sm, color: Colors.gray500 },
  selectedStock: { fontSize: Typography.sm, color: Colors.gray500 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    width: 60,
    textAlign: 'center',
    fontSize: Typography.xl,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});

export default TransactionItemForm;