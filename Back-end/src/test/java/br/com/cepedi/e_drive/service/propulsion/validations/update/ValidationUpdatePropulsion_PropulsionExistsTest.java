package br.com.cepedi.e_drive.service.propulsion.validations.update;

import br.com.cepedi.e_drive.repository.PropulsionRepository;
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

class ValidationUpdatePropulsion_PropulsionExistsTest {

    @InjectMocks
    private ValidationUpdatePropulsion_PropulsionExists validation;

    @Mock
    private PropulsionRepository propulsionRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

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
        when(messageSource.getMessage("propulsion.not.found_1", new Object[]{id}, Locale.getDefault()))
                .thenReturn("Propulsion with the given ID does not exist"); // Mockando a mensagem de erro

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
