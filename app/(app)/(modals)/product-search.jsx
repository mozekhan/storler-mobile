// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Search, X } from 'lucide-react-native';
// import api from '../../services/api';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

// export default function ProductSearch() {
//   const router = useRouter();
//   const { onSelect } = useLocalSearchParams();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     if (searchTerm.length >= 2) {
//       searchProducts();
//     } else {
//       setProducts([]);
//     }
//   }, [searchTerm]);

//   const searchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/products', {
//         params: { search: searchTerm, limit: 20 }
//       });
//       setProducts(response.data.data.products || []);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to search products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectProduct = (product) => {
//     router.back();
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.productItem}
//       onPress={() => selectProduct(item)}
//     >
//       <View style={styles.productRow}>
//         <View style={styles.productInfo}>
//           <Text style={styles.productName}>
//             {item.name}
//           </Text>
//           <Text style={styles.productSku}>SKU: {item.sku}</Text>
//         </View>
//         <View style={styles.productPriceContainer}>
//           <Text style={styles.productPrice}>
//             ${item.unitPrice?.toFixed(2)}
//           </Text>
//           <Text style={styles.productStock}>
//             Stock: {item.inventory?.quantity || 0}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchBar}>
//         <View style={styles.searchInputContainer}>
//           <Search size={20} color={Colors.gray400} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search by name or SKU..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             autoFocus
//             placeholderTextColor={Colors.gray400}
//           />
//           {searchTerm.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchTerm('')}>
//               <X size={20} color={Colors.gray400} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={Colors.primary} />
//         </View>
//       ) : products.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>
//             {searchTerm.length >= 2 ? 'No products found' : 'Type to search'}
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           style={styles.list}
//           contentContainerStyle={styles.listContent}
//           data={products}
//           keyExtractor={(item) => item._id}
//           renderItem={renderItem}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   searchBar: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: Colors.gray500,
//   },
//   list: {
//     flex: 1,
//   },
//   listContent: {
//     padding: Spacing.md,
//   },
//   productItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.sm,
//     ...Shadows.sm,
//   },
//   productRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: Typography.md,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   productSku: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   productPriceContainer: {
//     alignItems: 'flex-end',
//   },
//   productPrice: {
//     fontSize: Typography.md,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   productStock: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
// });























import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, Package } from 'lucide-react-native';
import ProductService from '../../../services/productService';
import { formatCurrency } from '../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import CustomHeader from '../../../components/ui/CustomHeader';

export default function ProductSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const result = await ProductService.getProducts({
        search: searchTerm,
        limit: 20,
      });
      setProducts(result.products || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    // Navigate back with selected product
    router.back();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => selectProduct(item)}
    >
      <View style={styles.productRow}>
        <View style={styles.productIcon}>
          <Package size={20} color={Colors.primary} />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productSku}>SKU: {item.sku}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>
            {formatCurrency(item.unitPrice)}
          </Text>
          <Text style={styles.productStock}>
            Stock: {item.inventory?.quantity || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Serach Products" />
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
            placeholderTextColor={Colors.gray400}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <X size={20} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={48} color={Colors.gray300} />
          <Text style={styles.emptyText}>
            {searchTerm.length >= 2 ? 'No products found' : 'Type to search'}
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  searchBar: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.md,
  },
  productItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Typography.md,
    fontWeight: '500',
    color: Colors.gray900,
  },
  productSku: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  productCategory: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  productPriceContainer: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: Typography.md,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  productStock: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
});