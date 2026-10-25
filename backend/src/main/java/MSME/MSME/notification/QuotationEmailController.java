package MSME.MSME.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotation-email")
@CrossOrigin(origins = "*")
public class QuotationEmailController {

    private final QuotationEmailService quotationEmailService;
    private final QuotationWhatsappService quotationWhatsappService;
    public QuotationEmailController(
            QuotationEmailService quotationEmailService ,  QuotationWhatsappService quotationWhatsappService) {

        this.quotationEmailService = quotationEmailService;
        this.quotationWhatsappService = quotationWhatsappService;
    }

    // ==========================================
    // Send quotation to client email
    // ==========================================

    @PostMapping("/send/{quotationId}")
    public ResponseEntity<String> sendQuotation(
            @PathVariable Long quotationId) {

        quotationEmailService.sendQuotation(quotationId);

        return ResponseEntity.ok(
                "Quotation sent successfully."
        );
    }
    @PostMapping("/{id}/whatsapp")
    public ResponseEntity<WhatsappResponse> sendWhatsapp(
            @PathVariable Long id) {

        String url = quotationWhatsappService.generateWhatsappUrl(id);

        return ResponseEntity.ok(new WhatsappResponse(url));
    }
}