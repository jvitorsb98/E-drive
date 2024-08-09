package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.Token;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.TokenRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TokenService Tests")
public class TokenServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private TokenService tokenService;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(tokenService, "secret", "testSecret123");
        faker = new Faker();
        tokenRepository.deleteAll();
    }

    @Test
    @DisplayName("Test generateToken")
    void testGenerateToken() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Act
        String token = tokenService.generateToken(user);

        // Mocking the repository to return a valid token
        Token mockToken = new Token();
        mockToken.setDisabled(false);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mockToken));

        // Assert
        assertNotNull(token);
        assertTrue(tokenService.isValidToken(token));

        String email = tokenService.getEmailByToken(token);
        assertEquals(user.getEmail(), email);

        String subject = tokenService.getSubject(token);
        assertEquals(user.getEmail(), subject);
    }

    @Test
    @DisplayName("Test revokeToken")
    void testRevokeToken() {
        // Arrange
        String token = "token_to_revoke";
        Token mockToken = new Token();
        mockToken.setDisabled(false);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mockToken));

        // Act
        tokenService.revokeToken(token);

        // Assert
        assertTrue(mockToken.getDisabled());
        verify(tokenRepository, times(1)).findByToken(token);
        verify(tokenRepository, times(1)).save(mockToken);
    }

    @Test
    @DisplayName("Test isValidToken with Valid Token")
    void testIsValidToken_ValidToken_ReturnsTrue() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());
        String token = tokenService.generateToken(user);

        Token mockToken = new Token();
        mockToken.setDisabled(false);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mockToken));

        // Act
        boolean isValid = tokenService.isValidToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Test getEmailByToken")
    void testGetEmailByToken() {
        // Arrange
        String email = faker.internet().emailAddress();
        String token = JWT.create()
                .withClaim("email", email)
                .sign(Algorithm.HMAC256("testSecret123"));

        // Act
        String retrievedEmail = tokenService.getEmailByToken(token);

        // Assert
        assertEquals(email, retrievedEmail);
    }

    @Test
    @DisplayName("Test getSubject with Valid Token")
    void testGetSubject_ValidToken_ReturnsSubject() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());
        String token = tokenService.generateToken(user);

        // Act
        String subject = tokenService.getSubject(token);

        // Assert
        assertEquals(user.getEmail(), subject);
    }
    
    //vou tentar cobrir 100%
    @Test
    @DisplayName("Test getSubject with Invalid Token")
    void testGetSubject_InvalidToken_ThrowsException() {
        // Arrange
        String invalidToken = "invalidToken";

        // Act & Assert
        assertThrows(JWTVerificationException.class, () -> tokenService.getSubject(invalidToken));
    }

    @Test
    @DisplayName("Test generateTokenRecoverPassword")
    void testGenerateTokenRecoverPassword() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Act
        String token = tokenService.generateTokenRecoverPassword(user);

        // Mocking the repository to return a valid token
        Token mockToken = new Token();
        mockToken.setDisabled(false);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mockToken));

        // Assert
        assertNotNull(token);
        assertTrue(tokenService.isValidToken(token));

        String email = tokenService.getEmailByToken(token);
        assertEquals(user.getEmail(), email);

        String subject = tokenService.getSubject(token);
        assertEquals(user.getEmail(), subject);
    }
    
    
  //vou tentar cobrir 100%
    @Test
    @DisplayName("Test generateToken with IllegalArgumentException due to null secret")
    void testGenerateToken_JWTCreationException() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Introduce a faulty secret (null) to trigger IllegalArgumentException
        ReflectionTestUtils.setField(tokenService, "secret", null);  // Set secret to null or an invalid value

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> tokenService.generateToken(user));
    }
    
  //vou tentar cobrir 100%
    @Test
    @DisplayName("Test generateTokenRecoverPassword with IllegalArgumentException due to null secret")
    void testGenerateTokenRecoverPassword_JWTCreationException() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Introduce a faulty secret (null) to trigger IllegalArgumentException
        ReflectionTestUtils.setField(tokenService, "secret", null);  // Set secret to null or an invalid value

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> tokenService.generateTokenRecoverPassword(user));
    }

    
    @Test
    @DisplayName("Test isValidToken with JWTVerificationException")
    void testIsValidToken_JWTVerificationException() {
        // Arrange
        String invalidToken = "invalidToken";  // This should be a string that fails verification

        // Act
        boolean isValid = tokenService.isValidToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }



}
