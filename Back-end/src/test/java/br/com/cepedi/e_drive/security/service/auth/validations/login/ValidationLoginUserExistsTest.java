package br.com.cepedi.e_drive.security.service.auth.validations.login;


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

class ValidationLoginUserExistsTest {

    @InjectMocks
    private ValidationLoginUserExists validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário não existir")
    void testValidate_UserDoesNotExist() {
        DataAuth dataAuth = new DataAuth("test@example.com", "password");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("User does not exist");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(dataAuth);
        });

        assertEquals("User does not exist", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail("test@example.com");
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário existir")
    void testValidate_UserExists() {
        DataAuth dataAuth = new DataAuth("test@example.com", "password");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Não deve lançar exceção
        validation.validate(dataAuth);

        verify(userRepository, times(1)).existsByEmail("test@example.com");
    }
}

