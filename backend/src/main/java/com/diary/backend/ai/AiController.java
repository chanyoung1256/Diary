package com.diary.backend.ai;

import com.diary.backend.diary.Diary;
import com.diary.backend.diary.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AiController {

    private final DiaryService diaryService;
    private final AiService aiService;
    private final AiAnalysisRepository aiRepo;

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

        aiService.saveResults(analyzed, diaries, username);

        return Map.of(
                "status", "OK",
                "results", analyzed,
                "count", analyzed.size(),
                "date", date
        );
    }

    // ⭐ 마이페이지용 API
    @GetMapping("/history")
    public List<AiAnalysis> getHistory(@RequestParam String username) {
        return aiRepo.findByUsername(username);
    }
}
