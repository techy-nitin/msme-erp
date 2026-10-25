package MSME.MSME.PDF;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class returnPDF {

    public Resource download(String filePath) {

        File file = new File(filePath);

        if (!file.exists()) {
            throw new RuntimeException("PDF not found");
        }

        return new FileSystemResource(file);
    }
}