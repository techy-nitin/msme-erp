package MSME.MSME.Client;

import jakarta.validation.constraints.*;

public class ClientRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 150, message = "Customer name must be under 150 characters")
    private String customerName;

    @Size(max = 150, message = "Company name must be under 150 characters")
    private String companyName;

    @Email(message = "Enter a valid email address")
    private String email;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian phone number")
    private String phone;

    @Pattern(
            regexp = "^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "Enter a valid GST number"
    )
    private String gstNumber;

    private String address;

    private String city;

    private String state;

    private String country;

    @Pattern(regexp = "^\\d{6}$", message = "Enter a valid 6-digit pincode")
    private String pincode;

    // ===== Getters & Setters =====

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }

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
}