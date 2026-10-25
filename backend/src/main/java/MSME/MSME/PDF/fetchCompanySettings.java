package MSME.MSME.PDF;

import MSME.MSME.Comppany.CompanyEntity;
import MSME.MSME.Comppany.CompanyRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class fetchCompanySettings {

    @Autowired
    private CompanyRepo companyRepo;

    /**
     * Returns the first company from the database.
     *
     * If your application supports multiple companies,
     * later we'll fetch by logged-in user.
     */
    public CompanyEntity getCompany() {

        return companyRepo.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Company settings not found."));
    }

}