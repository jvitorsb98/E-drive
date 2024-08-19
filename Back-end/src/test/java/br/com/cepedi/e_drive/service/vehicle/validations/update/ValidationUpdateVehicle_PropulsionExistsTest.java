package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import com.github.javafaker.Faker;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ValidationUpdateVehicle_PropulsionExistsTest {

    @Mock
    private PropulsionRepository propulsionRepository;

    @InjectMocks
    private ValidationUpdateVehicle_PropulsionExists validationUpdateVehiclePropulsionExists;

    private Faker faker;
    private DataUpdateVehicle data;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
    }

    @Test
    @DisplayName("Should throw ValidationException when propulsionId does not exist in the repository")
    public void shouldThrowExceptionWhenPropulsionIdDoesNotExist() {
        // Arrange
        Long invalidPropulsionId = faker.number().randomNumber(); 
        data = new DataUpdateVehicle(
            faker.lorem().word(), // motor
            null, // other fields if necessary
            invalidPropulsionId, invalidPropulsionId, invalidPropulsionId, invalidPropulsionId, invalidPropulsionId, invalidPropulsionId, null
        );

        when(propulsionRepository.existsById(invalidPropulsionId)).thenReturn(false);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationUpdateVehiclePropulsionExists.validate(data));
    }

    @Test
    @DisplayName("Should not throw ValidationException when propulsionId exists in the repository")
    public void shouldNotThrowExceptionWhenPropulsionIdExists() {
        // Arrange
        Long validPropulsionId = faker.number().randomNumber(); 
        data = new DataUpdateVehicle(
            faker.lorem().word(), // motor
            null, // other fields if necessary
            validPropulsionId, validPropulsionId, validPropulsionId, validPropulsionId, validPropulsionId, validPropulsionId, null
        );

        when(propulsionRepository.existsById(validPropulsionId)).thenReturn(true);

        // Act & Assert
        validationUpdateVehiclePropulsionExists.validate(data);
    }
}
