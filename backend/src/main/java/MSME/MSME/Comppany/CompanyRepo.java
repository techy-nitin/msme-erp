package MSME.MSME.Comppany;

import MSME.MSME.Login.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepo extends JpaRepository<CompanyEntity , Long> {
    Optional<CompanyEntity> findByUser(UserEntity user);

    boolean existsByUser(UserEntity user);
}
