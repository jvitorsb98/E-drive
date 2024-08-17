package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import com.github.javafaker.Faker;
import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.MalformedTemplateNameException;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateNotFoundException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("EmailService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender emailSender;

    @Mock
    private FreeMarkerConfigurer freeMarkerConfigurer;

    @Mock
    private SpringTemplateEngine templateEngine;

    @Mock
    private Configuration configuration;

    @Mock
    private Template template;

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
    void setUp() throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException {
        MockitoAnnotations.openMocks(this); // Initialize mocks
        faker = new Faker(); // Initialize Faker

        when(freeMarkerConfigurer.getConfiguration()).thenReturn(configuration);
        when(configuration.getTemplate(anyString())).thenReturn(template);
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
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any())).thenReturn(htmlBody);

        EmailService spyEmailService = spy(emailService);
        doReturn(htmlBody).when(spyEmailService).processHtmlTemplate(anyString(), anyMap());

        // Act
        String resultToken = spyEmailService.sendActivationEmail(name, email, tokenForActivate);

        // Assert
        verify(emailSender, times(1)).send(mimeMessage);
        assertEquals(tokenForActivate, resultToken, () -> "Token should match the input token");
    }

    @Test
    @DisplayName("Test sendActivationEmail with template processing exception")
    @Order(2)
    void sendActivationEmail_TemplateProcessingException_ExceptionThrown() throws Exception {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String tokenForActivate = faker.lorem().word();
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        when(templateEngine.process(anyString(), any(Context.class)))
            .thenThrow(new RuntimeException("Failed to process email template"));

        // Act & Assert
        RuntimeException thrownException = assertThrows(RuntimeException.class, () -> {
            emailService.sendActivationEmail(name, email, tokenForActivate);
        }, "Expected sendActivationEmail to throw RuntimeException due to template processing failure");

        assertEquals("Failed to process email template", thrownException.getMessage());
    }

    @Test
    @DisplayName("Test sendResetPasswordEmail with valid parameters")
    @Order(3)
    void sendResetPasswordEmail_ValidParameters_EmailSent() throws Exception {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String token = faker.lorem().word();
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Act
        emailService.sendResetPasswordEmail(name, email, token);

        // Assert
        verify(emailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Test sendResetPasswordEmail with template processing exception")
    @Order(4)
    void sendResetPasswordEmail_TemplateProcessingException_ExceptionThrown() throws Exception {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String token = faker.lorem().word();
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new TemplateException("Failed to process email template", null)).when(template).process(any(), any());

        // Act & Assert
        assertThrows(MessagingException.class, () -> emailService.sendResetPasswordEmail(name, email, token));
    }

    @Test
    @DisplayName("Test sendActivationEmailAsync with valid parameters")
    @Order(5)
    void sendActivationEmailAsync_ValidParameters_EmailSent() throws MessagingException, InterruptedException {
        // Arrange
        String name = faker.name().fullName();
        String email = faker.internet().emailAddress();
        String tokenForActivate = faker.lorem().word();
        String htmlBody = "<html><body>Activation Link: " + tokenForActivate + "</body></html>";

        MimeMessage message = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(message);
        when(templateEngine.process(anyString(), any())).thenReturn(htmlBody);

        CountDownLatch latch = new CountDownLatch(1);

        EmailService spyEmailService = spy(emailService);
        doAnswer(invocation -> {
            invocation.callRealMethod();
            latch.countDown();
            return null;
        }).when(spyEmailService).sendActivationEmail(name, email, tokenForActivate);

        // Act
        spyEmailService.sendActivationEmailAsync(name, email, tokenForActivate);

        boolean completedInTime = latch.await(5, TimeUnit.SECONDS);

        // Assert
        assertTrue(completedInTime,  () -> "The async method did not complete in time");
        verify(spyEmailService, times(1)).sendActivationEmail(name, email, tokenForActivate);
        verify(emailSender, times(1)).send(message);
    }
}
