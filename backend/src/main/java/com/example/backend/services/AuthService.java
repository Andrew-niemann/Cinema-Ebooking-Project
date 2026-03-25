package com.example.backend.services;

import com.example.backend.dtos.AuthDtos.AuthResponse;
import com.example.backend.dtos.AuthDtos.LoginRequest;
import com.example.backend.dtos.AuthDtos.RegisterRequest;
import com.example.backend.entities.User;
import com.example.backend.entities.VerificationToken;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.VerificationTokenRepository;
import com.example.backend.services.JwtService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.enums.Role;
import com.example.backend.enums.UserStatus;
import com.example.backend.dtos.AddressDto;
import com.example.backend.entities.Address; 
import com.example.backend.entities.PaymentCard;
import com.example.backend.dtos.CardDto;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Autowired
    public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   VerificationTokenRepository tokenRepository,
                   EmailService emailService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.tokenRepository = tokenRepository;
    this.emailService = emailService;
    }

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        // 1️⃣ Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // 2️⃣ Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        if (request.getPassword() == null || request.getPassword().trim().isEmpty() || request.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Password must be at least 6 characters long");
        }
        
        // 3️⃣ Hash password
        String hashed = passwordEncoder.encode(request.getPassword());
        user.setPasswordHash(hashed);

        // create address if provided
        if (request.getAddress() != null) {
            AddressDto dto = request.getAddress();

            Address address = new Address();
            address.setStreet(dto.getStreet());
            address.setCity(dto.getCity());
            address.setState(dto.getState());
            address.setZip(dto.getZip());
            user.setAddress(address);
        }

        if (request.getCard() != null) {
            if (user.getCards().size() >= 3) {
                throw new RuntimeException("Cannot have more than 3 cards");
            }

            CardDto cardDto = request.getCard();

            PaymentCard card = new PaymentCard();
            card.setDigits(cardDto.getDigits());
            card.setExpirationYear(cardDto.getExpirationYear());
            card.setExpirationMonth(cardDto.getExpirationMonth());
            card.setCvv(cardDto.getCvv());

            card.setUser(user); // important for relationship

            user.getCards().add(card);
        }


        // 4️⃣ Set defaults
        user.setRole(Role.CUSTOMER);
        user.setStatus(UserStatus.INACTIVE); 

        // 5️⃣ Save to DB
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User could not be saved: duplicate or invalid data");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Database error occurred");
        }
        sendVerificationEmail(user);
        
        return new AuthResponse(true, "User registered successfully. A confirmation email has been sent to your email address.", null, null, null);
        
    }

    public void sendVerificationEmail(User user) {

        // delete old codes first
        tokenRepository.deleteByUser(user);
        
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(code);
        verificationToken.setUser(user);

        tokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), "reg ver", code);
    }

    public AuthResponse verifyEmail(String email, String code) {

        // Find token by code + email
        VerificationToken token = tokenRepository
          .findByTokenAndUserEmail(code, email)
          .orElse(null);

        if (token == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid verification code");
        }

        // Activate user
        User user = token.getUser();
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        // Delete token (important)
        tokenRepository.delete(token);

        return new AuthResponse(true, "Account verified successfully", null, null, null);
    }

    public AuthResponse login(LoginRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userOptional.get();

        if(user.getStatus() != UserStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not active. Please verify your email.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(true, "Login successful", token, user.getEmail(), user.getRole().name());
    }

    public AuthResponse forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found");
        }

        User user = userOptional.get();

        // Generate reset code
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);

        // Save code to DB (reusing verification token table for simplicity)
        VerificationToken token = new VerificationToken();
        token.setToken(code);
        token.setUser(user);
        tokenRepository.save(token);

        // Send email
        emailService.sendVerificationEmail(user.getEmail(), "Password Reset", code);

        return new AuthResponse(true, "Password reset code sent to email", null, null, null);
    }

    public AuthResponse verifyPasswordResetCode(String email, String code, String newPassword) {
        VerificationToken token = tokenRepository
          .findByTokenAndUserEmail(code, email)
          .orElse(null);

        if (token == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid password reset code");
        }

        if (newPassword.length() < 6 || newPassword == null || newPassword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be at least 6 characters long");
        }

        try {
            User user = token.getUser();
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            tokenRepository.delete(token);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error resetting password");
        }

        return new AuthResponse(true, "Password reset confirmed. Please log in with your new password.", null, null, null);
    }
}
