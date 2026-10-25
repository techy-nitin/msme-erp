package MSME.MSME.PDF;

import MSME.MSME.Invoice.InvoiceEntityy;
import MSME.MSME.Quotations.QEntity;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class TotalGenerator {

    private static final float LABEL_X = 400;
    private static final float VALUE_X = 562;
    private static final float START_Y = 220;
    private static final float GAP = 18;

    private static final Color DARK = new Color(30, 30, 30);
    private static final Color GOLD = new Color(199, 161, 63);

    public void drawInvoiceTotal(PDDocument document,
                                 PDPage page,
                                 InvoiceEntityy invoice)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true);

        float y = START_Y;

        content.setNonStrokingColor(DARK);

        drawRow(content, y, "Subtotal", invoice.getSubtotal());
        y -= GAP;

        drawRow(content, y, "Discount", invoice.getDiscount());
        y -= GAP;

        drawRow(content, y, "GST", invoice.getGstAmount());
        y -= 8;

        content.setStrokingColor(DARK);
        content.setLineWidth(0.75f);
        content.moveTo(LABEL_X, y);
        content.lineTo(VALUE_X, y);
        content.stroke();
        y -= 20;

        content.setNonStrokingColor(DARK);
        drawGrandTotal(content, y, "Total", invoice.getTotalAmount());

        content.close();
    }

    public void drawQuotationTotal(PDDocument document,
                                   PDPage page,
                                   QEntity quotation)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true);

        float y = START_Y;

        content.setNonStrokingColor(DARK);

        drawRow(content, y, "Sub Total", quotation.getSubtotal());
        y -= GAP;

        drawRow(content, y, "Discount", quotation.getDiscount());
        y -= GAP;

        drawRow(content, y, "GST", quotation.getGstAmount());
        y -= 8;

        content.setStrokingColor(GOLD);
        content.setLineWidth(1f);
        content.moveTo(LABEL_X, y);
        content.lineTo(VALUE_X, y);
        content.stroke();
        y -= 20;

        content.setNonStrokingColor(GOLD);
        drawGrandTotal(content, y, "Total", quotation.getTotalAmount());

        content.close();
    }

    private void drawRow(PDPageContentStream content,
                         float y,
                         String label,
                         BigDecimal value)
            throws IOException {

        writeText(content, PDType1Font.HELVETICA_BOLD, 10, LABEL_X, y, label);
        writeRight(content, PDType1Font.HELVETICA, 10, VALUE_X, y, "Rs. " + money(value));
    }

    private void drawGrandTotal(PDPageContentStream content,
                                float y,
                                String label,
                                BigDecimal total)
            throws IOException {

        writeText(content, PDType1Font.HELVETICA_BOLD, 14, LABEL_X, y, label);
        writeRight(content, PDType1Font.HELVETICA_BOLD, 14, VALUE_X, y, "Rs. " + money(total));
    }

    private void writeText(PDPageContentStream content,
                           PDFont font, float size,
                           float x, float y, String text)
            throws IOException {

        content.beginText();
        content.setFont(font, size);
        content.newLineAtOffset(x, y);
        content.showText(text);
        content.endText();
    }

    private void writeRight(PDPageContentStream content,
                            PDFont font, float size,
                            float rightX, float y, String text)
            throws IOException {

        float width = font.getStringWidth(text) / 1000 * size;
        writeText(content, font, size, rightX - width, y, text);
    }

    private String money(BigDecimal value) {
        if (value == null) return "0.00";
        return value.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}