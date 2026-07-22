// // services/reportService.js
// import api from "./api";

// class ReportService {
//   appendParam(params, key, value) {
//     if (
//       value !== undefined &&
//       value !== null &&
//       value !== "" &&
//       value !== "undefined" &&
//       value !== "null"
//     ) {
//       params.append(key, value);
//     }
//   }

//   /**
//    * Get sales report...
//    */
//   /**
//    * Get sales report with advanced filters
//    */
//   async getSalesReport(filters = {}) {
//     const params = new URLSearchParams();

//     // Required filters
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);

//     // Optional filters
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "groupBy", filters.groupBy);
//     this.appendParam(
//       params,
//       "paymentMethods",
//       Array.isArray(filters.paymentMethods)
//         ? filters.paymentMethods.join(",")
//         : filters.paymentMethods,
//     );
//     this.appendParam(params, "minAmount", filters.minAmount);
//     this.appendParam(params, "maxAmount", filters.maxAmount);
//     this.appendParam(
//       params,
//       "productIds",
//       Array.isArray(filters.productIds)
//         ? filters.productIds.join(",")
//         : filters.productIds,
//     );
//     this.appendParam(params, "category", filters.category);
//     this.appendParam(params, "salesAttendantId", filters.salesAttendantId);
//     this.appendParam(params, "sortBy", filters.sortBy);
//     this.appendParam(params, "sortOrder", filters.sortOrder);
//     this.appendParam(params, "limit", filters.limit);
//     this.appendParam(params, "offset", filters.offset);
//     this.appendParam(params, "format", filters.format);
//     this.appendParam(params, "includeBreakdown", filters.includeBreakdown);

//     const response = await api.get(`/reports/sales?${params.toString()}`);
//     return response.data.data;
//   }

//   /**
//    * Download sales report as PDF
//    */
//   async downloadSalesReportPDF(filters = {}) {
//     const params = new URLSearchParams();

//     Object.entries({
//       ...filters,
//       format: "pdf",
//     }).forEach(([key, value]) => {
//       this.appendParam(params, key, value);
//     });

//     const response = await api.get(`/reports/sales?${params.toString()}`, {
//       responseType: "blob",
//     });

//     // Create download link
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `sales_report_${new Date().toISOString().split("T")[0]}.pdf`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   }

//   /**
//    * Get inventory report
//    */
//   async getInventoryReport(filters = {}) {
//     const params = new URLSearchParams();

//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "category", filters.category);
//     this.appendParam(params, "lowStockOnly", filters.lowStockOnly);
//     this.appendParam(params, "outOfStockOnly", filters.outOfStockOnly);
//     this.appendParam(params, "sortBy", filters.sortBy);
//     this.appendParam(params, "sortOrder", filters.sortOrder);
//     this.appendParam(params, "limit", filters.limit);
//     this.appendParam(params, "offset", filters.offset);
//     this.appendParam(params, "format", filters.format);

//     const response = await api.get(`/reports/inventory?${params.toString()}`);
//     return response.data.data;
//   }

//   /**
//    * Download inventory report as PDF
//    */
//   async downloadInventoryReportPDF(filters = {}) {
//     const params = new URLSearchParams();

//     Object.entries({
//       ...filters,
//       format: "pdf",
//     }).forEach(([key, value]) => {
//       this.appendParam(params, key, value);
//     });

//     const response = await api.get(`/reports/inventory?${params.toString()}`, {
//       responseType: "blob",
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `inventory_report_${new Date().toISOString().split("T")[0]}.pdf`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   }

//   /**
//    * Get financial report
//    */
//   async getFinancialReport(filters = {}) {
//     const params = new URLSearchParams();

//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "groupBy", filters.groupBy);
//     this.appendParam(params, "includeBreakdown", filters.includeBreakdown);
//     this.appendParam(params, "format", filters.format);

//     const response = await api.get(`/reports/financial?${params.toString()}`);
//     return response.data.data;
//   }

//   /**
//    * Download financial report as PDF
//    */
//   async downloadFinancialReportPDF(filters = {}) {
//     const params = new URLSearchParams();

//     Object.entries({
//       ...filters,
//       format: "pdf",
//     }).forEach(([key, value]) => {
//       this.appendParam(params, key, value);
//     });

//     const response = await api.get(`/reports/financial?${params.toString()}`, {
//       responseType: "blob",
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `financial_report_${new Date().toISOString().split("T")[0]}.pdf`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   }

//   /**
//    * Get audit report
//    */
//   async getAuditReport(filters = {}) {
//     const params = new URLSearchParams();

//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "actorId", filters.actorId);
//     this.appendParam(params, "action", filters.action);
//     this.appendParam(params, "resourceType", filters.resourceType);
//     this.appendParam(params, "severity", filters.severity);
//     this.appendParam(params, "limit", filters.limit);
//     this.appendParam(params, "offset", filters.offset);
//     this.appendParam(params, "format", filters.format);

//     const response = await api.get(`/reports/audit?${params.toString()}`);
//     return response.data.data;
//   }

//   /**
//    * Download audit report as PDF
//    */
//   async downloadAuditReportPDF(filters = {}) {
//     const params = new URLSearchParams();

//     Object.entries({
//       ...filters,
//       format: "pdf",
//     }).forEach(([key, value]) => {
//       this.appendParam(params, key, value);
//     });

//     const response = await api.get(`/reports/audit?${params.toString()}`, {
//       responseType: "blob",
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `audit_report_${new Date().toISOString().split("T")[0]}.pdf`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   }

//   /**
//    * Get store comparison report
//    */
//   async getStoreComparisonReport(filters = {}) {
//     const params = new URLSearchParams();

