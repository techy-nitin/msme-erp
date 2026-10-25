package MSME.MSME.notification;

import MSME.MSME.Client.ClientEntity;
import MSME.MSME.Client.ClientRepo;
import MSME.MSME.notification.EmailService;
import MSME.MSME.Invoice.InvoiceEntityy;
import MSME.MSME.Invoice.invoiceRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class NotificationScheduler {

    private final invoiceRepo invoiceRepository;
    private final ClientRepo clientRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public NotificationScheduler(
            invoiceRepo invoiceRepository,
            ClientRepo clientRepository,
            NotificationService notificationService,
            EmailService emailService
    ) {
        this.invoiceRepository = invoiceRepository;
        this.clientRepository = clientRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    /**
     * Every day at 9 AM
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkPendingInvoices() {

        List<InvoiceEntityy> overdueInvoices =
                invoiceRepository.findByStatusAndDueDateBefore(
                        "UNPAID",
                        LocalDate.now()
                );

        for (InvoiceEntityy invoice : overdueInvoices) {

            ClientEntity client =
                    clientRepository.findById(invoice.getCustomerId())
                            .orElse(null);

            if (client == null)
                continue;

            String title = "Payment Reminder";

            String message =
                    "Invoice "
                            + invoice.getInvoiceNumber()
                            + " is overdue. Amount ₹"
                            + invoice.getTotalAmount();

            notificationService.createNotification(
                    1L,
                    title,
                    message,
                    "PAYMENT"
            );

            emailService.sendPaymentReminder(
                    client.getEmail(),
                    client.getCustomerName(),
                    invoice
            );

        }

    }

}