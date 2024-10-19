package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.auth.AuthService;
import br.com.cepedi.e_drive.security.service.auth.validations.register.ValidationRegisterUser;
import br.com.cepedi.e_drive.security.service.token.TokenService;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import java.util.stream.Stream;

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
    private TokenService tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private MessageSource messageSource;

    @Mock
    private List<ValidationRegisterUser> validationRegisterUserList;


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
    
}
