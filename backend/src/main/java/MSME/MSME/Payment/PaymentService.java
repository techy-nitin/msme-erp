package MSME.MSME.Payment;

import MSME.MSME.Invoice.InvoiceEntityy;
import MSME.MSME.Invoice.invoiceRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final invoiceRepo invoiceRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          invoiceRepo invoiceRepository) {

        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    // ============================================
    // CREATE PAYMENT
    // ============================================

    public PaymentResponse createPayment(PaymentRequest request) {

        InvoiceEntityy invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Invoice not found."));

        PaymentEntity payment = new PaymentEntity();

        payment.setInvoice(invoice);
        payment.setPaymentDate(request.getPaymentDate());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());
        payment.setTransactionReference(request.getTransactionReference());
        payment.setRemarks(request.getRemarks());

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            payment.setStatus("SUCCESS");
        } else {
            payment.setStatus(request.getStatus().toUpperCase());
        }

        payment = paymentRepository.save(payment);
        updateInvoiceStatus(invoice);
        return mapToResponse(payment);
    }

    // ============================================
    // GET ALL PAYMENTS
    // ============================================

    public List<PaymentResponse> getAllPayments() {

        List<PaymentEntity> payments = paymentRepository.findAll();

        List<PaymentResponse> responses = new ArrayList<>();

        for (PaymentEntity payment : payments) {

            responses.add(mapToResponse(payment));

        }

        return responses;
    }

    // ============================================
    // GET PAYMENT BY ID
    // ============================================

    public PaymentResponse getPaymentById(Long id) {

        PaymentEntity payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Payment not found."));

        return mapToResponse(payment);
    }
    // ============================================
    // UPDATE PAYMENT
    // ============================================

    public PaymentResponse updatePayment(Long id,
                                         PaymentRequest request) {

        PaymentEntity payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Payment not found."));

        InvoiceEntityy invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Invoice not found."));

        payment.setInvoice(invoice);
        payment.setPaymentDate(request.getPaymentDate());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());
        payment.setTransactionReference(request.getTransactionReference());
        payment.setStatus(request.getStatus());
        payment.setRemarks(request.getRemarks());

        payment = paymentRepository.save(payment);
        updateInvoiceStatus(invoice);
        return mapToResponse(payment);
    }

    // ============================================
    // DELETE PAYMENT
    // ============================================

    public void deletePayment(Long id) {

        PaymentEntity payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Payment not found."));

        InvoiceEntityy invoice = payment.getInvoice();

        paymentRepository.delete(payment);

        updateInvoiceStatus(invoice);
    }

    // ============================================
    // GET PAYMENTS BY INVOICE
    // ============================================

    public List<PaymentResponse> getPaymentsByInvoice(Long invoiceId) {

        InvoiceEntityy invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Invoice not found."));

        List<PaymentEntity> payments =
                paymentRepository.findByInvoice(invoice);

        List<PaymentResponse> responses = new ArrayList<>();

        for (PaymentEntity payment : payments) {

            responses.add(mapToResponse(payment));

        }

        return responses;
    }

    // ============================================
    // GET PAYMENTS BY STATUS
    // ============================================

    public List<PaymentResponse> getPaymentsByStatus(String status) {

        List<PaymentEntity> payments =
                paymentRepository.findByStatus(status);

        List<PaymentResponse> responses = new ArrayList<>();

        for (PaymentEntity payment : payments) {

            responses.add(mapToResponse(payment));

        }

        return responses;
    }

    // ============================================
    // MAP ENTITY TO RESPONSE
    // ============================================

    private PaymentResponse mapToResponse(PaymentEntity payment) {

        PaymentResponse response = new PaymentResponse();

        response.setId(payment.getId());

        if (payment.getInvoice() != null) {
            response.setInvoiceId(payment.getInvoice().getId());
        }

        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setAmount(payment.getAmount());
        response.setTransactionReference(payment.getTransactionReference());
        response.setStatus(payment.getStatus());
        response.setRemarks(payment.getRemarks());
        response.setCreatedAt(payment.getCreatedAt());

        return response;
    }
    private void updateInvoiceStatus(InvoiceEntityy invoice) {

         BigDecimal totalPaid =
                paymentRepository.getTotalPaidForInvoice(invoice);

        BigDecimal invoiceTotal = invoice.getTotalAmount();

        if (totalPaid.compareTo(invoiceTotal) >= 0) {

            invoice.setStatus("PAID");

        } else if (invoice.getDueDate() != null &&
                invoice.getDueDate().isBefore(LocalDate.now())) {

            invoice.setStatus("OVERDUE");

        } else {

            invoice.setStatus("UNPAID");
        }

        invoiceRepository.save(invoice);
    }
}