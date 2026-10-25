package MSME.MSME.DashBoard;

import MSME.MSME.Invoice.InvoiceResponse;
import MSME.MSME.Payment.PaymentEntity;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {
    private long totalClients;
    private long totalEmployees;
    private long totalInvoices;
    private long pendingQuotations;

    private BigDecimal totalRevenue;
    private BigDecimal outstandingPayments;
    private List<PaymentEntity> pendingPayments;

    private List<InvoiceResponse> recentInvoices;

    public long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(long totalClients) {
        this.totalClients = totalClients;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalInvoices() {
        return totalInvoices;
    }

    public void setTotalInvoices(long totalInvoices) {
        this.totalInvoices = totalInvoices;
    }

    public long getPendingQuotations() {
        return pendingQuotations;
    }

    public void setPendingQuotations(long pendingQuotations) {
        this.pendingQuotations = pendingQuotations;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getOutstandingPayments() {
        return outstandingPayments;
    }

    public void setOutstandingPayments(BigDecimal outstandingPayments) {
        this.outstandingPayments = outstandingPayments;
    }

    public List<PaymentEntity> getPendingPayments() {
        return pendingPayments;
    }

    public void setPendingPayments(List<PaymentEntity> pendingPayments) {
        this.pendingPayments = pendingPayments;
    }

    public List<InvoiceResponse> getRecentInvoices() {
        return recentInvoices;
    }

    public void setRecentInvoices(List<InvoiceResponse> recentInvoices) {
        this.recentInvoices = recentInvoices;
    }
}
