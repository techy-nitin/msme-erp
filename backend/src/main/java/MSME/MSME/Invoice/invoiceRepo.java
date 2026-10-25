package MSME.MSME.Invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface invoiceRepo extends JpaRepository<InvoiceEntityy, Long>{
    Optional<InvoiceEntityy> findByInvoiceNumber(String invoiceNumber);

    boolean existsByInvoiceNumber(String invoiceNumber);
    @Query("""
select coalesce(sum(i.totalAmount),0)
from InvoiceEntityy i
""")
    BigDecimal getTotalRevenue();

    @Query("""
select coalesce(sum(i.totalAmount),0)
from InvoiceEntityy i
where i.status <> 'PAID'
""")
    BigDecimal getOutstandingAmount();

    List<InvoiceEntityy> findTop5ByOrderByInvoiceDateDesc();

    @Query("""
SELECT COALESCE(SUM(i.gstAmount),0)
FROM InvoiceEntityy i
WHERE EXTRACT(MONTH FROM i.invoiceDate)=EXTRACT(MONTH FROM CURRENT_DATE)
AND EXTRACT(YEAR FROM i.invoiceDate)=EXTRACT(YEAR FROM CURRENT_DATE)
""")
    BigDecimal getCurrentMonthGST();

    List<InvoiceEntityy> findByStatusAndDueDateBefore(
            String status,
            LocalDate date
    );
}
