package MSME.MSME.Products;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductRequest {

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "Product name is required")
    private String productName;

    private String description;

    private String hsnCode;

    private String unit;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be positive")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = true, message = "GST % must be positive")
    private BigDecimal gstPercentage;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockQuantity;

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHsnCode() { return hsnCode; }
    public void setHsnCode(String hsnCode) { this.hsnCode = hsnCode; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getGstPercentage() { return gstPercentage; }
    public void setGstPercentage(BigDecimal gstPercentage) { this.gstPercentage = gstPercentage; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
}