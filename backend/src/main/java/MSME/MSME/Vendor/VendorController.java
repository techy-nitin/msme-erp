package MSME.MSME.Vendor;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "http://localhost:5173")
public class VendorController {

    private final VendorService vendorService;

    // Manual Constructor
    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @PostMapping
    public ResponseEntity<VendorResponse> createVendor(
            @Valid @RequestBody VendorRequest request) {

        return new ResponseEntity<>(
                vendorService.createVendor(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<VendorResponse>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorResponse> getVendorById(
            @PathVariable Long id) {

        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorResponse> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request) {

        return ResponseEntity.ok(
                vendorService.updateVendor(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVendor(
            @PathVariable Long id) {

        vendorService.deleteVendor(id);
        return ResponseEntity.ok("Vendor deleted successfully.");
    }
}