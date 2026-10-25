package MSME.MSME.PDF;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Component
public class ExcelGenerator {

    /**
     * Generates an .xlsx report as bytes for the given report type.
     * Plug in real data lookups where noted below.
     */
    public byte[] generate(String type) throws IOException {

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {

            XSSFSheet sheet = workbook.createSheet(safeSheetName(type));

            List<String> headers = headersFor(type);
            List<List<String>> rows = rowsFor(type);

            writeHeaderRow(workbook, sheet, headers);
            writeDataRows(sheet, headers.size(), rows);
            autoSizeColumns(sheet, headers.size());

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    /**
     * Column headers per report type.
     * TODO: extend this switch as new report types are added.
     */
    private List<String> headersFor(String type) {

        switch (type) {

            case "Sales Report":
                return List.of("Date", "Invoice No", "Customer", "Amount");

            case "Client Report":
                return List.of("Client Name", "Company", "Phone", "GSTIN");

            default:
                return List.of("Column 1", "Column 2");
        }
    }

    /**
     * Row data per report type.
     * TODO: replace with real repository/service calls that fetch
     * data for the given type instead of returning an empty list.
     */
    private List<List<String>> rowsFor(String type) {
        return List.of();
    }

    private void writeHeaderRow(XSSFWorkbook workbook,
                                XSSFSheet sheet,
                                List<String> headers) {

        Font boldFont = workbook.createFont();
        boldFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(boldFont);

        Row headerRow = sheet.createRow(0);

        for (int i = 0; i < headers.size(); i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers.get(i));
            cell.setCellStyle(headerStyle);
        }
    }

    private void writeDataRows(XSSFSheet sheet,
                               int columnCount,
                               List<List<String>> rows) {

        int rowIndex = 1;

        for (List<String> rowValues : rows) {

            Row row = sheet.createRow(rowIndex++);

            for (int col = 0; col < columnCount; col++) {
                String value = col < rowValues.size() ? rowValues.get(col) : "";
                row.createCell(col).setCellValue(value == null ? "" : value);
            }
        }
    }

    private void autoSizeColumns(XSSFSheet sheet, int columnCount) {
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private String safeSheetName(String type) {

        if (type == null || type.trim().isEmpty()) {
            return "Report";
        }

        // Excel sheet names can't exceed 31 chars or contain \ / ? * [ ]
        String cleaned = type.replaceAll("[\\\\/?*\\[\\]]", "");
        return cleaned.length() > 31 ? cleaned.substring(0, 31) : cleaned;
    }
}