//     this.appendParam(
//       params,
//       "storeIds",
//       Array.isArray(filters.storeIds)
//         ? filters.storeIds.join(",")
//         : filters.storeIds,
//     );
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(
//       params,
//       "metrics",
//       Array.isArray(filters.metrics)
//         ? filters.metrics.join(",")
//         : filters.metrics,
//     );
//     this.appendParam(params, "format", filters.format);

//     const response = await api.get(
//       `/reports/store-comparison?${params.toString()}`,
//     );
//     return response.data.data;
//   }

//   /**
//    * Get user performance report
//    */
//   async getUserPerformanceReport(filters = {}) {
//     const params = new URLSearchParams();

//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);

//     const response = await api.get(
//       `/reports/user-performance?${params.toString()}`,
//     );
//     return response.data.data;
//   }

//   /**
//    * Get product performance report
//    */
//   async getProductPerformanceReport(filters = {}) {
//     const params = new URLSearchParams();

//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);

//     const response = await api.get(
//       `/reports/product-performance?${params.toString()}`,
//     );
//     return response.data.data;
//   }

//   /**
//    * Get report periods
//    */
//   getReportPeriods() {
//     return [
//       { label: "Today", value: "today" },
//       { label: "Yesterday", value: "yesterday" },
//       { label: "Last 7 Days", value: "7days" },
//       { label: "Last 14 Days", value: "14days" },
//       { label: "Last 30 Days", value: "30days" },
//       { label: "This Month", value: "this_month" },
//       { label: "Last Month", value: "last_month" },
//       { label: "This Quarter", value: "this_quarter" },
//       { label: "Last Quarter", value: "last_quarter" },
//       { label: "This Year", value: "this_year" },
//       { label: "Last Year", value: "last_year" },
//       { label: "Custom Range", value: "custom" },
//     ];
//   }

//   /**
//    * Get date range from period
//    */
//   getDateRangeFromPeriod(period) {
//     const now = new Date();
//     const start = new Date(now);
//     const end = new Date(now);

//     switch (period) {
//       case "today":
//         start.setHours(0, 0, 0, 0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "yesterday":
//         start.setDate(now.getDate() - 1);
//         start.setHours(0, 0, 0, 0);
//         end.setDate(now.getDate() - 1);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "7days":
//         start.setDate(now.getDate() - 7);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "14days":
//         start.setDate(now.getDate() - 14);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "30days":
//         start.setDate(now.getDate() - 30);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "this_month":
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "last_month":
//         start.setMonth(now.getMonth() - 1);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         end.setMonth(now.getMonth());
//         end.setDate(0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "this_quarter":
//         const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
//         start.setMonth(quarterMonth);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "this_year":
//         start.setMonth(0);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "last_year":
//         start.setFullYear(now.getFullYear() - 1);
//         start.setMonth(0);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         end.setFullYear(now.getFullYear() - 1);
//         end.setMonth(11);
//         end.setDate(31);
//         end.setHours(23, 59, 59, 999);
//         break;
//       default:
//         start.setDate(now.getDate() - 30);
//         start.setHours(0, 0, 0, 0);
//     }

//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   }

// }

// export default new ReportService();

// // services/reportService.js - Complete file

// import api from "./api";
// import ENDPOINTS from "../constants/apiEndpoints";

// class ReportService {
//   appendParam(params, key, value) {
//     if (
//       value !== undefined &&
//       value !== null &&
//       value !== "" &&
//       value !== "undefined" &&
//       value !== "null"
//     ) {
//       params.append(key, value);
//     }
//   }

//   // ===== SALES REPORT =====
//   async getSalesReport(filters = {}) {
//     const params = new URLSearchParams();
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "groupBy", filters.groupBy);
//     this.appendParam(
//       params,
//       "paymentMethods",
//       Array.isArray(filters.paymentMethods)
//         ? filters.paymentMethods.join(",")
//         : filters.paymentMethods,
//     );
//     this.appendParam(params, "minAmount", filters.minAmount);
//     this.appendParam(params, "maxAmount", filters.maxAmount);
//     this.appendParam(
//       params,
//       "productIds",
//       Array.isArray(filters.productIds)
//         ? filters.productIds.join(",")
//         : filters.productIds,
//     );
//     this.appendParam(params, "category", filters.category);
//     this.appendParam(params, "salesAttendantId", filters.salesAttendantId);
//     this.appendParam(params, "sortBy", filters.sortBy);
//     this.appendParam(params, "sortOrder", filters.sortOrder);
//     this.appendParam(params, "limit", filters.limit);
//     this.appendParam(params, "offset", filters.offset);

//     const response = await api.get(`${ENDPOINTS.REPORTS.SALES}?${params.toString()}`);
//     return response.data.data;
//   }

//   async downloadSalesReportPDF(filters = {}) {
//     try {
//       const params = new URLSearchParams();
//       this.appendParam(params, "startDate", filters.startDate);
//       this.appendParam(params, "endDate", filters.endDate);
//       this.appendParam(params, "storeId", filters.storeId);
//       this.appendParam(params, "groupBy", filters.groupBy);
//       this.appendParam(
//         params,
//         "paymentMethods",
//         Array.isArray(filters.paymentMethods)
//           ? filters.paymentMethods.join(",")
//           : filters.paymentMethods,
//       );
//       this.appendParam(params, "minAmount", filters.minAmount);
//       this.appendParam(params, "maxAmount", filters.maxAmount);
//       this.appendParam(
//         params,
//         "productIds",
//         Array.isArray(filters.productIds)
//           ? filters.productIds.join(",")
//           : filters.productIds,
//       );
//       this.appendParam(params, "category", filters.category);
//       this.appendParam(params, "salesAttendantId", filters.salesAttendantId);
//       this.appendParam(params, "sortBy", filters.sortBy);
//       this.appendParam(params, "sortOrder", filters.sortOrder);
//       this.appendParam(params, "limit", filters.limit);
//       this.appendParam(params, "offset", filters.offset);

