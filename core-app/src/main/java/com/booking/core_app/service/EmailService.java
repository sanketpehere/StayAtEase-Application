package com.booking.core_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String token) {
        String verificationLink = "http://localhost:3000/verify-email?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify your StayAtEase account");
            helper.setText("""
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e53e3e;">Welcome to StayAtEase!</h2>
                        <p>Thanks for signing up. Please verify your email address by clicking the button below.</p>
                        <a href="%s"
                           style="display: inline-block; background-color: #e53e3e; color: white;
                                  padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                           Verify Email
                        </a>
                        <p style="color: #666; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
                    </div>
                    """.formatted(verificationLink), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }
}