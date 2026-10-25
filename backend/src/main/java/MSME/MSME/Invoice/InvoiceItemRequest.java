package MSME.MSME.Invoice;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class InvoiceItemRequest {

    @NotNull(message = "Product is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Unit price must be positive")
    private BigDecimal unitPrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount must be positive")
    private BigDecimal discount;

    @DecimalMin(value = "0.0", inclusive = true, message = "GST % must be positive")
    @DecimalMax(value = "100.0", inclusive = true, message = "GST % cannot exceed 100")
    private BigDecimal gstPercentage;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getGstPercentage() { return gstPercentage; }
    public void setGstPercentage(BigDecimal gstPercentage) { this.gstPercentage = gstPercentage; }
}