package br.com.cepedi.e_drive.service.propulsion.validations.disabled;

import br.com.cepedi.e_drive.repository.PropulsionRepository;
import br.com.cepedi.e_drive.model.entitys.Propulsion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationPropulsionAlreadyDisabledTest {

    @InjectMocks
    private ValidationPropulsionAlreadyDisabled validation;

    @Mock
    private PropulsionRepository propulsionRepository;

    @Mock
    private MessageSource messageSource; // Adicionando mock para MessageSource

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Validate - Should throw IllegalStateException if propulsion is already disabled")
    void validate_ShouldThrowIllegalStateExceptionIfAlreadyDisabled() {
        // Arrange
        Long id = 1L;
        Propulsion propulsion = mock(Propulsion.class);
        when(propulsionRepository.findById(id)).thenReturn(java.util.Optional.of(propulsion));
        when(propulsion.getActivated()).thenReturn(false); // Already disabled
        when(messageSource.getMessage("propulsion.disabled.already.disabled", new Object[]{id}, Locale.getDefault()))
                .thenReturn("Propulsion with ID " + id + " is already disabled."); // Mocking the error message

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> validation.validate(id));
        assertEquals("Propulsion with ID " + id + " is already disabled.", exception.getMessage());
    }

    @Test
    @DisplayName("Validate - Should not throw exception if propulsion is not disabled")
    void validate_ShouldNotThrowExceptionIfNotDisabled() {
        // Arrange
        Long id = 1L;
        Propulsion propulsion = mock(Propulsion.class);
        when(propulsionRepository.findById(id)).thenReturn(java.util.Optional.of(propulsion));
        when(propulsion.getActivated()).thenReturn(true); // Not disabled

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(id));
    }

    @Test
    @DisplayName("Validate - Should throw IllegalArgumentException if propulsion does not exist")
    void validate_ShouldThrowIllegalArgumentExceptionIfNotExists() {
        // Arrange
        Long id = 1L;
        when(propulsionRepository.findById(id)).thenReturn(java.util.Optional.empty());
        when(messageSource.getMessage("propulsion.disabled.not.found", new Object[]{id}, Locale.getDefault()))
                .thenReturn("Propulsion with ID " + id + " does not exist."); // Mocking the error message

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> validation.validate(id));
        assertEquals("Propulsion with ID " + id + " does not exist.", exception.getMessage());
    }
}
