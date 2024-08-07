package br.com.cepedi.e_drive.security.model.entitys;

import com.github.javafaker.Faker;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Mail")
public class MailTest {

    private Faker faker;
    private Mail mail;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        mail = new Mail(
                new DataRegisterMail(
                        faker.internet().emailAddress(),  // sender
                        faker.internet().emailAddress(),  // recipient
                        faker.lorem().paragraph(),        // content
                        faker.lorem().sentence()          // subject
                )
        );
    }

    @Test
    @DisplayName("Test creation of Mail entity")
    void testMailCreation() {
        assertNotNull(mail);
        assertNotNull(mail.getFrom());
        assertNotNull(mail.getTo());
        assertNotNull(mail.getContent());
        assertNotNull(mail.getSubject());
    }

    @Test
    @DisplayName("Test setting and getting sender")
    void testSetAndGetSender() {
        String newSender = faker.internet().emailAddress();
        mail.setFrom(newSender);
        assertEquals(newSender, mail.getFrom());
    }

    @Test
    @DisplayName("Test setting and getting recipient")
    void testSetAndGetRecipient() {
        String newRecipient = faker.internet().emailAddress();
        mail.setTo(newRecipient);
        assertEquals(newRecipient, mail.getTo());
    }

    @Test
    @DisplayName("Test setting and getting content")
    void testSetAndGetContent() {
        String newContent = faker.lorem().paragraph();
        mail.setContent(newContent);
        assertEquals(newContent, mail.getContent());
    }

    @Test
    @DisplayName("Test setting and getting subject")
    void testSetAndGetSubject() {
        String newSubject = faker.lorem().sentence();
        mail.setSubject(newSubject);
        assertEquals(newSubject, mail.getSubject());
    }

    @Test
    @DisplayName("Test Mail entity with null values")
    void testMailWithNullValues() {
        Mail nullMail = new Mail(new DataRegisterMail(null, null, null, null));
        assertNull(nullMail.getFrom());
        assertNull(nullMail.getTo());
        assertNull(nullMail.getContent());
        assertNull(nullMail.getSubject());
    }
}

