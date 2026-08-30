// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   StyleSheet,
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Search, Plus, Package, Edit, Filter, X, RefreshCw, Tag } from "lucide-react-native";
// import ProductService from "../../../../services/productService";
// import { formatCurrency } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// const SORT_OPTIONS = [
//   { value: "name_asc", label: "Name A-Z" },
//   { value: "name_desc", label: "Name Z-A" },
//   { value: "unitPrice_asc", label: "Price: Low to High" },
//   { value: "unitPrice_desc", label: "Price: High to Low" },
//   { value: "createdAt_desc", label: "Newest First" },
//   { value: "createdAt_asc", label: "Oldest First" },
// ];

// export default function Products() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [sortBy, setSortBy] = useState("name_asc");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");

//   // UI state
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [hasActiveFilters, setHasActiveFilters] = useState(false);
//   const [selectedStoreFilter, setSelectedStoreFilter] = useState('');
//   const [userStores, setUserStores] = useState([]);

//   // Debounce refs
//   const searchTimeoutRef = useRef(null);

//   // Apply filters
//   const applyFilters = useCallback(async (page = 1, append = false) => {
//     try {
//       if (append) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       const params = {
//         page,
//         limit: 20,
//         search: searchTerm || undefined,
//         sort: sortBy,
//         category: selectedCategory || undefined,
//       };

//       if (minPrice) {
//         params.minPrice = parseFloat(minPrice);
//       }

//       if (maxPrice) {
//         params.maxPrice = parseFloat(maxPrice);
//       }

//       // Clean undefined params
//       Object.keys(params).forEach((key) => {
//         if (params[key] === undefined || params[key] === "") {
//           delete params[key];
//         }
//       });

//       const result = await ProductService.getProducts(params);
      
//       if (append) {
//         setProducts(prev => [...prev, ...(result.products || [])]);
//       } else {
//         setProducts(result.products || []);
//       }
//       setPagination(result.pagination || {});
//     } catch (error) {
//       Alert.alert("Error", "Failed to load products");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   }, [searchTerm, selectedCategory, sortBy, minPrice, maxPrice]);

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const result = await ProductService.getCategories();
//       setCategories(result || []);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     applyFilters(1);
//     fetchCategories();
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
//     searchTimeoutRef.current = setTimeout(() => {
//       if (searchTerm !== undefined) {
//         applyFilters(1);
//       }
//     }, 500);
//     return () => clearTimeout(searchTimeoutRef.current);
//   }, [searchTerm]);

//   // Check for active filters
//   useEffect(() => {
//     const hasFilters =
//       selectedCategory !== "" ||
//       sortBy !== "name_asc" ||
//       minPrice !== "" ||
//       maxPrice !== "";
//     setHasActiveFilters(hasFilters);
//   }, [selectedCategory, sortBy, minPrice, maxPrice]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     applyFilters(1);
//   };

//   const loadMore = () => {
//     if (pagination.page < pagination.pages && !loading && !loadingMore) {
//       applyFilters(pagination.page + 1, true);
//     }
//   };

