package com.diary.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        userService.signup(
                user.getName(),
                user.getPhone(),
                user.getUsername(),
                user.getPassword()
        );
        return "회원가입 성공!";
    }
    @PostMapping("/login")
    public Object login(@RequestBody User user) {
        User found = userService.findByUsername(user.getUsername());

        if (found != null && found.getPassword().equals(user.getPassword())) {
            return found;  // ⭐ 전체 user JSON 반환
        }

        return "로그인 실패!";
    }

}
