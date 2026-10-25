package MSME.MSME.Payment;

import MSME.MSME.Invoice.InvoiceEntityy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    List<PaymentEntity> findByInvoice(InvoiceEntityy invoice);

    List<PaymentEntity> findByStatus(String status);

    @Query("""
            SELECT COALESCE(SUM(p.amount),0)
            FROM PaymentEntity p
            WHERE p.invoice = :invoice
          AND UPPER(p.status)='SUCCESS'
            """)
    BigDecimal getTotalPaidForInvoice(InvoiceEntityy invoice);


    @Query("""
select p
from PaymentEntity p
where p.status='PENDING'
order by p.paymentDate asc
""")
    List<PaymentEntity> getPendingPayments();
}