//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.SALES_DOWNLOAD}?${params.toString()}`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `sales_report_${new Date().toISOString().split("T")[0]}.pdf`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download sales report error:", error);
//       throw error;
//     }
//   }

//   // ===== INVENTORY REPORT =====
//   async getInventoryReport(filters = {}) {
//     const params = new URLSearchParams();
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "category", filters.category);
//     this.appendParam(params, "lowStockOnly", filters.lowStockOnly);
//     this.appendParam(params, "outOfStockOnly", filters.outOfStockOnly);
//     this.appendParam(params, "sortBy", filters.sortBy);
//     this.appendParam(params, "sortOrder", filters.sortOrder);
//     this.appendParam(params, "limit", filters.limit);
//     this.appendParam(params, "offset", filters.offset);

//     const response = await api.get(`${ENDPOINTS.REPORTS.INVENTORY}?${params.toString()}`);
//     return response.data.data;
//   }

//   async downloadInventoryReportPDF(filters = {}) {
//     try {
//       const params = new URLSearchParams();
//       this.appendParam(params, "storeId", filters.storeId);
//       this.appendParam(params, "category", filters.category);
//       this.appendParam(params, "lowStockOnly", filters.lowStockOnly);
//       this.appendParam(params, "outOfStockOnly", filters.outOfStockOnly);
//       this.appendParam(params, "sortBy", filters.sortBy);
//       this.appendParam(params, "sortOrder", filters.sortOrder);
//       this.appendParam(params, "limit", filters.limit);
//       this.appendParam(params, "offset", filters.offset);

//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.INVENTORY_DOWNLOAD}?${params.toString()}`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `inventory_report_${new Date().toISOString().split("T")[0]}.pdf`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download inventory report error:", error);
//       throw error;
//     }
//   }

//   // ===== FINANCIAL REPORT =====
//   async getFinancialReport(filters = {}) {
//     const params = new URLSearchParams();
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "groupBy", filters.groupBy);
//     this.appendParam(params, "includeBreakdown", filters.includeBreakdown);

//     const response = await api.get(`${ENDPOINTS.REPORTS.FINANCIAL}?${params.toString()}`);
//     return response.data.data;
//   }

//   async downloadFinancialReportPDF(filters = {}) {
//     try {
//       const params = new URLSearchParams();
//       this.appendParam(params, "startDate", filters.startDate);
//       this.appendParam(params, "endDate", filters.endDate);
//       this.appendParam(params, "storeId", filters.storeId);
//       this.appendParam(params, "groupBy", filters.groupBy);
//       this.appendParam(params, "includeBreakdown", filters.includeBreakdown);

//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.FINANCIAL_DOWNLOAD}?${params.toString()}`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `financial_report_${new Date().toISOString().split("T")[0]}.pdf`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download financial report error:", error);
//       throw error;
//     }
//   }

//   // ===== AUDIT REPORT =====
//   async getAuditReport(filters = {}) {
//     const params = new URLSearchParams();
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "actorId", filters.actorId);
//     this.appendParam(params, "action", filters.action);
//     this.appendParam(params, "resourceType", filters.resourceType);
//     this.appendParam(params, "severity", filters.severity);
//     this.appendParam(params, "limit", filters.limit);
//     this.appendParam(params, "offset", filters.offset);

//     const response = await api.get(`${ENDPOINTS.REPORTS.AUDIT}?${params.toString()}`);
//     return response.data.data;
//   }

//   async downloadAuditReportPDF(filters = {}) {
//     try {
//       const params = new URLSearchParams();
//       this.appendParam(params, "startDate", filters.startDate);
//       this.appendParam(params, "endDate", filters.endDate);
//       this.appendParam(params, "storeId", filters.storeId);
//       this.appendParam(params, "actorId", filters.actorId);
//       this.appendParam(params, "action", filters.action);
//       this.appendParam(params, "resourceType", filters.resourceType);
//       this.appendParam(params, "severity", filters.severity);
//       this.appendParam(params, "limit", filters.limit);
//       this.appendParam(params, "offset", filters.offset);

//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.AUDIT_DOWNLOAD}?${params.toString()}`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `audit_report_${new Date().toISOString().split("T")[0]}.pdf`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download audit report error:", error);
//       throw error;
//     }
//   }

//   // ===== USER PERFORMANCE REPORT =====
//   async getUserPerformanceReport(filters = {}) {
//     const params = new URLSearchParams();
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);

//     const response = await api.get(`${ENDPOINTS.REPORTS.USER_PERFORMANCE}?${params.toString()}`);
//     return response.data.data;
//   }

//   async downloadUserPerformancePDF(filters = {}) {
//     try {
//       const params = new URLSearchParams();
//       this.appendParam(params, "startDate", filters.startDate);
//       this.appendParam(params, "endDate", filters.endDate);
//       this.appendParam(params, "storeId", filters.storeId);

//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.USER_PERFORMANCE_DOWNLOAD}?${params.toString()}`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `user_performance_${new Date().toISOString().split("T")[0]}.pdf`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download user performance error:", error);
//       throw error;
//     }
//   }

//   // ===== PRODUCT PERFORMANCE REPORT =====
//   async getProductPerformanceReport(filters = {}) {
//     const params = new URLSearchParams();
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(params, "storeId", filters.storeId);
//     this.appendParam(params, "category", filters.category);

