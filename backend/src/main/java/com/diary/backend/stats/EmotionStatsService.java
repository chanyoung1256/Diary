package com.diary.backend.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmotionStatsService {

    private final EmotionStatsRepository repo;

    public EmotionStats saveStats(String username, String weekStart, String weekEnd,
                                  String summary, String advice, String activities) {

        EmotionStats stats = EmotionStats.builder()
                .username(username)
                .weekStart(weekStart)
                .weekEnd(weekEnd)
                .summary(summary)
                .advice(advice)
                .activities(activities)
                .build();

        return repo.save(stats);
    }
}