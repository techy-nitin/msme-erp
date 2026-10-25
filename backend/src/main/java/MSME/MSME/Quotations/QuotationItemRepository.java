package MSME.MSME.Quotations;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuotationItemRepository extends JpaRepository<QuotationItemEntity, Long> {

    List<QuotationItemEntity> findByQuotation(QEntity quotation);

    void deleteByQuotation(QEntity quotation);

}