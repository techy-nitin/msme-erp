package MSME.MSME.notification;

import MSME.MSME.Client.ClientEntity;
import MSME.MSME.Client.ClientRepo;
import MSME.MSME.Login.UserEntity;
import MSME.MSME.Login.UserRepo;
import MSME.MSME.Quotations.QEntity;
import MSME.MSME.Quotations.QuotationRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class QuotationEmailService {

    private final QuotationRepository quotationRepository;
    private final ClientRepo clientRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final UserRepo userRepo;

    public QuotationEmailService(
            QuotationRepository quotationRepository,
            ClientRepo clientRepository,
            EmailService emailService,
            NotificationService notificationService,
            UserRepo userRepo) {

        this.quotationRepository = quotationRepository;
        this.clientRepository = clientRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.userRepo = userRepo;
    }

    // ====================================================
    // Send Quotation Email
    // ====================================================

    public void sendQuotation(Long quotationId) {

        QEntity quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        ClientEntity client = clientRepository.findById(quotation.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        String html = buildQuotationHtml(client, quotation);

        emailService.sendQuotationEmail(
                client.getEmail(),
                client.getCustomerName(),
                quotation,
                html
        );

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationService.createNotification(
                user.getId(),
                "Quotation Sent",
                "Quotation " + quotation.getQuotationNumber()
                        + " has been emailed to "
                        + client.getCustomerName(),
                NotificationType.QUOTATION_SENT.name()
        );
    }

    // ====================================================
    // HTML Template
    // ====================================================

    private String buildQuotationHtml(ClientEntity client,
                                      QEntity quotation) {

        return """
                <html>
                <body style="font-family:Arial">

                <h2>Quotation</h2>

                <p>Dear %s,</p>

                <p>
                Thank you for your interest.
                Please find your quotation details below.
                </p>

                <table border="1" cellpadding="8" cellspacing="0">

                <tr>
                <td><b>Quotation No</b></td>
                <td>%s</td>
                </tr>

                <tr>
                <td><b>Date</b></td>
                <td>%s</td>
                </tr>

                <tr>
                <td><b>Total Amount</b></td>
                <td>₹ %s</td>
                </tr>

                </table>

                <br>

                Regards,<br>
                Your Company

                </body>
                </html>
                """.formatted(
                client.getCustomerName(),
                quotation.getQuotationNumber(),
                quotation.getQuotationDate(),
                quotation.getTotalAmount()
        );
    }
}