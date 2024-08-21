package br.com.cepedi.e_drive.service.vehicleUser.validations.register;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;

public class ValidationRegisterVehicleUser_VehicleNotDisabledTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private ValidationRegisterVehicleUser_VehicleNotDisabled validation;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw ValidationException when Vehicle is disabled")
    void testValidate_WhenVehicleIsDisabled() {
        // Arrange
        Long vehicleId = 1L;
        DataRegisterVehicleUser data = new DataRegisterVehicleUser(vehicleId, null); // Mock userId
        Vehicle vehicle = mock(Vehicle.class);
        when(vehicleRepository.existsById(vehicleId)).thenReturn(true);
        when(vehicleRepository.getReferenceById(vehicleId)).thenReturn(vehicle);
        when(vehicle.isActivated()).thenReturn(false);

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            validation.validate(data);
        });
        assertEquals("The provided vehicle id is disabled", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException when Vehicle is active")
    void testValidate_WhenVehicleIsActive() {
        // Arrange
        Long vehicleId = 1L;
        DataRegisterVehicleUser data = new DataRegisterVehicleUser(vehicleId, null); // Mock userId
        Vehicle vehicle = mock(Vehicle.class);
        when(vehicleRepository.existsById(vehicleId)).thenReturn(true);
        when(vehicleRepository.getReferenceById(vehicleId)).thenReturn(vehicle);
        when(vehicle.isActivated()).thenReturn(true);

        // Act & Assert
        validation.validate(data); // No exception should be thrown
    }

    @Test
    @DisplayName("Should not throw ValidationException when Vehicle does not exist")
    void testValidate_WhenVehicleDoesNotExist() {
        // Arrange
        Long vehicleId = 1L;
        DataRegisterVehicleUser data = new DataRegisterVehicleUser(vehicleId, null); // Mock userId
        when(vehicleRepository.existsById(vehicleId)).thenReturn(false);

        // Act & Assert
        validation.validate(data); // No exception should be thrown
    }
}
