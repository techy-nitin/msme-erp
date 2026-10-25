package MSME.MSME.Document;

import MSME.MSME.PDF.PdfService;
import MSME.MSME.PDF.returnPDF;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {

    private final PdfService pdfService;
    private final returnPDF returnPDF;

    public DocumentService(PdfService pdfService,
                           returnPDF returnPDF) {
        this.pdfService = pdfService;
        this.returnPDF = returnPDF;
    }

    public Resource downloadInvoicePdf(Long invoiceId)
            throws Exception {

        String filePath = pdfService.generateInvoice(invoiceId);

        return returnPDF.download(filePath);
    }

    public Resource downloadQuotationPdf(Long quotationId)
            throws Exception {

        String filePath = pdfService.generateQuotation(quotationId);

        return returnPDF.download(filePath);
    }

}