//   const clearAllFilters = () => {
//     setSelectedCategory("");
//     setSortBy("name_asc");
//     setMinPrice("");
//     setMaxPrice("");
//     setSearchTerm("");
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const applyFilterChanges = () => {
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const getStockStatus = (item) => {
//     const quantity = item.inventory?.quantity || 0;
//     const minStock = item.minStockLevel || 5;

//     if (quantity === 0) {
//       return {
//         label: "Out of Stock",
//         container: styles.stockOut,
//         text: styles.stockOutText,
//       };
//     } else if (quantity <= minStock) {
//       return {
//         label: "Low Stock",
//         container: styles.stockLow,
//         text: styles.stockLowText,
//       };
//     } else {
//       return {
//         label: "In Stock",
//         container: styles.stockIn,
//         text: styles.stockInText,
//       };
//     }
//   };

//   const renderProduct = ({ item }) => {
//     const stock = getStockStatus(item);

//     return (
//       <TouchableOpacity
//         style={styles.productItem}
//         onPress={() => router.push(`/products/${item._id}`)}
//       >
//         <View style={styles.productRow}>
//           <View style={styles.productInfo}>
//             <View style={styles.productIcon}>
//               <Package size={20} color={Colors.primary} />
//             </View>
//             <View style={styles.productDetails}>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.productSku}>SKU: {item.sku}</Text>
//               <Text style={styles.productCategory}>{item.category}</Text>
//             </View>
//           </View>
//           <View style={styles.productRight}>
//             <Text style={styles.productPrice}>
//               {formatCurrency(item.unitPrice)}
//             </Text>
//             <View style={[styles.stockBadge, stock.container]}>
//               <Text style={[styles.stockBadgeText, stock.text]}>
//                 {stock.label}
//               </Text>
//             </View>
//             <Text style={styles.productQuantity}>
//               Qty: {item.inventory?.quantity || 0}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderFilterModal = () => (
//     <Modal
//       visible={showFilterModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowFilterModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <TouchableOpacity
//               onPress={() => setShowFilterModal(false)}
//               style={styles.modalCloseButton}
//             >
//               <X size={24} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             style={styles.modalScroll}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Categories */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Category</Text>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 style={styles.categoryScroll}
//               >
//                 <TouchableOpacity
//                   style={[
//                     styles.categoryChip,
//                     !selectedCategory && styles.categoryChipActive,
//                   ]}
//                   onPress={() => setSelectedCategory("")}
//                 >
//                   <Text
//                     style={[
//                       styles.categoryChipText,
//                       !selectedCategory && styles.categoryChipTextActive,
//                     ]}
//                   >
//                     All
//                   </Text>
//                 </TouchableOpacity>
//                 {categories.map((cat) => (
//                   <TouchableOpacity
//                     key={cat.category || cat}
//                     style={[
//                       styles.categoryChip,
//                       selectedCategory === (cat.category || cat) && styles.categoryChipActive,
//                     ]}
//                     onPress={() => setSelectedCategory(cat.category || cat)}
//                   >
//                     <Text
//                       style={[
//                         styles.categoryChipText,
//                         selectedCategory === (cat.category || cat) && styles.categoryChipTextActive,
//                       ]}
//                     >
//                       {cat.category || cat}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             {/* Price Range */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Price Range</Text>
//               <View style={styles.priceRangeContainer}>
//                 <View style={styles.priceInputWrapper}>
//                   <Text style={styles.pricePrefix}>Min</Text>
//                   <TextInput
//                     style={styles.priceInput}
//                     placeholder="0"
//                     value={minPrice}
//                     onChangeText={setMinPrice}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//                 <Text style={styles.priceSeparator}>—</Text>
//                 <View style={styles.priceInputWrapper}>
//                   <Text style={styles.pricePrefix}>Max</Text>
//                   <TextInput
//                     style={styles.priceInput}
//                     placeholder="∞"
//                     value={maxPrice}
//                     onChangeText={setMaxPrice}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Sort By */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Sort By</Text>
//               <View style={styles.sortContainer}>
//                 {SORT_OPTIONS.map((option) => (
//                   <TouchableOpacity
//                     key={option.value}
//                     style={[
//                       styles.sortOption,
//                       sortBy === option.value && styles.sortOptionActive,
//                     ]}
//                     onPress={() => setSortBy(option.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.sortOptionText,
//                         sortBy === option.value && styles.sortOptionTextActive,
//                       ]}
//                     >
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </ScrollView>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={clearAllFilters}
//             >
//               <RefreshCw size={18} color={Colors.gray500} />
//               <Text style={styles.clearButtonText}>Clear All</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.applyButton}
//               onPress={applyFilterChanges}
//             >
//               <Text style={styles.applyButtonText}>Apply Filters</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading && products.length === 0) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Products" />
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search products..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//           />
//           {searchTerm.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchTerm("")}>
//               <X size={18} color={Colors.gray400} />
//             </TouchableOpacity>
//           )}
//         </View>
//         <TouchableOpacity
//           style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
//           onPress={() => setShowFilterModal(true)}
//         >
//           <Filter
//             size={20}
//             color={hasActiveFilters ? Colors.white : Colors.gray400}
//           />
//           {hasActiveFilters && <View style={styles.filterBadge} />}
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => router.push("/products/new")}
//         >
//           <Plus size={20} color={Colors.white} />
//         </TouchableOpacity>
//       </View>

//       {/* Active Filters Summary */}
//       {hasActiveFilters && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.filterChipsScroll}
//           contentContainerStyle={styles.filterChipsContent}
//         >
//           {selectedCategory && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Category: {selectedCategory}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedCategory("")}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {sortBy !== "name_asc" && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSortBy("name_asc")}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {(minPrice || maxPrice) && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Price: {minPrice || "0"} - {maxPrice || "∞"}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setMinPrice("");
//                   setMaxPrice("");
//                 }}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
//             <Text style={styles.clearAllChipText}>Clear All</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={[
//           styles.listContent,
//           products.length === 0 && styles.emptyListContent,
//         ]}
//         data={products}
//         keyExtractor={(item) => item._id}
//         renderItem={renderProduct}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           products.length > 0 ? (
//             <View style={styles.listHeader}>
//               <Text style={styles.listHeaderText}>
//                 Showing {products.length} of {pagination.total} products
//               </Text>
//             </View>
//           ) : null
//         }
//         ListFooterComponent={
//           loadingMore ? (
//             <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
//           ) : null
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Package size={48} color={Colors.gray300} />
//             <Text style={styles.emptyTitle}>No Products Found</Text>
//             <Text style={styles.emptyDescription}>
//               {searchTerm || hasActiveFilters
//                 ? "Try adjusting your search or filters"
//                 : "Start by adding your first product"}
//             </Text>
//             {(searchTerm || hasActiveFilters) ? (
//               <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
//                 <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 style={styles.emptyButton}
//                 onPress={() => router.push("/products/new")}
//               >
//                 <Text style={styles.emptyButtonText}>Add Product</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       />

//       {renderFilterModal()}
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
//     gap: Spacing.sm,
//     ...Shadows.sm,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
//   },
//   filterButton: {
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     justifyContent: "center",
//     alignItems: "center",
//     width: 44,
//     height: 44,
//     position: "relative",
//   },
//   filterButtonActive: {
//     backgroundColor: Colors.primary,
//   },
//   filterBadge: {
//     position: "absolute",
//     top: 4,
//     right: 4,
//     width: 10,
//     height: 10,
//     borderRadius: 10,
//     backgroundColor: Colors.error,
//     borderWidth: 2,
//     borderColor: Colors.white,
//   },
//   addButton: {
//     backgroundColor: Colors.primary,
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     width: 44,
//     height: 44,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   filterChipsScroll: {
//     backgroundColor: Colors.white,
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     maxHeight: 50,
//   },
//   filterChipsContent: {
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   filterChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "10",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.xs,
//   },
//   filterChipText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//   },
//   filterChipRemove: {
//     padding: 2,
//   },
//   clearAllChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//   },
//   clearAllChipText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//   },
//   list: { flex: 1 },
//   listContent: { padding: Spacing.md, gap: Spacing.md },
//   emptyListContent: { flex: 1 },
//   listHeader: {
//     paddingBottom: Spacing.sm,
//   },
//   listHeaderText: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   productItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   productRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   productInfo: { flex: 1, flexDirection: "row", alignItems: "center" },
//   productIcon: {
//     width: 40,
//     height: 40,
//     backgroundColor: Colors.primary + "10",
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   productDetails: { marginLeft: Spacing.md, flex: 1 },
//   productName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   productSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   productCategory: { fontSize: Typography.xs, color: Colors.gray400 },
//   productRight: { alignItems: "flex-end" },
//   productPrice: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   stockBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     marginTop: 2,
//   },
//   stockBadgeText: { fontSize: Typography.xs, fontWeight: "500" },
//   stockIn: { backgroundColor: Colors.success + "20" },
//   stockInText: { color: Colors.success },
//   stockLow: { backgroundColor: Colors.warning + "20" },
//   stockLowText: { color: Colors.warning },
//   stockOut: { backgroundColor: Colors.error + "20" },
//   stockOutText: { color: Colors.error },
//   productQuantity: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: Spacing["4xl"],
//     gap: Spacing.md,
//   },
//   emptyTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   emptyDescription: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     textAlign: "center",
//     maxWidth: "80%",
//   },
//   clearFiltersButton: {
//     marginTop: Spacing.md,
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.sm,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//   },
//   clearFiltersButtonText: {
//     color: Colors.white,
//     fontWeight: "500",
//   },
//   emptyButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   emptyButtonText: { color: Colors.white, fontWeight: "600" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     maxHeight: "90%",
//     minHeight: "60%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalCloseButton: {
//     padding: Spacing.xs,
//   },
//   modalScroll: {
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.md,
//   },
//   filterSection: {
//     marginVertical: Spacing.md,
//   },
//   filterSectionTitle: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   categoryScroll: {
//     flexDirection: "row",
//   },
//   categoryChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     marginRight: Spacing.xs,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   categoryChipActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   categoryChipText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   categoryChipTextActive: {
//     color: Colors.white,
//   },
//   priceRangeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   priceInputWrapper: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.xs,
//   },
//   pricePrefix: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "500",
//   },
//   priceInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
//   },
//   priceSeparator: {
//     color: Colors.gray400,
//     fontSize: Typography.sm,
//   },
//   sortContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: Spacing.xs,
//   },
//   sortOption: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   sortOptionActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   sortOptionText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   sortOptionTextActive: {
//     color: Colors.white,
//   },
//   modalFooter: {
//     flexDirection: "row",
//     padding: Spacing.lg,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//     gap: Spacing.md,
//   },
//   clearButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     gap: Spacing.sm,
//   },
//   clearButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray600,
//   },
//   applyButton: {
//     flex: 2,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   applyButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.white,
//   },
//   footerLoader: {
//     paddingVertical: Spacing.lg,
//   },
// });
























// // app/(stacks)/products/index.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   StyleSheet,
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Search, Plus, Package, Edit, Filter, X, RefreshCw, Tag, Store, Check, ChevronDown } from "lucide-react-native";
// import ProductService from "../../../../services/productService";
// import { formatCurrency } from "../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../../constants/theme";
// import CustomHeader from "../../../../components/ui/CustomHeader";

