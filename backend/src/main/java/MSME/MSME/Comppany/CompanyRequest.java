package MSME.MSME.Comppany;

import jakarta.validation.constraints.*;

public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name must be under 150 characters")
    private String companyName;

    @NotBlank(message = "Owner name is required")
    @Size(max = 100, message = "Owner name must be under 100 characters")
    private String ownerName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian phone number")
    private String phone;

    @Pattern(
            regexp = "^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "Enter a valid GST number"
    )
    private String gstNumber;

    @Pattern(
            regexp = "^[A-Z]{5}\\d{4}[A-Z]{1}$",
            message = "Enter a valid PAN number"
    )
    private String panNumber;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must be under 500 characters")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^\\d{6}$", message = "Enter a valid 6-digit pincode")
    private String pincode;

    private String logo; // optional

    @NotBlank(message = "Bank name is required")
    private String bankName;

    @NotBlank(message = "Account holder name is required")
    private String accountHolderName;

    @NotBlank(message = "Account number is required")
    @Pattern(regexp = "^\\d{9,18}$", message = "Enter a valid account number (9-18 digits)")
    private String accountNumber;

    @NotBlank(message = "IFSC code is required")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Enter a valid IFSC code")
    private String ifsc;

    @NotBlank(message = "Branch name is required")
    private String branchName;

    @Pattern(
            regexp = "^[\\w.\\-]{2,256}@[a-zA-Z]{2,64}$",
            message = "Enter a valid UPI ID"
    )
    private String upiId; // optional, but validated if provided

    @NotBlank(message = "Invoice prefix is required")
    @Size(max = 10, message = "Invoice prefix must be under 10 characters")
    private String invoicePrefix;

    @NotBlank(message = "Currency is required")
    private String currency;

    @NotBlank(message = "Financial year is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}$", message = "Financial year must be in format YYYY-YY, e.g. 2026-27")
    private String financialYear;

    // ===== Getters & Setters =====

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getIfsc() { return ifsc; }
    public void setIfsc(String ifsc) { this.ifsc = ifsc; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public String getInvoicePrefix() { return invoicePrefix; }
    public void setInvoicePrefix(String invoicePrefix) { this.invoicePrefix = invoicePrefix; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }
}