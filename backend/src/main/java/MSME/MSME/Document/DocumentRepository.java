package MSME.MSME.Document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository
        extends JpaRepository<DocumentEntity, Long> {

    List<DocumentEntity> findByRelatedTypeAndRelatedId(
            String relatedType,
            Long relatedId
    );
}