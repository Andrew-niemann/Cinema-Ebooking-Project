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
            Emessage.setSubject("Updated Information Notification");
            Emessage.setText("The following changes to your account have been made:\n\n" + message);
        }

        mailSender.send(Emessage);
    }
}
