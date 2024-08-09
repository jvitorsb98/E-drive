package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.Mail;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsMail;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import br.com.cepedi.e_drive.security.repository.MailRepository;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class MailServiceTest {

    @Autowired
    private MailService mailService;

    @Autowired
    private MailRepository mailRepository;

    private Faker faker;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        mailRepository.deleteAll();
    }

    @Test
    @DisplayName("Should register a new mail and return details")
    void testRegister() {
        DataRegisterMail dataRegisterMail = new DataRegisterMail(
                faker.internet().emailAddress(),
                faker.internet().emailAddress(),
                faker.lorem().sentence(),
                faker.lorem().word()
        );

        DataDetailsMail result = mailService.register(dataRegisterMail);

        assertNotNull(result);
        assertNotNull(result.id());
        assertEquals(dataRegisterMail.from(), result.from());
        assertEquals(dataRegisterMail.to(), result.to());
        assertEquals(dataRegisterMail.content(), result.content());
        assertEquals(dataRegisterMail.subject(), result.subject());
    }

    @Test
    @DisplayName("Should register a mail with an invalid email address")
    void testRegister_InvalidEmail() {
        DataRegisterMail dataRegisterMail = new DataRegisterMail(
                "invalid-email", // E-mail inválido
                faker.internet().emailAddress(),
                faker.lorem().sentence(),
                faker.lorem().word()
        );

        
        DataDetailsMail result = mailService.register(dataRegisterMail);

        assertNotNull(result);
        assertEquals(dataRegisterMail.from(), result.from());

        Mail savedMail = mailRepository.findById(result.id()).orElse(null);
        assertNotNull(savedMail);
        assertEquals("invalid-email", savedMail.getFrom());
    }


    @Test
    @DisplayName("Should list all registered mails with pagination")
    void testListAll() {
        for (int i = 0; i < 10; i++) {
            mailService.register(new DataRegisterMail(
                    faker.internet().emailAddress(),
                    faker.internet().emailAddress(),
                    faker.lorem().sentence(),
                    faker.lorem().word()
            ));
        }

        Pageable pageable = PageRequest.of(0, 10);
        Page<DataDetailsMail> result = mailService.listAll(pageable);

        assertNotNull(result);
        assertEquals(10, result.getSize());
    }

    @Test
    @DisplayName("Should find a mail by its ID")
    void testFindById() {
        Mail mail = new Mail(
                null, faker.internet().emailAddress(),
                faker.internet().emailAddress(),
                faker.lorem().sentence(),
                faker.lorem().word()
        );
        mail = mailRepository.save(mail);

        DataDetailsMail result = mailService.findById(mail.getId());

        assertNotNull(result);
        assertEquals(mail.getId(), result.id());
        assertEquals(mail.getFrom(), result.from());
        assertEquals(mail.getTo(), result.to());
        assertEquals(mail.getContent(), result.content());
        assertEquals(mail.getSubject(), result.subject());
    }

    @Test
    @DisplayName("Should throw exception if mail not found by ID")
    void testFindById_MailNotFound() {
        Long invalidId = -1L; // ID inválido

        assertThrows(IllegalArgumentException.class, () -> {
            mailService.findById(invalidId);
        });
    }

    @Test
    @DisplayName("Should find mails by sender address")
    void testFindByFrom() {
        String sender = faker.internet().emailAddress();
        for (int i = 0; i < 5; i++) {
            mailService.register(new DataRegisterMail(
                    sender,
                    faker.internet().emailAddress(),
                    faker.lorem().sentence(),
                    faker.lorem().word()
            ));
        }

        List<DataDetailsMail> result = mailService.findByFrom(sender);

        assertNotNull(result);
        assertEquals(5, result.size());
        assertTrue(result.stream().allMatch(mail -> mail.from().equals(sender)));
    }
}
