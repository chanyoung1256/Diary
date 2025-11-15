package com.diary.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User signup(String name, String phone, String username, String password) {
        User user = User.builder()
                .name(name)
                .phone(phone)
                .username(username)
                .password(password)
                .build();
        return userRepository.save(user);
    }

    // ⭐ 추가한 부분
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean login(String username, String password) {
        User user = userRepository.findByUsername(username);
        return user != null && password.equals(user.getPassword());
    }
}