//     const response = await api.get(`${ENDPOINTS.REPORTS.PRODUCT_PERFORMANCE}?${params.toString()}`);
//     return response.data.data;
//   }

//   async downloadProductPerformancePDF(filters = {}) {
//     try {
//       const params = new URLSearchParams();
//       this.appendParam(params, "startDate", filters.startDate);
//       this.appendParam(params, "endDate", filters.endDate);
//       this.appendParam(params, "storeId", filters.storeId);
//       this.appendParam(params, "category", filters.category);

//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.PRODUCT_PERFORMANCE_DOWNLOAD}?${params.toString()}`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `product_performance_${new Date().toISOString().split("T")[0]}.pdf`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download product performance error:", error);
//       throw error;
//     }
//   }

//   // ===== STORE COMPARISON REPORT =====
//   async getStoreComparisonReport(filters = {}) {
//     const params = new URLSearchParams();
//     this.appendParam(
//       params,
//       "storeIds",
//       Array.isArray(filters.storeIds)
//         ? filters.storeIds.join(",")
//         : filters.storeIds,
//     );
//     this.appendParam(params, "startDate", filters.startDate);
//     this.appendParam(params, "endDate", filters.endDate);
//     this.appendParam(
//       params,
//       "metrics",
//       Array.isArray(filters.metrics)
//         ? filters.metrics.join(",")
//         : filters.metrics,
//     );

//     const response = await api.get(`${ENDPOINTS.REPORTS.STORE_COMPARISON}?${params.toString()}`);
//     return response.data.data;
//   }

//   async downloadStoreComparisonPDF(filters = {}) {
//     try {
//       const params = new URLSearchParams();
//       this.appendParam(
//         params,
//         "storeIds",
//         Array.isArray(filters.storeIds)
//           ? filters.storeIds.join(",")
//           : filters.storeIds,
//       );
//       this.appendParam(params, "startDate", filters.startDate);
//       this.appendParam(params, "endDate", filters.endDate);
//       this.appendParam(
//         params,
//         "metrics",
//         Array.isArray(filters.metrics)
//           ? filters.metrics.join(",")
//           : filters.metrics,
//       );

//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.STORE_COMPARISON_DOWNLOAD}?${params.toString()}`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `store_comparison_${new Date().toISOString().split("T")[0]}.pdf`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download store comparison error:", error);
//       throw error;
//     }
//   }

//   // ===== UTILITY METHODS =====
//   getReportPeriods() {
//     return [
//       { label: "Today", value: "today" },
//       { label: "Yesterday", value: "yesterday" },
//       { label: "Last 7 Days", value: "7days" },
//       { label: "Last 14 Days", value: "14days" },
//       { label: "Last 30 Days", value: "30days" },
//       { label: "This Month", value: "this_month" },
//       { label: "Last Month", value: "last_month" },
//       { label: "This Quarter", value: "this_quarter" },
//       { label: "Last Quarter", value: "last_quarter" },
//       { label: "This Year", value: "this_year" },
//       { label: "Last Year", value: "last_year" },
//       { label: "Custom Range", value: "custom" },
//     ];
//   }

//   getDateRangeFromPeriod(period) {
//     const now = new Date();
//     const start = new Date(now);
//     const end = new Date(now);

//     switch (period) {
//       case "today":
//         start.setHours(0, 0, 0, 0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "yesterday":
//         start.setDate(now.getDate() - 1);
//         start.setHours(0, 0, 0, 0);
//         end.setDate(now.getDate() - 1);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "7days":
//         start.setDate(now.getDate() - 7);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "14days":
//         start.setDate(now.getDate() - 14);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "30days":
//         start.setDate(now.getDate() - 30);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "this_month":
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "last_month":
//         start.setMonth(now.getMonth() - 1);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         end.setMonth(now.getMonth());
//         end.setDate(0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "this_quarter": {
//         const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
//         start.setMonth(quarterMonth);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       }
//       case "this_year":
//         start.setMonth(0);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "last_year":
//         start.setFullYear(now.getFullYear() - 1);
//         start.setMonth(0);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         end.setFullYear(now.getFullYear() - 1);
//         end.setMonth(11);
//         end.setDate(31);
//         end.setHours(23, 59, 59, 999);
//         break;
//       default:
//         start.setDate(now.getDate() - 30);
//         start.setHours(0, 0, 0, 0);
//     }

//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   }

//   /**
//    * Get available stores for comparison
//    */
//   async getAvailableStores() {
//     try {
//       const response = await api.get('/stores');
//       return response.data.data || [];
//     } catch (error) {
//       console.error('Failed to fetch stores:', error);
//       return [];
//     }
//   }
// }

// export default new ReportService();
























// // services/reportService.js
// import api from "./api";
// import ENDPOINTS from "../constants/apiEndpoints";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import { Platform, Alert } from "react-native";

// class ReportService {
//   /**
//    * Helper: Append parameter to URLSearchParams if value exists
//    */
//   appendParam(params, key, value) {
//     if (
//       value !== undefined &&
//       value !== null &&
//       value !== "" &&
//       value !== "undefined" &&
//       value !== "null"
//     ) {
//       params.append(key, value);
//     }
//   }

//   /**
//    * Helper: Build URLSearchParams from filters object
//    */
//   buildParams(filters = {}, excludeKeys = []) {
//     const params = new URLSearchParams();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (!excludeKeys.includes(key)) {
//         if (Array.isArray(value)) {
//           this.appendParam(params, key, value.join(","));
//         } else {
//           this.appendParam(params, key, value);
//         }
//       }
//     });
//     return params;
//   }

