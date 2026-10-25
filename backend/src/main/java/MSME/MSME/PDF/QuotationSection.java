package MSME.MSME.PDF;

import MSME.MSME.Quotations.QEntity;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.IOException;

@Component
public class QuotationSection {

    private static final float LEFT = 50;
    private static final float START_Y = 170;
    private static final float LINE_GAP = 15;

    private static final Color DARK = new Color(30, 30, 30);
    private static final Color GOLD = new Color(199, 161, 63);
    private static final Color NAVY = new Color(40, 48, 61);

    /**
     * Terms & Conditions, Notes, signature line, and a bottom gold banner
     * that mirrors the header — matches the "PRICE QUOTE" reference.
     */
    public void draw(PDDocument document,
                     PDPage page,
                     QEntity quotation)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true
                );

        float y = START_Y;

        content.setNonStrokingColor(NAVY);
        writeText(content, PDType1Font.HELVETICA_BOLD, 11, LEFT, y, "Terms & Conditions");
        y -= LINE_GAP;

        content.setNonStrokingColor(DARK);
        y = writeLine(content, y, "1. This quote is valid until " + safe(quotation.getValidUntil()) + ".");
        y = writeLine(content, y, "2. Goods once sold will not be taken back.");
        y = writeLine(content, y, "3. Delivery charges, if any, are extra.");
        y = writeLine(content, y, "4. Taxes are applicable as per GST rules.");

        y -= 12;

        content.setNonStrokingColor(NAVY);
        writeText(content, PDType1Font.HELVETICA_BOLD, 11, LEFT, y, "Notes");
        y -= LINE_GAP;

        String notes = quotation.getNotes();
        if (notes == null || notes.trim().isEmpty()) {
            notes = "No additional notes.";
        }

        content.setNonStrokingColor(DARK);
        writeLine(content, y, notes);

        // Signature line
        content.setStrokingColor(new Color(180, 180, 180));
        content.setLineWidth(0.75f);
        content.moveTo(400, 75);
        content.lineTo(562, 75);
        content.stroke();

        content.setNonStrokingColor(DARK);
        writeText(content, PDType1Font.HELVETICA, 9, 400, 62, "Authorized Signature");

        // Bottom gold banner (mirrors the header)
        content.setNonStrokingColor(GOLD);
        content.addRect(0, 0, 612, 20);
        content.fill();

        content.setNonStrokingColor(NAVY);
        content.moveTo(300, 0);
        content.lineTo(340, 0);
        content.lineTo(320, 20);
        content.lineTo(280, 20);
        content.closePath();
        content.fill();

        content.close();
    }

    private float writeLine(PDPageContentStream content, float y, String text)
            throws IOException {
        writeText(content, PDType1Font.HELVETICA, 9.5f, LEFT, y, text);
        return y - LINE_GAP;
    }

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

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String safe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}