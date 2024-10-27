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
import br.com.cepedi.e_drive.security.service.auth.validations.register.ValidationRegisterUser;
import br.com.cepedi.e_drive.security.service.auth.validations.resetPassword.ValidationResetPassword;
import br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest.ValidationResetPasswordRequest;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.UserService;
import br.com.cepedi.e_drive.security.service.user.validations.disabled.ValidationDisabledUser;
import jakarta.mail.MessagingException;
import br.com.cepedi.e_drive.security.service.email.EmailService;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;
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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.stream.Stream;
import java.net.URI;
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


    // Adicione o método de teste para reativação aqui se necessário
    public void testReactivateAccountRequest_Success() throws MessagingException {
        DataReactivateAccount dataReactivateAccount = new DataReactivateAccount(faker.internet().emailAddress());
        User user = new User();
        user.setEmail(dataReactivateAccount.email());

        // Mocks
        given(validationReactivateAccountRequestList.stream()).willReturn(Stream.of(mock(ValidationReactivateAccountRequest.class)));
        given(userRepository.findByEmail(dataReactivateAccount.email())).willReturn(user);
        given(tokenService.generateTokenForReactivation(user)).willReturn("mockedToken");
        doNothing().when(emailService).sendReactivationEmailAsync(anyString(), anyString(), anyString());
        given(messageSource.getMessage(any(String.class), any(Object[].class), any(Locale.class))).willReturn("Reactivation success message");

        // Act
        String result = authService.reactivateAccountRequest(dataReactivateAccount);

        // Assert
        assertEquals("Reactivation success message", result, "Success message should match");
        verify(emailService).sendReactivationEmailAsync(user.getName(), dataReactivateAccount.email(), "mockedToken");
    }


    @Test
    @DisplayName("Should redirect to login page with error message when token is invalid")
    void shouldReturnErrorForInvalidToken() {
        // Arrange
        String token = faker.internet().password(); // Simulating an invalid token

        when(tokenService.isValidToken(token)).thenReturn(false);

        // Act
        ResponseEntity<String> response = authService.activateAccount(token);

        // Assert
        verify(tokenService, times(1)).isValidToken(token);
        verifyNoMoreInteractions(validationsActivatedAccountList, userRepository);

        assertEquals(HttpStatus.FOUND, response.getStatusCode());
        assertEquals(URI.create("http://localhost:4200/e-driver/login?error=O+token+de+ativa%C3%A7%C3%A3o+%C3%A9+inv%C3%A1lido+ou+expirou"), response.getHeaders().getLocation());
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

}
