package com.diary.backend.ai;

import com.diary.backend.diary.Diary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RequiredArgsConstructor
@Service
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final AiAnalysisRepository aiRepo;

    private static final String FASTAPI_URL = "http://localhost:5001/analyze/multiple";

    public List<Map<String, Object>> analyzeMultiple(List<String> contents) {
        Map<String, Object> body = Map.of("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(FASTAPI_URL, entity, Map.class);

        return (List<Map<String, Object>>) response.getBody().get("results");
    }

    // ⭐ 분석 결과 DB 저장
    public void saveResults(List<Map<String, Object>> results, List<Diary> diaries, String username) {
        for (int i = 0; i < results.size(); i++) {

            Map<String, Object> r = results.get(i);
            Diary diary = diaries.get(i);

            AiAnalysis data = new AiAnalysis();
            data.setDiaryId(diary.getId());
            data.setUsername(username);
            data.setContent(diary.getContent());
            data.setEmotion((String) r.get("emotion"));
            data.setComfortMessage((String) r.get("comfort_message"));
            data.setRegulateTip((String) r.get("regulate_tip"));
            data.setActivityRecommendation((String) r.get("activity_recommendation"));

            aiRepo.save(data);
        }
    }
}
