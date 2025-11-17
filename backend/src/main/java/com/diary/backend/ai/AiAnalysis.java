package com.diary.backend.ai;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "ai_analysis")
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "diary_id", nullable = false)
    private Long diaryId;

    @Column(nullable = false)
    private String username;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String emotion;

    @Column(name = "comfort_message", columnDefinition = "TEXT")
    private String comfortMessage;

    @Column(name = "regulate_tip", columnDefinition = "TEXT")
    private String regulateTip;

    @Column(name = "activity_recommendation", columnDefinition = "TEXT")
    private String activityRecommendation;

    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt = LocalDateTime.now();
}
