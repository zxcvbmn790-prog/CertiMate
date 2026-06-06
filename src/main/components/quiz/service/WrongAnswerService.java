package com.capstone.project.quiz.service;

import com.capstone.project.quiz.dto.WrongAnswerResponse;
import com.capstone.project.quiz.repository.QuizHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WrongAnswerService {

    private final QuizHistoryRepository quizHistoryRepository;

    /**
     * 특정 유저의 오답 노트 리스트 조회
     */
//    public List<WrongAnswerResponse> getWrongAnswers(Long userId) {
//        return quizHistoryRepository.findByUserIdAndIsCorrectFalseOrderBySolvedAtDesc(userId)
//                .stream()
//                .map(history -> new WrongAnswerResponse(
//                        history.getHistoryId(),
//                        history.getAiLearn().getLearnId(), // 연관관계 매핑 필요
//                        history.getAiLearn().getQuestion(),
//                        history.getAiLearn().getOptions(),
//                        history.getAiLearn().getAnswer(),
//                        history.getUserAnswer(),
//                        history.getAiLearn().getExplanation(),
//                        history.getSolvedAt()
//                ))
//                .toList();
//    }

    // ... 기존 상단 코드 생략 ...
    public List<WrongAnswerResponse> getWrongAnswers(Long userId) {
        return quizHistoryRepository.findByUserIdAndIsCorrectFalseOrderBySolvedAtDesc(userId)
                .stream()
                .map(history -> new WrongAnswerResponse(
                        history.getHistoryId(),
                        history.getLearnId(),
                        history.getQuestion(),
                        history.getOptions(),
                        history.getAnswer(),
                        history.getUserAnswer(),
                        history.getExplanation(),
                        history.getSolvedAt()
                ))
                .toList();
    }
}