package MSME.MSME.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    // All notifications of a user (latest first)
    List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Unread notifications
    List<NotificationEntity> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    // Count unread notifications
    Long countByUserIdAndIsReadFalse(Long userId);

    List<NotificationEntity> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

}