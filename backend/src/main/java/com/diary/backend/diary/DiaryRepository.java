package com.diary.backend.diary;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    // 전체 일기 조회 (유저별)
    List<Diary> findByUsername(String username);

    // 🔥 날짜 + 유저 조합으로 여러 개 조회하도록 변경
    List<Diary> findByUsernameAndDate(String username, String date);

    // 필요하면 여러 날짜 한번에 조회 가능
    List<Diary> findByUsernameAndDateIn(String username, List<String> dates);
}
