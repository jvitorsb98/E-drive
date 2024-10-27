package br.com.cepedi.e_drive.security.service.auth.validations.reactivateAccountRequest;

import br.com.cepedi.e_drive.security.model.entitys.User;
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

class ValidationUserAlreadyActivatedForReactivatedRequestTest {

    @InjectMocks
    private ValidationUserAlreadyActivatedForReactivatedRequest validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário já estiver ativo")
    void testValidate_UserAlreadyActivated() {
        DataReactivateAccount data = new DataReactivateAccount("test@example.com");

        User user = new User();
        user.setActivated(true);
        user.setName("Test User");

        when(userRepository.findByEmail(data.email())).thenReturn(user);
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("User is already active");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(data);
        });

        assertEquals("User is already active", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(data.email());
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário não estiver ativo")
    void testValidate_UserNotActivated() {
        DataReactivateAccount data = new DataReactivateAccount("test@example.com");

        User user = new User();
        user.setActivated(false);

        when(userRepository.findByEmail(data.email())).thenReturn(user);

        // Não deve lançar exceção
        validation.validate(data);

        verify(userRepository, times(1)).findByEmail(data.email());
    }
}

