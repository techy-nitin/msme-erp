package MSME.MSME.Comppany;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // ==========================
    // CREATE COMPANY
    // ==========================

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CompanyRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(companyService.createCompany(token, request));
    }

    // ==========================
    // GET MY COMPANY
    // ==========================

    @GetMapping("/me")
    public ResponseEntity<CompanyResponse> getMyCompany(
            @RequestHeader("Authorization") String token) {

        return ResponseEntity.ok(
                companyService.getMyCompany(token));
    }

    // ==========================
    // UPDATE MY COMPANY
    // ==========================

    @PutMapping("/me")
    public ResponseEntity<CompanyResponse> updateCompany(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CompanyRequest request) {

        return ResponseEntity.ok(
                companyService.updateCompany(token, request));
    }

    // ==========================
    // DELETE MY COMPANY
    // ==========================

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteCompany(
            @RequestHeader("Authorization") String token) {

        companyService.deleteCompany(token);

        return ResponseEntity.ok("Company deleted successfully.");
    }
}