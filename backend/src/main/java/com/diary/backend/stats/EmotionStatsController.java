package com.diary.backend.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EmotionStatsController {

    private final EmotionStatsService service;

    @PostMapping("/stats/save")
    public String saveStats(@RequestBody Map<String, Object> body) {

        service.saveStats(
                (String) body.get("username"),
                (String) body.get("weekStart"),
                (String) body.get("weekEnd"),
                (String) body.get("summary"),
                (String) body.get("advice"),
                (String) body.get("activities")
        );

        return "감정 통계 저장 완료";
    }
}
