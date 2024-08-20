package br.com.cepedi.e_drive.service.vehicleType.validations.disabled;

import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import br.com.cepedi.e_drive.service.vehicleType.validations.disabled.ValidationVehicleTypeExistsForDisabled;
import com.github.javafaker.Faker;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValidationVehicleTypeExistsForDisabledTest {

    @Mock
    private VehicleTypeRepository vehicleTypeRepository;

    @InjectMocks
    private ValidationVehicleTypeExistsForDisabled validation;

    private final Faker faker = new Faker();

    @Test
    @DisplayName("Should throw ValidationException when VehicleType does not exist")
    void testValidationExists_ThrowsException() {
        // Arrange
        Long vehicleTypeId = faker.number().randomNumber();

        when(vehicleTypeRepository.existsById(vehicleTypeId)).thenReturn(false);

        // Act & Assert
        assertThrows(ValidationException.class, 
            () -> validation.validation(vehicleTypeId),
            () -> "Expected ValidationException when the VehicleType does not exist");
    }
}
