//package com.diary.backend.user;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
//public class AuthController {
//
//    private final UserService userService;
//
//    @PostMapping("/signup")
//    public String signup(@RequestBody User user) {
//        userService.signup(
//                user.getName(),
//                user.getPhone(),
//                user.getUsername(),
//                user.getPassword()
//        );
//        return "회원가입 성공!";
//    }
//    @PostMapping("/login")
//    public Object login(@RequestBody User user) {
//        User found = userService.findByUsername(user.getUsername());
//
//        if (found != null && found.getPassword().equals(user.getPassword())) {
//            return found;  // ⭐ 전체 user JSON 반환
//        }
//
//        return "로그인 실패!";
//    }
//
//}
package com.diary.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AuthController {

    private final UserService userService;

    // ------------------------ 기존 기능 ------------------------

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
            return found;  // 기존처럼 전체 User JSON 반환
        }

        return "로그인 실패!";
    }

    // ------------------------ 마이페이지 기능 ------------------------

    // 1) 회원 정보 조회
    @GetMapping("/user/info")
    public User getUserInfo(@RequestParam String username) {
        return userService.findByUsername(username);
    }

    // 2) 비밀번호 변경
    @PostMapping("/user/change-password")
    public Map<String, String> changePassword(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String oldPw = req.get("oldPassword");
        String newPw = req.get("newPassword");

        boolean ok = userService.changePassword(username, oldPw, newPw);

        if (!ok) {
            return Map.of(
                    "status", "FAIL",
                    "message", "비밀번호가 올바르지 않습니다."
            );
        }

        return Map.of(
                "status", "OK",
                "message", "비밀번호가 변경되었습니다."
        );
    }
}
