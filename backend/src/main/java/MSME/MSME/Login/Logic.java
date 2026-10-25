package MSME.MSME.Login;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service

public class Logic {

    private final UserRepo repo;
    private final PasswordEncoder encoder;
    private final jwtservice jwtService;

    public Logic(UserRepo repo,
                 PasswordEncoder encoder,
                 jwtservice jwtService) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }
    // ================= REGISTER =================

    public String register(UserEntity user) {

        // Remove extra spaces
        user.setEmail(user.getEmail().trim());
        user.setPhone(user.getPhone().trim());

        // Email Validation
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return "Invalid Email Format";
        }

        // Phone Validation
        if (!user.getPhone().matches("\\d{10}")) {
            return "Phone number must contain exactly 10 digits";
        }

        // Password Validation
        if (user.getPassword().length() < 6) {
            return "Password must be at least 6 characters";
        }

        if (repo.existsByEmail(user.getEmail())) {
            return "Email Already Exists";
        }

        if (repo.existsByPhone(user.getPhone())) {
            return "Phone Already Exists";
        }

        user.setPassword(encoder.encode(user.getPassword()));

        repo.save(user);

        return "Registration Successful";
    }

    // ================= LOGIN =================

    public ResponseDto login(String email, String password) {

        UserEntity user = repo.findByEmail(email.trim())
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        ResponseDto response = new ResponseDto();

        response.setToken(token);
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().toString());

        return response;
    }
    // ================= EDIT PROFILE =================

    public String editProfile(String token, String name, String phone) {

        token = token.replace("Bearer ", "");

        String email = jwtService.extractEmail(token);

        UserEntity user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        if (!phone.matches("\\d{10}")) {
            return "Phone number must contain exactly 10 digits";
        }

        user.setName(name.trim());
        user.setPhone(phone);

        repo.save(user);

        return "Profile Updated Successfully";
    }

// ================= DELETE ACCOUNT =================

    public String deleteAccount(String token) {

        token = token.replace("Bearer ", "");

        String email = jwtService.extractEmail(token);

        UserEntity user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        repo.delete(user);

        return "Account Deleted Successfully";
    }
    // ================= CHANGE PASSWORD =================

    public String changePassword(String token,
                                 String oldPassword,
                                 String newPassword) {

        token = token.replace("Bearer ", "");

        String email = jwtService.extractEmail(token);

        UserEntity user = repo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));

        if (!encoder.matches(oldPassword, user.getPassword())) {
            return "Old Password is Incorrect";
        }

        if (newPassword.length() < 6) {
            return "Password must be at least 6 characters";
        }

        user.setPassword(encoder.encode(newPassword));

        repo.save(user);

        return "Password Changed Successfully";
    }
    // ================= GET PROFILE =================

    public UserEntity getProfile(String token) {

        token = token.replace("Bearer ", "");

        String email = jwtService.extractEmail(token);

        return repo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));
    }
}