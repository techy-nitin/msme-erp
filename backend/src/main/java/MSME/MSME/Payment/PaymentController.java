package MSME.MSME.Payment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ============================================
    // CREATE PAYMENT
    // ============================================

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentRequest request) {

        PaymentResponse response = paymentService.createPayment(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ============================================
    // GET ALL PAYMENTS
    // ============================================

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {

        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // ============================================
    // GET PAYMENT BY ID
    // ============================================

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    // ============================================
    // UPDATE PAYMENT
    // ============================================

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.updatePayment(id, request));
    }

    // ============================================
    // DELETE PAYMENT
    // ============================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(
            @PathVariable Long id) {

        paymentService.deletePayment(id);

        return ResponseEntity.ok("Payment deleted successfully.");
    }

    // ============================================
    // GET PAYMENTS BY INVOICE
    // ============================================

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByInvoice(
            @PathVariable Long invoiceId) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByInvoice(invoiceId));
    }

    // ============================================
    // GET PAYMENTS BY STATUS
    // ============================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByStatus(status));
    }

}