package br.com.cepedi.e_drive.security.service.auth.validations.logout;

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

class ValidationTokenValidLogoutTest {

    @InjectMocks
    private ValidationTokenValidLogout validation;

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
    void testValidate_InvalidToken() {
        String token = "invalidToken";

        when(tokenService.isValidToken(token)).thenReturn(false);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("Token is invalid");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(token);
        });

        assertEquals("Token is invalid", exception.getMessage());
        verify(tokenService, times(1)).isValidToken(token);
    }

    @Test
    @DisplayName("Não deve lançar exceção se o token for válido")
    void testValidate_ValidToken() {
        String token = "validToken";

        when(tokenService.isValidToken(token)).thenReturn(true);

        // Não deve lançar exceção
        validation.validate(token);

        verify(tokenService, times(1)).isValidToken(token);
    }
}

