package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.email.EmailService;
import br.com.cepedi.e_drive.security.service.mail.MailService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import com.github.javafaker.Faker;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("EmailService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender emailSender;

    @Mock
    private SpringTemplateEngine templateEngine;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private MailService mailService;

    @InjectMocks
    private EmailService emailService;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Inicializa os mocks
        faker = new Faker(); // Inicializa o Faker
    }

    @Test
    @DisplayName("Test sendActivationEmail with valid parameters")
    @Order(1)
    void sendActivationEmail_ValidParameters_EmailSent() throws Exception {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String tokenForActivate = faker.lorem().word();
        String htmlBody = "<html><body>Activation Link: " + tokenForActivate + "</body></html>";

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn(htmlBody);

        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
        doNothing().when(emailSender).send(mimeMessage); // Simula o envio do e-mail

        // Act
        emailService.sendActivationEmail(name, email, tokenForActivate);

        // Assert
        verify(emailSender, times(1)).send(mimeMessage);
    }

    @Test
    @DisplayName("Test sendResetPasswordEmail with valid parameters")
    @Order(2)
    void sendResetPasswordEmail_ValidParameters_EmailSent() throws Exception {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String token = faker.lorem().word();
        String htmlBody = "<html><body>Password Reset Link: " + token + "</body></html>";

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn(htmlBody);

        doNothing().when(emailSender).send(mimeMessage); // Simula o envio do e-mail

        // Act
        emailService.sendResetPasswordEmail(name, email, token);

        // Assert
        verify(emailSender, times(1)).send(mimeMessage);
    }

    @Test
    @DisplayName("Test sendReactivationEmail with valid parameters")
    @Order(3)
    void sendReactivationEmail_ValidParameters_EmailSent() throws Exception {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String tokenForReactivation = faker.lorem().word();
        String htmlBody = "<html><body>Reactivation Link: " + tokenForReactivation + "</body></html>";

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn(htmlBody);

        doNothing().when(emailSender).send(mimeMessage); // Simula o envio do e-mail

        // Act
        emailService.sendReactivationEmail(name, email, tokenForReactivation);

        // Assert
        verify(emailSender, times(1)).send(mimeMessage);
    }

    @Test
    @DisplayName("Test sendActivationEmailAsync with valid parameters")
    @Order(4)
    void sendActivationEmailAsync_ValidParameters_EmailSent() throws MessagingException {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String tokenForActivate = faker.lorem().word();
        String htmlBody = "<html><body>Activation Link: " + tokenForActivate + "</body></html>";

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any())).thenReturn(htmlBody);

        // Act
        emailService.sendActivationEmailAsync(name, email, tokenForActivate);

        // Assert
        verify(emailSender, times(1)).send(mimeMessage);
    }

    @Test
    @DisplayName("Test sendResetPasswordEmailAsync with valid parameters")
    @Order(5)
    void sendResetPasswordEmailAsync_ValidParameters_EmailSent() throws MessagingException {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String token = faker.lorem().word();
        String htmlBody = "<html><body>Password Reset Link: " + token + "</body></html>";

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any())).thenReturn(htmlBody);

        // Act
        emailService.sendResetPasswordEmailAsync(name, email, token);

        // Assert
        verify(emailSender, times(1)).send(mimeMessage);
    }

    @Test
    @DisplayName("Test sendReactivationEmailAsync with valid parameters")
    @Order(6)
    void sendReactivationEmailAsync_ValidParameters_EmailSent() throws MessagingException {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String tokenForReactivation = faker.lorem().word();
        String htmlBody = "<html><body>Reactivation Link: " + tokenForReactivation + "</body></html>";

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any())).thenReturn(htmlBody);

        // Act
        emailService.sendReactivationEmailAsync(name, email, tokenForReactivation);

        // Assert
        verify(emailSender, times(1)).send(mimeMessage);
    }
}
