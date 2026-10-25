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

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class QuotationWhatsappService {

    private final QuotationRepository quotationRepository;
    private final ClientRepo clientRepo;
    private final NotificationService notificationService;
    private final UserRepo userRepo;

    public QuotationWhatsappService(
            QuotationRepository quotationRepository,
            ClientRepo clientRepo,
            NotificationService notificationService,
            UserRepo userRepo) {

        this.quotationRepository = quotationRepository;
        this.clientRepo = clientRepo;
        this.notificationService = notificationService;
        this.userRepo = userRepo;
    }

    public String generateWhatsappUrl(Long quotationId) {

        QEntity quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        ClientEntity client = clientRepo.findById(quotation.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        String phone = client.getPhone();

        phone = phone.replaceAll("\\D", "");

        if (!phone.startsWith("91")) {
            phone = "91" + phone;
        }

        String message =
                "Hello " + client.getCustomerName() + ",\n\n" +
                        "Your quotation has been generated.\n" +
                        "Quotation No: " + quotation.getQuotationNumber() + "\n" +
                        "Amount: ₹" + quotation.getTotalAmount() + "\n\n" +
                        "Thank you.";

        String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);

        // Get logged-in user from JWT
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Save notification
        notificationService.createNotification(
                user.getId(),
                "Quotation Shared",
                "Quotation " + quotation.getQuotationNumber()
                        + " has been shared with "
                        + client.getCustomerName()
                        + " via WhatsApp.",
                NotificationType.QUOTATION_SENT.name()
        );

        return "https://wa.me/" + phone + "?text=" + encoded;
    }
}