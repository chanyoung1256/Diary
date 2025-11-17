package com.diary.backend.stats;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "emotion_stats")
public class EmotionStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String weekStart;
    private String weekEnd;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String advice;

    @Column(columnDefinition = "TEXT")
    private String activities; // JSON 문자열 저장
}
