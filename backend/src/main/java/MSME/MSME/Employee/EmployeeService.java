package MSME.MSME.Employee;

import MSME.MSME.Employee.EmployeeRequest;
import MSME.MSME.Employee.EmplyeeResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepo employeeRepository;

    public EmployeeService(EmployeeRepo employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Create Employee
    public EmplyeeResponse createEmployee(EmployeeRequest request) {

        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Employee Code already exists");
        }

        if (request.getEmail() != null &&
                employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPhone() != null &&
                employeeRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        EmployeeEntity employee = new EmployeeEntity();

        employee.setUserId(request.getUserId());
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setGender(request.getGender());
        employee.setDob(request.getDob());
        employee.setAddress(request.getAddress());
        employee.setCity(request.getCity());
        employee.setState(request.getState());
        employee.setCountry(request.getCountry());
        employee.setPincode(request.getPincode());
        employee.setStatus(request.getStatus());
        employee.setProfileImage(request.getProfileImage());
        employee.setEmergencyContact(request.getEmergencyContact());
        employee.setEmergencyPerson(request.getEmergencyPerson());

        employee = employeeRepository.save(employee);

        return mapToResponse(employee);
    }

    // Get All Employees
    public List<EmplyeeResponse> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Employee By Id
    public EmplyeeResponse getEmployeeById(Long id) {

        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        return mapToResponse(employee);
    }

    // Update Employee
    public EmplyeeResponse updateEmployee(Long id, EmployeeRequest request) {

        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        employee.setUserId(request.getUserId());
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setGender(request.getGender());
        employee.setDob(request.getDob());
        employee.setAddress(request.getAddress());
        employee.setCity(request.getCity());
        employee.setState(request.getState());
        employee.setCountry(request.getCountry());
        employee.setPincode(request.getPincode());
        employee.setStatus(request.getStatus());
        employee.setProfileImage(request.getProfileImage());
        employee.setEmergencyContact(request.getEmergencyContact());
        employee.setEmergencyPerson(request.getEmergencyPerson());

        employee = employeeRepository.save(employee);

        return mapToResponse(employee);
    }

    // Delete Employee
    public void deleteEmployee(Long id) {

        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        employeeRepository.delete(employee);
    }

    // Mapper
    private EmplyeeResponse mapToResponse(EmployeeEntity employee) {

        EmplyeeResponse response = new EmplyeeResponse();

        response.setId(employee.getId());
        response.setUserId(employee.getUserId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setPhone(employee.getPhone());
        response.setDepartment(employee.getDepartment());
        response.setDesignation(employee.getDesignation());
        response.setSalary(employee.getSalary());
        response.setJoiningDate(employee.getJoiningDate());
        response.setGender(employee.getGender());
        response.setDob(employee.getDob());
        response.setAddress(employee.getAddress());
        response.setCity(employee.getCity());
        response.setState(employee.getState());
        response.setCountry(employee.getCountry());
        response.setPincode(employee.getPincode());
        response.setStatus(employee.getStatus());
        response.setProfileImage(employee.getProfileImage());
        response.setEmergencyContact(employee.getEmergencyContact());
        response.setEmergencyPerson(employee.getEmergencyPerson());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());

        return response;
    }
}