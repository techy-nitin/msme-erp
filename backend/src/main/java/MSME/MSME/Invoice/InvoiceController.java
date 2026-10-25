package MSME.MSME.Invoice;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import MSME.MSME.notification.InvoiceEmailService;
import MSME.MSME.notification.NotificationService;
import MSME.MSME.notification.InvoiceWhatsappService;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {
    private final InvoiceService invoiceService;
    private final InvoiceEmailService invoiceEmailService;
    private final InvoiceWhatsappService invoiceWhatsappService;

    public InvoiceController(
            InvoiceService invoiceService,
            InvoiceEmailService invoiceEmailService,
            InvoiceWhatsappService invoiceWhatsappService) {

        this.invoiceService = invoiceService;
        this.invoiceEmailService = invoiceEmailService;
        this.invoiceWhatsappService = invoiceWhatsappService;
    }
    // Create Invoice
    @PostMapping
    public ResponseEntity<InvoiceResponse> createInvoice(
            @Valid @RequestBody InvoiceRequest request) {

        InvoiceResponse response = invoiceService.createInvoice(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get All Invoices
    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices() {

        List<InvoiceResponse> invoices = invoiceService.getAllInvoices();

        return ResponseEntity.ok(invoices);
    }

    // Get Invoice By Id
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getInvoiceById(
            @PathVariable Long id) {

        InvoiceResponse response = invoiceService.getInvoiceById(id);

        return ResponseEntity.ok(response);
    }

    // Update Invoice
    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponse> updateInvoice(
            @PathVariable Long id,
            @Valid @RequestBody InvoiceRequest request) {

        InvoiceResponse response =
                invoiceService.updateInvoice(id, request);

        return ResponseEntity.ok(response);
    }

    // Delete Invoice
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInvoice(
            @PathVariable Long id) {

        invoiceService.deleteInvoice(id);

        return ResponseEntity.ok("Invoice deleted successfully.");
    }
    @PostMapping("/{id}/send-email")
    public ResponseEntity<String> sendInvoiceEmail(
            @PathVariable Long id) {

        invoiceEmailService.sendInvoice(id);

        return ResponseEntity.ok("Invoice email sent successfully.");
    }

    @PostMapping("/{id}/send-whatsapp")
    public ResponseEntity<String> sendInvoiceWhatsapp(@PathVariable Long id) {

        String url = invoiceWhatsappService.sendInvoice(id);

        return ResponseEntity.ok(url);
    }
}