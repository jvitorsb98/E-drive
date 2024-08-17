package br.com.cepedi.e_drive.service.propulsion.validations.update;

import br.com.cepedi.e_drive.repository.PropulsionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationUpdatePropulsion_PropulsionExistsTest {

    @InjectMocks
    private ValidationUpdatePropulsion_PropulsionExists validation;

    @Mock
    private PropulsionRepository propulsionRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Validate - Should throw IllegalArgumentException if propulsion does not exist")
    void validate_ShouldThrowIllegalArgumentExceptionIfNotExists() {
        // Arrange
        Long id = 1L;
        when(propulsionRepository.existsById(id)).thenReturn(false); 

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> validation.validate(id));
        assertEquals("Propulsion with the given ID does not exist", exception.getMessage());
    }

    @Test
    @DisplayName("Validate - Should not throw exception if propulsion exists")
    void validate_ShouldNotThrowExceptionIfExists() {
        // Arrange
        Long id = 1L;
        when(propulsionRepository.existsById(id)).thenReturn(true); // Exists

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(id));
    }
}
