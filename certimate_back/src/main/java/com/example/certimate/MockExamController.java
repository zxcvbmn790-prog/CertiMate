package com.example.certimate;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class MockExamController {

    private final MockExamService mockExamService;

    // 1. 모의고사 출제 API (정답/해설은 채점 전까지 노출하지 않는다)
    @GetMapping("/{certId}/mock")
    public ResponseEntity<List<MockExamQuestionResponse>> getMockExam(@PathVariable Long certId) {
        List<MockExamQuestionResponse> questions = mockExamService.generateMockExam(certId).stream()
                .map(MockExamQuestionResponse::from)
                .toList();
        return ResponseEntity.ok(questions);
    }

    // 1-1. 한 문제씩 풀기(무한 학습) 모드: 랜덤 1문제 출제 (정답/해설 미포함)
    // excludeIds: 직전에 풀었던 learnId들을 쉼표로 구분해 넘기면 연속 중복 출제를 피한다
    @GetMapping("/{certId}/practice")
    public ResponseEntity<MockExamQuestionResponse> getPracticeQuestion(
            @PathVariable Long certId,
            @RequestParam(required = false) String excludeIds) {
        List<Long> excluded = (excludeIds == null || excludeIds.isBlank())
                ? List.of()
                : Arrays.stream(excludeIds.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .map(Long::valueOf)
                        .toList();

        AiLearn question = mockExamService.getRandomPracticeQuestion(certId, excluded);
        if (question == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(MockExamQuestionResponse.from(question));
    }

    // 2. 모의고사 제출 -> 서버 채점 후 결과(오답노트용 이력 저장 포함) 반환
    @PostMapping("/history")
    public ResponseEntity<List<GradedAnswerResponse>> saveExamHistory(@RequestBody List<QuizHistoryDto> submissions) {
        // 🚨 임시 조치: 백엔드에 로그인 연동이 아직 없어 userId를 고정값으로 저장한다.
        // users 테이블에 실제로 존재하는 계정 id로 맞춰뒀을 뿐, 근본 해결책은 아니다.
        // 로그인 연동 시 인증된 사용자의 id로 교체해야 한다.
        Long userId = 3L;
        return ResponseEntity.ok(mockExamService.submitAndGrade(userId, submissions));
    }
}