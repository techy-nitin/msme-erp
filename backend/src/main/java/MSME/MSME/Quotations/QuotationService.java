package MSME.MSME.Quotations;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final QuotationItemRepository quotationItemRepository;
    public QuotationService(QuotationRepository quotationRepository,
                            QuotationItemRepository quotationItemRepository) {

        this.quotationRepository = quotationRepository;
        this.quotationItemRepository = quotationItemRepository;
    }
    // ============================================
    // CREATE QUOTATION
    // ============================================

    public QuotationResponse createQuotation(QuotationRequest request) {

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalGST = BigDecimal.ZERO;

        QEntity quotation = new QEntity();

        quotation.setQuotationNumber(generateQuotationNumber());
        quotation.setCustomerId(request.getCustomerId());
        quotation.setQuotationDate(request.getQuotationDate());
        quotation.setValidUntil(request.getValidUntil());
        quotation.setNotes(request.getNotes());

        quotation.setStatus(
                request.getStatus() == null || request.getStatus().isBlank()
                        ? "PENDING"
                        : request.getStatus()
        );

        quotation.setIsConverted(false);

        // ******** IMPORTANT ********
        // Set default values because DB columns are NOT NULL
        quotation.setSubtotal(BigDecimal.ZERO);
        quotation.setDiscount(BigDecimal.ZERO);
        quotation.setGstAmount(BigDecimal.ZERO);
        quotation.setTotalAmount(BigDecimal.ZERO);

        // Save first to generate quotation ID
        quotation = quotationRepository.save(quotation);

        List<QuotationItemEntity> quotationItems = new ArrayList<>();
        List<QuotationItemResponse> itemResponses = new ArrayList<>();

        if (request.getItems() != null) {

            for (QuotationItemRequest itemRequest : request.getItems()) {

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
                totalGST = totalGST.add(gstAmount);

                QuotationItemEntity item = new QuotationItemEntity();

                item.setQuotation(quotation);
                item.setProductId(itemRequest.getProductId());
                item.setQuantity(itemRequest.getQuantity());
                item.setUnitPrice(price);
                item.setDiscount(discount);
                item.setGstPercentage(gst);
                item.setTotal(total);

                item = quotationItemRepository.save(item);

                quotationItems.add(item);

                QuotationItemResponse response = new QuotationItemResponse();
                response.setId(item.getId());
                response.setProductId(item.getProductId());
                response.setQuantity(item.getQuantity());
                response.setUnitPrice(item.getUnitPrice());
                response.setDiscount(item.getDiscount());
                response.setGstPercentage(item.getGstPercentage());
                response.setTotal(item.getTotal());

                itemResponses.add(response);
            }
        }

        quotation.setItems(quotationItems);

        quotation.setSubtotal(subtotal);
        quotation.setDiscount(BigDecimal.ZERO);
        quotation.setGstAmount(totalGST);
        quotation.setTotalAmount(subtotal.add(totalGST));

        quotation = quotationRepository.save(quotation);

        QuotationResponse response = new QuotationResponse();

        response.setId(quotation.getId());
        response.setQuotationNumber(quotation.getQuotationNumber());
        response.setCustomerId(quotation.getCustomerId());
        response.setQuotationDate(quotation.getQuotationDate());
        response.setValidUntil(quotation.getValidUntil());
        response.setSubtotal(quotation.getSubtotal());
        response.setDiscount(quotation.getDiscount());
        response.setGstAmount(quotation.getGstAmount());
        response.setTotalAmount(quotation.getTotalAmount());
        response.setStatus(quotation.getStatus());
        response.setNotes(quotation.getNotes());
        response.setIsConverted(quotation.getIsConverted());
        response.setItems(itemResponses);

        return response;
    }
    // ============================================
    // GENERATE QUOTATION NUMBER
    // ============================================

    private String generateQuotationNumber() {

        long count = quotationRepository.count() + 1;

        return "QT-" +
                Year.now().getValue() +
                "-" +
                String.format("%05d", count);

    }
// ============================================
// GET ALL QUOTATIONS
// ============================================

    public List<QuotationResponse> getAllQuotations() {

        List<QEntity> quotations = quotationRepository.findAll();

        List<QuotationResponse> responses = new ArrayList<>();

        for (QEntity quotation : quotations) {

            responses.add(mapToResponse(quotation));

        }

        return responses;

    }

