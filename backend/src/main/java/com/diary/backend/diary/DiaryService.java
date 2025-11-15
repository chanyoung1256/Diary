package com.diary.backend.diary;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;

    // 저장
    public Diary saveDiary(String username, String date, String content, String emotion) {
        Diary diary = Diary.builder()
                .username(username)
                .date(date)
                .content(content)
                .emotion(emotion)
                .build();
        return diaryRepository.save(diary);
    }

    // 전체 리스트 조회
    public List<Diary> getDiaryList(String username) {
        return diaryRepository.findByUsername(username);
    }

    // ⭐ 날짜별 여러 개 조회 (중요)
    public List<Diary> getDiaryByDate(String username, String date) {
        return diaryRepository.findByUsernameAndDate(username, date);
    }

    // 수정
    public Diary updateDiary(Diary diary) {
        Diary existing = diaryRepository.findById(diary.getId())
                .orElseThrow(() -> new RuntimeException("일기를 찾을 수 없습니다."));

        existing.setContent(diary.getContent());
        existing.setEmotion(diary.getEmotion());
        existing.setDate(diary.getDate());

        return diaryRepository.save(existing);
    }

    // 삭제
    public void deleteDiary(Long id) {
        diaryRepository.deleteById(id);
    }

    // ⭐ AI 분석 결과 자동 저장
    public Diary saveEmotionResult(String username, String date, String content, String emotion) {
        Diary diary = Diary.builder()
                .username(username)
                .date(date)
                .content(content)
                .emotion(emotion)
                .build();

        return diaryRepository.save(diary);
    }


}
