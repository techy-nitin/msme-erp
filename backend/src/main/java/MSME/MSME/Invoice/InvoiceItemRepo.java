package MSME.MSME.Invoice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceItemRepo  extends JpaRepository<InvoiceItems , Long> {
    List<InvoiceItems> findByInvoiceId(Long invoiceId);

}
