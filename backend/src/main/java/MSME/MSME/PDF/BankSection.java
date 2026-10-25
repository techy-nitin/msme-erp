package MSME.MSME.PDF;

import MSME.MSME.Comppany.CompanyEntity;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.IOException;

@Component
public class BankSection {

    private static final float LEFT = 50;
    private static final float RIGHT_EDGE = 562;
    private static final float START_Y = 130;
    private static final float GAP = 15;

    private static final Color DARK = new Color(30, 30, 30);
    private static final Color GRAY = new Color(110, 110, 110);

    /**
     * Footer: "Thank you!" note, bank/payment details (bottom left)
     * and a signature block (bottom right) — matches the invoice reference.
     */
    public void draw(PDDocument document,
                     PDPage page,
                     CompanyEntity company)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true
                );

        content.setNonStrokingColor(DARK);
        writeText(content, PDType1Font.HELVETICA, 18, LEFT, START_Y + 40, "Thank you!");

        float y = START_Y;

        writeText(content, PDType1Font.HELVETICA_BOLD, 11, LEFT, y, "PAYMENT INFORMATION");
        y -= GAP;

        content.setNonStrokingColor(GRAY);
        y = writeLine(content, LEFT, y, value(company.getBankName()));
        y = writeLine(content, LEFT, y, "Account Name: " + value(company.getAccountHolderName()));
        y = writeLine(content, LEFT, y, "Account No.: " + value(company.getAccountNumber()));
        y = writeLine(content, LEFT, y, "IFSC: " + value(company.getIfsc()) + "   Branch: " + value(company.getBranchName()));
        writeLine(content, LEFT, y, "UPI ID: " + value(company.getUpiId()));

        // Signature block (bottom right)
        content.setNonStrokingColor(DARK);
        writeRight(content, PDType1Font.HELVETICA_OBLIQUE, 16, RIGHT_EDGE, START_Y, company.getCompanyName());

        content.setNonStrokingColor(GRAY);
        String addr = value(company.getAddress()) +
                (company.getCity() != null ? ", " + company.getCity() : "") +
                (company.getState() != null ? ", " + company.getState() : "");
        writeRight(content, PDType1Font.HELVETICA, 9, RIGHT_EDGE, START_Y - 16, addr);

        content.close();
    }

    private float writeLine(PDPageContentStream content, float x, float y, String text)
            throws IOException {
        writeText(content, PDType1Font.HELVETICA, 9.5f, x, y, text);
        return y - GAP;
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

    private void writeRight(PDPageContentStream content,
                            PDFont font, float size,
                            float rightX, float y, String text)
            throws IOException {

        text = text == null ? "" : text;
        float width = font.getStringWidth(text) / 1000 * size;
        writeText(content, font, size, rightX - width, y, text);
    }

    private String value(String value) {
        return (value == null || value.trim().isEmpty()) ? "-" : value;
    }
}