// ============================================
// GET QUOTATION BY ID
// ============================================

    public QuotationResponse getQuotationById(Long id) {

        QEntity quotation = quotationRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Quotation not found."));

        return mapToResponse(quotation);

    }

// ============================================
// UPDATE QUOTATION
// ============================================

    public QuotationResponse updateQuotation(Long id,
                                             QuotationRequest request) {

        QEntity quotation = quotationRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Quotation not found."));

        quotation.setCustomerId(request.getCustomerId());
        quotation.setQuotationDate(request.getQuotationDate());
        quotation.setValidUntil(request.getValidUntil());
        quotation.setStatus(request.getStatus());
        quotation.setNotes(request.getNotes());

        quotationItemRepository.deleteByQuotation(quotation);
        List<QuotationItemEntity> quotationItems = new ArrayList<>();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalGST = BigDecimal.ZERO;

        for (QuotationItemRequest itemRequest : request.getItems()) {

            BigDecimal quantity =
                    BigDecimal.valueOf(itemRequest.getQuantity());

            BigDecimal price =
                    itemRequest.getUnitPrice();

            BigDecimal discount =
                    itemRequest.getDiscount() == null
                            ? BigDecimal.ZERO
                            : itemRequest.getDiscount();

            BigDecimal gst =
                    itemRequest.getGstPercentage() == null
                            ? BigDecimal.ZERO
                            : itemRequest.getGstPercentage();

            BigDecimal amount =
                    price.multiply(quantity).subtract(discount);

            BigDecimal gstAmount =
                    amount.multiply(gst)
                            .divide(BigDecimal.valueOf(100),
                                    2,
                                    RoundingMode.HALF_UP);

            BigDecimal total =
                    amount.add(gstAmount);

            subtotal = subtotal.add(amount);

            totalGST = totalGST.add(gstAmount);

            QuotationItemEntity item = new QuotationItemEntity();

            item.setQuotation(quotation);
            item.setProductId(itemRequest.getProductId());
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(price);
            item.setDiscount(discount);
            item.setGstPercentage(gst);
            item.setTotal(total);

            item = quotationItemRepository.save(item);
            quotationItems.add(item);

        }

        quotation.setItems(quotationItems);

        quotation.setSubtotal(subtotal);

        quotation.setDiscount(BigDecimal.ZERO);

        quotation.setGstAmount(totalGST);

        quotation.setTotalAmount(subtotal.add(totalGST));

        quotationRepository.save(quotation);

        return mapToResponse(quotation);

    }
    // ============================================
// DELETE QUOTATION
// ============================================

    public void deleteQuotation(Long id) {

        QEntity quotation = quotationRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Quotation not found."));

        quotationRepository.delete(quotation);

    }
    // ============================================
// MAP ENTITY TO RESPONSE
// ============================================

    private QuotationResponse mapToResponse(QEntity quotation) {

        List<QuotationItemResponse> itemResponses = new ArrayList<>();

        if (quotation.getItems() != null) {

            for (QuotationItemEntity item : quotation.getItems()) {

                QuotationItemResponse response = new QuotationItemResponse();

                response.setId(item.getId());
                response.setProductId(item.getProductId());
                response.setQuantity(item.getQuantity());
                response.setUnitPrice(item.getUnitPrice());
                response.setDiscount(item.getDiscount());
                response.setGstPercentage(item.getGstPercentage());
                response.setTotal(item.getTotal());

                itemResponses.add(response);

            }

        }

        QuotationResponse response = new QuotationResponse();

        response.setId(quotation.getId());
        response.setQuotationNumber(quotation.getQuotationNumber());
        response.setCustomerId(quotation.getCustomerId());
        response.setQuotationDate(quotation.getQuotationDate());
        response.setValidUntil(quotation.getValidUntil());
        response.setSubtotal(quotation.getSubtotal());
        response.setDiscount(quotation.getDiscount());
        response.setGstAmount(quotation.getGstAmount());
        response.setTotalAmount(quotation.getTotalAmount());
        response.setStatus(quotation.getStatus());
        response.setNotes(quotation.getNotes());
        response.setIsConverted(quotation.getIsConverted());
        response.setItems(itemResponses);

        return response;

    }
}