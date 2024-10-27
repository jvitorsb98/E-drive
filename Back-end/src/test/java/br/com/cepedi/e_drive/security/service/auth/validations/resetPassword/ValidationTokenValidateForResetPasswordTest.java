package br.com.cepedi.e_drive.security.service.auth.validations.resetPassword;

import br.com.cepedi.e_drive.security.model.records.register.DataResetPassword;
import br.com.cepedi.e_drive.security.service.token.TokenService;
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

class ValidationTokenValidateForResetPasswordTest {

    @InjectMocks
    private ValidationTokenValidateForResetPassword validation;

    @Mock
    private TokenService tokenService;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o token for inválido")
    void testValidate_TokenInvalid() {
        // Dados de redefinição de senha com token inválido
        DataResetPassword dataResetPassword = new DataResetPassword("invalidToken", "newPassword");

        // Simulando que o token não é válido
        when(tokenService.isValidToken("invalidToken")).thenReturn(false);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("Token inválido");

        // Verifica se a exceção é lançada
        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(dataResetPassword);
        });

        assertEquals("Token inválido", exception.getMessage());
        verify(tokenService, times(1)).isValidToken("invalidToken");
    }

    @Test
    @DisplayName("Não deve lançar exceção se o token for válido")
    void testValidate_TokenValid() {
        // Dados de redefinição de senha com token válido
        DataResetPassword dataResetPassword = new DataResetPassword("validToken", "newPassword");

        // Simulando que o token é válido
        when(tokenService.isValidToken("validToken")).thenReturn(true);

        // Não deve lançar exceção
        validation.validate(dataResetPassword);

        verify(tokenService, times(1)).isValidToken("validToken");
    }
}

