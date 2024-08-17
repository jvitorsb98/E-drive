package br.com.cepedi.e_drive.service.vehicle.validations.disabled;

import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationDisabledVehicle_ExistsTest {

    @InjectMocks
    private ValidationDisabledVehicle_Exists validation;

    @Mock
    private VehicleRepository vehicleRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Validate - Should throw ValidationException if vehicle does not exist")
    void validate_ShouldThrowValidationExceptionIfNotExists() {
        // Arrange
        Long id = 1L;
        when(vehicleRepository.existsById(id)).thenReturn(false); 

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(id));
        assertEquals("The provided vehicle id does not exist", exception.getMessage());
    }

    @Test
    @DisplayName("Validate - Should not throw exception if vehicle exists")
    void validate_ShouldNotThrowExceptionIfExists() {
        // Arrange
        Long id = 1L;
        when(vehicleRepository.existsById(id)).thenReturn(true); 

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(id));
    }
}

