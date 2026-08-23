package com.example.certimate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Entity
@Table(name = "ai_learn")
@Getter
@NoArgsConstructor
public class AiLearn {

    private static final ObjectMapper OPTIONS_MAPPER = new ObjectMapper();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learnId;

    @Column(name = "cert_id", nullable = false)
    private Long certId;

    @Column(name = "subject_num", nullable = false)
    private Integer subjectNum;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "JSON", nullable = false)
    private String options;

    @Column(nullable = false)
    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // answer 컬럼은 보기 텍스트가 아니라 1-based 인덱스("1"~"4")로 저장되어 있다.
    // 채점/정답 표시를 위해 options에서 실제 정답 텍스트를 찾아 반환한다.
    public String getCorrectAnswerText() {
        try {
            String[] parsedOptions = OPTIONS_MAPPER.readValue(options, String[].class);
            int index = Integer.parseInt(answer.trim()) - 1;
            if (index >= 0 && index < parsedOptions.length) {
                return parsedOptions[index];
            }
        } catch (RuntimeException ignored) {
            // 파싱에 실패하면 원본 값을 그대로 반환한다
        }
        return answer;
    }
}
