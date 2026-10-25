package MSME.MSME.Invoice;

import org.springframework.stereotype.Service;
import MSME.MSME.Login.UserEntity;
import MSME.MSME.Login.UserRepo;
import MSME.MSME.notification.NotificationService;
import MSME.MSME.notification.NotificationType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import java.util.stream.Collectors;
@Service
public class InvoiceService {

    private final invoiceRepo invoiceRepository;
    private final InvoiceItemRepo invoiceItemRepository;

    private final NotificationService notificationService;
    private final UserRepo userRepo;
    public InvoiceService(invoiceRepo invoiceRepository,
                          InvoiceItemRepo invoiceItemRepository,
                          NotificationService notificationService,
                          UserRepo userRepo) {

        this.invoiceRepository = invoiceRepository;
        this.invoiceItemRepository = invoiceItemRepository;
        this.notificationService = notificationService;
        this.userRepo = userRepo;
    }

    public InvoiceResponse createInvoice(InvoiceRequest request) {

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalGST = BigDecimal.ZERO;

        InvoiceEntityy invoice = new InvoiceEntityy();

        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setCustomerId(request.getCustomerId());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setNotes(request.getNotes());

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            invoice.setStatus("UNPAID");
        } else {
            invoice.setStatus(request.getStatus());
        }

        // Seed the NOT NULL numeric columns before the first insert. The real
        // values are computed from the items below and written on the second
        // save() at the end of this method — without this, the first insert
        // tries to write NULL into subtotal/total_amount and Postgres rejects
        // it with a not-null constraint violation.
        invoice.setSubtotal(BigDecimal.ZERO);
        invoice.setDiscount(BigDecimal.ZERO);
        invoice.setGstAmount(BigDecimal.ZERO);
        invoice.setTotalAmount(BigDecimal.ZERO);

        invoice = invoiceRepository.save(invoice);
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {

            UserEntity user = userRepo.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            notificationService.createNotification(
                    user.getId(),
                    "Invoice Created",
                    "Invoice " + invoice.getInvoiceNumber() + " created successfully.",
                    NotificationType.INVOICE_CREATED.name()
            );
        }
        List<InvoiceItems> invoiceItems = new ArrayList<>();
        List<InvoiceItemResponse> itemResponses = new ArrayList<>();

        for (InvoiceItemRequest itemRequest : request.getItems()) {

            BigDecimal quantity = BigDecimal.valueOf(itemRequest.getQuantity());

            BigDecimal price = itemRequest.getUnitPrice();

            BigDecimal discount =
                    itemRequest.getDiscount() == null
                            ? BigDecimal.ZERO
                            : itemRequest.getDiscount();

            BigDecimal gst =
                    itemRequest.getGstPercentage() == null
                            ? BigDecimal.ZERO
                            : itemRequest.getGstPercentage();

            BigDecimal amount = price.multiply(quantity);
            amount = amount.subtract(discount);

            BigDecimal gstAmount =
                    amount.multiply(gst)
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            BigDecimal total = amount.add(gstAmount);

            subtotal = subtotal.add(amount);
            totalGST = totalGST.add(gstAmount);

            InvoiceItems invoiceItem = new InvoiceItems();

            invoiceItem.setInvoice(invoice);
            invoiceItem.setProductId(itemRequest.getProductId());
            invoiceItem.setQuantity(itemRequest.getQuantity());
            invoiceItem.setUnitPrice(price);
            invoiceItem.setGstPercentage(gst);
            invoiceItem.setDiscount(discount);
            invoiceItem.setTotal(total);

            invoiceItem = invoiceItemRepository.save(invoiceItem);

            invoiceItems.add(invoiceItem);

            InvoiceItemResponse response = new InvoiceItemResponse();

            response.setId(invoiceItem.getId());
            response.setProductId(invoiceItem.getProductId());
            response.setQuantity(invoiceItem.getQuantity());
            response.setUnitPrice(invoiceItem.getUnitPrice());
            response.setGstPercentage(invoiceItem.getGstPercentage());
            response.setDiscount(invoiceItem.getDiscount());
            response.setTotal(invoiceItem.getTotal());

            itemResponses.add(response);
        }

        invoice.setItems(invoiceItems);
        invoice.setSubtotal(subtotal);
        invoice.setDiscount(BigDecimal.ZERO);
        invoice.setGstAmount(totalGST);
        invoice.setTotalAmount(subtotal.add(totalGST));

