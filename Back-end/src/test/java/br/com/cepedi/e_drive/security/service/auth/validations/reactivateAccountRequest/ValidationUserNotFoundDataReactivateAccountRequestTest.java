package br.com.cepedi.e_drive.security.service.auth.validations.reactivateAccountRequest;

import br.com.cepedi.e_drive.security.model.records.register.DataReactivateAccount;
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

class ValidationUserNotFoundDataReactivateAccountRequestTest {

    @InjectMocks
    private ValidationUserNotFoundDataReactivateAccountRequest validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário não for encontrado")
    void testValidate_UserNotFound() {
        DataReactivateAccount data = new DataReactivateAccount("test@example.com");

        when(userRepository.existsByEmail(data.email())).thenReturn(false);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("User not found");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(data);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail(data.email());
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário for encontrado")
    void testValidate_UserFound() {
        DataReactivateAccount data = new DataReactivateAccount("test@example.com");

        when(userRepository.existsByEmail(data.email())).thenReturn(true);

        // Não deve lançar exceção
        validation.validate(data);

        verify(userRepository, times(1)).existsByEmail(data.email());
    }
}