// const SORT_OPTIONS = [
//   { value: "name_asc", label: "Name A-Z" },
//   { value: "name_desc", label: "Name Z-A" },
//   { value: "unitPrice_asc", label: "Price: Low to High" },
//   { value: "unitPrice_desc", label: "Price: High to Low" },
//   { value: "createdAt_desc", label: "Newest First" },
//   { value: "createdAt_asc", label: "Oldest First" },
// ];

// export default function Products() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   });

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [sortBy, setSortBy] = useState("name_asc");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");

//   // Store filter state
//   const [selectedStoreFilter, setSelectedStoreFilter] = useState("");
//   const [userStores, setUserStores] = useState([]);
//   const [showStoreFilterModal, setShowStoreFilterModal] = useState(false);

//   // UI state
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [hasActiveFilters, setHasActiveFilters] = useState(false);

//   // Debounce refs
//   const searchTimeoutRef = useRef(null);

//   // Fetch user stores
//   const fetchUserStores = async () => {
//     try {
//       const stores = await ProductService.getUserStores();
//       setUserStores(stores);
//       // Auto-select first store if only one available
//       if (stores.length === 1) {
//         setSelectedStoreFilter(stores[0]._id);
//       }
//     } catch (error) {
//       console.error("Failed to load stores:", error);
//     }
//   };

//   // Apply filters
//   const applyFilters = useCallback(async (page = 1, append = false) => {
//     try {
//       if (append) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       const params = {
//         page,
//         limit: 20,
//         search: searchTerm || undefined,
//         sort: sortBy,
//         category: selectedCategory || undefined,
//         storeId: selectedStoreFilter || undefined, // ← Add store filter
//       };

//       if (minPrice) {
//         params.minPrice = parseFloat(minPrice);
//       }

//       if (maxPrice) {
//         params.maxPrice = parseFloat(maxPrice);
//       }

//       // Clean undefined params
//       Object.keys(params).forEach((key) => {
//         if (params[key] === undefined || params[key] === "") {
//           delete params[key];
//         }
//       });

//       const result = await ProductService.getProducts(params);
      
