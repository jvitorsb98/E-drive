package br.com.cepedi.e_drive.security.service.user.validations.disabled;

import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.*;

class ValidationUserExistsForDisabledTest {

    @InjectMocks
    private ValidationUserExistsForDisabled validation;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário não existir")
    void testValidation_UserDoesNotExist() {
        Long userId = 1L;

        when(userRepository.existsById(userId)).thenReturn(false);

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validation(userId);
        });

        assertEquals("The user does not exist", exception.getMessage());
        verify(userRepository, times(1)).existsById(userId);
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário existir")
    void testValidation_UserExists() {
        Long userId = 1L;

        when(userRepository.existsById(userId)).thenReturn(true);

        validation.validation(userId);

        verify(userRepository, times(1)).existsById(userId);
    }
}
