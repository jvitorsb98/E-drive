package br.com.cepedi.e_drive.security.service.auth.validations.register;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.entitys.User; // Importando a classe User
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationRegisterUser_EmailRegistradoTest {

    @InjectMocks
    private ValidationRegisterUser_EmailRegistrado validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @Mock
    private PasswordEncoder passwordEncoder; // Mock do PasswordEncoder

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o e-mail já estiver registrado")
    void testValidation_EmailAlreadyRegistered() {
        // Dados de registro com e-mail já registrado
        DataRegisterUser dataRegisterUser = new DataRegisterUser(
                "test@example.com",
                "Test User",
                "securePassword123",
                LocalDate.of(1990, 1, 1),
                "123456789"
        );

        // Simulando o PasswordEncoder
        when(passwordEncoder.encode("securePassword123")).thenReturn("encodedPassword");

        // Simulando que o e-mail existe
        User existingUser = new User(dataRegisterUser, passwordEncoder);
        existingUser.activate(); // Ativa o usuário

        when(userRepository.findByEmail("test@example.com")).thenReturn(existingUser);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("E-mail já registrado");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validation(dataRegisterUser);
        });

        assertEquals("E-mail já registrado", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Não deve lançar exceção se o e-mail não estiver registrado")
    void testValidation_EmailNotRegistered() {
        // Dados de registro com e-mail não registrado
        DataRegisterUser dataRegisterUser = new DataRegisterUser(
                "new@example.com",
                "New User",
                "securePassword123",
                LocalDate.of(1990, 1, 1),
                "987654321"
        );

        when(userRepository.findByEmail("new@example.com")).thenReturn(null); // Simulando que o e-mail não existe

        // Não deve lançar exceção
        validation.validation(dataRegisterUser);

        verify(userRepository, times(1)).findByEmail("new@example.com");
    }
}
