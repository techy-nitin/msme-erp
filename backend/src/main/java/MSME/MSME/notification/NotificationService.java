package MSME.MSME.notification;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // ============================================
    // Create Notification
    // ============================================

    public NotificationEntity createNotification(Long userId,
                                                 String title,
                                                 String message,
                                                 String type) {

        NotificationEntity notification = new NotificationEntity();

        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(type);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    // ============================================
    // Get All Notifications
    // ============================================

    public List<NotificationEntity> getAllNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ============================================
    // Latest Notifications
    // ============================================

    public List<NotificationEntity> getLatestNotifications(Long userId) {
        return notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }

    // ============================================
    // Unread Notifications
    // ============================================

    public List<NotificationEntity> getUnreadNotifications(Long userId) {
        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    // ============================================
    // Unread Count
    // ============================================

    public Long getUnreadCount(Long userId) {
        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }

    // ============================================
    // Mark One As Read
    // ============================================

    public NotificationEntity markAsRead(Long notificationId) {

        NotificationEntity notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found"));

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }

    // ============================================
    // Mark All As Read
    // ============================================

    public void markAllAsRead(Long userId) {

        List<NotificationEntity> notifications =
                notificationRepository
                        .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        notifications.forEach(n -> n.setIsRead(true));

        notificationRepository.saveAll(notifications);
    }

    // ============================================
    // Delete Notification
    // ============================================

    public void deleteNotification(Long id) {

        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found");
        }

        notificationRepository.deleteById(id);
    }

}