package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

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

    private User user;
    private String email;
    private String newPassword;
    private String encodedPassword;
    private DataUpdateUser dataUpdateUser;

    @BeforeEach
    void setUp() {
        email = "test@example.com";
        newPassword = "newPassword";
        encodedPassword = "encodedPassword";

        user = new User();
        user.setEmail(email);
        user.setName("Old Name");
        user.setCellphone("Old Cellphone");
        user.setBirth(LocalDate.of(1990, 1, 1));
        user.setActivated(true);

        dataUpdateUser = new DataUpdateUser(
                "New Name",
                "New Cellphone",
                LocalDate.of(2000, 1, 1)
        );

        // Resetting mocks before each test
        reset(userRepository, passwordEncoder);
    }

    @Test
    @DisplayName("Should return true if user exists by email")
    void testExistsByEmail_UserExists() {
        when(userRepository.existsByEmail(email)).thenReturn(true);

        boolean exists = userService.existsByEmail(email);

        assertTrue(exists, () -> "Expected user to exist by email: " + email);
        verify(userRepository).existsByEmail(email);
    }

    @Test
    @DisplayName("Should return false if user does not exist by email")
    void testExistsByEmail_UserDoesNotExist() {
        when(userRepository.existsByEmail(email)).thenReturn(false);

        boolean exists = userService.existsByEmail(email);

        assertFalse(exists, () -> "Expected user not to exist by email: " + email);
        verify(userRepository).existsByEmail(email);
    }

    @Test
    @DisplayName("Should return user details when found by email")
    void testGetDetailsUserByEmail_UserExists() {
        when(userRepository.findByEmail(email)).thenReturn(user);

        DataDetailsUser result = userService.getDetailsUserByEmail(email);

        assertNotNull(result, () -> "Expected result to be non-null for email: " + email);
        assertEquals(email, result.email(), () -> "Expected email to match: " + email);
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should return user when found by email")
    void testGetUserActivatedByEmail_UserFound() {
        User expectedUser = new User();
        expectedUser.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(expectedUser);

        User result = userService.getUserActivatedByEmail(email);

        assertNotNull(result, () -> "Expected user to be non-null for email: " + email);
        assertEquals(expectedUser.getEmail(), result.getEmail(), () -> "Expected email to match: " + expectedUser.getEmail());
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should return null when user not found by email")
    void testGetUserActivatedByEmail_UserNotFound() {
        when(userRepository.findByEmail(email)).thenReturn(null);

        User result = userService.getUserActivatedByEmail(email);

        assertNull(result, () -> "Expected user to be null for email: " + email);
        verify(userRepository).findByEmail(email);
    }

    @Test
    @DisplayName("Should update user password successfully")
    void testUpdatePassword_Success() {
        User user = new User();
        user.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(user);
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);

        userService.updatePassword(email, newPassword);

        assertEquals(encodedPassword, user.getPassword(), () -> "Expected password to be updated to: " + encodedPassword);
        verify(userRepository).saveAndFlush(user);
    }

    @Test
    @DisplayName("Should throw exception when user not found while updating password")
    void testUpdatePassword_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updatePassword(email, newPassword);
        });

        assertEquals("User not found", exception.getMessage(), () -> "Expected exception message to be: User not found");
        verify(userRepository, never()).saveAndFlush(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when user not found while updating details")
    void testUpdateUser_UserNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(userDetails, dataUpdateUser);
        });

        assertEquals("User not found", exception.getMessage(), () -> "Expected exception message to be: User not found");
        verify(userRepository, never()).saveAndFlush(any(User.class));
    }

    @Test
    @DisplayName("Should update user details successfully")
    void testUpdateUser_Success() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(user);

        DataDetailsUser result = userService.updateUser(userDetails, dataUpdateUser);

        assertNotNull(result, () -> "Expected result to be non-null");
        assertEquals("New Name", user.getName(), () -> "Expected user name to be updated to: New Name");
        assertEquals("New Cellphone", user.getCellphone(), () -> "Expected user cellphone to be updated to: New Cellphone");
        assertEquals(LocalDate.of(2000, 1, 1), user.getBirth(), () -> "Expected user birth date to be updated to: 2000-01-01");
        verify(userRepository).findByEmail(email);


    }


}

