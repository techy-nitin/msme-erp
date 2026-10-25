package MSME.MSME.Vendor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


public class VendorRequest {
    @NotBlank(message = "Vendor name is required")
    private String vendorName;

    private String companyName;

    @Email(message = "Invalid email")
    private String email;

    private String phone;

    public @NotBlank(message = "Vendor name is required") String getVendorName() {
        return vendorName;
    }

    public void setVendorName(@NotBlank(message = "Vendor name is required") String vendorName) {
        this.vendorName = vendorName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public @Email(message = "Invalid email") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Invalid email") String email) {
        this.email = email;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    private String gstNumber;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;
}
