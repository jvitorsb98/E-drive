package br.com.cepedi.e_drive.security.service.auth;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import br.com.cepedi.e_drive.security.model.records.register.DataReactivateAccount;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;
import br.com.cepedi.e_drive.security.model.records.register.DataResetPassword;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.auth.validations.activatedAccount.ValidationsActivatedAccount;
import br.com.cepedi.e_drive.security.service.auth.validations.login.ValidationsLogin;
import br.com.cepedi.e_drive.security.service.auth.validations.logout.ValidationLogout;
import br.com.cepedi.e_drive.security.service.auth.validations.reactivateAccountRequest.ValidationReactivateAccountRequest;
import br.com.cepedi.e_drive.security.service.auth.validations.reactivated.ValidationReactivate;
import br.com.cepedi.e_drive.security.service.auth.validations.reactivated.ValidationUserNotFoundDataReactivateAccount;
import br.com.cepedi.e_drive.security.service.auth.validations.register.ValidationRegisterUser;
import br.com.cepedi.e_drive.security.service.auth.validations.resetPassword.ValidationResetPassword;
import br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest.ValidationResetPasswordRequest;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.UserService;
import br.com.cepedi.e_drive.security.service.user.validations.disabled.ValidationDisabledUser;
import jakarta.mail.MessagingException;
import jakarta.validation.ValidationException;
import br.com.cepedi.e_drive.security.service.email.EmailService;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.stream.Stream;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import java.util.Locale;

