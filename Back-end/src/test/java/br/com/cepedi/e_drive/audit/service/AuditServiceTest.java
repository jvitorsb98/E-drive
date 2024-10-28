package br.com.cepedi.e_drive.audit.service;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;
import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.repositorys.AuditLogRepository;
import br.com.cepedi.e_drive.audit.service.AuditService;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
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

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuditService auditService;

    private DataRegisterAudit dataRegisterAudit;
    private User user;

    @BeforeEach
    void setUp() {
        dataRegisterAudit = new DataRegisterAudit(
                "EventName",
                "EventDescription",
                1L,           // ID do usuário
                "Test User",  // Nome do usuário
                "AffectedResource",
                "1"
        );
        user = new User();
        user.setId(1L); // Define o ID do usuário
        user.setEmail("test@example.com");
        user.setName("Test User");
    }

    @Test
    @DisplayName("Should save an AuditLog when logEvent is called")
    void testLogEvent_Success() {
        // Arrange
        when(userRepository.getReferenceById(dataRegisterAudit.userId())).thenReturn(user);

        // Act
        auditService.logEvent(dataRegisterAudit);

        // Assert
        ArgumentCaptor<AuditLog> auditLogCaptor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(auditLogCaptor.capture());
        AuditLog capturedAuditLog = auditLogCaptor.getValue();

        assertNotNull(capturedAuditLog, "AuditLog should not be null");
        assertEquals(dataRegisterAudit.eventName(), capturedAuditLog.getEventName(), "EventName should match");
        assertEquals(dataRegisterAudit.eventDescription(), capturedAuditLog.getEventDescription(), "EventDescription should match");
        assertEquals(dataRegisterAudit.affectedResource(), capturedAuditLog.getAffectedResource(), "AffectedResource should match");
        assertEquals(dataRegisterAudit.origin(), capturedAuditLog.getOrigin(), "Origin should match");
        assertEquals(user, capturedAuditLog.getUser(), "User should match");

        assertNotNull(capturedAuditLog.getTimestamp(), "Timestamp should not be null");
    }

    @Test
    @DisplayName("Should handle exceptions when saving AuditLog")
    void testLogEvent_Exception() {
        // Arrange
        when(userRepository.getReferenceById(dataRegisterAudit.userId())).thenReturn(user);
        doThrow(new RuntimeException("Database error")).when(auditLogRepository).save(any(AuditLog.class));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> auditService.logEvent(dataRegisterAudit));
    }
}
