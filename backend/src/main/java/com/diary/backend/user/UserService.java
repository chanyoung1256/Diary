//package com.diary.backend.user;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class UserService {
//
//    private final UserRepository userRepository;
//
//    public User signup(String name, String phone, String username, String password) {
//        User user = User.builder()
//                .name(name)
//                .phone(phone)
//                .username(username)
//                .password(password)
//                .build();
//        return userRepository.save(user);
//    }
//
//    // ⭐ 추가한 부분
//    public User findByUsername(String username) {
//        return userRepository.findByUsername(username);
//    }
//
//    public boolean login(String username, String password) {
//        User user = userRepository.findByUsername(username);
//        return user != null && password.equals(user.getPassword());
//    }
//}
package com.diary.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 기존 회원가입
    public User signup(String name, String phone, String username, String password) {
        User user = User.builder()
                .name(name)
                .phone(phone)
                .username(username)
                .password(password)
                .build();

        return userRepository.save(user);
    }

    // 기존 로그인
    public boolean login(String username, String password) {
        User user = userRepository.findByUsername(username);
        return user != null && password.equals(user.getPassword());
    }

    // 🔥 마이페이지: 회원 정보 조회
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 🔥 마이페이지: 비밀번호 변경
    public boolean changePassword(String username, String oldPw, String newPw) {
        User user = userRepository.findByUsername(username);

        if (user == null) return false;
        if (!user.getPassword().equals(oldPw)) return false;

        user.setPassword(newPw);
        userRepository.save(user);

        return true;
    }
}