//       if (append) {
//         setProducts(prev => [...prev, ...(result.products || [])]);
//       } else {
//         setProducts(result.products || []);
//       }
//       setPagination(result.pagination || {});
//     } catch (error) {
//       Alert.alert("Error", "Failed to load products");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   }, [searchTerm, selectedCategory, sortBy, minPrice, maxPrice, selectedStoreFilter]);

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const result = await ProductService.getCategories();
//       setCategories(result || []);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchUserStores();
//     fetchCategories();
//   }, []);

//   // Apply filters when stores are loaded or filters change
//   useEffect(() => {
//     if (userStores.length > 0) {
//       applyFilters(1);
//     }
//   }, [selectedStoreFilter]);

//   // Debounced search
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
//     searchTimeoutRef.current = setTimeout(() => {
//       if (searchTerm !== undefined) {
//         applyFilters(1);
//       }
//     }, 500);
//     return () => clearTimeout(searchTimeoutRef.current);
//   }, [searchTerm]);

//   // Check for active filters
//   useEffect(() => {
//     const hasFilters =
//       selectedCategory !== "" ||
//       sortBy !== "name_asc" ||
//       minPrice !== "" ||
//       maxPrice !== "" ||
//       (userStores.length > 1 && selectedStoreFilter !== "");
//     setHasActiveFilters(hasFilters);
//   }, [selectedCategory, sortBy, minPrice, maxPrice, selectedStoreFilter, userStores.length]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     applyFilters(1);
//   };

//   const loadMore = () => {
//     if (pagination.page < pagination.pages && !loading && !loadingMore) {
//       applyFilters(pagination.page + 1, true);
//     }
//   };

//   const clearAllFilters = () => {
//     setSelectedCategory("");
//     setSortBy("name_asc");
//     setMinPrice("");
//     setMaxPrice("");
//     setSearchTerm("");
//     // Reset store filter if user has multiple stores
//     if (userStores.length > 1) {
//       setSelectedStoreFilter("");
//     }
//     setShowFilterModal(false);
//     setShowStoreFilterModal(false);
//     applyFilters(1);
//   };

//   const applyFilterChanges = () => {
//     setShowFilterModal(false);
//     applyFilters(1);
//   };

//   const getStoreName = (storeId) => {
//     const store = userStores.find(s => s._id === storeId);
//     return store ? store.name : "";
//   };

//   const getStockStatus = (item) => {
//     const quantity = item.inventory?.quantity || 0;
//     const minStock = item.minStockLevel || 5;

//     if (quantity === 0) {
//       return {
//         label: "Out of Stock",
//         container: styles.stockOut,
//         text: styles.stockOutText,
//       };
//     } else if (quantity <= minStock) {
//       return {
//         label: "Low Stock",
//         container: styles.stockLow,
//         text: styles.stockLowText,
//       };
//     } else {
//       return {
//         label: "In Stock",
//         container: styles.stockIn,
//         text: styles.stockInText,
//       };
//     }
//   };

//   const renderProduct = ({ item }) => {
//     const stock = getStockStatus(item);
//     const storeName = item.storeId?.name || getStoreName(item.storeId?._id) || "";

//     return (
//       <TouchableOpacity
//         style={styles.productItem}
//         onPress={() => router.push(`/products/${item._id}`)}
//       >
//         <View style={styles.productRow}>
//           <View style={styles.productInfo}>
//             <View style={styles.productIcon}>
//               <Package size={20} color={Colors.primary} />
//             </View>
//             <View style={styles.productDetails}>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.productSku}>SKU: {item.sku}</Text>
//               <Text style={styles.productCategory}>{item.category}</Text>
//               {storeName && (
//                 <Text style={styles.productStore}>
//                   <Store size={12} color={Colors.gray400} /> {storeName}
//                 </Text>
//               )}
//             </View>
//           </View>
//           <View style={styles.productRight}>
//             <Text style={styles.productPrice}>
//               {formatCurrency(item.unitPrice)}
//             </Text>
//             <View style={[styles.stockBadge, stock.container]}>
//               <Text style={[styles.stockBadgeText, stock.text]}>
//                 {stock.label}
//               </Text>
//             </View>
//             <Text style={styles.productQuantity}>
//               Qty: {item.inventory?.quantity || 0}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Store filter modal
//   const renderStoreFilterModal = () => (
//     <Modal
//       visible={showStoreFilterModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowStoreFilterModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filter by Store</Text>
//             <TouchableOpacity onPress={() => setShowStoreFilterModal(false)}>
//               <X size={24} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.modalScroll}>
//             <TouchableOpacity
//               style={[
//                 styles.storeFilterItem,
//                 !selectedStoreFilter && styles.storeFilterItemSelected,
//               ]}
//               onPress={() => {
//                 setSelectedStoreFilter("");
//                 setShowStoreFilterModal(false);
//                 applyFilters(1);
//               }}
//             >
//               <View style={styles.storeFilterItemLeft}>
//                 <Store size={20} color={Colors.gray500} />
//                 <Text style={styles.storeFilterItemName}>All Stores</Text>
//               </View>
//               {!selectedStoreFilter && (
//                 <Check size={20} color={Colors.primary} />
//               )}
//             </TouchableOpacity>

