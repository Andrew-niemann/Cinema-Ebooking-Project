package com.example.backend.repositories;

import com.example.backend.entities.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entities.User;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    
    Optional<VerificationToken> findByToken(String token);
    
    Optional<VerificationToken> findByTokenAndUserEmail(String token, String email);

    void deleteByUser(User user);

    void deleteByUserId(Long userId);
}