//   /**
//    * Helper: Download file from API and save to device
//    */
//   // async downloadFile(url, fileName) {
//   //   try {
//   //     // Get the full URL
//   //     const baseURL = api.defaults?.baseURL || '';
//   //     const fullUrl = `${baseURL}${url}`;

//   //     console.log('Downloading from:', fullUrl);

//   //     // Download using expo-file-system
//   //     const downloadResult = await FileSystem.downloadAsync(
//   //       fullUrl,
//   //       FileSystem.documentDirectory + fileName
//   //     );

//   //     console.log('Download completed:', downloadResult.uri);
//   //     return downloadResult.uri;
//   //   } catch (error) {
//   //     console.error('Download error:', error);
//   //     throw new Error(`Failed to download file: ${error.message}`);
//   //   }
//   // }

//   async downloadFile(url, fileName) {
//     try {
//       const token = await AsyncStorage.getItem("accessToken");

//       const userStr = await AsyncStorage.getItem("user");

//       let storeId = "";

//       if (userStr) {
//         const user = JSON.parse(userStr);
//         storeId = user.currentStoreId || user.storeId || "";
//       }

//       const fullUrl = `${api.defaults.baseURL}${url}`;

//       console.log("Downloading:", fullUrl);

//       const file = new File(Paths.cache, fileName);

//       await file.downloadFileAsync(fullUrl, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//           "X-Store-Id": storeId,
//         },
//       });

//       console.log("Downloaded to:", file.uri);

//       return file.uri;
//     } catch (err) {
//       console.error("Download failed:", err);
//       throw err;
//     }
//   }

//   /**
//    * Helper: Share file using expo-sharing
//    */
//   async shareFile(fileUri, fileName) {
//     try {
//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(fileUri, {
//           dialogTitle: `Share ${fileName}`,
//           mimeType: "application/pdf",
//         });
//         return true;
//       } else {
//         Alert.alert("Error", "Sharing is not available on this device");
//         return false;
//       }
//     } catch (error) {
//       console.error("Share error:", error);
//       Alert.alert("Error", "Failed to share file");
//       return false;
//     }
//   }

//   /**
//    * Helper: Download and share a report
//    */
//   async downloadAndShareReport(endpoint, filters, fileNamePrefix) {
//     try {
//       const params = this.buildParams(filters);
//       const url = `${endpoint}?${params.toString()}`;
//       const fileName = `${fileNamePrefix}_${new Date().toISOString().split("T")[0]}.pdf`;

//       // Show download progress (optional)
//       Alert.alert(
//         "Downloading",
//         "Please wait while your report is being prepared...",
//       );

//       const fileUri = await this.downloadFile(url, fileName);

//       Alert.alert("Success", "Report downloaded successfully!");

//       // Share the file
//       await this.shareFile(fileUri, fileName);

//       return fileUri;
//     } catch (error) {
//       console.error(`Download ${fileNamePrefix} error:`, error);
//       Alert.alert("Error", error.message || "Failed to download report");
//       throw error;
//     }
//   }

//   // ============================================
//   // ===== SALES REPORT =====
//   // ============================================

//   /**
//    * Get sales report with advanced filters
//    */
//   async getSalesReport(filters = {}) {
//     try {
//       const params = this.buildParams(filters);
//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.SALES}?${params.toString()}`,
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("Get sales report error:", error);
//       throw error;
//     }
//   }

//   /**
//    * Download sales report as PDF
//    */
//   async downloadSalesReportPDF(filters = {}) {
//     return this.downloadAndShareReport(
//       ENDPOINTS.REPORTS.SALES_DOWNLOAD,
//       filters,
//       "sales_report",
//     );
//   }

//   // ============================================
//   // ===== INVENTORY REPORT =====
//   // ============================================

//   /**
//    * Get inventory report with advanced filters
//    */
//   async getInventoryReport(filters = {}) {
//     try {
//       const params = this.buildParams(filters);
//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.INVENTORY}?${params.toString()}`,
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("Get inventory report error:", error);
//       throw error;
//     }
//   }

//   /**
//    * Download inventory report as PDF
//    */
//   async downloadInventoryReportPDF(filters = {}) {
//     return this.downloadAndShareReport(
//       ENDPOINTS.REPORTS.INVENTORY_DOWNLOAD,
//       filters,
//       "inventory_report",
//     );
//   }

//   // ============================================
//   // ===== FINANCIAL REPORT =====
//   // ============================================

//   /**
//    * Get financial report with advanced filters
//    */
//   async getFinancialReport(filters = {}) {
//     try {
//       const params = this.buildParams(filters);
//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.FINANCIAL}?${params.toString()}`,
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("Get financial report error:", error);
//       throw error;
//     }
//   }

//   /**
//    * Download financial report as PDF
//    */
//   async downloadFinancialReportPDF(filters = {}) {
//     return this.downloadAndShareReport(
//       ENDPOINTS.REPORTS.FINANCIAL_DOWNLOAD,
//       filters,
//       "financial_report",
//     );
//   }

//   // ============================================
//   // ===== AUDIT REPORT =====
//   // ============================================

//   /**
//    * Get audit report with advanced filters
//    */
//   async getAuditReport(filters = {}) {
//     try {
//       const params = this.buildParams(filters);
//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.AUDIT}?${params.toString()}`,
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("Get audit report error:", error);
//       throw error;
//     }
//   }

//   /**
//    * Download audit report as PDF
//    */
//   async downloadAuditReportPDF(filters = {}) {
//     return this.downloadAndShareReport(
//       ENDPOINTS.REPORTS.AUDIT_DOWNLOAD,
//       filters,
//       "audit_report",
//     );
//   }

//   // ============================================
//   // ===== USER PERFORMANCE REPORT =====
//   // ============================================

