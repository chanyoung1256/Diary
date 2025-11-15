package com.diary.backend.diary;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DiaryController {

    private final DiaryService diaryService;
    private final DiaryRepository diaryRepository; // ⭐ 추가된 부분

    // 저장
    @PostMapping("/diary/save")
    public String saveDiary(@RequestBody Diary diary) {
        diaryService.saveDiary(
                diary.getUsername(),
                diary.getDate(),
                diary.getContent(),
                diary.getEmotion()
        );
        return "일기 저장 성공!";
    }

    // 전체 리스트 조회
    @GetMapping("/diary/list")
    public List<Diary> getDiaryList(@RequestParam String username) {
        return diaryService.getDiaryList(username);
    }

    // ⭐ 날짜별 여러 개 반환
    @GetMapping("/diary/date")
    public List<Diary> getDiaryByDate(@RequestParam String username, @RequestParam String date) {
        return diaryService.getDiaryByDate(username, date);
    }

    // ⭐ ID로 단일 조회 (상세 페이지용)
    @GetMapping("/diary/get")
    public Diary getDiary(@RequestParam Long id) {
        return diaryRepository.findById(id).orElse(null);
    }

    // 수정
    @PutMapping("/diary/update")
    public String updateDiary(@RequestBody Diary diary) {
        diaryService.updateDiary(diary);
        return "일기 수정 완료!";
    }

    // 삭제
    @DeleteMapping("/diary/delete/{id}")
    public String deleteDiary(@PathVariable Long id) {
        diaryService.deleteDiary(id);
        return "일기 삭제 완료!";
    }
}
