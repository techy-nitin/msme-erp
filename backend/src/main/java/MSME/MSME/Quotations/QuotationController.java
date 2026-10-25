package MSME.MSME.Quotations;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "*")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    // ============================================
    // CREATE QUOTATION
    // ============================================

    @PostMapping
    public ResponseEntity<QuotationResponse> createQuotation(
            @RequestBody QuotationRequest request) {
        System.out.println("POST /api/quotations reached");

        QuotationResponse response = quotationService.createQuotation(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ============================================
    // GET ALL QUOTATIONS
    // ============================================

    @GetMapping
    public ResponseEntity<List<QuotationResponse>> getAllQuotations() {

        List<QuotationResponse> quotations =
                quotationService.getAllQuotations();

        return ResponseEntity.ok(quotations);
    }

    // ============================================
    // GET QUOTATION BY ID
    // ============================================

    @GetMapping("/{id}")
    public ResponseEntity<QuotationResponse> getQuotationById(
            @PathVariable Long id) {

        QuotationResponse quotation =
                quotationService.getQuotationById(id);

        return ResponseEntity.ok(quotation);
    }

    // ============================================
    // UPDATE QUOTATION
    // ============================================

    @PutMapping("/{id}")
    public ResponseEntity<QuotationResponse> updateQuotation(
            @PathVariable Long id,
            @RequestBody QuotationRequest request) {

        QuotationResponse quotation =
                quotationService.updateQuotation(id, request);

        return ResponseEntity.ok(quotation);
    }

    // ============================================
    // DELETE QUOTATION
    // ============================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuotation(
            @PathVariable Long id) {

        quotationService.deleteQuotation(id);

        return ResponseEntity.ok("Quotation deleted successfully.");
    }

}