package br.com.cepedi.e_drive.security.service.user;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.validations.update.UserValidationUpdate;

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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenService tokenService;

     @Mock
    private List<UserValidationUpdate> userValidationUpdateList;

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
            reset(userRepository, passwordEncoder, userValidationUpdateList); // Resetting mocks, incluindo a lista
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
        when(userRepository.findByEmail(email)).thenReturn(null); // Simula que o usuário não foi encontrado
    
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(dataUpdateUser, userDetails);
        });
    
        assertEquals("User not found", exception.getMessage(), "Expected exception message to be: User not found");
        verify(userRepository, never()).saveAndFlush(any(User.class)); // Verifica se saveAndFlush não foi chamado
    }
    
    @Test
    void testUpdateUser_Success() {
        // Dados de entrada
        String email = "test@example.com";
        DataUpdateUser data = new DataUpdateUser("Nome Atualizado", "11999999999", LocalDate.of(1990, 1, 1));
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);

        // Configurando o usuário existente
        User existingUser = new User();
        existingUser.setEmail(email);

        // Configurando mocks
        when(userRepository.findByEmail(email)).thenReturn(existingUser);
        userValidationUpdateList.forEach(validation -> doNothing().when(validation).validate(data, email));

        // Chama o método de teste
        DataDetailsUser result = userService.updateUser(data, userDetails);

        // Verificações
        assertNotNull(result); // Verifica se o retorno não é nulo
        assertEquals("Nome Atualizado", existingUser.getName()); 
        assertEquals("11999999999", existingUser.getCellphone());
        assertEquals(LocalDate.of(1990, 1, 1), existingUser.getBirth()); 
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
void testGetUserDesctivatedByEmail_UserFound() {
    // Dados de entrada
    String email = "desativado@example.com";
    
    // Configurando o usuário esperado
    User expectedUser = new User();
    expectedUser.setEmail(email);
    
    // Configurando o mock
    when(userRepository.findByEmail(email)).thenReturn(expectedUser);
    
    // Chama o método de teste
    User result = userService.getUserDesctivatedByEmail(email);
    
    // Verificações
    assertNotNull(result); // Verifica se o retorno não é nulo
    assertEquals(email, result.getEmail()); // Verifica se o e-mail é o esperado
    verify(userRepository, times(1)).findByEmail(email); // Verifica se o método findByEmail foi chamado uma vez
}
@Test
void testGetUserByToken_UserFound() {
    // Dados de entrada
    String token = "Bearer someValidToken";
    String email = "tokenUser@example.com";
    
    // Configurando o usuário esperado
    User expectedUser = new User();
    expectedUser.setEmail(email);
    
    // Configurando mocks para o TokenService e UserRepository
    when(tokenService.getEmailByToken("someValidToken")).thenReturn(email);
    when(userRepository.findByEmail(email)).thenReturn(expectedUser);
    
    // Chama o método de teste
    User result = userService.getUserByToken(token);
    
    // Verificações
    assertNotNull(result); // Verifica se o retorno não é nulo
    assertEquals(email, result.getEmail()); // Verifica se o e-mail é o esperado
    verify(tokenService, times(1)).getEmailByToken("someValidToken"); // Verifica a extração do e-mail pelo token
    verify(userRepository, times(1)).findByEmail(email); // Verifica se a busca no repositório foi chamada
}

    
}

