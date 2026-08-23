package com.example.certimate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_quiz_history") // 소문자 통일
@Getter
@Setter
@NoArgsConstructor
public class UserQuizHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    private Long userId;
    private Long learnId;

    private String userAnswer;
    private Boolean isCorrect;
    private Boolean isImportant;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime solvedAt;

    @PrePersist
    public void prePersist() {
        this.solvedAt = LocalDateTime.now();
    }

}