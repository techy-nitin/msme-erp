package MSME.MSME.notification;

import java.time.LocalDateTime;

public class NotificationDTO {

    private Long id;

    private String title;

    private String message;

    private NotificationType notificationType;

    private Boolean isRead;

    private LocalDateTime createdAt;

    public NotificationDTO() {
    }

    public NotificationDTO(NotificationEntity entity) {

        this.id = entity.getId();
        this.title = entity.getTitle();
        this.message = entity.getMessage();
        this.notificationType =
                NotificationType.valueOf(entity.getNotificationType());

        this.isRead = entity.getIsRead();

        this.createdAt = entity.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}