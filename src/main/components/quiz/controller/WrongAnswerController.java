package com.capstone.project.quiz.controller;

import com.capstone.project.quiz.dto.WrongAnswerResponse;
import com.capstone.project.quiz.service.WrongAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class WrongAnswerController {

    private final WrongAnswerService wrongAnswerService;

    /**
     * 로그인한 유저의 오답 리스트 가져오기
     * (실무에서는 시큐리티 세션이나 JWT 토큰에서 userId를 추출하지만, 우선 테스트용으로 PathVariable을 씁시다!)
     */
    @GetMapping("/wrong-answers/{userId}")
    public ResponseEntity<List<WrongAnswerResponse>> getWrongAnswers(@PathVariable("userId") Long userId) {
        List<WrongAnswerResponse> response = wrongAnswerService.getWrongAnswers(userId);
        return ResponseEntity.ok(response);
    }
}