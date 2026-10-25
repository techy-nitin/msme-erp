import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// Request Interceptor
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// AUTH APIs
// ============================================

export const register = (user) => api.post("/auth/register", user);
export const login = (user) => api.post("/auth/login", user);
export const logout = () => api.post("/auth/logout");
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (profile) => api.put("/auth/profile", profile);
export const changePassword = (passwords) => api.put("/auth/change-password", passwords);
export const deleteAccount = () => api.delete("/auth/profile");

// ============================================
// PAYMENT APIs
// ============================================

export const createPayment = (payment) => api.post("/api/payments", payment);
export const getPayments = () => api.get("/api/payments");
export const getPayment = (id) => api.get(`/api/payments/${id}`);
export const updatePayment = (id, payment) => api.put(`/api/payments/${id}`, payment);
export const deletePayment = (id) => api.delete(`/api/payments/${id}`);
export const getPaymentsByInvoice = (invoiceId) => api.get(`/api/payments/invoice/${invoiceId}`);
export const getPaymentsByStatus = (status) => api.get(`/api/payments/status/${status}`);

// ============================================
// COMPANY APIs
// ============================================

export const createCompany = (company) => api.post("/api/company", company);
export const getCompany = () => api.get("/api/company/me");
export const updateCompany = (company) => api.put("/api/company/me", company);
export const deleteCompany = (id) => api.delete("/api/company/me");

// ============================================
// CLIENT APIs
// ============================================

export const createClient = (client) => api.post("/api/clients", client);
export const getClients = () => api.get("/api/clients");
export const getClient = (id) => api.get(`/api/clients/${id}`);
export const updateClient = (id, client) => api.put(`/api/clients/${id}`, client);
export const deleteClient = (id) => api.delete(`/api/clients/${id}`);

// ============================================
// EMPLOYEE APIs
// ============================================

export const createEmployee = (employee) => api.post("/api/employees", employee);
export const getEmployees = () => api.get("/api/employees");
export const getEmployee = (id) => api.get(`/api/employees/${id}`);
export const updateEmployee = (id, employee) => api.put(`/api/employees/${id}`, employee);
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`);

// ============================================
// CATEGORY APIs
// ============================================

export const createCategory = (category) => api.post("/api/categories", category);
export const getCategories = () => api.get("/api/categories");
export const getCategory = (id) => api.get(`/api/categories/${id}`);
export const updateCategory = (id, category) => api.put(`/api/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);

// ============================================
// PRODUCT APIs
// ============================================

export const createProduct = (product) => api.post("/api/products", product);
export const getProducts = () => api.get("/api/products");
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const updateProduct = (id, product) => api.put(`/api/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
export const searchProducts = (name) => api.get("/api/products/search", { params: { name } });
export const getProductsByCategory = (categoryId) => api.get(`/api/products/category/${categoryId}`);

// ============================================
// INVOICE APIs
// ============================================

export const createInvoice = (invoice) => api.post("/api/invoices", invoice);
export const getInvoices = () => api.get("/api/invoices");
export const getInvoice = (id) => api.get(`/api/invoices/${id}`);
export const updateInvoice = (id, invoice) => api.put(`/api/invoices/${id}`, invoice);
export const deleteInvoice = (id) => api.delete(`/api/invoices/${id}`);

// ============================================
// QUOTATIONS APIs
// ============================================

export const getQuotations = () => api.get("/api/quotations");
export const getQuotation = (id) => api.get(`/api/quotations/${id}`);
export const createQuotation = (data) => api.post("/api/quotations", data);
export const updateQuotation = (id, data) => api.put(`/api/quotations/${id}`, data);
export const deleteQuotation = (id) => api.delete(`/api/quotations/${id}`);

// ============================================
// ACCOUNTS APIs
// ============================================

export const getAccountsDashboard = () => api.get("/accounts/dashboard");

// ============================================
// EXPENSE APIs
// ============================================

export const createExpense = (expense) => api.post("/api/expenses", expense);
export const getExpenses = () => api.get("/api/expenses");
export const getExpense = (id) => api.get(`/api/expenses/${id}`);
export const updateExpense = (id, expense) => api.put(`/api/expenses/${id}`, expense);
export const deleteExpense = (id) => api.delete(`/api/expenses/${id}`);

// ============================================
// DASHBOARD APIs
// ============================================

export const getDashboardData = () => api.get("/api/dashboard");

// ============================================
// VENDOR APIs
// ============================================

export const createVendor = (vendor) => api.post("/api/vendors", vendor);
export const getVendors = () => api.get("/api/vendors");
export const getVendor = (id) => api.get(`/api/vendors/${id}`);
export const updateVendor = (id, vendor) => api.put(`/api/vendors/${id}`, vendor);
export const deleteVendor = (id) => api.delete(`/api/vendors/${id}`);

// ============================================
// NOTIFICATION APIs (JWT Based)
// ============================================

export const getNotifications = () =>
  api.get("/api/notifications");

export const getLatestNotifications = () =>
  api.get("/api/notifications/latest");

export const getUnreadNotifications = () =>
  api.get("/api/notifications/unread");

export const getUnreadNotificationCount = () =>
  api.get("/api/notifications/count");

export const markNotificationRead = (id) =>
  api.put(`/api/notifications/read/${id}`);

export const markAllNotificationsRead = () =>
  api.put("/api/notifications/read-all");

export const deleteNotification = (id) =>
  api.delete(`/api/notifications/${id}`);

// ============================================
// QUOTATION EMAIL APIs
// ============================================

export const sendQuotationEmail = (quotationId) =>
  api.post(`/api/quotation-email/send/${quotationId}`);

export const sendQuotationWhatsapp = (id) =>
  api.post(`/api/quotation-email/${id}/whatsapp`);

// ============================================
// INVOICE EMAIL APIs
// ============================================

export const sendInvoiceEmail = (invoiceId) =>
  api.post(`/api/invoices/${invoiceId}/send-email`);

export const sendInvoiceWhatsapp = (invoiceId) =>
  api.post(`/api/invoices/${invoiceId}/send-whatsapp`);

export const getInvoiceById = (invoiceId) =>
  api.get(`/api/invoices/${invoiceId}`);

// ============================================
// DOCUMENT APIs
// ============================================

export const generateInvoicePdf = (invoiceId, employeeId) =>
  api.post(`/api/documents/invoice/${invoiceId}`, null, {
    params: { employeeId },
  });

export const generateQuotationPdf = (quotationId, employeeId) =>
  api.post(`/api/documents/quotation/${quotationId}`, null, {
    params: { employeeId },
  });

export const getDocuments = (type, id) =>
  api.get("/api/documents", {
    params: { type, id },
  });

export const downloadInvoicePdf = (invoiceId) =>
  api.get(`/api/documents/invoice/${invoiceId}`, {
    responseType: "blob",
  });

export const downloadQuotationPdf = (quotationId) =>
  api.get(`/api/documents/quotation/${quotationId}`, {
    responseType: "blob",
  });

// ============================================
// REPORT EXPORT APIs
// (maps to ReportExportController: /reports/export/{pdf|excel|csv})
// ============================================

export const exportReportPdf = (type) =>
  api.get("/reports/export/pdf", {
    params: { type },
    responseType: "blob",
  });

export const exportReportExcel = (type) =>
  api.get("/reports/export/excel", {
    params: { type },
    responseType: "blob",
  });

export const exportReportCsv = (type) =>
  api.get("/reports/export/csv", {
    params: { type },
    responseType: "blob",
  });

export default api;