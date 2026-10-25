package MSME.MSME.Employee;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;



public interface EmployeeRepo  extends JpaRepository<EmployeeEntity, Long>{
    Optional<EmployeeEntity> findByEmployeeCode(String employeeCode);

    Optional<EmployeeEntity> findByEmail(String email);

    Optional<EmployeeEntity> findByPhone(String phone);

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}