package com.example.certimate;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WrongAnswerService {

    private final UserQuizHistoryRepository userQuizHistoryRepository;
    private final AiLearnRepository aiLearnRepository;

    public List<WrongAnswerResponse> getWrongAnswers(Long userId) {
        List<UserQuizHistory> wrongHistories =
                userQuizHistoryRepository.findByUserIdAndIsCorrectFalseOrderBySolvedAtDesc(userId);

        List<Long> learnIds = wrongHistories.stream()
                .map(UserQuizHistory::getLearnId)
                .distinct()
                .toList();

        Map<Long, AiLearn> learnById = aiLearnRepository.findAllById(learnIds).stream()
                .collect(Collectors.toMap(AiLearn::getLearnId, Function.identity()));

        return wrongHistories.stream()
                .map(history -> {
                    AiLearn learn = learnById.get(history.getLearnId());
                    return new WrongAnswerResponse(
                            history.getHistoryId(),
                            history.getLearnId(),
                            learn != null ? learn.getQuestion() : null,
                            learn != null ? learn.getOptions() : null,
                            learn != null ? learn.getAnswer() : null,
                            history.getUserAnswer(),
                            learn != null ? learn.getExplanation() : null,
                            history.getSolvedAt()
                    );
                })
                .toList();
    }
}
