package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

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

    private Faker faker;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Test Register User")
    public void testRegisterUser() {
        String email = faker.internet().emailAddress();
        DataRegisterUser data = new DataRegisterUser(
            faker.name().fullName(),
            email,
            faker.internet().password(),
            faker.date().past(30, TimeUnit.DAYS).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate(),
            faker.phoneNumber().phoneNumber()
        );
        
        User user = new User();
        user.setEmail(email);
        given(passwordEncoder.encode(data.password())).willReturn("encodedPassword");
        given(userRepository.save(any(User.class))).willReturn(user);
        given(tokenService.generateTokenForActivatedEmail(any(User.class))).willReturn("mockedToken");
        
        DataDetailsRegisterUser result = authService.register(data);
        
        assertThat(result).isNotNull();
        assertThat(result.confirmationToken()).isEqualTo("mockedToken");
    }
    
    @Test
    @DisplayName("Test Activate User Success")
    public void testActivateUser_Success() {
        String email = faker.internet().emailAddress();
        User user = new User();
        user.setEmail(email);
        user.setActivated(false);

        String secret = "your_secret_key";
        String token = JWT.create()
                .withClaim("email", email)
                .withExpiresAt(java.util.Date.from(java.time.Instant.now().plus(1, java.time.temporal.ChronoUnit.HOURS)))
                .sign(Algorithm.HMAC256(secret));

        given(userRepository.findByEmail(email)).willReturn(user);

        authService.activateUser(token);

        assertTrue(user.getActivated(), "User should be activated");
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Test Activate User Not Found")
    public void testActivateUser_UserNotFound() {
        String email = faker.internet().emailAddress();

        String secret = "your_secret_key";
        String token = JWT.create()
                .withClaim("email", email)
                .withExpiresAt(java.util.Date.from(java.time.Instant.now().plus(1, java.time.temporal.ChronoUnit.HOURS)))
                .sign(Algorithm.HMAC256(secret));

        given(userRepository.findByEmail(email)).willReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> authService.activateUser(token),
                "Expected activateUser to throw UsernameNotFoundException, but it didn't");
    }
    
    @Test
    @DisplayName("Test Load User By Username Success")
    public void testLoadUserByUsername_Success() {
        String email = faker.internet().emailAddress();
        User user = new User();
        user.setEmail(email);

        given(userRepository.findByEmail(email)).willReturn(user);

        UserDetails userDetails = authService.loadUserByUsername(email);

        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(email);
    }

    @Test
    @DisplayName("Test Load User By Username Not Found")
    public void testLoadUserByUsername_UserNotFound() {
        String email = faker.internet().emailAddress();

        given(userRepository.findByEmail(email)).willReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> authService.loadUserByUsername(email),
                "Expected loadUserByUsername to throw UsernameNotFoundException, but it didn't");
    }
}


