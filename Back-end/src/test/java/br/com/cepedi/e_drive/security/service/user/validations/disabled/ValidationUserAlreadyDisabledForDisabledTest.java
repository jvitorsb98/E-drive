package br.com.cepedi.e_drive.security.service.user.validations.disabled;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.*;

class ValidationUserAlreadyDisabledForDisabledTest {

    @InjectMocks
    private ValidationUserAlreadyDisabledForDisabled validation;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar IllegalArgumentException se o usuário já estiver desativado")
    void testValidation_UserAlreadyDisabled() {
        Long userId = 1L;

        User user = new User();
        user.setActivated(false);

        when(userRepository.existsById(userId)).thenReturn(true);
        when(userRepository.getReferenceById(userId)).thenReturn(user);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            validation.validation(userId);
        });

        assertEquals("The user is already deactivated", exception.getMessage());
        verify(userRepository, times(1)).existsById(userId);
        verify(userRepository, times(1)).getReferenceById(userId);
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário estiver ativado")
    void testValidation_UserIsActivated() {
        Long userId = 1L;

        User user = new User();
        user.setActivated(true);

        when(userRepository.existsById(userId)).thenReturn(true);
        when(userRepository.getReferenceById(userId)).thenReturn(user);

        validation.validation(userId);

        verify(userRepository, times(1)).existsById(userId);
        verify(userRepository, times(1)).getReferenceById(userId);
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário não existir")
    void testValidation_UserDoesNotExist() {
        Long userId = 1L;

        when(userRepository.existsById(userId)).thenReturn(false);

        validation.validation(userId);

        verify(userRepository, times(1)).existsById(userId);
        verify(userRepository, never()).getReferenceById(userId);
    }
}
