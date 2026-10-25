package MSME.MSME.notification;

public enum NotificationType {

    // ==========================
    // Invoice
    // ==========================

    INVOICE_CREATED,

    INVOICE_SENT,

    INVOICE_WHATSAPP_SENT,

    INVOICE_DOWNLOADED,

    INVOICE_VIEWED,

    INVOICE_CANCELLED,

    // ==========================
    // Payment
    // ==========================

    PAYMENT_RECEIVED,

    PAYMENT_REMINDER,

    PAYMENT_OVERDUE,

    // ==========================
    // Quotation
    // ==========================

    QUOTATION_SENT,

    QUOTATION_ACCEPTED,

    QUOTATION_REJECTED,

    // ==========================
    // GST
    // ==========================

    GST_DUE,

    GST_FILED,

    // ==========================
    // Expenses
    // ==========================

    EXPENSE_ADDED,

    // ==========================
    // Clients
    // ==========================

    CLIENT_ADDED,

    CLIENT_UPDATED,

    // ==========================
    // Products
    // ==========================

    PRODUCT_ADDED,

    PRODUCT_UPDATED,

    PRODUCT_LOW_STOCK,

    // ==========================
    // Documents
    // ==========================

    DOCUMENT_UPLOADED,

    DOCUMENT_DELETED,

    // ==========================
    // System
    // ==========================

    SYSTEM

}