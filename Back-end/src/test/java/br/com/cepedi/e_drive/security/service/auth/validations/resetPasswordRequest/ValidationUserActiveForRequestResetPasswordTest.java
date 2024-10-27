package br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest;

import br.com.cepedi.e_drive.security.model.entitys.User;
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

class ValidationUserActiveForRequestResetPasswordTest {

    @InjectMocks
    private ValidationUserActiveForRequestResetPassword validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário estiver inativo")
    void testValidate_UserInactive() {
        // Dados de solicitação de redefinição de senha com email
        DataRequestResetPassword dataRequestResetPassword = new DataRequestResetPassword("user@example.com");

        // Simulando que o usuário existe e está inativo
        User user = mock(User.class);
        when(userRepository.findByEmail("user@example.com")).thenReturn(user);
        when(user.isActive()).thenReturn(false);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("Usuário inativo");

        // Verifica se a exceção é lançada
        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(dataRequestResetPassword);
        });

        assertEquals("Usuário inativo", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("user@example.com");
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário estiver ativo")
    void testValidate_UserActive() {
        // Dados de solicitação de redefinição de senha com email
        DataRequestResetPassword dataRequestResetPassword = new DataRequestResetPassword("user@example.com");

        // Simulando que o usuário existe e está ativo
        User user = mock(User.class);
        when(userRepository.findByEmail("user@example.com")).thenReturn(user);
        when(user.isActive()).thenReturn(true);

        // Não deve lançar exceção
        validation.validate(dataRequestResetPassword);

        verify(userRepository, times(1)).findByEmail("user@example.com");
    }
}
