package com.example.certimate;

import java.time.LocalDateTime;

public record WrongAnswerResponse(
        Long historyId,
        Long learnId,
        String question,
        String options,
        String answer,
        String userAnswer,
        String explanation,
        LocalDateTime solvedAt
) {}
