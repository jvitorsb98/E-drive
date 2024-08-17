package br.com.cepedi.e_drive.security.repository;


import br.com.cepedi.e_drive.security.model.entitys.Mail;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.Random.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class MailRepositoryTest {

    @Autowired
    private MailRepository mailRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        mailRepository.deleteAll(); // Clear the repository before each test
    }

    private Mail createRandomMail(String fromAddress) {
        return new Mail(null, fromAddress, faker.internet().emailAddress(), faker.lorem().sentence(), faker.lorem().sentence());
    }

    @Test
    @DisplayName("Should save and find mail by ID")
    public void testSaveAndFindById() {
        // Arrange
        Mail mail = createRandomMail(faker.internet().emailAddress());
        Mail savedMail = mailRepository.save(mail);

        // Act
        Mail foundMail = mailRepository.findById(savedMail.getId()).orElse(null);

        // Assert
        assertNotNull(foundMail, () -> "Mail should be found");
        assertEquals(savedMail.getId(), foundMail.getId(), () -> "Mail ID should match");
    }

    @Test
    @DisplayName("Should find mails by 'from' field")
    public void testFindByFrom() {
        // Arrange
        String fromAddress = faker.internet().emailAddress();
        Mail mail1 = createRandomMail(fromAddress);
        Mail mail2 = createRandomMail(fromAddress);
        Mail mail3 = createRandomMail(faker.internet().emailAddress());

        mailRepository.save(mail1);
        mailRepository.save(mail2);
        mailRepository.save(mail3);

        // Act
        List<Mail> mails = mailRepository.findByFrom(fromAddress);

        // Assert
        assertFalse(mails.isEmpty(), () -> "Mails should be found by 'from' field");
        assertEquals(2, mails.size(), () -> "Two mails should be found with the same 'from' address");
        assertTrue(mails.stream().allMatch(mail -> mail.getFrom().equals(fromAddress)), () -> "All mails should have the 'from' address matching the query");
    }

    @Test
    @DisplayName("Should not find mails if 'from' field is empty")
    public void testFindByFromEmpty() {
        // Arrange
        String emptyFrom = "";

        // Act
        List<Mail> mails = mailRepository.findByFrom(emptyFrom);

        // Assert
        assertTrue(mails.isEmpty(), () -> "No mails should be found for empty 'from' field");
    }

    @Test
    @DisplayName("Should not save mail if 'from' field contains only spaces")
    public void testSaveMailWithSpacesInFrom() {
        // Arrange
        String fromWithSpaces = "     "; // ou uma string com espaços
        Mail mail = new Mail(null, fromWithSpaces, faker.internet().emailAddress(), faker.lorem().sentence(), faker.lorem().sentence());

        // Act
        Mail savedMail = mailRepository.save(mail);

        // Assert
        assertNotNull(savedMail, () -> "Mail should be saved even with spaces in 'from' field");
        assertEquals(fromWithSpaces, savedMail.getFrom(), () -> "Mail 'from' field should match the input value");
    }

    @Test
    @DisplayName("Should handle mail deletion correctly")
    public void testMailDeletion() {
        // Arrange
        String fromAddress = "delete@example.com";
        Mail mail = createRandomMail(fromAddress);
        mailRepository.save(mail);
        mailRepository.delete(mail);

        // Act
        List<Mail> mails = mailRepository.findByFrom(fromAddress);

        // Assert
        assertTrue(mails.isEmpty(), () -> "No mails should be found after deletion");
    }

    @Test
    @DisplayName("Should not find mail by non-existent ID")
    public void testFindByIdNonExistent() {
        // Act
        Optional<Mail> mailOptional = mailRepository.findById(999L);

        // Assert
        assertTrue(mailOptional.isEmpty(), () -> "No mail should be found for non-existent ID");
    }

    @Test
    @DisplayName("Should find mails with special characters in 'from' field")
    public void testFindByFromSpecialCharacters() {
        // Arrange
        String specialFrom = "!@#$%^&*()_+";
        Mail mail = createRandomMail(specialFrom);
        mailRepository.save(mail);

        // Act
        List<Mail> mails = mailRepository.findByFrom(specialFrom);

        // Assert
        assertFalse(mails.isEmpty(), () -> "Mail should be found for 'from' field with special characters");
        assertEquals(1, mails.size(), () -> "There should be exactly one mail with the special 'from' field");
    }

    @Test
    @DisplayName("Should test all constructors and methods in Mail class")
    public void testMailConstructorsAndMethods() {
        // Test default constructor
        Mail defaultMail = new Mail();
        assertNotNull(defaultMail, () -> "Default constructor should create a new Mail instance");

        // Test constructor with DataRegisterMail
        DataRegisterMail data = new DataRegisterMail("from@example.com", "to@example.com", "content", "subject");
        Mail mailFromData = new Mail(data);
        assertEquals(data.from(), mailFromData.getFrom(), () -> "Mail 'from' field should match DataRegisterMail");
        assertEquals(data.to(), mailFromData.getTo(), () -> "Mail 'to' field should match DataRegisterMail");
        assertEquals(data.content(), mailFromData.getContent(), () -> "Mail 'content' should match DataRegisterMail");
        assertEquals(data.subject(), mailFromData.getSubject(), () -> "Mail 'subject' should match DataRegisterMail");
    }
}

