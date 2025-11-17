package com.diary.backend.stats;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmotionStatsRepository extends JpaRepository<EmotionStats, Long> {
    List<EmotionStats> findByUsername(String username);
}
