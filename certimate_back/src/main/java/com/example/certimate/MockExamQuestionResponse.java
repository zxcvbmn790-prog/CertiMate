package com.example.certimate;

public record MockExamQuestionResponse(
        Long learnId,
        Long certId,
        Integer subjectNum,
        String question,
        String options
) {
    public static MockExamQuestionResponse from(AiLearn aiLearn) {
        return new MockExamQuestionResponse(
                aiLearn.getLearnId(),
                aiLearn.getCertId(),
                aiLearn.getSubjectNum(),
                aiLearn.getQuestion(),
                aiLearn.getOptions()
        );
    }
}