//   /**
//    * Get user performance report
//    */
//   async getUserPerformanceReport(filters = {}) {
//     try {
//       const params = this.buildParams(filters);
//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.USER_PERFORMANCE}?${params.toString()}`,
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("Get user performance error:", error);
//       throw error;
//     }
//   }

//   /**
//    * Download user performance report as PDF
//    */
//   async downloadUserPerformancePDF(filters = {}) {
//     return this.downloadAndShareReport(
//       ENDPOINTS.REPORTS.USER_PERFORMANCE_DOWNLOAD,
//       filters,
//       "user_performance",
//     );
//   }

//   // ============================================
//   // ===== PRODUCT PERFORMANCE REPORT =====
//   // ============================================

//   /**
//    * Get product performance report
//    */
//   async getProductPerformanceReport(filters = {}) {
//     try {
//       const params = this.buildParams(filters);
//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.PRODUCT_PERFORMANCE}?${params.toString()}`,
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("Get product performance error:", error);
//       throw error;
//     }
//   }

//   /**
//    * Download product performance report as PDF
//    */
//   async downloadProductPerformancePDF(filters = {}) {
//     return this.downloadAndShareReport(
//       ENDPOINTS.REPORTS.PRODUCT_PERFORMANCE_DOWNLOAD,
//       filters,
//       "product_performance",
//     );
//   }

//   // ============================================
//   // ===== STORE COMPARISON REPORT =====
//   // ============================================

//   /**
//    * Get store comparison report
//    */
//   async getStoreComparisonReport(filters = {}) {
//     try {
//       const params = this.buildParams(filters, ["storeIds"]);
//       if (filters.storeIds) {
//         this.appendParam(params, "storeIds", filters.storeIds.join(","));
//       }
//       const response = await api.get(
//         `${ENDPOINTS.REPORTS.STORE_COMPARISON}?${params.toString()}`,
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("Get store comparison error:", error);
//       throw error;
//     }
//   }

//   /**
//    * Download store comparison report as PDF
//    */
//   async downloadStoreComparisonPDF(filters = {}) {
//     const params = this.buildParams(filters, ["storeIds"]);
//     if (filters.storeIds) {
//       this.appendParam(params, "storeIds", filters.storeIds.join(","));
//     }
//     return this.downloadAndShareReport(
//       ENDPOINTS.REPORTS.STORE_COMPARISON_DOWNLOAD,
//       Object.fromEntries(params),
//       "store_comparison",
//     );
//   }

//   // ============================================
//   // ===== UTILITY METHODS =====
//   // ============================================

//   /**
//    * Get report periods for filter
//    */
//   getReportPeriods() {
//     return [
//       { label: "Today", value: "today" },
//       { label: "Yesterday", value: "yesterday" },
//       { label: "Last 7 Days", value: "7days" },
//       { label: "Last 14 Days", value: "14days" },
//       { label: "Last 30 Days", value: "30days" },
//       { label: "This Month", value: "this_month" },
//       { label: "Last Month", value: "last_month" },
//       { label: "This Quarter", value: "this_quarter" },
//       { label: "Last Quarter", value: "last_quarter" },
//       { label: "This Year", value: "this_year" },
//       { label: "Last Year", value: "last_year" },
//       { label: "Custom Range", value: "custom" },
//     ];
//   }

//   /**
//    * Get date range from period string
//    */
//   getDateRangeFromPeriod(period) {
//     const now = new Date();
//     const start = new Date(now);
//     const end = new Date(now);

//     switch (period) {
//       case "today":
//         start.setHours(0, 0, 0, 0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "yesterday":
//         start.setDate(now.getDate() - 1);
//         start.setHours(0, 0, 0, 0);
//         end.setDate(now.getDate() - 1);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "7days":
//         start.setDate(now.getDate() - 7);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "14days":
//         start.setDate(now.getDate() - 14);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "30days":
//         start.setDate(now.getDate() - 30);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "this_month":
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "last_month":
//         start.setMonth(now.getMonth() - 1);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         end.setMonth(now.getMonth());
//         end.setDate(0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       case "this_quarter": {
//         const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
//         start.setMonth(quarterMonth);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       }
//       case "this_year":
//         start.setMonth(0);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         break;
//       case "last_year":
//         start.setFullYear(now.getFullYear() - 1);
//         start.setMonth(0);
//         start.setDate(1);
//         start.setHours(0, 0, 0, 0);
//         end.setFullYear(now.getFullYear() - 1);
//         end.setMonth(11);
//         end.setDate(31);
//         end.setHours(23, 59, 59, 999);
//         break;
//       default:
//         start.setDate(now.getDate() - 30);
//         start.setHours(0, 0, 0, 0);
//     }

//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   }

//   /**
//    * Get available stores for comparison
//    */
//   async getAvailableStores() {
//     try {
//       const response = await api.get("/stores");
//       return response.data.data || [];
//     } catch (error) {
//       console.error("Failed to fetch stores:", error);
//       return [];
//     }
//   }

//   /**
//    * Get report metadata (summary stats for dashboard)
//    */
//   async getReportSummary() {
//     try {
//       const endDate = new Date().toISOString().split("T")[0];
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - 30);
//       const start = startDate.toISOString().split("T")[0];

//       const [sales, inventory] = await Promise.all([
//         this.getSalesReport({ startDate: start, endDate: endDate }),
//         this.getInventoryReport(),
//       ]);

