package com.diary.backend.ai;

import com.diary.backend.diary.Diary;
import com.diary.backend.diary.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiController {

    private final DiaryService diaryService;
    private final AiService aiService;

    @GetMapping("/analyze")
    public Map<String, Object> analyzeByDate(
            @RequestParam String username,
            @RequestParam String date
    ) {
        List<Diary> diaries = diaryService.getDiaryByDate(username, date);

        if (diaries.isEmpty()) {
            return Map.of(
                    "status", "NO_DIARY",
                    "message", "해당 날짜에 작성된 일기가 없습니다."
            );
        }

        List<String> contents = diaries.stream().map(Diary::getContent).toList();

        List<Map<String, Object>> analyzed = aiService.analyzeMultiple(contents);

        return Map.of(
                "status", "OK",
                "results", analyzed,
                "count", analyzed.size(),
                "date", date
        );
    }
}
