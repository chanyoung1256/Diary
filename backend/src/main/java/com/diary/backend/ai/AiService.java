package com.diary.backend.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();

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
}
