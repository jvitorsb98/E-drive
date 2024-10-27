package br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest;

import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationUserExistsForRequestResetPasswordRequestTest {

    @InjectMocks
    private ValidationUserExistsForRequestResetPasswordRequest validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o email não existir")
    void testValidate_EmailNotFound() {
        // Dados de solicitação de redefinição de senha com email
        DataRequestResetPassword dataRequestResetPassword = new DataRequestResetPassword("notfound@example.com");

        // Simulando que o email não existe
        when(userRepository.existsByEmail("notfound@example.com")).thenReturn(false);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("Email não encontrado");

        // Verifica se a exceção é lançada
        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(dataRequestResetPassword);
        });

        assertEquals("Email não encontrado", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail("notfound@example.com");
    }

    @Test
    @DisplayName("Não deve lançar exceção se o email existir")
    void testValidate_EmailFound() {
        // Dados de solicitação de redefinição de senha com email
        DataRequestResetPassword dataRequestResetPassword = new DataRequestResetPassword("found@example.com");

        // Simulando que o email existe
        when(userRepository.existsByEmail("found@example.com")).thenReturn(true);

        // Não deve lançar exceção
        validation.validate(dataRequestResetPassword);

        verify(userRepository, times(1)).existsByEmail("found@example.com");
    }
}
