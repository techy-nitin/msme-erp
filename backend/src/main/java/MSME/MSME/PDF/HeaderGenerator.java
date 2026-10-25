package MSME.MSME.PDF;

import MSME.MSME.Client.ClientEntity;
import MSME.MSME.Comppany.CompanyEntity;
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

@Component
public class HeaderGenerator {

    private static final float LEFT = 50;
    private static final float RIGHT_EDGE = 562;

    private static final Color DARK = new Color(30, 30, 30);
    private static final Color GRAY = new Color(110, 110, 110);
    private static final Color GOLD = new Color(199, 161, 63);
    private static final Color NAVY = new Color(40, 48, 61);

    /**
     * Invoice Header — clean, minimal style (matches "INVOICE" reference)
     */
    public void draw(PDDocument document,
                     PDPage page,
                     CompanyEntity company,
                     ClientEntity client,
                     InvoiceEntityy invoice)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true
                );

        content.setNonStrokingColor(DARK);

        // Company name (top left, acts as the logo)
        writeText(content, PDType1Font.HELVETICA_BOLD, 20,
                LEFT, 750, company.getCompanyName());

        // "INVOICE" title (top right)
        writeRight(content, PDType1Font.HELVETICA_BOLD, 26,
                RIGHT_EDGE, 755, "INVOICE");

        // Small company detail line under the name
        content.setNonStrokingColor(GRAY);
        String companyLine =
                nonNull(company.getAddress()) +
                        (company.getCity() != null ? ", " + company.getCity() : "") +
                        (company.getState() != null ? ", " + company.getState() : "");
        writeText(content, PDType1Font.HELVETICA, 8,
                LEFT, 733, companyLine);

        writeText(content, PDType1Font.HELVETICA, 8,
                LEFT, 721,
                "Ph: " + nonNull(company.getPhone()) +
                        "   Email: " + nonNull(company.getEmail()));

        writeText(content, PDType1Font.HELVETICA, 8,
                LEFT, 709,
                "GSTIN: " + nonNull(company.getGstNumber()) +
                        "   PAN: " + nonNull(company.getPanNumber()));

        // Invoice meta (top right, under the title)
        content.setNonStrokingColor(DARK);
        writeRight(content, PDType1Font.HELVETICA, 10,
                RIGHT_EDGE, 725, "Invoice No.  " + nonNull(invoice.getInvoiceNumber()));

        writeRight(content, PDType1Font.HELVETICA, 10,
                RIGHT_EDGE, 711, "Invoice Date  " + nonNull(invoice.getInvoiceDate()));

        writeRight(content, PDType1Font.HELVETICA, 10,
                RIGHT_EDGE, 697, "Due Date  " + nonNull(invoice.getDueDate()));

        // Divider line
        drawLine(content, LEFT, 685, RIGHT_EDGE, 685, 0.75f, new Color(210, 210, 210));

        // BILLED TO
        content.setNonStrokingColor(DARK);
        writeText(content, PDType1Font.HELVETICA_BOLD, 11,
                LEFT, 662, "BILLED TO:");

        float y = 646;
        y = writeLineIfPresent(content, LEFT, y, client.getCustomerName());
        y = writeLineIfPresent(content, LEFT, y, client.getCompanyName());
        y = writeLineIfPresent(content, LEFT, y, client.getAddress());
        y = writeLineIfPresent(content, LEFT, y,
                joinNonEmpty(client.getCity(), client.getState()));
        y = writeLineIfPresent(content, LEFT, y,
                client.getPhone() != null ? "Phone: " + client.getPhone() : null);
        y = writeLineIfPresent(content, LEFT, y,
                client.getGstNumber() != null ? "GSTIN: " + client.getGstNumber() : null);

        content.close();
    }

    /**
     * Quotation Header — "Price Quote" style with gold accent banner
     */
    public void drawQuotation(PDDocument document,
                              PDPage page,
                              CompanyEntity company,
                              ClientEntity client,
                              QEntity quotation)
            throws IOException {

        PDPageContentStream content =
                new PDPageContentStream(
                        document,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true
                );

        // Top gold banner
        content.setNonStrokingColor(GOLD);
        content.addRect(0, 772, 612, 20);
        content.fill();

        // Diagonal navy accent
        content.setNonStrokingColor(NAVY);
        content.moveTo(300, 772);
        content.lineTo(340, 772);
        content.lineTo(320, 792);
        content.lineTo(280, 792);
        content.closePath();
        content.fill();

        // Title
        content.setNonStrokingColor(NAVY);
        writeText(content, PDType1Font.HELVETICA_BOLD, 26,
                LEFT, 735, "PRICE QUOTE");

        // Prepared By / Quotation For columns
        float colY = 700;
        content.setNonStrokingColor(GOLD);
        writeText(content, PDType1Font.HELVETICA_BOLD, 11, LEFT, colY, "Prepared By:");
        writeText(content, PDType1Font.HELVETICA_BOLD, 11, 330, colY, "Quotation For:");

        drawLine(content, LEFT, colY - 4, 260, colY - 4, 1.2f, NAVY);
        drawLine(content, 330, colY - 4, RIGHT_EDGE, colY - 4, 1.2f, NAVY);

        content.setNonStrokingColor(DARK);
        float leftY = colY - 20;
        leftY = writeLineIfPresent(content, LEFT, leftY, company.getCompanyName());
        leftY = writeLineIfPresent(content, LEFT, leftY, company.getEmail());
        leftY = writeLineIfPresent(content, LEFT, leftY, company.getPhone());
        leftY = writeLineIfPresent(content, LEFT, leftY, company.getGstNumber() != null
                ? "GSTIN: " + company.getGstNumber() : null);

        float rightY = colY - 20;
        rightY = writeLineIfPresent(content, 330, rightY, client.getCompanyName());
        rightY = writeLineIfPresent(content, 330, rightY, client.getAddress());
        rightY = writeLineIfPresent(content, 330, rightY, client.getEmail());
        rightY = writeLineIfPresent(content, 330, rightY, client.getPhone());

        // Quotation meta
        float metaY = Math.min(leftY, rightY) - 12;
        writeText(content, PDType1Font.HELVETICA, 9, LEFT, metaY,
                "Quotation No: " + nonNull(quotation.getQuotationNumber()) +
                        "     Date: " + nonNull(quotation.getQuotationDate()) +
                        "     Valid Till: " + nonNull(quotation.getValidUntil()));

        content.close();
    }

    // ---------- helpers ----------

    private float writeLineIfPresent(PDPageContentStream content,
                                     float x, float y, String text)
            throws IOException {

        if (text == null || text.trim().isEmpty()) {
            return y;
        }

        writeText(content, PDType1Font.HELVETICA, 9.5f, x, y, text);
        return y - 14;
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

    private String nonNull(String value) {
        return value == null ? "" : value;
    }

    private String nonNull(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private String joinNonEmpty(String a, String b) {
        if (a == null) a = "";
        if (b == null) b = "";
        if (a.isEmpty()) return b;
        if (b.isEmpty()) return a;
        return a + ", " + b;
    }
}