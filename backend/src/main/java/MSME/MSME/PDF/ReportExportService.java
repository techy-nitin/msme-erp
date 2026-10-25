package MSME.MSME.PDF;

import org.springframework.stereotype.Service;

@Service
public class ReportExportService {

    private final ExcelGenerator excelGenerator;
    private final CsvGenerator csvGenerator;

    public ReportExportService(
            ExcelGenerator excelGenerator,
            CsvGenerator csvGenerator
    ) {

        this.excelGenerator = excelGenerator;
        this.csvGenerator = csvGenerator;

    }

    public byte[] generatePDF(String type)
            throws Exception {

        /*
          Here connect your PDFBox logic

          Example:

          if(type.equals("Sales Report"))
             return salesReportPdf();

        */

        return new byte[0];
    }

    public byte[] generateExcel(String type)
            throws Exception {

        return excelGenerator.generate(type);

    }

    public byte[] generateCSV(String type)
            throws Exception {

        return csvGenerator.generate(type);

    }

}