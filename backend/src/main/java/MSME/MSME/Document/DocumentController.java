package MSME.MSME.Document;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<Resource> downloadInvoicePdf(
            @PathVariable Long invoiceId
    ) throws Exception {

        Resource resource = documentService.downloadInvoicePdf(invoiceId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"Invoice_" + invoiceId + ".pdf\""
                )
                .body(resource);
    }

    @GetMapping("/quotation/{quotationId}")
    public ResponseEntity<Resource> downloadQuotationPdf(
            @PathVariable Long quotationId
    ) throws Exception {

        Resource resource = documentService.downloadQuotationPdf(quotationId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"Quotation_" + quotationId + ".pdf\""
                )
                .body(resource);
    }

}