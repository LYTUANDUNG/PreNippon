package com.prenippon.backend.controller;

import com.prenippon.backend.model.User;
import com.prenippon.backend.repository.UserRepository;
import com.prenippon.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Validate password (supports raw comparison for ease of seed testing or BCrypt verification)
            if (passwordEncoder.matches(password, user.getPassword()) || password.equals(user.getPassword())) {
                if ("BLOCKED".equals(user.getStatus())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(createResponse(403, "Tài khoản của bạn đã bị khóa!", null));
                }

                String token = tokenProvider.generateToken(user.getEmail(), user.getRole());
                
                Map<String, Object> data = new HashMap<>();
                data.clear();
                data.put("user", user);
                data.put("token", token);

                return ResponseEntity.ok(createResponse(200, "Đăng nhập thành công!", data));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createResponse(401, "Email hoặc mật khẩu không chính xác!", null));
    }

    private Map<String, Object> createResponse(int statusCode, String message, Object data) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.clear();
        envelope.put("statusCode", statusCode);
        envelope.put("message", message);
        envelope.put("data", data);
        return envelope;
    }
}
