package br.com.cepedi.e_drive.service.vehicle.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
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

class ValidationDisabledVehicle_NotDisabledTest {

    @InjectMocks
    private ValidationDisabledVehicle_NotDisabled validation;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Validate - Should throw ValidationException if vehicle is already disabled")
    void validate_ShouldThrowValidationExceptionIfDisabled() {
        // Arrange
        Long id = 1L;
        Vehicle vehicle = mock(Vehicle.class);
        when(vehicleRepository.existsById(id)).thenReturn(true);
        when(vehicleRepository.getReferenceById(id)).thenReturn(vehicle);
        when(vehicle.isActivated()).thenReturn(false); // Vehicle is not activated

        // Mockando a mensagem de erro
        when(messageSource.getMessage("vehicle.disable.already", new Object[]{id}, Locale.getDefault()))
                .thenReturn("The provided vehicle already disabled");

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(id));
        assertEquals("The provided vehicle already disabled", exception.getMessage());
    }

    @Test
    @DisplayName("Validate - Should not throw exception if vehicle is activated")
    void validate_ShouldNotThrowExceptionIfActivated() {
        // Arrange
        Long id = 1L;
        Vehicle vehicle = mock(Vehicle.class);
        when(vehicleRepository.existsById(id)).thenReturn(true);
        when(vehicleRepository.getReferenceById(id)).thenReturn(vehicle);
        when(vehicle.isActivated()).thenReturn(true); // Vehicle is activated

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(id));
    }

    @Test
    @DisplayName("Validate - Should not throw exception if vehicle does not exist")
    void validate_ShouldNotThrowExceptionIfNotExists() {
        // Arrange
        Long id = 1L;
        when(vehicleRepository.existsById(id)).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(id));
    }
}
