package br.com.cepedi.e_drive.security.controller;

import br.com.cepedi.e_drive.security.controller.auth.AuthController;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.service.auth.AuthService;
import br.com.cepedi.e_drive.security.service.email.EmailService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test controller auth for register")
public class RegisterControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private EmailService emailService;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthController registerController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should register user successfully")
    void testRegisterUser() throws MessagingException {
        // Arrange
        DataRegisterUser dataRegisterUser = new DataRegisterUser("Test Name", "test@example.com", "password", null, "1234567890");

        User mockUser = new User();
        mockUser.setName("Test Name");
        mockUser.setEmail("test@example.com");

        DataDetailsRegisterUser dataDetailsRegisterUser = new DataDetailsRegisterUser(mockUser, "token");

        when(authService.register(any(DataRegisterUser.class))).thenReturn(dataDetailsRegisterUser);

        // Act
        ResponseEntity<String> response = registerController.registerUser(dataRegisterUser);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully. Activation email sent.", response.getBody());

        verify(emailService, times(1)).sendActivationEmailAsync(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should activate account successfully")
    void testActivateAccount_Success() {
        // Arrange
        String token = "validToken";
        when(tokenService.isValidToken(token)).thenReturn(true);

        // Act
        ResponseEntity<String> response = registerController.activateAccount(token);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User account activated successfully", response.getBody());

        verify(authService, times(1)).activateUser(token);
        verify(tokenService, times(1)).revokeToken(token);
    }

    @Test
    @DisplayName("Should return Bad Request for invalid token")
    void testActivateAccount_InvalidToken() {
        // Arrange
        String token = "invalidToken";
        when(tokenService.isValidToken(token)).thenReturn(false);

        // Act
        ResponseEntity<String> response = registerController.activateAccount(token);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Token invalid", response.getBody());

        verify(authService, never()).activateUser(anyString());
        verify(tokenService, never()).revokeToken(anyString());
    }

    @Test
    @DisplayName("Should handle exception during activation")
    void testActivateAccount_Exception() {
        // Arrange
        String token = "validButThrowsException";
        when(tokenService.isValidToken(token)).thenThrow(new RuntimeException("Simulated exception"));

        // Act
        ResponseEntity<String> response = registerController.activateAccount(token);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to activate user account.", response.getBody());
    }
}
