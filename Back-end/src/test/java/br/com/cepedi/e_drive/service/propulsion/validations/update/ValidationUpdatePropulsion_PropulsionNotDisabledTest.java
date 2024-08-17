package br.com.cepedi.e_drive.service.propulsion.validations.update;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationUpdatePropulsion_PropulsionNotDisabledTest {

    @InjectMocks
    private ValidationUpdatePropulsion_PropulsionNotDisabled validation;

    @Mock
    private PropulsionRepository propulsionRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Validate - Should throw ValidationException if propulsion is activated")
    void validate_ShouldThrowValidationExceptionIfActivated() {
        // Arrange
        Long id = 1L;
        Propulsion propulsion = mock(Propulsion.class);
        when(propulsionRepository.existsById(id)).thenReturn(true);
        when(propulsionRepository.getReferenceById(id)).thenReturn(propulsion);
        when(propulsion.getActivated()).thenReturn(true); // Activated

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(id));
        assertEquals("The required propulsion is activated", exception.getMessage());
    }

    @Test
    @DisplayName("Validate - Should not throw exception if propulsion is not activated")
    void validate_ShouldNotThrowExceptionIfNotActivated() {
        // Arrange
        Long id = 1L;
        Propulsion propulsion = mock(Propulsion.class);
        when(propulsionRepository.existsById(id)).thenReturn(true);
        when(propulsionRepository.getReferenceById(id)).thenReturn(propulsion);
        when(propulsion.getActivated()).thenReturn(false); 

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(id));
    }

    @Test
    @DisplayName("Validate - Should not throw exception if propulsion does not exist")
    void validate_ShouldNotThrowExceptionIfNotExists() {
        // Arrange
        Long id = 1L;
        when(propulsionRepository.existsById(id)).thenReturn(false); 

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(id));
    }
}
