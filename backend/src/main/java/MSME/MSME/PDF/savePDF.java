package MSME.MSME.PDF;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
public class savePDF {

    // Folder where PDFs will be stored
    private static final String UPLOAD_DIRECTORY = "uploads/documents/";

    /**
     * Save PDF and return full file path
     */
    public String save(PDDocument document, String fileName)
            throws IOException {

        File directory = new File(UPLOAD_DIRECTORY);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filePath = UPLOAD_DIRECTORY + fileName;

        document.save(filePath);

        return filePath;
    }
}