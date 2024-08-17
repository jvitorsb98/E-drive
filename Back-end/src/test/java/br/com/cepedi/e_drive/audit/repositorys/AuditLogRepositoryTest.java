package br.com.cepedi.e_drive.audit.repositorys;


import br.com.cepedi.e_drive.audit.entitys.AuditLog;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.Random.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class AuditLogRepositoryTest {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository; // Supondo que você tenha um repositório de usuários

    @BeforeEach
    public void setUp() {
        auditLogRepository.deleteAll(); // Garante que o banco está limpo antes de cada teste
        userRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("Should save and find an AuditLog by ID")
    public void testSaveAndFindAuditLogById() {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setPassword("password");
        user.setActivated(true);
        userRepository.save(user);

        AuditLog auditLog = new AuditLog();
        auditLog.setEventName("UserCreated");
        auditLog.setEventDescription("A new user was created");
        auditLog.setTimestamp(new Date());
        auditLog.setUser(user);
        auditLog.setAffectedResource("User");
        auditLog.setOrigin("System");

        // Act
        AuditLog savedAuditLog = auditLogRepository.save(auditLog);
        AuditLog foundAuditLog = auditLogRepository.findById(savedAuditLog.getId()).orElse(null);

        // Assert
        assertNotNull(foundAuditLog, "Expected to find the saved AuditLog by ID");
        assertEquals(savedAuditLog.getEventName(), foundAuditLog.getEventName(), "EventName should be equal");
        assertEquals(savedAuditLog.getEventDescription(), foundAuditLog.getEventDescription(), "EventDescription should be equal");
        assertEquals(savedAuditLog.getTimestamp(), foundAuditLog.getTimestamp(), "Timestamp should be equal");
        assertEquals(savedAuditLog.getUser(), foundAuditLog.getUser(), "User should be equal");
        assertEquals(savedAuditLog.getAffectedResource(), foundAuditLog.getAffectedResource(), "AffectedResource should be equal");
        assertEquals(savedAuditLog.getOrigin(), foundAuditLog.getOrigin(), "Origin should be equal");
    }

    @Test
    @Order(2)
    @DisplayName("Should return null when finding a non-existent AuditLog by ID")
    public void testFindNonExistentAuditLogById() {
        // Act
        AuditLog foundAuditLog = auditLogRepository.findById(999L).orElse(null);

        // Assert
        assertNull(foundAuditLog, "Expected no AuditLog to be found for non-existent ID");
    }

    @Test
    @Order(3)
    @DisplayName("Should delete an AuditLog and not find it by ID")
    public void testDeleteAuditLog() {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setPassword("password");
        user.setActivated(true);
        userRepository.save(user);

        AuditLog auditLog = new AuditLog();
        auditLog.setEventName("UserDeleted");
        auditLog.setEventDescription("A user was deleted");
        auditLog.setTimestamp(new Date());
        auditLog.setUser(user);
        auditLog.setAffectedResource("User");
        auditLog.setOrigin("System");
        AuditLog savedAuditLog = auditLogRepository.save(auditLog);

        // Act
        auditLogRepository.delete(savedAuditLog);
        AuditLog foundAuditLog = auditLogRepository.findById(savedAuditLog.getId()).orElse(null);

        // Assert
        assertNull(foundAuditLog, "Expected no AuditLog to be found after deletion");
    }
}

