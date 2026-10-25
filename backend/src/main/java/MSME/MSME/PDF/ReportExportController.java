package MSME.MSME.PDF;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports/export")
public class ReportExportController {

    private final ReportExportService reportExportService;

    public ReportExportController(
            ReportExportService reportExportService
    ) {
        this.reportExportService = reportExportService;
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> pdf(
            @RequestParam String type
    ) throws Exception {

        byte[] file =
                reportExportService.generatePDF(type);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + type + ".pdf"
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(file);
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> excel(
            @RequestParam String type
    ) throws Exception {

        byte[] file =
                reportExportService.generateExcel(type);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + type + ".xlsx"
                )
                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM
                )
                .body(file);
    }

    @GetMapping("/csv")
    public ResponseEntity<byte[]> csv(
            @RequestParam String type
    ) throws Exception {

        byte[] file =
                reportExportService.generateCSV(type);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + type + ".csv"
                )
                .contentType(
                        MediaType.TEXT_PLAIN
                )
                .body(file);
    }

}