//       return {
//         totalRevenue: sales?.summary?.totalRevenue || 0,
//         totalTransactions: sales?.summary?.totalTransactions || 0,
//         totalProducts: inventory?.summary?.totalProducts || 0,
//         lowStock: inventory?.summary?.lowStock || 0,
//       };
//     } catch (error) {
//       console.error("Failed to fetch summary:", error);
//       return {
//         totalRevenue: 0,
//         totalTransactions: 0,
//         totalProducts: 0,
//         lowStock: 0,
//       };
//     }
//   }
// }

// export default new ReportService();



































// services/reportService.js - Using new API
import { File, Paths } from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import ENDPOINTS from "../constants/apiEndpoints";
// import * as FileSystem from 'expo-file-system';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

console.log("FileSystem:", Object.keys(FileSystem));
console.log("Paths:", Paths);
console.log("File prototype:", Object.getOwnPropertyNames(File.prototype));

class ReportService {
  /**
   * Helper: Append parameter to URLSearchParams if value exists
   */
  appendParam(params, key, value) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "undefined" &&
      value !== "null"
    ) {
      params.append(key, value);
    }
  }

  /**
   * Helper: Build URLSearchParams from filters object
   */
  buildParams(filters = {}, excludeKeys = []) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (!excludeKeys.includes(key)) {
        if (Array.isArray(value)) {
          this.appendParam(params, key, value.join(","));
        } else {
          this.appendParam(params, key, value);
        }
      }
    });
    return params;
  }

  /**
   * Helper: Download file from API and save to device using new API
   */
  async downloadFile(url, fileName) {
    try {
      // Get the full URL
      const baseURL = api.defaults?.baseURL || '';
      const fullUrl = `${baseURL}${url}`;

      console.log('Downloading from:', fullUrl);

      // Use the new File API (Expo 54+)
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Create a download resumable
      const downloadResumable = FileSystem.createDownloadResumable(
        fullUrl,
        fileUri,
        {},
        (downloadProgress) => {
          // Optional: Track progress
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${(progress * 100).toFixed(0)}%`);
        }
      );

      // Start download
      const result = await downloadResumable.downloadAsync();
      
      console.log('Download completed:', result.uri);
      return result.uri;
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }


 
// async downloadFile(url, fileName) {
//   const token = await AsyncStorage.getItem("accessToken");

//   const userStr = await AsyncStorage.getItem("user");
//   const user = userStr ? JSON.parse(userStr) : {};

//   const fullUrl = `${api.defaults.baseURL}${url}`;

//   const file = new File(Paths.cache, fileName);

//   const response = await file.downloadFileAsync(fullUrl, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//       "X-Store-Id": user.currentStoreId || user.storeId || "",
//     },
//   });

//   console.log(response);

//   return file.uri;
// }


  /**
   * Alternative: Download file using fetch and write as base64
   */
  async downloadFileWithFetch(url, fileName) {
    try {
      const baseURL = api.defaults?.baseURL || '';
      const fullUrl = `${baseURL}${url}`;

      console.log('Downloading from:', fullUrl);

      // Fetch the file
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob
      const blob = await response.blob();
      
      // Convert blob to base64
      const base64 = await this.blobToBase64(blob);
      
      // Write to file system using new API
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Using new API - write as base64
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Download completed:', fileUri);
      return fileUri;
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Helper: Convert blob to base64
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Helper: Share file using expo-sharing
   */
  async shareFile(fileUri, fileName) {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: `Share ${fileName}`,
          mimeType: 'application/pdf',
        });
        return true;
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
        return false;
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share file');
      return false;
    }
  }

  /**
   * Helper: Download and share a report
   */
  async downloadAndShareReport(endpoint, filters, fileNamePrefix) {
    try {
      const params = this.buildParams(filters);
      const url = `${endpoint}?${params.toString()}`;
      const fileName = `${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Show download progress
      Alert.alert('Downloading', 'Please wait while your report is being prepared...');
      
      // Use the fetch-based download (more reliable)
      const fileUri = await this.downloadFileWithFetch(url, fileName);
      
      Alert.alert('Success', 'Report downloaded successfully!');
      
      // Share the file
      await this.shareFile(fileUri, fileName);
      
      return fileUri;
    } catch (error) {
      console.error(`Download ${fileNamePrefix} error:`, error);
      Alert.alert('Error', error.message || 'Failed to download report');
      throw error;
    }
  }

  // ============================================
  // ===== SALES REPORT =====
  // ============================================

  /**
   * Get sales report with advanced filters
   */
  async getSalesReport(filters = {}) {
    try {
      const params = this.buildParams(filters);
      const response = await api.get(`${ENDPOINTS.REPORTS.SALES}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get sales report error:', error);
      throw error;
    }
  }

  /**
   * Download sales report as PDF
   */
  async downloadSalesReportPDF(filters = {}) {
    return this.downloadAndShareReport(
      ENDPOINTS.REPORTS.SALES_DOWNLOAD,
      filters,
      'sales_report'
    );
  }

  // ============================================
  // ===== INVENTORY REPORT =====
  // ============================================

  /**
   * Get inventory report with advanced filters
   */
  async getInventoryReport(filters = {}) {
    try {
      const params = this.buildParams(filters);
      const response = await api.get(`${ENDPOINTS.REPORTS.INVENTORY}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get inventory report error:', error);
      throw error;
    }
  }

  /**
   * Download inventory report as PDF
   */
  async downloadInventoryReportPDF(filters = {}) {
    return this.downloadAndShareReport(
      ENDPOINTS.REPORTS.INVENTORY_DOWNLOAD,
      filters,
      'inventory_report'
    );
  }

  // ============================================
  // ===== FINANCIAL REPORT =====
  // ============================================

  /**
   * Get financial report with advanced filters
   */
  async getFinancialReport(filters = {}) {
    try {
      const params = this.buildParams(filters);
      const response = await api.get(`${ENDPOINTS.REPORTS.FINANCIAL}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get financial report error:', error);
      throw error;
    }
  }

  /**
   * Download financial report as PDF
   */
  async downloadFinancialReportPDF(filters = {}) {
    return this.downloadAndShareReport(
      ENDPOINTS.REPORTS.FINANCIAL_DOWNLOAD,
      filters,
      'financial_report'
    );
  }

  // ============================================
  // ===== AUDIT REPORT =====
  // ============================================

  /**
   * Get audit report with advanced filters
   */
  async getAuditReport(filters = {}) {
    try {
      const params = this.buildParams(filters);
      const response = await api.get(`${ENDPOINTS.REPORTS.AUDIT}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get audit report error:', error);
      throw error;
    }
  }

  /**
   * Download audit report as PDF
   */
  async downloadAuditReportPDF(filters = {}) {
    return this.downloadAndShareReport(
      ENDPOINTS.REPORTS.AUDIT_DOWNLOAD,
      filters,
      'audit_report'
    );
  }

  // ============================================
  // ===== USER PERFORMANCE REPORT =====
  // ============================================

  /**
   * Get user performance report
   */
  async getUserPerformanceReport(filters = {}) {
    try {
      const params = this.buildParams(filters);
      const response = await api.get(`${ENDPOINTS.REPORTS.USER_PERFORMANCE}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get user performance error:', error);
      throw error;
    }
  }

  /**
   * Download user performance report as PDF
   */
  async downloadUserPerformancePDF(filters = {}) {
    return this.downloadAndShareReport(
      ENDPOINTS.REPORTS.USER_PERFORMANCE_DOWNLOAD,
      filters,
      'user_performance'
    );
  }

  // ============================================
  // ===== PRODUCT PERFORMANCE REPORT =====
  // ============================================

  /**
   * Get product performance report
   */
  async getProductPerformanceReport(filters = {}) {
    try {
      const params = this.buildParams(filters);
      const response = await api.get(`${ENDPOINTS.REPORTS.PRODUCT_PERFORMANCE}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get product performance error:', error);
      throw error;
    }
  }

  /**
   * Download product performance report as PDF
   */
  async downloadProductPerformancePDF(filters = {}) {
    return this.downloadAndShareReport(
      ENDPOINTS.REPORTS.PRODUCT_PERFORMANCE_DOWNLOAD,
      filters,
      'product_performance'
    );
  }

  // ============================================
  // ===== STORE COMPARISON REPORT =====
  // ============================================

  /**
   * Get store comparison report
   */
  async getStoreComparisonReport(filters = {}) {
    try {
      const params = this.buildParams(filters, ['storeIds']);
      if (filters.storeIds) {
        this.appendParam(params, 'storeIds', filters.storeIds.join(','));
      }
      const response = await api.get(`${ENDPOINTS.REPORTS.STORE_COMPARISON}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Get store comparison error:', error);
      throw error;
    }
  }

  /**
   * Download store comparison report as PDF
   */
  async downloadStoreComparisonPDF(filters = {}) {
    const params = this.buildParams(filters, ['storeIds']);
    if (filters.storeIds) {
      this.appendParam(params, 'storeIds', filters.storeIds.join(','));
    }
    return this.downloadAndShareReport(
      ENDPOINTS.REPORTS.STORE_COMPARISON_DOWNLOAD,
      Object.fromEntries(params),
      'store_comparison'
    );
  }

  // ============================================
  // ===== UTILITY METHODS =====
  // ============================================

  /**
   * Get report periods for filter
   */
  getReportPeriods() {
    return [
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "Last 7 Days", value: "7days" },
      { label: "Last 14 Days", value: "14days" },
      { label: "Last 30 Days", value: "30days" },
      { label: "This Month", value: "this_month" },
      { label: "Last Month", value: "last_month" },
      { label: "This Quarter", value: "this_quarter" },
      { label: "Last Quarter", value: "last_quarter" },
      { label: "This Year", value: "this_year" },
      { label: "Last Year", value: "last_year" },
      { label: "Custom Range", value: "custom" },
    ];
  }

  /**
   * Get date range from period string
   */
  getDateRangeFromPeriod(period) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
      case "today":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case "7days":
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case "14days":
        start.setDate(now.getDate() - 14);
        start.setHours(0, 0, 0, 0);
        break;
      case "30days":
        start.setDate(now.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;
      case "this_month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case "last_month":
        start.setMonth(now.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(now.getMonth());
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case "this_quarter": {
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        start.setMonth(quarterMonth);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case "this_year":
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case "last_year":
        start.setFullYear(now.getFullYear() - 1);
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setFullYear(now.getFullYear() - 1);
        end.setMonth(11);
        end.setDate(31);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start.setDate(now.getDate() - 30);
        start.setHours(0, 0, 0, 0);
    }

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }

  /**
   * Get available stores for comparison
   */
  async getAvailableStores() {
    try {
      const response = await api.get('/stores');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      return [];
    }
  }

  /**
   * Get report metadata (summary stats for dashboard)
   */
  async getReportSummary() {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const start = startDate.toISOString().split('T')[0];

      const [sales, inventory] = await Promise.all([
        this.getSalesReport({ startDate: start, endDate: endDate }),
        this.getInventoryReport(),
      ]);

      return {
        totalRevenue: sales?.summary?.totalRevenue || 0,
        totalTransactions: sales?.summary?.totalTransactions || 0,
        totalProducts: inventory?.summary?.totalProducts || 0,
        lowStock: inventory?.summary?.lowStock || 0,
      };
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        totalProducts: 0,
        lowStock: 0,
      };
    }
  }
}

export default new ReportService();