package MSME.MSME.Quotations;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="quotations")
public class QEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="quotation_number",unique=true,nullable=false)
    private String quotationNumber;

    @Column(name="customer_id",nullable=false)
    private Long customerId;

    @Column(name="quotation_date",nullable=false)
    private LocalDate quotationDate;

    @Column(name="valid_until")
    private LocalDate validUntil;

    @Column(name="subtotal")
    private BigDecimal subtotal;

    @Column(name="discount")
    private BigDecimal discount;

    @Column(name="gst_amount")
    private BigDecimal gstAmount;

    @Column(name="total_amount")
    private BigDecimal totalAmount;

    @Column(name="status")
    private String status;

    @Column(name="notes")
    private String notes;

    @Column(name="is_converted")
    private Boolean isConverted;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy="quotation",
            cascade=CascadeType.ALL,
            orphanRemoval=true)
    private List<QuotationItemEntity> items;

    public QEntity() {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt=createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt=updatedAt;
    }

    public List<QuotationItemEntity> getItems() {
        return items;
    }

    public void setItems(List<QuotationItemEntity> items) {
        this.items=items;
    }
}