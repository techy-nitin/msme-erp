package MSME.MSME.DashBoard;

import MSME.MSME.Client.ClientRepo;
import MSME.MSME.Employee.EmployeeRepo;
import MSME.MSME.Invoice.InvoiceEntityy;
import MSME.MSME.Invoice.invoiceRepo;
import MSME.MSME.Payment.PaymentRepository;
import MSME.MSME.Quotations.QuotationRepository;
import org.springframework.stereotype.Service;
import MSME.MSME.Invoice.InvoiceResponse;

import java.util.List;

@Service
public class DashLogic {
    private final ClientRepo clientRepository;
    private final EmployeeRepo employeeRepository;
    private final invoiceRepo invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final QuotationRepository quotationRepository;

    public DashLogic(ClientRepo clientRepository,
                     EmployeeRepo employeeRepository,
                     invoiceRepo invoiceRepository,
                     PaymentRepository paymentRepository,
                     QuotationRepository quotationRepository) {

        this.clientRepository = clientRepository;
        this.employeeRepository = employeeRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.quotationRepository = quotationRepository;
    }
    public DashboardResponse getDashboard() {

        DashboardResponse dto = new DashboardResponse();

        dto.setTotalClients(clientRepository.count());

        dto.setTotalEmployees(employeeRepository.count());

        dto.setTotalInvoices(invoiceRepository.count());

        dto.setPendingQuotations(
                quotationRepository.countByStatus("PENDING"));

        dto.setTotalRevenue(
                invoiceRepository.getTotalRevenue());

        dto.setOutstandingPayments(
                invoiceRepository.getOutstandingAmount());

        dto.setPendingPayments(
                paymentRepository.getPendingPayments());

        List<InvoiceEntityy> invoices =
                invoiceRepository.findTop5ByOrderByInvoiceDateDesc();

        dto.setRecentInvoices(
                invoices.stream()
                        .map(this::convertToResponse)
                        .toList()
        );

        return dto;
    }
    private InvoiceResponse convertToResponse(InvoiceEntityy invoice) {

        InvoiceResponse r = new InvoiceResponse();

        r.setId(invoice.getId());
        r.setInvoiceNumber(invoice.getInvoiceNumber());
        r.setCustomerId(invoice.getCustomerId());
        r.setInvoiceDate(invoice.getInvoiceDate());
        r.setDueDate(invoice.getDueDate());
        r.setTotalAmount(invoice.getTotalAmount());
        r.setStatus(invoice.getStatus());

        return r;
    }
}
