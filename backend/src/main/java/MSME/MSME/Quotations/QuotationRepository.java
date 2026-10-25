package MSME.MSME.Quotations;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuotationRepository extends JpaRepository<QEntity ,Long> {
    Optional<QEntity> findByQuotationNumber(String quotationNumber);
    long countByStatus(String status);
}