//             {userStores.map((store) => (
//               <TouchableOpacity
//                 key={store._id}
//                 style={[
//                   styles.storeFilterItem,
//                   selectedStoreFilter === store._id && styles.storeFilterItemSelected,
//                 ]}
//                 onPress={() => {
//                   setSelectedStoreFilter(store._id);
//                   setShowStoreFilterModal(false);
//                   applyFilters(1);
//                 }}
//               >
//                 <View style={styles.storeFilterItemLeft}>
//                   <Store size={20} color={Colors.primary} />
//                   <View>
//                     <Text style={styles.storeFilterItemName}>{store.name}</Text>
//                     <Text style={styles.storeFilterItemCode}>Code: {store.code}</Text>
//                   </View>
//                 </View>
//                 {selectedStoreFilter === store._id && (
//                   <Check size={20} color={Colors.primary} />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   // Filter modal (includes categories, price, sort)
//   const renderFilterModal = () => (
//     <Modal
//       visible={showFilterModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowFilterModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <TouchableOpacity
//               onPress={() => setShowFilterModal(false)}
//               style={styles.modalCloseButton}
//             >
//               <X size={24} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             style={styles.modalScroll}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Categories */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Category</Text>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 style={styles.categoryScroll}
//               >
//                 <TouchableOpacity
//                   style={[
//                     styles.categoryChip,
//                     !selectedCategory && styles.categoryChipActive,
//                   ]}
//                   onPress={() => setSelectedCategory("")}
//                 >
//                   <Text
//                     style={[
//                       styles.categoryChipText,
//                       !selectedCategory && styles.categoryChipTextActive,
//                     ]}
//                   >
//                     All
//                   </Text>
//                 </TouchableOpacity>
//                 {categories.map((cat) => (
//                   <TouchableOpacity
//                     key={cat.category || cat}
//                     style={[
//                       styles.categoryChip,
//                       selectedCategory === (cat.category || cat) && styles.categoryChipActive,
//                     ]}
//                     onPress={() => setSelectedCategory(cat.category || cat)}
//                   >
//                     <Text
//                       style={[
//                         styles.categoryChipText,
//                         selectedCategory === (cat.category || cat) && styles.categoryChipTextActive,
//                       ]}
//                     >
//                       {cat.category || cat}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             {/* Price Range */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Price Range</Text>
//               <View style={styles.priceRangeContainer}>
//                 <View style={styles.priceInputWrapper}>
//                   <Text style={styles.pricePrefix}>Min</Text>
//                   <TextInput
//                     style={styles.priceInput}
//                     placeholder="0"
//                     value={minPrice}
//                     onChangeText={setMinPrice}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//                 <Text style={styles.priceSeparator}>—</Text>
//                 <View style={styles.priceInputWrapper}>
//                   <Text style={styles.pricePrefix}>Max</Text>
//                   <TextInput
//                     style={styles.priceInput}
//                     placeholder="∞"
//                     value={maxPrice}
//                     onChangeText={setMaxPrice}
//                     keyboardType="numeric"
//                     placeholderTextColor={Colors.gray400}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Sort By */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Sort By</Text>
//               <View style={styles.sortContainer}>
//                 {SORT_OPTIONS.map((option) => (
//                   <TouchableOpacity
//                     key={option.value}
//                     style={[
//                       styles.sortOption,
//                       sortBy === option.value && styles.sortOptionActive,
//                     ]}
//                     onPress={() => setSortBy(option.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.sortOptionText,
//                         sortBy === option.value && styles.sortOptionTextActive,
//                       ]}
//                     >
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </ScrollView>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={clearAllFilters}
//             >
//               <RefreshCw size={18} color={Colors.gray500} />
//               <Text style={styles.clearButtonText}>Clear All</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.applyButton}
//               onPress={applyFilterChanges}
//             >
//               <Text style={styles.applyButtonText}>Apply Filters</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading && products.length === 0) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Products" />
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search products..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor={Colors.gray400}
//           />
//           {searchTerm.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchTerm("")}>
//               <X size={18} color={Colors.gray400} />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Store Filter Button - Show if user has multiple stores */}
//         {userStores.length > 1 && (
//           <TouchableOpacity
//             style={[
//               styles.storeFilterButton,
//               selectedStoreFilter && styles.storeFilterButtonActive,
//             ]}
//             onPress={() => setShowStoreFilterModal(true)}
//           >
//             <Store
//               size={18}
//               color={selectedStoreFilter ? Colors.white : Colors.gray400}
//             />
//             {selectedStoreFilter && <View style={styles.filterBadge} />}
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity
//           style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
//           onPress={() => setShowFilterModal(true)}
//         >
//           <Filter
//             size={20}
//             color={hasActiveFilters ? Colors.white : Colors.gray400}
//           />
//           {hasActiveFilters && <View style={styles.filterBadge} />}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => router.push("/products/new")}
//         >
//           <Plus size={20} color={Colors.white} />
//         </TouchableOpacity>
//       </View>

