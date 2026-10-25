package MSME.MSME.notification;

import MSME.MSME.Invoice.InvoiceEntityy;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import MSME.MSME.PDF.PdfService;
import MSME.MSME.PDF.PdfService;
import MSME.MSME.Quotations.QEntity;

import java.io.File;
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;
    private final PdfService pdfService;
    public EmailService(JavaMailSender mailSender,
                        EmailLogRepository emailLogRepository , PdfService pdfService) {

        this.mailSender = mailSender;
        this.emailLogRepository = emailLogRepository;
        this.pdfService = pdfService;
    }

    // ==========================================================
    // Generic Email Sender
    // ==========================================================
    private void sendEmail(String recipient,
                           String subject,
                           String htmlBody,
                           InvoiceEntityy invoice,
                           QEntity quotation) {

        EmailLogEntity log = new EmailLogEntity();

        log.setRecipientEmail(recipient);
        log.setSubject(subject);
        log.setInvoice(invoice);

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            // ===========================
            // Attach Invoice PDF
            // ===========================

            if (invoice != null) {

                String pdf =
                        pdfService.generateInvoice(invoice.getId());

                helper.addAttachment(
                        invoice.getInvoiceNumber() + ".pdf",
                        new File(pdf)
                );
            }

            // ===========================
            // Attach Quotation PDF
            // ===========================

            if (quotation != null) {

                String pdf =
                        pdfService.generateQuotation(quotation.getId());

                helper.addAttachment(
                        quotation.getQuotationNumber() + ".pdf",
                        new File(pdf)
                );
            }

            mailSender.send(message);

            log.setStatus("SENT");

        } catch (Exception e) {

            log.setStatus("FAILED");

            throw new RuntimeException("Unable to send email", e);

        } finally {

            emailLogRepository.save(log);

        }
    }
    // ==========================================================
    // Invoice Email
    // ==========================================================

    public void sendInvoiceEmail(String customerEmail,
                                 String customerName,
                                 InvoiceEntityy invoice) {

        String body = """
                <html>
                <body>

                <h2>Invoice Generated</h2>

                <p>Hello %s,</p>

                <p>Your invoice has been generated successfully.</p>

                <table border='1' cellpadding='8' cellspacing='0'>

                    <tr>
                        <td>Invoice Number</td>
                        <td>%s</td>
                    </tr>

                    <tr>
                        <td>Total Amount</td>
                        <td>₹ %s</td>
                    </tr>

                    <tr>
                        <td>Due Date</td>
                        <td>%s</td>
                    </tr>

                </table>

                <br>

                <p>Thank you.</p>

                </body>
                </html>
                """.formatted(
                customerName,
                invoice.getInvoiceNumber(),
                invoice.getTotalAmount(),
                invoice.getDueDate()
        );

        sendEmail(
                customerEmail,
                "Invoice " + invoice.getInvoiceNumber(),
                body,
                invoice,
                null
        );

    }

    // ==========================================================
    // Payment Reminder
    // ==========================================================

    public void sendPaymentReminder(String customerEmail,
                                    String customerName,
                                    InvoiceEntityy invoice) {

        String body = """
                <html>
                <body>

                <h2>Payment Reminder</h2>

                <p>Dear %s,</p>

                <p>Your payment is pending.</p>

                <p>

                Invoice Number :
                <b>%s</b>

                </p>

                <p>

                Amount :
                <b>₹ %s</b>

                </p>

                <p>

                Due Date :
                <b>%s</b>

                </p>

                <br>

                Please make the payment as soon as possible.

                </body>
                </html>
                """.formatted(
                customerName,
                invoice.getInvoiceNumber(),
                invoice.getTotalAmount(),
                invoice.getDueDate()
        );

        sendEmail(
                customerEmail,
                "Payment Reminder",
                body,
                invoice,
                null
        );

    }

    // ==========================================================
    // Quotation Email
    // ==========================================================

    // ==========================================================
// Quotation Email
// ==========================================================

    public void sendQuotationEmail(String customerEmail,
                                   String customerName,
                                   QEntity quotation,
                                   String htmlBody) {

        sendEmail(
                customerEmail,
                "Quotation " + quotation.getQuotationNumber(),
                htmlBody,
                null,
                quotation
        );
    }

    // ==========================================================
    // Custom Email
    // ==========================================================

    public void sendCustomEmail(String recipient,
                                String subject,
                                String html) {

        sendEmail(
                recipient,
                subject,
                html,
                null,
                null
        );

    }

}