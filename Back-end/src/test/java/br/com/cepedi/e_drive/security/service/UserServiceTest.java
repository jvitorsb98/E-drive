package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private Faker faker;
    private User user;
    private String email;
    private String newPassword;
    private String encodedPassword;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        email = faker.internet().emailAddress();
        newPassword = faker.internet().password();
        encodedPassword = faker.internet().password();
        
        user = new User();
        user.setEmail(email);
        user.setPassword(faker.internet().password());

        // Resetting mocks before each test
        reset(userRepository, passwordEncoder);
    }

    @Test
    @DisplayName("Should return user when found by email")
    void testGetUserActivatedByEmail() {
        when(userRepository.findByEmail(email)).thenReturn(user);

        User result = userService.getUserActivatedByEmail(email);

        assertNotNull(result);
        assertEquals(email, result.getEmail());
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should return null when user not found by email")
    void testGetUserActivatedByEmail_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(null);

        User result = userService.getUserActivatedByEmail(faker.internet().emailAddress());

        assertNull(result);
        verify(userRepository).findByEmail(anyString());
    }

    @Test
    @DisplayName("Should update user password successfully")
    void testUpdatePassword() {
        when(userRepository.findByEmail(email)).thenReturn(user);
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);

        userService.updatePassword(email, newPassword);

        assertEquals(encodedPassword, user.getPassword());
        verify(userRepository).saveAndFlush(user);
    }

    @Test
    @DisplayName("Should throw exception when user not found while updating password")
    void testUpdatePassword_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updatePassword(faker.internet().emailAddress(), newPassword);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, never()).saveAndFlush(any(User.class));
    }
}
