package com.example.backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String type, String message) {

        SimpleMailMessage Emessage = new SimpleMailMessage();
        Emessage.setTo(toEmail);

        if (type.equals("reg ver")) {
            Emessage.setSubject("Verify Your Email");
            Emessage.setText(
                "Below is your verification code:\n\n" + message
            );
        }
        if (type.equals("Password Reset")) {
            Emessage.setSubject("Reset Your Password");
            Emessage.setText(
                "Below is your password reset code:\n\n" + message
            );
        }
        if (type.equals("update info")) {
            Emessage.setSubject("Updated Profile Information Notification");
            Emessage.setText("Your profile information has been updated successfully. If you did not make this change, please change your password immediately and contact our support team.");
        }

        mailSender.send(Emessage);
    }
}
