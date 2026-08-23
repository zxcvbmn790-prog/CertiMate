package com.example.certimate;

public record GradedAnswerResponse(
        Long learnId,
        String question,
        String options,
        String correctAnswer,
        String userAnswer,
        Boolean isCorrect,
        String explanation,
        Boolean isImportant
) {}
