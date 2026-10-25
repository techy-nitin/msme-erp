package MSME.MSME.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLogEntity, Long> {

    List<EmailLogEntity> findByRecipientEmailOrderBySentAtDesc(String recipientEmail);

    List<EmailLogEntity> findByStatusOrderBySentAtDesc(String status);

    List<EmailLogEntity> findByInvoiceId(Long invoiceId);



}