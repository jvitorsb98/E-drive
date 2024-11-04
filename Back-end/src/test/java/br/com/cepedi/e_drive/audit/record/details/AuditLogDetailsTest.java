package br.com.cepedi.e_drive.audit.record.details;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;
import br.com.cepedi.e_drive.security.model.entitys.User;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class AuditLogDetailsTest {

    @Test
    void auditLogDetails_CreatesInstanceCorrectly_WithAllFields() {
        // Arrange
        String eventName = "Event Name";
        String eventDescription = "Event Description";
        Date timestamp = new Date();
        Long userId = 1L;
        String affectedResource = "Resource Affected";
        String origin = "127.0.0.1";

        // Act
        AuditLogDetails details = new AuditLogDetails(eventName, eventDescription, timestamp, userId, affectedResource, origin);

        // Assert
        assertEquals(eventName, details.eventName());
        assertEquals(eventDescription, details.eventDescription());
        assertEquals(timestamp, details.timestamp());
        assertEquals(userId, details.userId());
        assertEquals(affectedResource, details.affectedResource());
        assertEquals(origin, details.origin());
    }

    @Test
    void auditLogDetails_CreatesInstanceCorrectly_FromAuditLog() {
        // Arrange
        AuditLog auditLog = new AuditLog();
        auditLog.setEventName("Event Name");
        auditLog.setEventDescription("Event Description");
        auditLog.setTimestamp(new Date());
        
        User user = new User();
        user.setId(1L);
        auditLog.setUser(user); // Supondo que a classe AuditLog tenha um método setUser
        auditLog.setAffectedResource("Resource Affected");
        auditLog.setOrigin("127.0.0.1");

        // Act
        AuditLogDetails details = new AuditLogDetails(auditLog);

        // Assert
        assertEquals(auditLog.getEventName(), details.eventName());
        assertEquals(auditLog.getEventDescription(), details.eventDescription());
        assertEquals(auditLog.getTimestamp(), details.timestamp());
        assertEquals(user.getId(), details.userId());
        assertEquals(auditLog.getAffectedResource(), details.affectedResource());
        assertEquals(auditLog.getOrigin(), details.origin());
    }

    @Test
    void auditLogDetails_CreatesInstanceCorrectly_WithNullUser() {
        // Arrange
        AuditLog auditLog = new AuditLog();
        auditLog.setEventName("Event Name");
        auditLog.setEventDescription("Event Description");
        auditLog.setTimestamp(new Date());
        auditLog.setUser(null); // Usuário nulo
        auditLog.setAffectedResource("Resource Affected");
        auditLog.setOrigin("127.0.0.1");

        // Act
        AuditLogDetails details = new AuditLogDetails(auditLog);

        // Assert
        assertNull(details.userId()); // O ID do usuário deve ser nulo
    }
}
