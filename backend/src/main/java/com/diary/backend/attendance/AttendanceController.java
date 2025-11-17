package com.diary.backend.attendance;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AttendanceController {

    private final AttendanceRepository repo;

    // 출석 리스트
    @GetMapping("/list")
    public List<Attendance> getList(@RequestParam String username) {
        return repo.findByUsername(username);
    }

    // 출석 체크 (오늘 날짜 자동 입력)
    @PostMapping("/check")
    public Attendance check(@RequestParam String username) {
        Attendance a = new Attendance();
        a.setUsername(username);
        a.setDate(LocalDate.now().toString());
        return repo.save(a);
    }
}
