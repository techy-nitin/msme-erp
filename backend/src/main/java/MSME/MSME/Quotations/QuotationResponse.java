package MSME.MSME.Quotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class QuotationResponse {

    private Long id;

    private String quotationNumber;

    private Long customerId;

    private LocalDate quotationDate;

    private LocalDate validUntil;

    private BigDecimal subtotal;

    private BigDecimal discount;

    private BigDecimal gstAmount;

    private BigDecimal totalAmount;

    private String status;

    private String notes;

    private Boolean isConverted;

    private List<QuotationItemResponse> items;

    public QuotationResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public String getQuotationNumber() {
        return quotationNumber;
    }

    public void setQuotationNumber(String quotationNumber) {
        this.quotationNumber=quotationNumber;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId=customerId;
    }

    public LocalDate getQuotationDate() {
        return quotationDate;
    }

    public void setQuotationDate(LocalDate quotationDate) {
        this.quotationDate=quotationDate;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil=validUntil;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal=subtotal;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount=discount;
    }

    public BigDecimal getGstAmount() {
        return gstAmount;
    }

    public void setGstAmount(BigDecimal gstAmount) {
        this.gstAmount=gstAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount=totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status=status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes=notes;
    }

    public Boolean getIsConverted() {
        return isConverted;
    }

    public void setIsConverted(Boolean isConverted) {
        this.isConverted=isConverted;
    }

    public List<QuotationItemResponse> getItems() {
        return items;
    }

    public void setItems(List<QuotationItemResponse> items) {
        this.items=items;
    }
}