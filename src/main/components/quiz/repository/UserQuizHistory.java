package com.capstone.project.quiz.repository;

import lombok.Getter;
import lombok.Setter;
//import java.annotation.processing.Generated; // 임시 사용용
//import java.datetime; // 만약 LocalDateTime 에러나면 지우고 아래거 쓰세요
import java.time.LocalDateTime;

@Getter
@Setter
public class UserQuizHistory {
    private Long historyId;
    private Long userId;
    private Long learnId;
    private String userAnswer;
    private boolean isCorrect;
    private LocalDateTime solvedAt;

    // 테스트용 가짜 데이터를 쉽게 만들기 위한 생성자
    public UserQuizHistory(Long historyId, Long userId, String userAnswer, boolean isCorrect) {
        this.historyId = historyId;
        this.userId = userId;
        this.userAnswer = userAnswer;
        this.isCorrect = isCorrect;
        this.solvedAt = LocalDateTime.now();
    }

    // 기존 서비스 코드(WrongAnswerService)가 에러 나지 않도록 가짜 매서드 연결용
    public UserQuizHistory getAiLearn() {
        return this;
    }
    public Long getLearnId() { return 100L; }
    public String getQuestion() { return "가짜 오답 문제입니다. 스프링 부트가 잘 작동하나요?"; }
    public String getOptions() { return "['네', '아니오']"; }
    public String getAnswer() { return "네"; }
    public String getExplanation() { return "오답노트 기능이 정상 작동하면 '네'가 정답입니다."; }
}