package com.example.certimate;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // CORS 허용 (개발 환경용)
@RestController
@RequestMapping("/api/exams/history")
@RequiredArgsConstructor
public class WrongAnswerController {

    private final WrongAnswerService wrongAnswerService;

    // 오답노트: 특정 유저가 틀린 문제 목록 조회
    // 로그인 기능이 아직 없으므로 임시로 PathVariable로 userId를 받는다
    @GetMapping("/wrong/{userId}")
    public ResponseEntity<List<WrongAnswerResponse>> getWrongAnswers(@PathVariable Long userId) {
        return ResponseEntity.ok(wrongAnswerService.getWrongAnswers(userId));
    }
}
