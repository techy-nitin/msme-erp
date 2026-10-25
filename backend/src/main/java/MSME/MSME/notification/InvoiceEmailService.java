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

@Service
public class InvoiceEmailService {

    private final invoiceRepo invoiceRepository;
    private final ClientRepo clientRepo;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final UserRepo userRepo;

    public InvoiceEmailService(
            invoiceRepo invoiceRepository,
            ClientRepo clientRepo,
            EmailService emailService,
            NotificationService notificationService,
            UserRepo userRepo) {

        this.invoiceRepository = invoiceRepository;
        this.clientRepo = clientRepo;
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.userRepo = userRepo;
    }

    public void sendInvoice(Long invoiceId) {

        InvoiceEntityy invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        ClientEntity client = clientRepo.findById(invoice.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        emailService.sendInvoiceEmail(
                client.getEmail(),
                client.getCustomerName(),
                invoice
        );

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserEntity user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationService.createNotification(
                user.getId(),
                "Invoice Sent",
                "Invoice "
                        + invoice.getInvoiceNumber()
                        + " emailed to "
                        + client.getCustomerName(),
                NotificationType.INVOICE_SENT.name()        );
    }
}