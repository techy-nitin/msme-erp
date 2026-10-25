package MSME.MSME.Vendor;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class VendorService {

    private final VendorRepo vendorRepository;
    public VendorService(VendorRepo vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    public VendorResponse createVendor(VendorRequest request) {

        if (request.getEmail() != null && vendorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPhone() != null && vendorRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        if (request.getGstNumber() != null && vendorRepository.existsByGstNumber(request.getGstNumber())) {
            throw new RuntimeException("GST Number already exists");
        }

        VendorEntity vendor = new VendorEntity();

        vendor.setVendorName(request.getVendorName());
        vendor.setCompanyName(request.getCompanyName());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setGstNumber(request.getGstNumber());
        vendor.setAddress(request.getAddress());
        vendor.setCity(request.getCity());
        vendor.setState(request.getState());
        vendor.setCountry(request.getCountry());
        vendor.setPincode(request.getPincode());
        vendor = vendorRepository.save(vendor);

        return mapToResponse(vendor);
    }

    public VendorResponse updateVendor(Long id, VendorRequest request) {

        VendorEntity vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found"));

        vendor.setVendorName(request.getVendorName());
        vendor.setCompanyName(request.getCompanyName());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setGstNumber(request.getGstNumber());
        vendor.setAddress(request.getAddress());
        vendor.setCity(request.getCity());
        vendor.setState(request.getState());
        vendor.setCountry(request.getCountry());
        vendor.setPincode(request.getPincode());

        vendor = vendorRepository.save(vendor);

        return mapToResponse(vendor);
    }

    public VendorResponse getVendorById(Long id) {

        VendorEntity vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found"));

        return mapToResponse(vendor);
    }

    public List<VendorResponse> getAllVendors() {

        return vendorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteVendor(Long id) {

        VendorEntity vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found"));

        vendorRepository.delete(vendor);
    }

    private VendorResponse mapToResponse(VendorEntity vendor) {

         VendorResponse response = new VendorResponse();

        response.setId(vendor.getId());
        response.setVendorName(vendor.getVendorName());
        response.setCompanyName(vendor.getCompanyName());
        response.setEmail(vendor.getEmail());
        response.setPhone(vendor.getPhone());
        response.setGstNumber(vendor.getGstNumber());
        response.setAddress(vendor.getAddress());
        response.setCity(vendor.getCity());
        response.setState(vendor.getState());
        response.setCountry(vendor.getCountry());
        response.setPincode(vendor.getPincode());
        response.setCreatedAt(vendor.getCreatedAt());
        response.setUpdatedAt(vendor.getUpdatedAt());

        return response;
    }
}