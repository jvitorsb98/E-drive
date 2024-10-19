package br.com.cepedi.e_drive.audit.service;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;
import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.repositorys.AuditLogRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuditServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditService auditService;

    private DataRegisterAudit dataRegisterAudit;
    private User user;

    @BeforeEach
    void setUp() {
        dataRegisterAudit = new DataRegisterAudit(
                "EventName",
                "EventDescription",
                "AffectedResource",
                "1"
        );
        user = new User();
        user.setEmail("test@example.com");
        user.setName("Test User");
    }

    @Test
    @DisplayName("Should save an AuditLog when logEvent is called")
    void testLogEvent_Success() {
        // Act
        auditService.logEvent(dataRegisterAudit, user);

        // Assert
        ArgumentCaptor<AuditLog> auditLogCaptor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(auditLogCaptor.capture());
        AuditLog capturedAuditLog = auditLogCaptor.getValue();

        assertNotNull(capturedAuditLog, "AuditLog should not be null");
        assertEquals(dataRegisterAudit.eventName(), capturedAuditLog.getEventName(), () -> "EventName should match");
        assertEquals(dataRegisterAudit.eventDescription(), capturedAuditLog.getEventDescription(), () -> "EventDescription should match");
        assertEquals(dataRegisterAudit.affectedResource(), capturedAuditLog.getAffectedResource(), () -> "AffectedResource should match");
        assertEquals(dataRegisterAudit.origin(), capturedAuditLog.getOrigin(), () -> "Origin should match");
        assertEquals(user, capturedAuditLog.getUser(), "User should match");

        // Verifique o timestamp ou outros campos, se aplicável
        assertNotNull(capturedAuditLog.getTimestamp(), "Timestamp should not be null");
    }
    
    @Test
    @DisplayName("Should handle null User gracefully")
    void testLogEvent_NullUser() {
        // Act
        auditService.logEvent(dataRegisterAudit, null);

        // Assert
        ArgumentCaptor<AuditLog> auditLogCaptor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(auditLogCaptor.capture());
        AuditLog capturedAuditLog = auditLogCaptor.getValue();

        assertNotNull(capturedAuditLog, "AuditLog should not be null");
        assertEquals(dataRegisterAudit.eventName(), capturedAuditLog.getEventName(), () -> "EventName should match");
        assertEquals(dataRegisterAudit.eventDescription(), capturedAuditLog.getEventDescription(), () -> "EventDescription should match");
        assertEquals(dataRegisterAudit.affectedResource(), capturedAuditLog.getAffectedResource(), () -> "AffectedResource should match");
        assertEquals(dataRegisterAudit.origin(), capturedAuditLog.getOrigin(), () -> "Origin should match");
        assertNull(capturedAuditLog.getUser(), () -> "User should be null");
    }


    @Test
    @DisplayName("Should handle exceptions when saving AuditLog")
    void testLogEvent_Exception() {
        // Arrange
        doThrow(new RuntimeException("Database error")).when(auditLogRepository).save(any(AuditLog.class));
    
        // Act & Assert
        assertThrows(RuntimeException.class, () -> auditService.logEvent(dataRegisterAudit, user));
    }
    

 

}

