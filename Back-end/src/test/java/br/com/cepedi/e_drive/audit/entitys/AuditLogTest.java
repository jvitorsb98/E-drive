package br.com.cepedi.e_drive.audit.entitys;


import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.security.model.entitys.User;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity AuditLog")
public class AuditLogTest {

    private Faker faker;
    private DataRegisterAudit data;
    private User user;
    private AuditLog auditLog;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        user = mock(User.class);
        data = mock(DataRegisterAudit.class);

        when(data.eventName()).thenReturn(faker.lorem().word());
        when(data.eventDescription()).thenReturn(faker.lorem().sentence());
        when(data.affectedResource()).thenReturn(faker.lorem().word());
        when(data.origin()).thenReturn(faker.internet().ipV4Address());

        auditLog = new AuditLog(data, user);
    }

    @Test
    @DisplayName("Test AuditLog creation with DataRegisterAudit and User")
    void testAuditLogCreation() {
        // Act
        String actualEventName = auditLog.getEventName();

        // Assert
        assertNotNull(auditLog, () -> "AuditLog should not be null");
        assertEquals(data.eventName(), actualEventName, () -> "The event name should be set correctly from DataRegisterAudit");
        assertNotNull(auditLog.getTimestamp(), () -> "The timestamp should be automatically set during creation");
    }

    @Test
    @DisplayName("Test AuditLog setters and getters")
    void testAuditLogSettersAndGetters() {
        // Arrange
        String eventName = faker.lorem().word();
        String eventDescription = faker.lorem().sentence();
        Date timestamp = new Date();
        String affectedResource = faker.lorem().word();
        String origin = faker.internet().ipV4Address();

        // Act
        auditLog.setEventName(eventName);
        auditLog.setEventDescription(eventDescription);
        auditLog.setTimestamp(timestamp);
        auditLog.setUser(user);
        auditLog.setAffectedResource(affectedResource);
        auditLog.setOrigin(origin);

        // Assert
        assertAll("auditLog",
            () -> assertEquals(eventName, auditLog.getEventName(), () -> "The event name should be set and retrieved correctly."),
            () -> assertEquals(eventDescription, auditLog.getEventDescription(), () -> "The event description should be set and retrieved correctly."),
            () -> assertEquals(timestamp, auditLog.getTimestamp(), () -> "The timestamp should be set and retrieved correctly."),
            () -> assertEquals(user, auditLog.getUser(), () -> "The user should be set and retrieved correctly."),
            () -> assertEquals(affectedResource, auditLog.getAffectedResource(), () -> "The affected resource should be set and retrieved correctly."),
            () -> assertEquals(origin, auditLog.getOrigin(), () -> "The origin should be set and retrieved correctly.")
        );
    }

    @Test
    @DisplayName("Test AuditLog creation with all-args constructor")
    void testAllArgsConstructor() {
        // Arrange
        String eventName = faker.lorem().word();
        String eventDescription = faker.lorem().sentence();
        Date timestamp = new Date();
        String affectedResource = faker.lorem().word();
        String origin = faker.internet().ipV4Address();

        // Act
        AuditLog auditLog = new AuditLog(1L, eventName, eventDescription, timestamp, user, affectedResource, origin);

        // Assert
        assertNotNull(auditLog, () -> "AuditLog instance should be created with all-args constructor.");
        assertEquals(eventName, auditLog.getEventName(), () -> "Event name should be initialized correctly.");
        assertEquals(eventDescription, auditLog.getEventDescription(), () -> "Event description should be initialized correctly.");
        assertEquals(timestamp, auditLog.getTimestamp(), () -> "Timestamp should be initialized correctly.");
        assertEquals(user, auditLog.getUser(), () -> "User should be initialized correctly.");
        assertEquals(affectedResource, auditLog.getAffectedResource(), () -> "Affected resource should be initialized correctly.");
        assertEquals(origin, auditLog.getOrigin(), () -> "Origin should be initialized correctly.");
    }

    @Test
    @DisplayName("Test AuditLog creation with no-args constructor")
    void testNoArgsConstructor() {
        // Act
        AuditLog auditLog = new AuditLog(); // Usando o construtor padrão

        // Assert
        assertNotNull(auditLog, () -> "AuditLog instance should be created with no-args constructor.");
        assertNull(auditLog.getEventName(), () -> "Event name should be null by default.");
        assertNull(auditLog.getEventDescription(), () -> "Event description should be null by default.");
        assertNull(auditLog.getTimestamp(), () -> "Timestamp should be null by default.");
        assertNull(auditLog.getUser(), () -> "User should be null by default.");
        assertNull(auditLog.getAffectedResource(), () -> "Affected resource should be null by default.");
        assertNull(auditLog.getOrigin(), () -> "Origin should be null by default.");
    }

    @Test
    @DisplayName("Test AuditLog timestamp is set during creation")
    void testAuditLogTimestamp() {
        // Arrange
        Date beforeCreation = new Date();

        // Act
        Date timestamp = auditLog.getTimestamp();

        // Assert
        assertNotNull(timestamp, () -> "Timestamp should not be null after creation.");
        assertTrue(!timestamp.after(beforeCreation), () -> "Timestamp should be before or equal to the current time.");
    }
}

