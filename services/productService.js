import api from './api';
import ENDPOINTS from '../constants/apiEndpoints';

class ProductService {
  /**
   * Get products with filters
   */
  async getProducts(params = {}) {
    const response = await api.get(ENDPOINTS.PRODUCTS.LIST, { params });
    return response.data.data;
  }

  /**
   * Get product by ID
   */
  async getProduct(id) {
    const response = await api.get(ENDPOINTS.PRODUCTS.GET(id));
    return response.data.data;
  }

  /**
   * Create product
   */
  async createProduct(productData) {
    const response = await api.post(ENDPOINTS.PRODUCTS.CREATE, productData);
    return response.data.data;
  }

  /**
   * Bulk create products
   */
  async bulkCreateProducts(products) {
    const response = await api.post(ENDPOINTS.PRODUCTS.BULK_CREATE, { products });
    return response.data.data;
  }

  /**
   * Update product
   */
  async updateProduct(id, productData) {
    const response = await api.put(ENDPOINTS.PRODUCTS.UPDATE(id), productData);
    return response.data.data;
  }

  /**
   * Delete (deactivate) product
   */
  async deleteProduct(id) {
    const response = await api.delete(ENDPOINTS.PRODUCTS.DELETE(id));
    return response.data;
  }

  /**
   * Get product categories
   */
  async getCategories() {
    const response = await api.get(ENDPOINTS.PRODUCTS.CATEGORIES);
    return response.data.data;
  }
}

export default new ProductService();