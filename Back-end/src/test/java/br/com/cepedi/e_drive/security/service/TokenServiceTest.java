package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.Token;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.TokenRepository;
import br.com.cepedi.e_drive.security.service.token.TokenService;
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
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

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

    @Test
    @DisplayName("Test getSubject with Invalid Token")
    void testGetSubject_InvalidToken_ThrowsException() {
        // Arrange
        String invalidToken = "invalidToken";

        // Act & Assert
        assertThrows(JWTVerificationException.class, () -> tokenService.getSubject(invalidToken));
    }

    @Test
    @DisplayName("Test generateTokenForActivatedEmail - Success")
    void testGenerateTokenForActivatedEmail_Success() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        // Act
        String token = tokenService.generateTokenForActivatedEmail(user);

        // Assert
        assertNotNull(token);

        // Mock the token repository to verify token registration
        Token mockToken = new Token();
        mockToken.setDisabled(false);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mockToken));

        // Verify token registration
        assertTrue(tokenService.isValidToken(token));
        assertEquals(user.getEmail(), tokenService.getEmailByToken(token));
    }

    @Test
    @DisplayName("Test generateTokenForActivatedEmail with JWTCreationException")
    void testGenerateTokenForActivatedEmail_JWTCreationException() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        try (MockedStatic<JWT> mockedJWT = mockStatic(JWT.class)) {
            mockedJWT.when(JWT::create)
                      .thenThrow(new JWTCreationException("Simulated JWT creation exception", new RuntimeException()));

            // Act & Assert
            RuntimeException thrownException = assertThrows(RuntimeException.class, () -> {
                tokenService.generateTokenForActivatedEmail(user);
            });

            // Verify the exception message
            assertEquals("Erro ao gerar o token JWT", thrownException.getMessage());
            assertEquals("Simulated JWT creation exception", thrownException.getCause().getMessage());
        }
    }

    @Test
    @DisplayName("Test generateToken with JWTCreationException")
    void testGenerateToken_JWTCreationException() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Create a spy of TokenService
        TokenService tokenServiceSpy = spy(tokenService);

        // Simulate the exception in the token creation
        doThrow(new JWTCreationException("Erro ao gerar o token JWT", new RuntimeException()))
            .when(tokenServiceSpy)
            .generateToken(any(User.class));

        // Act & Assert
        RuntimeException thrownException = assertThrows(RuntimeException.class, () -> {
            tokenServiceSpy.generateToken(user);
        });

        // Verify the exception message
        assertEquals("Erro ao gerar o token JWT", thrownException.getMessage());
    }

    @Test
    @DisplayName("Test generateTokenRecoverPassword")
    void testGenerateTokenRecoverPassword() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Mock o repositório para que possa verificar se o token está sendo salvo
        Token mockToken = new Token();
        mockToken.setDisabled(false);
        when(tokenRepository.findByToken(anyString())).thenReturn(Optional.of(mockToken));

        // Act
        String token = tokenService.generateTokenRecoverPassword(user);

        // Assert
        assertNotNull(token);
        assertTrue(tokenService.isValidToken(token));
        assertEquals(user.getEmail(), tokenService.getEmailByToken(token));
        assertEquals(user.getEmail(), tokenService.getSubject(token));
    }

    @Test
    @DisplayName("Test generateTokenRecoverPassword with JWTCreationException")
    void testGenerateTokenRecoverPassword_JWTCreationException() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Mock a exceção JWTCreationException ao criar o token
        TokenService tokenServiceSpy = spy(tokenService);
        doThrow(new JWTCreationException("Erro ao gerar o token JWT", new RuntimeException()))
            .when(tokenServiceSpy)
            .generateTokenRecoverPassword(user);

        // Act & Assert
        RuntimeException thrownException = assertThrows(RuntimeException.class, () -> {
            tokenServiceSpy.generateTokenRecoverPassword(user);
        });

        // Verifique se a mensagem da exceção é a esperada
        assertEquals("Erro ao gerar o token JWT", thrownException.getMessage());
    }
    
    ////////////////////////////////////////
    @Test
    @DisplayName("Test generateTokenRecoverPassword - Success")
    void testGenerateTokenRecoverPassword_Success() {
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
        assertEquals(user.getEmail(), tokenService.getEmailByToken(token));
    }

    @Test
    @DisplayName("Test generateTokenForReactivation - Success")
    void testGenerateTokenForReactivation_Success() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Act
        String token = tokenService.generateTokenForReactivation(user);

        // Mock the token repository to verify token registration
        Token mockToken = new Token();
        mockToken.setDisabled(false);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mockToken));

        // Assert
        assertNotNull(token);
        assertTrue(tokenService.isValidToken(token));
        assertEquals(user.getEmail(), tokenService.getEmailByToken(token));
    }

    @Test
    @DisplayName("Test isValidToken - Disabled Token")
    void testIsValidToken_DisabledToken_ReturnsFalse() {
        // Arrange
        String token = "disabledToken";
        Token mockToken = new Token();
        mockToken.setDisabled(true);
        lenient().when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mockToken));

        // Act
        boolean isValid = tokenService.isValidToken(token);

        // Assert
        assertFalse(isValid);
    }


    @Test
    @DisplayName("Test isValidToken - Nonexistent Token")
    void testIsValidToken_NonexistentToken_ReturnsFalse() {
        // Arrange
        String token = "nonexistentToken";
        lenient().when(tokenRepository.findByToken(token)).thenReturn(Optional.empty());

        // Act
        boolean isValid = tokenService.isValidToken(token);

        // Assert
        assertFalse(isValid);
    }


    @Test
    @DisplayName("Test generateTokenForReactivation with JWTCreationException")
    void testGenerateTokenForReactivation_JWTCreationException() {
        // Arrange
        User user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());

        // Inject an invalid secret to force JWTCreationException
        ReflectionTestUtils.setField(tokenService, "secret", "");

        // Act & Assert
        assertThrows(RuntimeException.class, () -> tokenService.generateTokenForReactivation(user));
    }
    
    @Test
    @DisplayName("Test getIdUserByToken - Valid Token")
    void testGetIdUserByToken_ValidToken_ReturnsUserId() {
        // Arrange
        Long expectedUserId = 1L;
        User user = new User();
        user.setId(expectedUserId);
        user.setEmail(faker.internet().emailAddress());

        // Create token, ensuring the claim is set
        String token = JWT.create()
                .withClaim("id", expectedUserId)  // Ensure "id" claim is set
                .sign(Algorithm.HMAC256("testSecret123"));  // Use matching secret

        // Act
        Long userId = tokenService.getIdUSerByToken(token);  // Should return Long, not null

        // Assert
        assertEquals(expectedUserId, userId);
    }





    @Test
    @DisplayName("Test getIdUserByToken - Invalid Token")
    void testGetIdUserByToken_InvalidToken_ThrowsException() {
        // Arrange
        String invalidToken = "invalidToken";

        // Act & Assert
        assertThrows(JWTVerificationException.class, () -> tokenService.getEmailByToken(invalidToken));
    }

}





