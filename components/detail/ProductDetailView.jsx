import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Badge from "../ui/Badge";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../constants/theme";

const ProductDetailView = ({ product }) => {
  const getStockStatus = () => {
    const quantity = product.inventory?.quantity || 0;
    const minStock = product.minStockLevel || 5;

    if (quantity === 0) return { label: "Out of Stock", variant: "error" };
    if (quantity <= minStock) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "success" };
  };

  const stockStatus = getStockStatus();
  const available =
    (product.inventory?.quantity || 0) -
    (product.inventory?.reservedQuantity || 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{product.name}</Text>
          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
        </View>
        <Text style={styles.sku}>SKU: {product.sku}</Text>
        <Text style={styles.barcode}>Barcode: {product.barcode || "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.pricingGrid}>
          <View style={styles.pricingItem}>
            <Text style={styles.pricingLabel}>Unit Price</Text>
            <Text style={styles.pricingValue}>
              {formatCurrency(product.unitPrice)}
            </Text>
          </View>
          <View style={styles.pricingItem}>
            <Text style={styles.pricingLabel}>Cost Price</Text>
            <Text style={styles.pricingValue}>
              {product.costPrice ? formatCurrency(product.costPrice) : "N/A"}
            </Text>
          </View>
          <View style={styles.pricingItem}>
            <Text style={styles.pricingLabel}>Tax Rate</Text>
            <Text style={styles.pricingValue}>{product.taxRate || 0}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory</Text>
        <View style={styles.inventoryGrid}>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Available</Text>
            <Text
              style={[
                styles.inventoryValue,
                available === 0 && styles.outOfStock,
                available <= product.minStockLevel &&
                  available > 0 &&
                  styles.lowStock,
              ]}
            >
              {available}
            </Text>
          </View>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Reserved</Text>
            <Text style={styles.inventoryValue}>
              {product.inventory?.reservedQuantity || 0}
            </Text>
          </View>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Reorder Point</Text>
            <Text style={styles.inventoryValue}>
              {product.minStockLevel || 5}
            </Text>
          </View>
          <View style={styles.inventoryItem}>
            <Text style={styles.inventoryLabel}>Status</Text>
            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{product.category}</Text>
          </View>
          {product.subCategory && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Sub Category</Text>
              <Text style={styles.detailValue}>{product.subCategory}</Text>
            </View>
          )}
          {product.brand && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{product.brand}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Unit</Text>
            <Text style={styles.detailValue}>{product.unitOfMeasure}</Text>
          </View>
        </View>
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}
      </View>

      {product.warehouseLocation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Warehouse Location</Text>
          <View style={styles.locationGrid}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Aisle</Text>
              <Text style={styles.locationValue}>
                {product.warehouseLocation.aisle || "N/A"}
              </Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Shelf</Text>
              <Text style={styles.locationValue}>
                {product.warehouseLocation.shelf || "N/A"}
              </Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Bin</Text>
              <Text style={styles.locationValue}>
                {product.warehouseLocation.bin || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store</Text>
        <Text style={styles.storeName}>{product.storeId?.name}</Text>
        <Text style={styles.storeCode}>Code: {product.storeId?.code}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Created: {formatDate(product.createdAt)} •{" "}
          {product.isActive ? "Active" : "Inactive"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Styles.shadow,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: Typography.xl, fontWeight: "bold", color: Colors.gray900 },
  sku: { fontSize: Typography.sm, color: Colors.gray500, marginTop: 2 },
  barcode: { fontSize: Typography.sm, color: Colors.gray500 },
  section: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  pricingGrid: { flexDirection: "row", justifyContent: "space-around" },
  pricingItem: { alignItems: "center" },
  pricingLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  pricingValue: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  inventoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  inventoryItem: { minWidth: "45%" },
  inventoryLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  inventoryValue: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  outOfStock: { color: Colors.error },
  lowStock: { color: Colors.warning },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  detailItem: { minWidth: "45%" },
  detailLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  detailValue: { fontSize: Typography.sm, color: Colors.gray900 },
  description: { fontSize: Typography.sm, color: Colors.gray700, marginTop: 8 },
  locationGrid: { flexDirection: "row", justifyContent: "space-around" },
  locationItem: { alignItems: "center" },
  locationLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  locationValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  storeName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
  },
  storeCode: { fontSize: Typography.sm, color: Colors.gray500 },
  footer: { padding: Spacing.md, alignItems: "center" },
  footerText: { fontSize: Typography.xs, color: Colors.gray400 },
});

const Styles = {
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

export default ProductDetailView;
