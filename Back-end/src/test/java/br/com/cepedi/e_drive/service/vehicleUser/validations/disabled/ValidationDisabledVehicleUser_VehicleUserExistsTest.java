package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;

public class ValidationDisabledVehicleUser_VehicleUserExistsTest {

    @Mock
    private VehicleUserRepository vehicleUserRepository;

    @InjectMocks
    private ValidationDisabledVehicleUser_VehicleUserExists validation;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw ValidationException when VehicleUser does not exist")
    void testValidate_WhenVehicleUserDoesNotExist() {
        // Arrange
        Long id = 1L;
        when(vehicleUserRepository.existsById(id)).thenReturn(false);

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            validation.validate(id);
        });
        assertEquals("The provided vehicleUser id does not exist", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException when VehicleUser exists")
    void testValidate_WhenVehicleUserExists() {
        // Arrange
        Long id = 1L;
        when(vehicleUserRepository.existsById(id)).thenReturn(true);

        // Act & Assert
        validation.validate(id); // No exception should be thrown
    }
}
