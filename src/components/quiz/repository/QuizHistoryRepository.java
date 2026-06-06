package com.capstone.project.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

// Entity 이름은 프로젝트 구성에 맞게 바뀜
// 여기서는 ERD 기반으로 UserQuizHistory 클래스라고 가정
//public interface QuizHistoryRepository extends JpaRepository<UserQuizHistory, Long> {
//         // 특정 사용자의 기록 중 틀린(isCorrect = false) 이력만 최신순으로 조회
//    List<UserQuizHistory> findByUserIdAndIsCorrectFalseOrderBySolvedAtDesc(Long userId);
//}

// ----------------- 이 밑은 테스트를 위한 코드 ---------------
public interface QuizHistoryRepository {

    // 원래 있던 메서드 이름을 그대로 유지하되, 가짜 데이터를 리턴할 수 있게 디폴트 메서드로 만듭니다.
    default List<UserQuizHistory> findByUserIdAndIsCorrectFalseOrderBySolvedAtDesc(Long userId) {
        List<UserQuizHistory> fakeList = new ArrayList<>();

        // 1번 유저든 5번 유저든 무조건 가짜 오답 데이터 2개를 만들어서 리스트에 담아 보냅니다.
        fakeList.add(new UserQuizHistory(1L, userId, "틀린 답안 A", false));
        fakeList.add(new UserQuizHistory(2L, userId, "틀린 답안 B", false));

        return fakeList;
    }
}