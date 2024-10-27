package br.com.cepedi.e_drive.security.service.auth.validations.login;


import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
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

class ValidationLoginUserActiveTest {

    @InjectMocks
    private ValidationLoginUserActive validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário não estiver ativo")
    void testValidate_UserNotActive() {
        DataAuth dataAuth = new DataAuth("test@example.com", "password");

        User user = new User();
        user.setActivated(false); // O usuário está inativo

        when(userRepository.findByEmail("test@example.com")).thenReturn(user);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("User is not active");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(dataAuth);
        });

        assertEquals("User is not active", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário estiver ativo")
    void testValidate_UserIsActive() {
        DataAuth dataAuth = new DataAuth("test@example.com", "password");

        User user = new User();
        user.setActivated(true); // O usuário está ativo

        when(userRepository.findByEmail("test@example.com")).thenReturn(user);

        // Não deve lançar exceção
        validation.validate(dataAuth);

        verify(userRepository, times(1)).findByEmail("test@example.com");
    }
}

