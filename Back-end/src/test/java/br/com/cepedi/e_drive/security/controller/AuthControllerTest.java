package br.com.cepedi.e_drive.security.controller;

import br.com.cepedi.e_drive.security.controller.auth.AuthController;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.details.DadosTokenJWT;
import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import br.com.cepedi.e_drive.security.model.records.register.DataReactivateAccount;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;
import br.com.cepedi.e_drive.security.service.auth.AuthService;
import br.com.cepedi.e_drive.security.service.email.EmailService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.UserService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test controller auth for register")
public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private EmailService emailService;

    @Mock
    private TokenService tokenService;

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager manager;

    @InjectMocks
    private AuthController authController;

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

        DataDetailsRegisterUser dataDetailsRegisterUser = new DataDetailsRegisterUser(mockUser, "token", "User registered successfully. Activation email sent.");
        when(authService.register(any(DataRegisterUser.class))).thenReturn(dataDetailsRegisterUser);

        // Act
        ResponseEntity<String> response = authController.register(dataRegisterUser);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully. Activation email sent.", response.getBody());

        verify(emailService, times(1)).sendActivationEmailAsync(anyString(), anyString(), anyString());
    }

    @SuppressWarnings("deprecation")
    @Test
    void testActivateAccount_Success() {
        // Arrange
        String validToken = "validToken";
        String expectedResponse = "User activated successfully.";
        
        // Simula o comportamento do authService
        when(authService.activateAccount(validToken)).thenReturn(ResponseEntity.ok(expectedResponse));

        // Act
        ResponseEntity<String> response = authController.activateAccount(validToken);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedResponse, response.getBody());
    }
    

    @Test
    @DisplayName("Should return Bad Request for invalid token")
    void testActivateAccount_InvalidToken() {
        // Arrange
        String token = "invalidToken";
        when(authService.activateAccount(token)).thenReturn(new ResponseEntity<>("Token invalid", HttpStatus.BAD_REQUEST));

        // Act
        ResponseEntity<String> response = authController.activateAccount(token);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Token invalid", response.getBody());

        verify(authService).activateAccount(token);
        verify(tokenService, never()).revokeToken(anyString());
    }
    

    @Test
    @DisplayName("Should log in user successfully")
    void testLoginUser() {
        // Arrange
        DataAuth dataAuth = new DataAuth("test@example.com", "password");
        User mockUser = new User();
        mockUser.setEmail(dataAuth.login());

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dataAuth.login(), dataAuth.password());
        Authentication mockAuthentication = mock(Authentication.class);
        when(authService.login(dataAuth)).thenReturn(authToken);
        when(userService.getUserActivatedByEmail(dataAuth.login())).thenReturn(mockUser);
        when(manager.authenticate(authToken)).thenReturn(mockAuthentication);
        when(tokenService.generateToken(mockUser)).thenReturn("mockToken");

        // Act
        ResponseEntity<DadosTokenJWT> response = authController.login(dataAuth);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("mockToken", response.getBody().token());
    }

    @Test
    @DisplayName("Should reset password request successfully")
    void testResetPasswordRequest() throws MessagingException {
        // Arrange
        DataRequestResetPassword dataRequestResetPassword = new DataRequestResetPassword("test@example.com");
        when(authService.resetPasswordRequest(any())).thenReturn("Password reset email sent successfully.");

        // Act
        ResponseEntity<String> response = authController.resetPasswordRequest(dataRequestResetPassword);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password reset email sent successfully.", response.getBody());
    }

    @Test
    @DisplayName("Should request account reactivation successfully")
    void testReactivateAccountRequest() {
        // Arrange
        DataReactivateAccount dataReactivateAccount = new DataReactivateAccount("test@example.com");
        String expectedResponse = "Account reactivation email sent successfully";

        when(authService.reactivateAccountRequest(dataReactivateAccount)).thenReturn(expectedResponse);

        // Act
        ResponseEntity<String> response = authController.reactivateAccountRequest(dataReactivateAccount);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    @DisplayName("Should reactivate account successfully")
    void testReactivateAccount() {
        // Arrange
        String validToken = "validReactivationToken";
        String expectedResponse = "User reactivated successfully";

        when(authService.reactivateAccount(validToken)).thenReturn(expectedResponse);

        // Act
        ResponseEntity<String> response = authController.reactivateAccount(validToken);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }



}
