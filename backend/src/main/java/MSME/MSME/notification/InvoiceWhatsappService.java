package MSME.MSME.notification;

import MSME.MSME.Client.ClientEntity;
import MSME.MSME.Client.ClientRepo;
import MSME.MSME.Invoice.InvoiceEntityy;
import MSME.MSME.Invoice.invoiceRepo;
import MSME.MSME.Login.UserEntity;
import MSME.MSME.Login.UserRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class InvoiceWhatsappService {

    private final invoiceRepo invoiceRepository;
    private final ClientRepo clientRepo;
    private final NotificationService notificationService;
    private final UserRepo userRepo;

    public InvoiceWhatsappService(
            invoiceRepo invoiceRepository,
            ClientRepo clientRepo,
            NotificationService notificationService,
            UserRepo userRepo) {

        this.invoiceRepository = invoiceRepository;
        this.clientRepo = clientRepo;
        this.notificationService = notificationService;
        this.userRepo = userRepo;
    }

    public String sendInvoice(Long invoiceId) {

        InvoiceEntityy invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        ClientEntity client = clientRepo.findById(invoice.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        String phone = client.getPhone();

        String message = String.format(
                "Hello %s,%n%n" +
                        "Your invoice has been generated.%n%n" +
                        "Invoice No: %s%n" +
                        "Amount: ₹%s%n" +
                        "Due Date: %s%n%n" +
                        "Thank you.",
                client.getCustomerName(),
                invoice.getInvoiceNumber(),
                invoice.getTotalAmount(),
                invoice.getDueDate()
        );

        String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserEntity user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationService.createNotification(
                user.getId(),
                "Invoice WhatsApp",
                "Invoice " + invoice.getInvoiceNumber()
                        + " shared on WhatsApp with "
                        + client.getCustomerName(),
                NotificationType.INVOICE_WHATSAPP_SENT.name()
        );

        return "https://wa.me/91" + phone + "?text=" + encoded;
    }
}