        invoice = invoiceRepository.save(invoice);

        InvoiceResponse response = new InvoiceResponse();

        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setCustomerId(invoice.getCustomerId());
        response.setInvoiceDate(invoice.getInvoiceDate());
        response.setDueDate(invoice.getDueDate());
        response.setSubtotal(invoice.getSubtotal());
        response.setDiscount(invoice.getDiscount());
        response.setGstAmount(invoice.getGstAmount());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setStatus(invoice.getStatus());
        response.setNotes(invoice.getNotes());
        response.setItems(itemResponses);

        return response;
    }
    private String generateInvoiceNumber() {

        long count = invoiceRepository.count() + 1;

        return "INV-" +
                Year.now().getValue() +
                "-" +
                String.format("%05d", count);
    }
    public List<InvoiceResponse> getAllInvoices() {

        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }
    public InvoiceResponse getInvoiceById(Long id) {

        InvoiceEntityy invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Invoice not found"));

        return mapToResponse(invoice);

    }
    public InvoiceResponse updateInvoice(Long id,
                                         InvoiceRequest request) {

        InvoiceEntityy invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Invoice not found"));

        invoice.setCustomerId(request.getCustomerId());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setStatus(request.getStatus());
        invoice.setNotes(request.getNotes());

        invoiceItemRepository.deleteAll(invoice.getItems());

        invoice.getItems().clear();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal gstTotal = BigDecimal.ZERO;

        List<InvoiceItems> items = new ArrayList<>();

        for (InvoiceItemRequest itemRequest : request.getItems()) {

            BigDecimal quantity = BigDecimal.valueOf(itemRequest.getQuantity());

            BigDecimal price = itemRequest.getUnitPrice();

            BigDecimal discount = itemRequest.getDiscount() == null
                    ? BigDecimal.ZERO
                    : itemRequest.getDiscount();

            BigDecimal gst = itemRequest.getGstPercentage() == null
                    ? BigDecimal.ZERO
                    : itemRequest.getGstPercentage();

            BigDecimal amount = price.multiply(quantity).subtract(discount);

            BigDecimal gstAmount = amount.multiply(gst)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            BigDecimal total = amount.add(gstAmount);

            subtotal = subtotal.add(amount);
            gstTotal = gstTotal.add(gstAmount);

            InvoiceItems item = new InvoiceItems();

            item.setInvoice(invoice);
            item.setProductId(itemRequest.getProductId());
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(price);
            item.setDiscount(discount);
            item.setGstPercentage(gst);
            item.setTotal(total);

            item = invoiceItemRepository.save(item);

            items.add(item);
        }

        invoice.setItems(items);
        invoice.setSubtotal(subtotal);
        invoice.setDiscount(BigDecimal.ZERO);
        invoice.setGstAmount(gstTotal);
        invoice.setTotalAmount(subtotal.add(gstTotal));

        invoiceRepository.save(invoice);

        return mapToResponse(invoice);

    }
    public void deleteInvoice(Long id) {

        InvoiceEntityy invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Invoice not found"));

        invoiceRepository.delete(invoice);

    }
    private InvoiceResponse mapToResponse(InvoiceEntityy invoice) {

        List<InvoiceItemResponse> itemResponses = invoice.getItems()
                .stream()
                .map(item -> {

                    InvoiceItemResponse response = new InvoiceItemResponse();

                    response.setId(item.getId());
                    response.setProductId(item.getProductId());
                    response.setQuantity(item.getQuantity());
                    response.setUnitPrice(item.getUnitPrice());
                    response.setDiscount(item.getDiscount());
                    response.setGstPercentage(item.getGstPercentage());
                    response.setTotal(item.getTotal());

                    return response;

                })
                .collect(Collectors.toList());

        InvoiceResponse response = new InvoiceResponse();

        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setCustomerId(invoice.getCustomerId());
        response.setInvoiceDate(invoice.getInvoiceDate());
        response.setDueDate(invoice.getDueDate());
        response.setSubtotal(invoice.getSubtotal());
        response.setDiscount(invoice.getDiscount());
        response.setGstAmount(invoice.getGstAmount());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setStatus(invoice.getStatus());
        response.setNotes(invoice.getNotes());
        response.setItems(itemResponses);

        return response;

    }
}