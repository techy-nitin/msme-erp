package MSME.MSME.Quotations;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class QuotationRequest {

    @NotNull(message = "Customer Id is required")
    private Long customerId;

    @NotNull(message = "Quotation Date is required")
    private LocalDate quotationDate;

    private LocalDate validUntil;

    private String status;

    private String notes;

    @Valid
    @NotEmpty(message = "Quotation must contain at least one item")
    private List<QuotationItemRequest> items;

    public QuotationRequest() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public LocalDate getQuotationDate() {
        return quotationDate;
    }

    public void setQuotationDate(LocalDate quotationDate) {
        this.quotationDate = quotationDate;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<QuotationItemRequest> getItems() {
        return items;
    }

    public void setItems(List<QuotationItemRequest> items) {
        this.items = items;
    }
}