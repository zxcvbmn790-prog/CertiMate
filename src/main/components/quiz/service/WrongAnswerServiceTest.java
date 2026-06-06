package main.components.quiz.service;

import com.capstone.project.quiz.dto.WrongAnswerResponse;
import com.capstone.project.quiz.repository.QuizHistoryRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class) // Mockito(가짜 객체 도구)를 사용하겠다고 선언
class WrongAnswerServiceTest {

    @Mock
    private QuizHistoryRepository quizHistoryRepository; // 1. 가짜 DB 대행사(Stub)를 만듭니다.

    @InjectMocks
    private com.capstone.project.quiz.service.WrongAnswerService wrongAnswerService; // 2. 가짜 대행사를 진짜 서비스 안에 쏙 넣어줍니다.

    @Test
    @DisplayName("오답 노트 조회 시, 틀린 문제가 없으면 빈 리스트를 반환한다")
    void getWrongAnswers_EmptyResult() {
        // given (이런 상황이 주어졌을 때 - 테스트 스텁 설정)
        Long userId = 1L;

        // 가짜 Repository에게 "1번 유저의 틀린 문제를 찾으라고 하면 텅 빈 리스트(Collections.emptyList())를 뱉어라"고 세팅 (이게 바로 스텁입니다!)
        given(quizHistoryRepository.findByUserIdAndIsCorrectFalseOrderBySolvedAtDesc(userId))
                .willReturn(Collections.emptyList());

        // when (이 행동을 했을 때 - 테스트 드라이버 발동)
        List<WrongAnswerResponse> result = wrongAnswerService.getWrongAnswers(userId);

        // then (결과가 이래야 한다 - 검증)
        assertThat(result).isEmpty(); // 결과 리스트가 진짜로 비어있는지 확인!
    }
}