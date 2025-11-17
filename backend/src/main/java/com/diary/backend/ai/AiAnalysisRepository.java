package com.diary.backend.ai;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {
    List<AiAnalysis> findByUsername(String username);
}
