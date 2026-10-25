package MSME.MSME.PDF;

import MSME.MSME.Invoice.InvoiceItems;
import MSME.MSME.Products.ProductEntity;
import MSME.MSME.Products.ProductRepository;
import MSME.MSME.Quotations.QuotationItemEntity;
import MSME.MSME.Invoice.InvoiceEntityy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import MSME.MSME.Quotations.QEntity;
import java.util.ArrayList;
import java.util.List;

@Service
public class fetchItems {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Invoice Items
     */
    public List<PdfItem> getInvoiceItems(InvoiceEntityy invoice) {

        List<PdfItem> pdfItems = new ArrayList<>();

        for (InvoiceItems item : invoice.getItems()) {

            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            PdfItem pdfItem = new PdfItem();

            pdfItem.setProductName(product.getProductName());
            pdfItem.setHsnCode(product.getHsnCode());
            pdfItem.setUnit(product.getUnit());
            pdfItem.setQuantity(item.getQuantity());
            pdfItem.setUnitPrice(item.getUnitPrice());
            pdfItem.setGstPercentage(item.getGstPercentage());
            pdfItem.setTotal(item.getTotal());

            pdfItems.add(pdfItem);
        }

        return pdfItems;
    }

    /**
     * Quotation Items
     */
    public List<PdfItem> getQuotationItems(QEntity quotation) {

        List<PdfItem> pdfItems = new ArrayList<>();

        for (QuotationItemEntity item : quotation.getItems()) {

            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            PdfItem pdfItem = new PdfItem();

            pdfItem.setProductName(product.getProductName());
            pdfItem.setHsnCode(product.getHsnCode());
            pdfItem.setUnit(product.getUnit());
            pdfItem.setQuantity(item.getQuantity());
            pdfItem.setUnitPrice(item.getUnitPrice());
            pdfItem.setGstPercentage(item.getGstPercentage());
            pdfItem.setTotal(item.getTotal());

            pdfItems.add(pdfItem);
        }

        return pdfItems;
    }
}