//       {/* Store Filter Chip */}
//       {selectedStoreFilter && userStores.length > 1 && (
//         <View style={styles.storeFilterChipContainer}>
//           <Store size={14} color={Colors.primary} />
//           <Text style={styles.storeFilterChipText}>
//             Store: {getStoreName(selectedStoreFilter)}
//           </Text>
//           <TouchableOpacity
//             onPress={() => {
//               setSelectedStoreFilter("");
//               applyFilters(1);
//             }}
//             style={styles.filterChipRemove}
//           >
//             <X size={14} color={Colors.gray500} />
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Active Filters Summary */}
//       {hasActiveFilters && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.filterChipsScroll}
//           contentContainerStyle={styles.filterChipsContent}
//         >
//           {selectedCategory && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Category: {selectedCategory}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSelectedCategory("")}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {sortBy !== "name_asc" && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setSortBy("name_asc")}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           {(minPrice || maxPrice) && (
//             <View style={styles.filterChip}>
//               <Text style={styles.filterChipText}>
//                 Price: {minPrice || "0"} - {maxPrice || "∞"}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setMinPrice("");
//                   setMaxPrice("");
//                 }}
//                 style={styles.filterChipRemove}
//               >
//                 <X size={14} color={Colors.gray500} />
//               </TouchableOpacity>
//             </View>
//           )}
//           <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
//             <Text style={styles.clearAllChipText}>Clear All</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       <FlatList
//         style={styles.list}
//         contentContainerStyle={[
//           styles.listContent,
//           products.length === 0 && styles.emptyListContent,
//         ]}
//         data={products}
//         keyExtractor={(item) => item._id}
//         renderItem={renderProduct}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           products.length > 0 ? (
//             <View style={styles.listHeader}>
//               <Text style={styles.listHeaderText}>
//                 Showing {products.length} of {pagination.total} products
//                 {selectedStoreFilter && ` in ${getStoreName(selectedStoreFilter)}`}
//               </Text>
//             </View>
//           ) : null
//         }
//         ListFooterComponent={
//           loadingMore ? (
//             <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
//           ) : null
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Package size={48} color={Colors.gray300} />
//             <Text style={styles.emptyTitle}>No Products Found</Text>
//             <Text style={styles.emptyDescription}>
//               {searchTerm || hasActiveFilters
//                 ? "Try adjusting your search or filters"
//                 : "Start by adding your first product"}
//             </Text>
//             {(searchTerm || hasActiveFilters) ? (
//               <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
//                 <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 style={styles.emptyButton}
//                 onPress={() => router.push("/products/new")}
//               >
//                 <Text style={styles.emptyButtonText}>Add Product</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       />

//       {renderFilterModal()}
//       {renderStoreFilterModal()}
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
//     gap: Spacing.sm,
//     ...Shadows.sm,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
//   },
//   storeFilterButton: {
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     justifyContent: "center",
//     alignItems: "center",
//     width: 44,
//     height: 44,
//     position: "relative",
//   },
//   storeFilterButtonActive: {
//     backgroundColor: Colors.primary,
//   },
//   filterButton: {
//     padding: Spacing.sm,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     justifyContent: "center",
//     alignItems: "center",
//     width: 44,
//     height: 44,
//     position: "relative",
//   },
//   filterButtonActive: {
//     backgroundColor: Colors.primary,
//   },
//   filterBadge: {
//     position: "absolute",
//     top: 4,
//     right: 4,
//     width: 10,
//     height: 10,
//     borderRadius: 10,
//     backgroundColor: Colors.error,
//     borderWidth: 2,
//     borderColor: Colors.white,
//   },
//   addButton: {
//     backgroundColor: Colors.primary,
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     width: 44,
//     height: 44,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   storeFilterChipContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "10",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     gap: Spacing.sm,
//   },
//   storeFilterChipText: {
//     fontSize: Typography.sm,
//     color: Colors.primary,
//     flex: 1,
//   },
//   filterChipsScroll: {
//     backgroundColor: Colors.white,
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//     maxHeight: 50,
//   },
//   filterChipsContent: {
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.sm,
//   },
//   filterChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.primary + "10",
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.lg,
//     gap: Spacing.xs,
//   },
//   filterChipText: {
//     fontSize: Typography.xs,
//     color: Colors.primary,
//   },
//   filterChipRemove: {
//     padding: 2,
//   },
//   clearAllChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//   },
//   clearAllChipText: {
//     fontSize: Typography.xs,
//     color: Colors.error,
//   },
//   list: { flex: 1 },
//   listContent: { padding: Spacing.md, gap: Spacing.md },
//   emptyListContent: { flex: 1 },
//   listHeader: {
//     paddingBottom: Spacing.sm,
//   },
//   listHeaderText: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   productItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   productRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   productInfo: { flex: 1, flexDirection: "row", alignItems: "center" },
//   productIcon: {
//     width: 40,
//     height: 40,
//     backgroundColor: Colors.primary + "10",
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   productDetails: { marginLeft: Spacing.md, flex: 1 },
//   productName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   productSku: { fontSize: Typography.sm, color: Colors.gray500 },
//   productCategory: { fontSize: Typography.xs, color: Colors.gray400 },
//   productStore: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: 2,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   productRight: { alignItems: "flex-end" },
//   productPrice: {
//     fontSize: Typography.md,
//     fontWeight: "bold",
//     color: Colors.primary,
//   },
//   stockBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 2,
//     borderRadius: BorderRadius.sm,
//     marginTop: 2,
//   },
//   stockBadgeText: { fontSize: Typography.xs, fontWeight: "500" },
//   stockIn: { backgroundColor: Colors.success + "20" },
//   stockInText: { color: Colors.success },
//   stockLow: { backgroundColor: Colors.warning + "20" },
//   stockLowText: { color: Colors.warning },
//   stockOut: { backgroundColor: Colors.error + "20" },
//   stockOutText: { color: Colors.error },
//   productQuantity: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: 2,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: Spacing["4xl"],
//     gap: Spacing.md,
//   },
//   emptyTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray700,
//   },
//   emptyDescription: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     textAlign: "center",
//     maxWidth: "80%",
//   },
//   clearFiltersButton: {
//     marginTop: Spacing.md,
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.sm,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//   },
//   clearFiltersButtonText: {
//     color: Colors.white,
//     fontWeight: "500",
//   },
//   emptyButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   emptyButtonText: { color: Colors.white, fontWeight: "600" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     maxHeight: "90%",
//     minHeight: "40%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   modalTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "600",
//     color: Colors.gray900,
//   },
//   modalCloseButton: {
//     padding: Spacing.xs,
//   },
//   modalScroll: {
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.md,
//   },
//   filterSection: {
//     marginVertical: Spacing.md,
//   },
//   filterSectionTitle: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   categoryScroll: {
//     flexDirection: "row",
//   },
//   categoryChip: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     marginRight: Spacing.xs,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   categoryChipActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   categoryChipText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   categoryChipTextActive: {
//     color: Colors.white,
//   },
//   priceRangeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   priceInputWrapper: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     gap: Spacing.xs,
//   },
//   pricePrefix: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     fontWeight: "500",
//   },
//   priceInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     color: Colors.gray900,
//   },
//   priceSeparator: {
//     color: Colors.gray400,
//     fontSize: Typography.sm,
//   },
//   sortContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: Spacing.xs,
//   },
//   sortOption: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   sortOptionActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   sortOptionText: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   sortOptionTextActive: {
//     color: Colors.white,
//   },
//   modalFooter: {
//     flexDirection: "row",
//     padding: Spacing.lg,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//     gap: Spacing.md,
//   },
//   clearButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.gray100,
//     gap: Spacing.sm,
//   },
//   clearButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray600,
//   },
//   applyButton: {
//     flex: 2,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     backgroundColor: Colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   applyButtonText: {
//     fontSize: Typography.md,
//     fontWeight: "600",
//     color: Colors.white,
//   },
//   footerLoader: {
//     paddingVertical: Spacing.lg,
//   },
//   // Store Filter Modal Styles
//   storeFilterItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   storeFilterItemSelected: {
//     backgroundColor: Colors.primary + "10",
//   },
//   storeFilterItemLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.md,
//   },
//   storeFilterItemName: {
//     fontSize: Typography.md,
//     fontWeight: "500",
//     color: Colors.gray900,
//   },
//   storeFilterItemCode: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
// });




























