package MSME.MSME.Login;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    private final Logic logic;

    public LoginController(Logic logic) {
        this.logic = logic;
    }

    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserEntity user) {

        String response = logic.register(user);

        if (response.equals("Registration Successful")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<ResponseDto> login(@RequestBody UserEntity user) {

        ResponseDto response = logic.login(
                user.getEmail(),
                user.getPassword()
        );

        return ResponseEntity.ok(response);
    }
    // ================= EDIT PROFILE =================

    @PutMapping("/profile")
    public ResponseEntity<String> editProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody UserEntity user) {

        String response = logic.editProfile(
                token,
                user.getName(),
                user.getPhone()
        );

        return ResponseEntity.ok(response);
    }

    // ================= DELETE ACCOUNT =================

    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteAccount(
            @RequestHeader("Authorization") String token) {

        String response = logic.deleteAccount(token);

        return ResponseEntity.ok(response);
    }
// ================= CHANGE PASSWORD =================

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody ChangePasswordRequest request) {
//        System.out.println("TOKEN = " + token);

        return ResponseEntity.ok(
                logic.changePassword(
                        token,
                        request.getOldPassword(),
                        request.getNewPassword()));
    }
    // ================= GET PROFILE =================

    @GetMapping("/profile")
    public ResponseEntity<UserEntity> getProfile(
            @RequestHeader("Authorization") String token) {

        return ResponseEntity.ok(
                logic.getProfile(token));
    }
}