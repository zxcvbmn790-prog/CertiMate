package com.example.certimate;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MockExamService {

    private final AiLearnRepository aiLearnRepository;

    // 🚨 바로 이 줄이 추가되어야 합니다! (새로 만든 Repository를 주입받음)
    private final UserQuizHistoryRepository historyRepository;

    @PostConstruct
    public void checkDatabaseStatus() {
        long count = aiLearnRepository.count();
        System.out.println("\n==================================================");
        System.out.println("🚨 [디버깅] 현재 AI_LEARN 테이블의 데이터 개수: " + count + "개");
        System.out.println("==================================================\n");
    }

    @Transactional(readOnly = true)
    public List<AiLearn> generateMockExam(Long certId) {
        List<AiLearn> mockExam = new ArrayList<>();

        // 1과목, 2과목, 3과목 순서대로 반복
        for (int subjectNum = 1; subjectNum <= 3; subjectNum++) {
            // 1. 해당 자격증(certId)과 과목(subjectNum)의 전체 문제 가져오기
            List<AiLearn> allQuestions = aiLearnRepository.findByCertIdAndSubjectNum(certId, subjectNum);

            // 2. 전체 문제를 무작위로 섞기
            Collections.shuffle(allQuestions);

            // 3. 앞에서부터 딱 20개만 잘라서 모의고사 리스트에 추가
            int limit = Math.min(allQuestions.size(), 20);
            mockExam.addAll(allQuestions.subList(0, limit));
        }

        return mockExam;
    }

    // 한 문제씩 풀기(무한 학습) 모드: 과목 구분 없이 랜덤 1문제를 뽑아 준다
    @Transactional(readOnly = true)
    public AiLearn getRandomPracticeQuestion(Long certId, List<Long> excludeIds) {
        List<AiLearn> result = (excludeIds == null || excludeIds.isEmpty())
                ? aiLearnRepository.findRandomQuestion(certId)
                : aiLearnRepository.findRandomQuestionExcluding(certId, excludeIds);

        // 제외 대상이 너무 많아 더 뽑을 문제가 없으면 제외 없이 다시 랜덤 출제한다
        if (result.isEmpty() && excludeIds != null && !excludeIds.isEmpty()) {
            result = aiLearnRepository.findRandomQuestion(certId);
        }
        return result.isEmpty() ? null : result.get(0);
    }

    @Transactional
    public List<GradedAnswerResponse> submitAndGrade(Long userId, List<QuizHistoryDto> submissions) {
        List<Long> learnIds = submissions.stream().map(QuizHistoryDto::getLearnId).toList();
        Map<Long, AiLearn> learnById = aiLearnRepository.findAllById(learnIds).stream()
                .collect(Collectors.toMap(AiLearn::getLearnId, Function.identity()));

        List<GradedAnswerResponse> results = new ArrayList<>();
        for (QuizHistoryDto dto : submissions) {
            AiLearn learn = learnById.get(dto.getLearnId());
            // AI_LEARN.answer는 보기 텍스트가 아니라 1-based 인덱스로 저장되어 있으므로
            // 실제 정답 텍스트로 변환한 뒤 사용자가 고른 보기 텍스트와 비교한다.
            String correctAnswerText = learn != null ? learn.getCorrectAnswerText() : null;
            boolean isCorrect = correctAnswerText != null && correctAnswerText.equals(dto.getUserAnswer());

            boolean isImportant = Boolean.TRUE.equals(dto.getIsImportant());

            UserQuizHistory history = new UserQuizHistory();
            history.setUserId(userId);
            history.setLearnId(dto.getLearnId());
            history.setUserAnswer(dto.getUserAnswer());
            history.setIsCorrect(isCorrect);
            history.setIsImportant(isImportant);
            historyRepository.save(history);

            results.add(new GradedAnswerResponse(
                    dto.getLearnId(),
                    learn != null ? learn.getQuestion() : null,
                    learn != null ? learn.getOptions() : null,
                    correctAnswerText,
                    dto.getUserAnswer(),
                    isCorrect,
                    learn != null ? learn.getExplanation() : null,
                    isImportant
            ));
        }
        return results;
    }
}