// app/(stacks)/products/index.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Search, 
  Plus, 
  Package, 
  Edit, 
  Filter, 
  X, 
  RefreshCw, 
  Tag, 
  Store, 
  Check, 
  ChevronDown 
} from "lucide-react-native";
import ProductService from "../../../../services/productService";
import AuthService from "../../../../services/authService";
import StoreService from "../../../../services/storeService";
import { formatCurrency } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
  { value: "unitPrice_asc", label: "Price: Low to High" },
  { value: "unitPrice_desc", label: "Price: High to Low" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
];

export default function Products() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // User and store state
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // UI state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Debounce refs
  const searchTimeoutRef = useRef(null);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Load user and stores
  const loadUserAndStores = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
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
      }
    } catch (error) {
      console.error("Failed to load user/stores:", error);
    }
  };

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.value === storeId);
    return store ? store.label : "";
  };

  // Apply filters
  const applyFilters = useCallback(async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = {
        page,
        limit: 20,
        search: searchTerm || undefined,
        sort: sortBy,
        category: selectedCategory || undefined,
      };

      if (minPrice) {
        params.minPrice = parseFloat(minPrice);
      }

      if (maxPrice) {
        params.maxPrice = parseFloat(maxPrice);
      }

      // Add store filter for Super Admin
      if (isSuperAdmin && selectedStoreId) {
        params.storeId = selectedStoreId;
      }

      // Clean undefined params
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const result = await ProductService.getProducts(params);
      
      if (append) {
        setProducts(prev => [...prev, ...(result.products || [])]);
      } else {
        setProducts(result.products || []);
      }
      setPagination(result.pagination || {});
    } catch (error) {
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [searchTerm, selectedCategory, sortBy, minPrice, maxPrice, selectedStoreId, isSuperAdmin]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await ProductService.getCategories();
      setCategories(result || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Initial load
  useEffect(() => {
    loadUserAndStores();
    fetchCategories();
  }, []);

  // Apply filters when stores are loaded or filters change
  useEffect(() => {
    if (user) {
      applyFilters(1);
    }
  }, [selectedStoreId]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm !== undefined) {
        applyFilters(1);
      }
    }, 500);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm]);

  

  useEffect(() => {
  const hasFilters =
    selectedCategory !== "" ||
    sortBy !== "name_asc" ||
    minPrice !== "" ||
    maxPrice !== "";

  setHasActiveFilters(hasFilters);
}, [selectedCategory, sortBy, minPrice, maxPrice]);

  const onRefresh = () => {
    setRefreshing(true);
    applyFilters(1);
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages && !loading && !loadingMore) {
      applyFilters(pagination.page + 1, true);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSortBy("name_asc");
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setShowFilterModal(false);
    applyFilters(1);
  };

  const applyFilterChanges = () => {
    setShowFilterModal(false);
    applyFilters(1);
  };

  const selectStore = (storeId) => {
    setSelectedStoreId(storeId);
    setShowStoreModal(false);
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

  const renderStoreModal = () => (
    <Modal
      visible={showStoreModal}
      animationType="slide"
      transparent={true}
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
                onPress={() => selectStore(item.value)}
              >
                <View style={styles.storeItemLeft}>
                  <Store size={20} color={selectedStoreId === item.value ? Colors.white : Colors.gray500} />
                  <View style={styles.storeItemInfo}>
                    <Text style={[styles.storeItemName, selectedStoreId === item.value && styles.storeItemTextSelected]}>
                      {item.label}
                    </Text>
                  </View>
                </View>
                {selectedStoreId === item.value && (
                  <Check size={20} color={Colors.white} />
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

  const renderProduct = ({ item }) => {
    const stock = getStockStatus(item);
    const storeName = item.storeId?.name || getStoreName(item.storeId?._id) || "";

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => router.push(`/products/${item._id}`)}
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
              {storeName && (
                <Text style={styles.productStore}>
                  <Store size={12} color={Colors.gray400} /> {storeName}
                </Text>
              )}
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

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={styles.modalCloseButton}
            >
              <X size={24} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    !selectedCategory && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory("")}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      !selectedCategory && styles.categoryChipTextActive,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.category || cat}
                    style={[
                      styles.categoryChip,
                      selectedCategory === (cat.category || cat) && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.category || cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === (cat.category || cat) && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.category || cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.pricePrefix}>Min</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.gray400}
                  />
                </View>
                <Text style={styles.priceSeparator}>—</Text>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.pricePrefix}>Max</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="∞"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.gray400}
                  />
                </View>
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortContainer}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      sortBy === option.value && styles.sortOptionActive,
                    ]}
                    onPress={() => setSortBy(option.value)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy === option.value && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllFilters}
            >
              <RefreshCw size={18} color={Colors.gray500} />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilterChanges}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Products" 
      />

      {/* Store Selector Bar - Super Admin Only */}
      {isSuperAdmin && selectedStoreId && (
        <View style={styles.storeSelectorBar}>
          <Store size={16} color={Colors.primary} />
          <Text style={styles.storeSelectorText}>
            Store: {getStoreName(selectedStoreId)}
          </Text>
          <TouchableOpacity
            style={styles.storeSelectorChange}
            onPress={() => setShowStoreModal(true)}
          >
            <Text style={styles.storeSelectorChangeText}>Change Store ➔</Text>
          </TouchableOpacity>
          {
            isSuperAdmin && stores.length > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowStoreModal(true)}
            >
              <Store size={20} color={Colors.primary} />
            </TouchableOpacity>
          )
          }
        </View>
      )}

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
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <X size={18} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter
            size={20}
            color={hasActiveFilters ? Colors.white : Colors.gray400}
          />
          {hasActiveFilters && <View style={styles.filterBadge} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/products/new")}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsScroll}
          contentContainerStyle={styles.filterChipsContent}
        >
          {selectedCategory && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Category: {selectedCategory}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedCategory("")}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {sortBy !== "name_asc" && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              </Text>
              <TouchableOpacity
                onPress={() => setSortBy("name_asc")}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          {(minPrice || maxPrice) && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Price: {minPrice || "0"} - {maxPrice || "∞"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                style={styles.filterChipRemove}
              >
                <X size={14} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.clearAllChip} onPress={clearAllFilters}>
            <Text style={styles.clearAllChipText}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          products.length === 0 && styles.emptyListContent,
        ]}
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          products.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Showing {products.length} of {pagination.total} products
                {isSuperAdmin && selectedStoreId && ` in ${getStoreName(selectedStoreId)}`}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={Colors.primary} />
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Package size={48} color={Colors.gray300} />
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptyDescription}>
              {searchTerm || hasActiveFilters
                ? "Try adjusting your search or filters"
                : isSuperAdmin && !selectedStoreId
                ? "Please select a store to view products"
                : "Start by adding your first product"}
            </Text>
            {(searchTerm || hasActiveFilters) ? (
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            ) : isSuperAdmin && !selectedStoreId ? (
              <TouchableOpacity style={styles.emptyButton} onPress={() => setShowStoreModal(true)}>
                <Text style={styles.emptyButtonText}>Select Store</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push("/products/new")}
              >
                <Text style={styles.emptyButtonText}>Add Product</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {renderFilterModal()}
      {renderStoreModal()}
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
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  headerButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
  },
  storeSelectorBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    color: Colors.gray900,
  },
  filterButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipsScroll: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    maxHeight: 50,
  },
  filterChipsContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  filterChipText: {
    fontSize: Typography.xs,
    color: Colors.primary,
  },
  filterChipRemove: {
    padding: 2,
  },
  clearAllChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  clearAllChipText: {
    fontSize: Typography.xs,
    color: Colors.error,
  },
  list: { flex: 1 },
  listContent: { padding: Spacing.md, gap: Spacing.md },
  emptyListContent: { flex: 1 },
  listHeader: {
    paddingBottom: Spacing.sm,
  },
  listHeaderText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  productItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
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
  productStore: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray700,
  },
  emptyDescription: {
    fontSize: Typography.md,
    color: Colors.gray500,
    textAlign: "center",
    maxWidth: "80%",
  },
  clearFiltersButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  clearFiltersButtonText: {
    color: Colors.white,
    fontWeight: "500",
  },
  emptyButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: { color: Colors.white, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "90%",
    minHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  modalScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  filterSection: {
    marginVertical: Spacing.md,
  },
  filterSectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  pricePrefix: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: "500",
  },
  priceInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    color: Colors.gray900,
  },
  priceSeparator: {
    color: Colors.gray400,
    fontSize: Typography.sm,
  },
  sortContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  sortOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: "transparent",
  },
  sortOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortOptionText: {
    fontSize: Typography.sm,
    color: Colors.gray600,
  },
  sortOptionTextActive: {
    color: Colors.white,
  },
  modalFooter: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: Spacing.md,
  },
  clearButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    gap: Spacing.sm,
  },
  clearButtonText: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray600,
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.white,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  storeItemSelected: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  storeItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  storeItemInfo: {
    flex: 1,
  },
  storeItemName: {
    fontSize: Typography.md,
    fontWeight: "500",
    color: Colors.gray900,
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