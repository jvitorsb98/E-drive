package br.com.cepedi.e_drive.security.service.auth.validations.reactivated;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.service.user.UserService;
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

class ValidationUserAlreadyActivatedForReactivatedTest {

    @InjectMocks
    private ValidationUserAlreadyActivatedForReactivated validation;

    @Mock
    private UserService userService;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário já estiver ativado")
    void testValidate_UserAlreadyActivated() {
        String token = "valid-token";
        User user = new User();
        user.setActivated(true);

        when(userService.getUserByToken(token)).thenReturn(user);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("User already activated");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(token);
        });

        assertEquals("User already activated", exception.getMessage());
        verify(userService, times(1)).getUserByToken(token);
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário não estiver ativado")
    void testValidate_UserNotActivated() {
        String token = "valid-token";
        User user = new User();
        user.setActivated(false);

        when(userService.getUserByToken(token)).thenReturn(user);

        // Não deve lançar exceção
        validation.validate(token);

        verify(userService, times(1)).getUserByToken(token);
    }
}
