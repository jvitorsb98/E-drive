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

import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;

public class ValidationRegisterVehicleUser_VehicleExistsTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private ValidationRegisterVehicleUser_VehicleExists validation;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw ValidationException when Vehicle does not exist")
    void testValidate_WhenVehicleDoesNotExist() {
        // Arrange
        Long vehicleId = 1L;
        DataRegisterVehicleUser data = new DataRegisterVehicleUser(vehicleId, null); // Mock userId
        when(vehicleRepository.existsById(vehicleId)).thenReturn(false);

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            validation.validate(data);
        });
        assertEquals("The provided vehicle id does not exist", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException when Vehicle exists")
    void testValidate_WhenVehicleExists() {
        // Arrange
        Long vehicleId = 1L;
        DataRegisterVehicleUser data = new DataRegisterVehicleUser(vehicleId, null); // Mock userId
        when(vehicleRepository.existsById(vehicleId)).thenReturn(true);

        // Act & Assert
        validation.validate(data); // No exception should be thrown
    }
}

