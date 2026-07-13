package com.example.certimate;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserQuizHistoryRepository extends JpaRepository<UserQuizHistory, Long> {
    List<UserQuizHistory> findByUserIdAndIsCorrectFalseOrderBySolvedAtDesc(Long userId);
}