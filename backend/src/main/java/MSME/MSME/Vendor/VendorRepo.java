package MSME.MSME.Vendor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VendorRepo extends JpaRepository<VendorEntity ,Long> {
    Optional<VendorEntity> findByEmail(String email);

    Optional<VendorEntity> findByPhone(String phone);

    Optional<VendorEntity> findByGstNumber(String gstNumber);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByGstNumber(String gstNumber);
}
