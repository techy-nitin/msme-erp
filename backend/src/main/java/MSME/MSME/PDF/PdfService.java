package MSME.MSME.PDF;

import MSME.MSME.Client.ClientEntity;
import MSME.MSME.Comppany.CompanyEntity;
import MSME.MSME.Invoice.InvoiceEntityy;
import MSME.MSME.Quotations.QEntity;
import MSME.MSME.Quotations.QuotationRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import MSME.MSME.Invoice.invoiceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PdfService {
    private final invoiceRepo invoiceRepo;
    private final QuotationRepository quotationRepo;
    private final fetchCompanySettings companyService;
    private final fetchClient clientService;
    private final fetchItems itemsService;
    private final HeaderGenerator headerGenerator;
    private final TableGenerator tableGenerator;
    private final TotalGenerator totalGenerator;
    private final BankSection bankSection;
    private final QuotationSection quotationSection;
    private final savePDF savePDF;

    public PdfService(
            invoiceRepo invoiceRepo,
            QuotationRepository quotationRepo,
            fetchCompanySettings companyService,
            fetchClient clientService,
            fetchItems itemsService,
            HeaderGenerator headerGenerator,
            TableGenerator tableGenerator,
            TotalGenerator totalGenerator,
            BankSection bankSection,
            QuotationSection quotationSection,
            savePDF savePDF) {

        this.invoiceRepo = invoiceRepo;
        this.quotationRepo = quotationRepo;
        this.companyService = companyService;
        this.clientService = clientService;
        this.itemsService = itemsService;
        this.headerGenerator = headerGenerator;
        this.tableGenerator = tableGenerator;
        this.totalGenerator = totalGenerator;
        this.bankSection = bankSection;
        this.quotationSection = quotationSection;
        this.savePDF = savePDF;
    }

    /**
     * Generate Invoice PDF
     */
    public String generateInvoice(Long invoiceId) throws Exception {

        InvoiceEntityy invoice = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        CompanyEntity company =
                companyService.getCompany();

        ClientEntity client =
                clientService.getClient(invoice.getCustomerId());

        PDDocument document = new PDDocument();

        PDPage page = new PDPage();

        document.addPage(page);

        headerGenerator.draw(document, page, company, client, invoice);

        tableGenerator.drawInvoiceTable(
                document,
                page,
                itemsService.getInvoiceItems(invoice)
        );

        totalGenerator.drawInvoiceTotal(
                document,
                page,
                invoice
        );

        bankSection.draw(
                document,
                page,
                company
        );

        String filePath =
                savePDF.save(document,
                        invoice.getInvoiceNumber() + ".pdf");

        document.close();

        return filePath;
    }

    /**
     * Generate Quotation PDF
     */
    public String generateQuotation(Long quotationId) throws Exception {
        QEntity quotation = quotationRepo.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        CompanyEntity company =
                companyService.getCompany();

        ClientEntity client =
                clientService.getClient(
                        quotation.getCustomerId());

        PDDocument document = new PDDocument();

        PDPage page = new PDPage();

        document.addPage(page);

        headerGenerator.drawQuotation(
                document,
                page,
                company,
                client,
                quotation
        );

        tableGenerator.drawQuotationTable(
                document,
                page,
                itemsService.getQuotationItems(quotation)
        );

        totalGenerator.drawQuotationTotal(
                document,
                page,
                quotation
        );

        quotationSection.draw(
                document,
                page,
                quotation
        );

        String filePath =
                savePDF.save(
                        document,
                        quotation.getQuotationNumber() + ".pdf"
                );

        document.close();

        return filePath;
    }

}