package MSME.MSME.Comppany;

import MSME.MSME.Login.UserEntity;
import MSME.MSME.Login.UserRepo;
import MSME.MSME.Login.jwtservice;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepo companyRepository;
    private final UserRepo userRepository;
    private final jwtservice jwtService;

    public CompanyService(
            CompanyRepo companyRepository,
            UserRepo userRepository,
            jwtservice jwtService) {

        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // ===========================
    // CREATE COMPANY
    // ===========================

    public CompanyResponse createCompany(
            String token,
            CompanyRequest request) {

        UserEntity user = getLoggedInUser(token);

        if (companyRepository.existsByUser(user)) {
            throw new RuntimeException("Company already exists.");
        }

        CompanyEntity company = new CompanyEntity();

        company.setUser(user);

        copyRequestToEntity(company, request);

        company = companyRepository.save(company);

        return mapToResponse(company);
    }

    // ===========================
    // GET MY COMPANY
    // ===========================

    public CompanyResponse getMyCompany(String token) {

        UserEntity user = getLoggedInUser(token);

        CompanyEntity company = companyRepository.findByUser(user)
                .orElseThrow(() ->
                        new EntityNotFoundException("Company not found."));

        return mapToResponse(company);
    }

    // ===========================
    // UPDATE COMPANY
    // ===========================

    public CompanyResponse updateCompany(
            String token,
            CompanyRequest request) {

        UserEntity user = getLoggedInUser(token);

        CompanyEntity company = companyRepository.findByUser(user)
                .orElseThrow(() ->
                        new EntityNotFoundException("Company not found."));

        copyRequestToEntity(company, request);

        company = companyRepository.save(company);

        return mapToResponse(company);
    }

    // ===========================
    // DELETE COMPANY
    // ===========================

    public void deleteCompany(String token) {

        UserEntity user = getLoggedInUser(token);

        CompanyEntity company = companyRepository.findByUser(user)
                .orElseThrow(() ->
                        new EntityNotFoundException("Company not found."));

        companyRepository.delete(company);
    }

    // ===========================
    // GET LOGGED-IN USER
    // ===========================

    private UserEntity getLoggedInUser(String token) {

        token = token.replace("Bearer ", "");

        String email = jwtService.extractEmail(token); // change if your method name differs

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));
    }

    // ===========================
    // COPY REQUEST TO ENTITY
    // ===========================

    private void copyRequestToEntity(
            CompanyEntity company,
            CompanyRequest request) {

        company.setCompanyName(request.getCompanyName());
        company.setOwnerName(request.getOwnerName());
        company.setEmail(request.getEmail());
        company.setPhone(request.getPhone());

        company.setBankName(request.getBankName());
        company.setAccountHolderName(request.getAccountHolderName());
        company.setAccountNumber(request.getAccountNumber());
        company.setIfsc(request.getIfsc());
        company.setBranchName(request.getBranchName());
        company.setUpiId(request.getUpiId());

        company.setGstNumber(request.getGstNumber());
        company.setPanNumber(request.getPanNumber());

        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPincode(request.getPincode());

        company.setLogo(request.getLogo());

        company.setInvoicePrefix(request.getInvoicePrefix());
        company.setCurrency(request.getCurrency());
        company.setFinancialYear(request.getFinancialYear());
    }

    // ===========================
    // ENTITY TO RESPONSE
    // ===========================

    private CompanyResponse mapToResponse(CompanyEntity company) {

        CompanyResponse response = new CompanyResponse();

        response.setId(company.getId());

        response.setCompanyName(company.getCompanyName());
        response.setOwnerName(company.getOwnerName());
        response.setEmail(company.getEmail());
        response.setPhone(company.getPhone());

        response.setBankName(company.getBankName());
        response.setAccountHolderName(company.getAccountHolderName());
        response.setAccountNumber(company.getAccountNumber());
        response.setIfsc(company.getIfsc());
        response.setBranchName(company.getBranchName());
        response.setUpiId(company.getUpiId());

        response.setGstNumber(company.getGstNumber());
        response.setPanNumber(company.getPanNumber());

        response.setAddress(company.getAddress());
        response.setCity(company.getCity());
        response.setState(company.getState());
        response.setCountry(company.getCountry());
        response.setPincode(company.getPincode());

        response.setLogo(company.getLogo());

        response.setInvoicePrefix(company.getInvoicePrefix());
        response.setCurrency(company.getCurrency());
        response.setFinancialYear(company.getFinancialYear());

        response.setCreatedAt(company.getCreatedAt());
        response.setUpdatedAt(company.getUpdatedAt());

        return response;
    }
}