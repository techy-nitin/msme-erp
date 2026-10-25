package MSME.MSME.Client;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepo extends JpaRepository<ClientEntity , Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByGstNumber(String gstNumber);
}
