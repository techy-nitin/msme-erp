package MSME.MSME.PDF;

import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class CsvGenerator {

    private static final String DELIMITER = ",";
    private static final String LINE_END = "\r\n";

    /**
     * Generates a .csv report as bytes for the given report type.
     * Plug in real data lookups where noted below.
     */
    public byte[] generate(String type) throws IOException {

        List<String> headers = headersFor(type);
        List<List<String>> rows = rowsFor(type);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PrintWriter writer =
                     new PrintWriter(out, true, StandardCharsets.UTF_8)) {

            writer.print(toCsvLine(headers));

            for (List<String> row : rows) {
                writer.print(toCsvLine(row));
            }
        }

        return out.toByteArray();
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

    private String toCsvLine(List<String> values) {

        StringBuilder line = new StringBuilder();

        for (int i = 0; i < values.size(); i++) {

            if (i > 0) {
                line.append(DELIMITER);
            }

            line.append(escape(values.get(i)));
        }

        line.append(LINE_END);
        return line.toString();
    }

    private String escape(String value) {

        if (value == null) {
            return "";
        }

        boolean needsQuoting =
                value.contains(DELIMITER)
                        || value.contains("\"")
                        || value.contains("\n")
                        || value.contains("\r");

        if (!needsQuoting) {
            return value;
        }

        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}