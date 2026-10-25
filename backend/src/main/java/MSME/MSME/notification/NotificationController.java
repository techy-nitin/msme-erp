package MSME.MSME.notification;

import MSME.MSME.Login.UserEntity;
import MSME.MSME.Login.UserRepo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepo userRepo;

    public NotificationController(
            NotificationService notificationService,
            UserRepo userRepo) {

        this.notificationService = notificationService;
        this.userRepo = userRepo;
    }

    // ============================================
    // Get Logged-in User ID
    // ============================================

    private Long getCurrentUserId(Authentication authentication) {

        String email = authentication.getName();

        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return user.getId();
    }

    // ============================================
    // All Notifications
    // ============================================

    @GetMapping
    public List<NotificationDTO> getNotifications(
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);

        return notificationService
                .getAllNotifications(userId)
                .stream()
                .map(NotificationDTO::new)
                .toList();
    }

    // ============================================
    // Latest 10
    // ============================================

    @GetMapping("/latest")
    public List<NotificationDTO> latest(
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);

        return notificationService
                .getLatestNotifications(userId)
                .stream()
                .map(NotificationDTO::new)
                .toList();
    }

    // ============================================
    // Unread Notifications
    // ============================================

    @GetMapping("/unread")
    public List<NotificationDTO> unread(
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);

        return notificationService
                .getUnreadNotifications(userId)
                .stream()
                .map(NotificationDTO::new)
                .toList();
    }

    // ============================================
    // Unread Count
    // ============================================

    @GetMapping("/count")
    public Long count(
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);

        return notificationService.getUnreadCount(userId);
    }

    // ============================================
    // Mark Single Notification Read
    // ============================================

    @PutMapping("/{id}/read")
    public NotificationDTO markRead(
            @PathVariable Long id) {

        return new NotificationDTO(
                notificationService.markAsRead(id)
        );
    }

    // ============================================
    // Mark All Notifications Read
    // ============================================

    @PutMapping("/read-all")
    public String markAll(
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);

        notificationService.markAllAsRead(userId);

        return "All notifications marked as read.";
    }

    // ============================================
    // Delete Notification
    // ============================================

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        notificationService.deleteNotification(id);

        return "Notification deleted.";
    }
}