@DisplayName("AuthService Tests")
@TestMethodOrder(MethodOrderer.Random.class)
public class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private TokenService tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private MessageSource messageSource;

    @Mock
    private List<ValidationRegisterUser> validationRegisterUserList;


    @Mock
    private List<ValidationsLogin> validationsLoginList;


    @Mock
    private List<ValidationLogout> validationLogoutList;

    @Mock
    private List<ValidationDisabledUser> validationDisabledUserList;

 @Mock
    private List<ValidationResetPassword> validationResetPasswords;

    @Mock
    private List<ValidationResetPasswordRequest> validationResetPasswordRequestList;

    @Mock
    private List<ValidationsActivatedAccount> validationsActivatedAccountList;

    @Mock
    private List<ValidationReactivateAccountRequest> validationReactivateAccountRequestList;

    @Mock
    private List<ValidationReactivate> validationReactivateList;
    
    @InjectMocks
    private ValidationUserNotFoundDataReactivateAccount validationUserNotFoundDataReactivateAccount;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Test Register User")
    public void testRegisterUser() {
        DataRegisterUser data = new DataRegisterUser(
            faker.name().fullName(),
            faker.internet().emailAddress(),
            faker.internet().password(),
            null, // Considerar que o birthDate não está presente
            faker.phoneNumber().phoneNumber()
        );

        User user = new User(data, passwordEncoder);
        user.setEmail(data.email());

        // Mocks
        given(passwordEncoder.encode(data.password())).willReturn("encodedPassword");
        given(userRepository.save(any(User.class))).willReturn(user);
        given(tokenService.generateTokenForActivatedEmail(any(User.class))).willReturn("mockedToken");
        given(messageSource.getMessage(any(String.class), any(Object[].class), any(Locale.class))).willReturn("Success Message");

        // Mockar o comportamento da lista de validação, se necessário
        given(validationRegisterUserList.stream()).willReturn(Stream.of(mock(ValidationRegisterUser.class)));

        // Act
        DataDetailsRegisterUser result = authService.register(data);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertEquals("mockedToken", result.confirmationToken(), "The confirmation token should be 'mockedToken'");
        assertEquals("Success Message", result.successMessage(), "The success message should match");
    }

    @Test
    @DisplayName("Test Load User By Username Success")
    public void testLoadUserByUsername_Success() {
        String email = faker.internet().emailAddress();
        User user = new User();
        user.setEmail(email);

        given(userRepository.findByEmail(email)).willReturn(user);

        UserDetails userDetails = authService.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(userDetails.getUsername(), email);
    }

    @Test
    @DisplayName("Test Load User By Username Not Found")
    public void testLoadUserByUsername_UserNotFound() {
        String email = faker.internet().emailAddress();
    
        // Mocks
        given(userRepository.findByEmail(email)).willReturn(null);
    
        // Act
        UserDetails userDetails = authService.loadUserByUsername(email);
    
        // Assert
        assertNull(userDetails, "Expected loadUserByUsername to return null when user is not found");
    }
    
    @Test
    @DisplayName("Test Login Success")
    public void testLogin_Success() {
        DataAuth dataAuth = new DataAuth(faker.internet().emailAddress(), faker.internet().password());
        User user = new User();
        user.setEmail(dataAuth.login());
        
        // Mocks
        given(userService.getUserActivatedByEmail(dataAuth.login())).willReturn(user);
        
        // Act
        UsernamePasswordAuthenticationToken authToken = authService.login(dataAuth);
        
        // Assert
        assertNotNull(authToken, "Auth token should not be null");
        assertEquals(dataAuth.login(), authToken.getPrincipal(), "The login should match the principal");
        assertEquals(dataAuth.password(), authToken.getCredentials(), "The password should match the credentials");
    }


    @Test
    @DisplayName("Test Logout with Invalid Token")
    void testLogout_InvalidToken() {
        // Arrange
        String invalidToken = "Bearer invalidToken";

        doThrow(new RuntimeException("Token is invalid"))
            .when(validationLogoutList).forEach(any());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.logout(invalidToken);
        });

        assertEquals("Token is invalid", exception.getMessage());
    }
    
    @Test
    @DisplayName("Test Disable User Success")
    public void testDisableUser_Success() {
        Long userId = faker.number().randomNumber();
        User user = new User();
        user.setId(userId);
        
        // Simula o retorno do método getReferenceById
        given(userRepository.getReferenceById(userId)).willReturn(user);

        // Simula o retorno do método save
        given(userRepository.save(user)).willReturn(user);

        // Mocks for validation
        given(validationDisabledUserList.stream()).willReturn(Stream.of(mock(ValidationDisabledUser.class)));

        // Act
        authService.disableUser(userId);

        // Assert
        assertFalse(user.isActive(), "User should be disabled after calling disableUser");
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Test Reset Password Request Success")
    public void testResetPasswordRequest_Success() throws MessagingException {
        DataRequestResetPassword dataResetPassword = new DataRequestResetPassword(faker.internet().emailAddress());
        User user = new User();
        user.setEmail(dataResetPassword.email());

        // Mocks
        given(validationResetPasswordRequestList.stream()).willReturn(Stream.of(mock(ValidationResetPasswordRequest.class)));
        given(userRepository.findByEmail(dataResetPassword.email())).willReturn(user);
        given(tokenService.generateTokenRecoverPassword(user)).willReturn("mockedToken");
        doNothing().when(emailService).sendResetPasswordEmailAsync(anyString(), anyString(), anyString());
        given(messageSource.getMessage(any(String.class), any(Object[].class), any(Locale.class))).willReturn("Success Message");

        // Act
        String result = authService.resetPasswordRequest(dataResetPassword);

        // Assert
        assertEquals("Success Message", result, "Success message should match");
        verify(emailService).sendResetPasswordEmailAsync(user.getName(), dataResetPassword.email(), "mockedToken");
    }

    @Test
    @DisplayName("Test Reset Password Success")
    public void testResetPassword_Success() {
        String token = "mockedToken";
        String email = faker.internet().emailAddress();
        String newPassword = faker.internet().password();

        DataResetPassword dataResetPassword = new DataResetPassword(token, newPassword);

        // Mocks
        given(validationResetPasswords.stream()).willReturn(Stream.of(mock(ValidationResetPassword.class)));
        given(tokenService.getEmailByToken(token)).willReturn(email);
        doNothing().when(userService).updatePassword(email, newPassword);
        doNothing().when(tokenService).revokeToken(token);
        given(messageSource.getMessage(any(String.class), any(Object[].class), any(Locale.class))).willReturn("Password reset success");

        // Act
        String result = authService.resetPassword(dataResetPassword);

        // Assert
        assertEquals("Password reset success", result, "Success message should match");
    }


    


    @Test
    @DisplayName("Should redirect to login page with error message when token is invalid")
    void shouldReturnErrorForInvalidToken() {

        String frontEndUrl = System.getenv("FRONT_END_URL");
        if (frontEndUrl == null ) {
            frontEndUrl = "https://192.168.0.108:4200"; // Valor padrão
        }
        // Arrange
        String token = faker.internet().password(); // Simulating an invalid token

        when(tokenService.isValidToken(token)).thenReturn(false);

        // Act
        ResponseEntity<String> response = authService.activateAccount(token);

        // Assert
        verify(tokenService, times(1)).isValidToken(token);
        verifyNoMoreInteractions(validationsActivatedAccountList, userRepository);


        assertEquals(HttpStatus.FOUND, response.getStatusCode());
    }
    

    @Test
    @DisplayName("Test Logout with Valid Token")
    void testLogout_ValidToken() {
        String validToken = "Bearer validToken";

        // Mocks
        doNothing().when(validationLogoutList).forEach(any());

        // Act
        assertDoesNotThrow(() -> {
            authService.logout(validToken);
        });

        // Assert
        verify(validationLogoutList, times(1)).forEach(any());
    }
    
    @Test
    @DisplayName("Test Reset Password Success")
    public void testResetPassword_Susccess() {
        // Arrange
        String token = "mockedToken";
        String email = faker.internet().emailAddress();
        String newPassword = faker.internet().password();
        
        DataResetPassword dataResetPassword = new DataResetPassword(token, newPassword);

        // Mocks
        given(validationResetPasswords.stream()).willReturn(Stream.of(mock(ValidationResetPassword.class)));
        given(tokenService.getEmailByToken(token)).willReturn(email);
        doNothing().when(userService).updatePassword(email, newPassword);
        doNothing().when(tokenService).revokeToken(token);
        given(messageSource.getMessage(any(String.class), any(Object[].class), any(Locale.class))).willReturn("Password reset success");

        // Act
        String result = authService.resetPassword(dataResetPassword);

        // Assert
        assertEquals("Password reset success", result, "Success message should match");
        verify(userService).updatePassword(email, newPassword);
        verify(tokenService).revokeToken(token);
    }
   
    @Test
    @DisplayName("Test Reactivate Account Request Email Sending Failure")
    public void testReactivateAccountRequest_EmailSendingFailure() throws MessagingException {
        // Arrange
        String email = faker.internet().emailAddress();
        String userName = faker.name().fullName();
        DataReactivateAccount dataReactivateAccount = new DataReactivateAccount(email);

        // Mock
        User user = new User();
        user.setName(userName);
        user.setEmail(email);
        
        // Simula a validação
        given(validationReactivateAccountRequestList.stream()).willReturn(Stream.of(mock(ValidationReactivateAccountRequest.class)));
        
        // Simula a recuperação do usuário
        given(userRepository.findByEmail(email)).willReturn(user);
        
        // Simula a geração do token
        String token = "mockedToken";
        given(tokenService.generateTokenForReactivation(user)).willReturn(token);
        
        // Simula o lançamento da exceção durante o envio do e-mail
        doThrow(new MessagingException("Failed to send email")).when(emailService).sendReactivationEmailAsync(userName, email, token);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.reactivateAccountRequest(dataReactivateAccount);
        });

        // Verifica a mensagem da exceção
        assertEquals("Failed to send email", exception.getCause().getMessage());
    }


    @Test
    @DisplayName("Test Reactivate Account Success")
    public void testReactivateAccount_Success() {
        // Arrange
        String token = "validToken";
        String userName = "John Doe";

        // Mock
        User user = new User();
        user.setName(userName);
        given(validationReactivateList.stream()).willReturn(Stream.of(mock(ValidationReactivate.class)));
        given(userService.getUserByToken(token)).willReturn(user);
        given(messageSource.getMessage("auth.reactivated.success", new Object[]{userName}, LocaleContextHolder.getLocale()))
            .willReturn("Account reactivated successfully for " + userName);

        // Act
        String result = authService.reactivateAccount(token);

        // Assert
        assertEquals("Account reactivated successfully for " + userName, result);
        assertTrue(user.isActive()); // Verifica se o usuário foi ativado
        verify(tokenService).revokeToken(token); // Verifica se o token foi revogado
    }
    
    @Test
    @DisplayName("Test User Not Found Validation")
    public void testUserNotFoundValidation() {
        // Arrange
        String token = "invalidToken";

        // Mock do serviço de usuário para retornar null
        given(userService.getUserByToken(token)).willReturn(null);
        
        // Mock da mensagem do MessageSource
        given(messageSource.getMessage(
                "auth.reactivated.user.not.found",
                new Object[]{token},
                LocaleContextHolder.getLocale()))
            .willReturn("No user found for the provided token: " + token);

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validationUserNotFoundDataReactivateAccount.validate(token);
        });

        // Assert
        assertEquals("No user found for the provided token: invalidToken", exception.getMessage());
    }

    @Test
    @DisplayName("Test Reactivate Account Success")
    public void testReactivateAccountSuccess() throws MessagingException {
        // Arrange
        String email = faker.internet().emailAddress();
        String userName = faker.name().fullName();
        DataReactivateAccount dataReactivateAccount = new DataReactivateAccount(email);

        // Mock
        User user = new User();
        user.setName(userName);
        user.setEmail(email);
        user.setActivated(false); // Simulating that the user account is currently inactive

        // Simulate validations
        given(validationReactivateAccountRequestList.stream()).willReturn(Stream.of(mock(ValidationReactivateAccountRequest.class)));
        
        // Simulate user retrieval
        given(userRepository.findByEmail(email)).willReturn(user);
        
        // Generate a mock token for reactivation
        String token = "mockedToken";
        given(tokenService.generateTokenForReactivation(user)).willReturn(token);
        
        // Mock email sending
        doNothing().when(emailService).sendReactivationEmailAsync(userName, email, token);
        given(messageSource.getMessage(any(String.class), any(Object[].class), any(Locale.class))).willReturn("Reactivation email sent successfully");

        // Act
        String result = authService.reactivateAccountRequest(dataReactivateAccount);

        // Assert
        assertEquals("Reactivation email sent successfully", result, "Success message should match");
        verify(emailService).sendReactivationEmailAsync(userName, email, token);
        verify(tokenService).generateTokenForReactivation(user); // Ensure the reactivation method is called
    }
    
    @Test
    @DisplayName("Test Reactivate Account Token Generation Failure")
    public void testReactivateAccount_TokenGenerationFailure() {
        // Arrange
        String email = faker.internet().emailAddress();
        String userName = faker.name().fullName();
        DataReactivateAccount dataReactivateAccount = new DataReactivateAccount(email);

        User user = new User();
        user.setName(userName);
        user.setEmail(email);
        user.setActivated(false); // Simulando que a conta está inativa

        // Mocks
        given(validationReactivateAccountRequestList.stream()).willReturn(Stream.of(mock(ValidationReactivateAccountRequest.class)));
        given(userRepository.findByEmail(email)).willReturn(user);
        
        // Simula uma falha ao gerar o token
        doThrow(new RuntimeException("Token generation failed")).when(tokenService).generateTokenForReactivation(user);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.reactivateAccountRequest(dataReactivateAccount);
        });
        assertEquals("Token generation failed", exception.getMessage());
    }


    private void setupUserRepositoryMock(String email, User user) {
        given(userRepository.findByEmail(email)).willReturn(user);
    }

    @Test
    @DisplayName("Test Load User By Username Success")
    public void testLoadUserByUserName_Success() {
        String email = faker.internet().emailAddress();
        User user = new User();
        user.setEmail(email);

        setupUserRepositoryMock(email, user);

        UserDetails userDetails = authService.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(userDetails.getUsername(), email);
    }







    
}
