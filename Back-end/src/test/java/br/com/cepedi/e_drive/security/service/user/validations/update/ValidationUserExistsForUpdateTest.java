package br.com.cepedi.e_drive.security.service.user.validations.update;

import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class ValidationUserExistsForUpdateTest {

    @InjectMocks
    private ValidationUserExistsForUpdate validation;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar RuntimeException se o usuário não existir")
    void testValidate_UserDoesNotExist() {
        String email = "test@example.com";
        DataUpdateUser dataUpdateUser = new DataUpdateUser(null, null, null); // Pode ser vazio, pois não está sendo usado

        when(userRepository.existsByEmail(email)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            validation.validate(dataUpdateUser, email);
        });

        assertEquals("User does not exist", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail(email);
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário existir")
    void testValidate_UserExists() {
        String email = "test@example.com";
        DataUpdateUser dataUpdateUser = new DataUpdateUser(null, null, null); // Pode ser vazio, pois não está sendo usado

        when(userRepository.existsByEmail(email)).thenReturn(true);

        validation.validate(dataUpdateUser, email);

        verify(userRepository, times(1)).existsByEmail(email);
    }
}
