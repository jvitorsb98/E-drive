package br.com.cepedi.e_drive.security.repository;


import br.com.cepedi.e_drive.security.model.entitys.Mail;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.Random.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension.class)
public class MailRepositoryTest {

    @Autowired
    private MailRepository mailRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        // Clear the repository before each test
        mailRepository.deleteAll();
    }

    @Test
    @DisplayName("Should save and find mail by ID")
    public void testSaveAndFindById() {
        // Arrange
        Mail mail = new Mail(null, faker.internet().emailAddress(), faker.internet().emailAddress(), faker.lorem().sentence(),faker.lorem().sentence());
        Mail savedMail = mailRepository.save(mail);

        // Act
        Mail foundMail = mailRepository.findById(savedMail.getId()).orElse(null);

        // Assert
        assertNotNull(foundMail, "Mail should be found");
        assertEquals(savedMail.getId(), foundMail.getId(), "Mail ID should match");
    }

    @Test
    @DisplayName("Should find mails by 'from' field")
    public void testFindByFrom() {
        // Arrange
        String fromAddress = faker.internet().emailAddress();
        Mail mail1 = new Mail(null, fromAddress, faker.internet().emailAddress(), faker.lorem().sentence(), faker.lorem().sentence());
        mailRepository.save(mail1);

        Mail mail2 = new Mail(null, fromAddress, faker.internet().emailAddress(), faker.lorem().sentence(), faker.lorem().sentence());
        mailRepository.save(mail2);

        Mail mail3 = new Mail(null, faker.internet().emailAddress(), faker.internet().emailAddress(), faker.lorem().sentence(), faker.lorem().sentence());
        mailRepository.save(mail3);

        // Act
        List<Mail> mails = mailRepository.findByFrom(fromAddress);

        // Assert
        assertFalse(mails.isEmpty(), "Mails should be found by 'from' field");
        assertEquals(2, mails.size(), "Two mails should be found with the same 'from' address");
        assertTrue(mails.stream().allMatch(mail -> mail.getFrom().equals(fromAddress)), "All mails should have the 'from' address matching the query");
    }
}
