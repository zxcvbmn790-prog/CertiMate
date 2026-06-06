package com.capstone.project.quiz.dto;

import java.time.LocalDateTime;

public record WrongAnswerResponse(
        Long historyId,
        Long learnId,
        String question,
        String options,       // JSON 문자열 형태
        String answer,        // 정답
        String userAnswer,    // 사용자가 제출했던 오답
        String explanation,   // 해설
        LocalDateTime solvedAt
) {}