package br.com.cepedi.e_drive.service.vehicleUser.validations.update;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;

public class ValidationUpdateVehicleUser_VehicleUserNotDisabledTest {

    @Mock
    private VehicleUserRepository vehicleUserRepository;

    @InjectMocks
    private ValidationUpdateVehicleUser_VehicleUserNotDisabled validation;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw ValidationException when VehicleUser is disabled")
    void testValidate_WhenVehicleUserIsDisabled() {
        // Arrange
        Long id = 1L;
        VehicleUser vehicleUser = mock(VehicleUser.class);
        when(vehicleUserRepository.existsById(id)).thenReturn(true);
        when(vehicleUserRepository.getReferenceById(id)).thenReturn(vehicleUser);
        when(vehicleUser.isActivated()).thenReturn(false);

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            validation.validate(id);
        });
        assertEquals("The provided vehicle user id is disabled", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException when VehicleUser is active")
    void testValidate_WhenVehicleUserIsActive() {
        // Arrange
        Long id = 1L;
        VehicleUser vehicleUser = mock(VehicleUser.class);
        when(vehicleUserRepository.existsById(id)).thenReturn(true);
        when(vehicleUserRepository.getReferenceById(id)).thenReturn(vehicleUser);
        when(vehicleUser.isActivated()).thenReturn(true);

        // Act & Assert
        validation.validate(id); // No exception should be thrown
    }

    @Test
    @DisplayName("Should not throw ValidationException when VehicleUser does not exist")
    void testValidate_WhenVehicleUserDoesNotExist() {
        // Arrange
        Long id = 1L;
        when(vehicleUserRepository.existsById(id)).thenReturn(false);

        // Act & Assert
        validation.validate(id); // No exception should be thrown
    }
}
