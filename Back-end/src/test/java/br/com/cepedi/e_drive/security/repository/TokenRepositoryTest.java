package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.security.model.entitys.Token;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterToken;
import com.github.javafaker.Faker;
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

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class TokenRepositoryTest {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        userRepository.deleteAll();
        tokenRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create and find a token by its value")
    public void testCreateAndFindToken() {
        // Arrange
        User user = new User();
        userRepository.save(user);

        String tokenValue = faker.lorem().characters(32);
        Instant expireDate = Instant.now().plusSeconds(3600);
        Token token = new Token(new DataRegisterToken(tokenValue, null, expireDate), user);

        // Act
        tokenRepository.save(token);
        Optional<Token> foundToken = tokenRepository.findByToken(tokenValue);

        // Assert
        assertTrue(foundToken.isPresent(), () -> "Token should be present in the repository");
        assertEquals(tokenValue, foundToken.get().getToken(), () -> "Token value should match");
        assertEquals(expireDate, foundToken.get().getExpireDate(), () -> "Expire date should match");
        assertEquals(user, foundToken.get().getUser(), () -> "User should match");
        assertFalse(foundToken.get().getDisabled(), () -> "Token should not be disabled");
    }

    @Test
    @DisplayName("Should return empty when finding a non-existent token")
    public void testFindNonExistentToken() {
        // Act
        Optional<Token> foundToken = tokenRepository.findByToken("nonexistenttoken");

        // Assert
        assertFalse(foundToken.isPresent(),() -> "Token should not be found in the repository");
    }

    @Test
    @DisplayName("Should update an existing token")
    public void testUpdateToken() {
        // Arrange
        User user = new User();
        userRepository.save(user);

        String tokenValue = faker.lorem().characters(32);
        Instant expireDate = Instant.now().plusSeconds(3600);
        Token token = new Token(new DataRegisterToken(tokenValue, null, expireDate), user);
        tokenRepository.save(token);

        String newTokenValue = faker.lorem().characters(32);
        Instant newExpireDate = Instant.now().plusSeconds(7200);
        token.setToken(newTokenValue);
        token.setExpireDate(newExpireDate);
        tokenRepository.save(token);

        // Act
        Optional<Token> foundToken = tokenRepository.findByToken(newTokenValue);

        // Assert
        assertTrue(foundToken.isPresent(), () -> "Token should be present in the repository after update");
        assertEquals(newTokenValue, foundToken.get().getToken(), () -> "Updated token value should match");
        assertEquals(newExpireDate, foundToken.get().getExpireDate(), () -> "Updated expire date should match");
    }

    @Test
    @DisplayName("Should delete a token and not find it anymore")
    public void testDeleteToken() {
        // Arrange
        User user = new User();
        userRepository.save(user);

        String tokenValue = faker.lorem().characters(32);
        Instant expireDate = Instant.now().plusSeconds(3600);
        Token token = new Token(new DataRegisterToken(tokenValue, null, expireDate), user);
        tokenRepository.save(token);

        // Act
        tokenRepository.delete(token);

        // Assert
        Optional<Token> foundToken = tokenRepository.findByToken(tokenValue);
        assertFalse(foundToken.isPresent(), () -> "Token should be removed from the repository");
    }
    
    @Test
    @DisplayName("Should ensure that tokens are consistently saved and retrieved")
    public void testTokenPersistenceConsistency() {
        // Arrange
        User user = new User();
        userRepository.save(user);

        String tokenValue = faker.lorem().characters(32);
        Instant expireDate = Instant.now().plusSeconds(3600);
        Token token = new Token(new DataRegisterToken(tokenValue, null, expireDate), user);
        tokenRepository.save(token);

        // Act
        Optional<Token> foundTokenFirstTime = tokenRepository.findByToken(tokenValue);
        Optional<Token> foundTokenSecondTime = tokenRepository.findByToken(tokenValue);

        // Assert
        assertTrue(foundTokenFirstTime.isPresent(), () -> "Token should be present in the repository");
        assertTrue(foundTokenSecondTime.isPresent(), () -> "Token should be present in the repository the second time");
        assertEquals(foundTokenFirstTime.get(), foundTokenSecondTime.get(), () -> "Tokens should be identical");
    }
    
    @Test
    @DisplayName("Should not alter token if updated with the same values")
    public void testUpdateTokenWithSameValues() {
        // Arrange
        User user = new User();
        userRepository.save(user);

        String tokenValue = faker.lorem().characters(32);
        Instant expireDate = Instant.now().plusSeconds(3600);
        Token token = new Token(new DataRegisterToken(tokenValue, null, expireDate), user);
        tokenRepository.save(token);

        // Act
        Token updatedToken = tokenRepository.findByToken(tokenValue).orElseThrow();
        tokenRepository.save(updatedToken); // Save with the same values

        // Assert
        Optional<Token> foundToken = tokenRepository.findByToken(tokenValue);
        assertTrue(foundToken.isPresent(), () ->"Token should be present after saving with the same values");
        assertEquals(expireDate, foundToken.get().getExpireDate(), () -> "Expire date should remain the same");
    }


}

