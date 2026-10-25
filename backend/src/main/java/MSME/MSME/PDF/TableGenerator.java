package MSME.MSME.PDF;

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
import java.util.List;

@Component
public class TableGenerator {

    private static final float LEFT = 50;
    private static final float RIGHT_EDGE = 562;
    private static final float ROW_HEIGHT = 22;

    private static final Color DARK = new Color(30, 30, 30);
    private static final Color LINE_GRAY = new Color(210, 210, 210);
    private static final Color GOLD = new Color(199, 161, 63);
    private static final Color NAVY = new Color(40, 48, 61);

    /**
     * Invoice table — clean style with thin row separators (matches "INVOICE" reference)
     */
    public void drawInvoiceTable(PDDocument document,
                                 PDPage page,
                                 List<PdfItem> items)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true);

        float y = 490;

        content.setNonStrokingColor(DARK);
        writeText(content, PDType1Font.HELVETICA_BOLD, 9, LEFT, y, "Item");
        writeText(content, PDType1Font.HELVETICA_BOLD, 9, 250, y, "HSN");
        writeRight(content, PDType1Font.HELVETICA_BOLD, 9, 330, y, "Qty");
        writeRight(content, PDType1Font.HELVETICA_BOLD, 9, 410, y, "Unit Price");
        writeRight(content, PDType1Font.HELVETICA_BOLD, 9, 470, y, "GST%");
        writeRight(content, PDType1Font.HELVETICA_BOLD, 9, RIGHT_EDGE, y, "Total");

        y -= 8;
        drawLine(content, LEFT, y, RIGHT_EDGE, y, 0.75f, DARK);
        y -= 16;

        for (PdfItem item : items) {

            content.setNonStrokingColor(DARK);
            writeText(content, PDType1Font.HELVETICA, 9, LEFT, y, safe(item.getProductName()));
            writeText(content, PDType1Font.HELVETICA, 9, 250, y, safe(item.getHsnCode()));
            writeRight(content, PDType1Font.HELVETICA, 9, 330, y, String.valueOf(item.getQuantity()));
            writeRight(content, PDType1Font.HELVETICA, 9, 410, y, money(item.getUnitPrice()));
            writeRight(content, PDType1Font.HELVETICA, 9, 470, y, money(item.getGstPercentage()));
            writeRight(content, PDType1Font.HELVETICA, 9, RIGHT_EDGE, y, money(item.getTotal()));

            y -= 8;
            drawLine(content, LEFT, y, RIGHT_EDGE, y, 0.5f, LINE_GRAY);
            y -= ROW_HEIGHT - 8;
        }

        content.close();
    }

    /**
     * Quotation table — gold-accented "Price Quote" style
     */
    public void drawQuotationTable(PDDocument document,
                                   PDPage page,
                                   List<PdfItem> items)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true);

        float y = 470;

        content.setNonStrokingColor(GOLD);
        writeText(content, PDType1Font.HELVETICA_BOLD, 10, LEFT, y, "Description");
        writeRight(content, PDType1Font.HELVETICA_BOLD, 10, 380, y, "Price");
        writeRight(content, PDType1Font.HELVETICA_BOLD, 10, 450, y, "Qty");
        writeRight(content, PDType1Font.HELVETICA_BOLD, 10, RIGHT_EDGE, y, "Subtotal");

        y -= 6;
        drawLine(content, LEFT, y, RIGHT_EDGE, y, 1.4f, NAVY);
        y -= 3;
        drawLine(content, LEFT, y, RIGHT_EDGE, y, 0.6f, GOLD);
        y -= 18;

        for (PdfItem item : items) {

            content.setNonStrokingColor(DARK);
            writeText(content, PDType1Font.HELVETICA, 9.5f, LEFT, y, safe(item.getProductName()));
            writeRight(content, PDType1Font.HELVETICA, 9.5f, 380, y, money(item.getUnitPrice()));
            writeRight(content, PDType1Font.HELVETICA, 9.5f, 450, y, String.valueOf(item.getQuantity()));
            writeRight(content, PDType1Font.HELVETICA, 9.5f, RIGHT_EDGE, y, money(item.getTotal()));

            y -= 8;
            drawLine(content, LEFT, y, RIGHT_EDGE, y, 0.4f, LINE_GRAY);
            y -= ROW_HEIGHT - 8;
        }

        content.close();
    }

    // ---------- helpers ----------

    private void writeText(PDPageContentStream content,
                           PDFont font, float size,
                           float x, float y, String text)
            throws IOException {

        content.beginText();
        content.setFont(font, size);
        content.newLineAtOffset(x, y);
        content.showText(text == null ? "" : text);
        content.endText();
    }

    private void writeRight(PDPageContentStream content,
                            PDFont font, float size,
                            float rightX, float y, String text)
            throws IOException {

        text = text == null ? "" : text;
        float width = font.getStringWidth(text) / 1000 * size;
        writeText(content, font, size, rightX - width, y, text);
    }

    private void drawLine(PDPageContentStream content,
                          float x1, float y1, float x2, float y2,
                          float width, Color color)
            throws IOException {

        content.setStrokingColor(color);
        content.setLineWidth(width);
        content.moveTo(x1, y1);
        content.lineTo(x2, y2);
        content.stroke();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String money(BigDecimal value) {
        if (value == null) return "0.00";
        return value.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}