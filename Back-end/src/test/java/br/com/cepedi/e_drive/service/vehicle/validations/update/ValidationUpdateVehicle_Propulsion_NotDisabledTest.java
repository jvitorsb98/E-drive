package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationUpdateVehicle_Propulsion_NotDisabledTest {

    @Mock
    private PropulsionRepository propulsionRepository;

    @InjectMocks
    private ValidationUpdateVehicle_Propulsion_NotDisabled validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker(); 
    }

    @Test
    @DisplayName("Should throw ValidationException when propulsionId does not exist")
    void shouldThrowValidationExceptionWhenPropulsionIdDoesNotExist() {
        // Arrange
        Long propulsionId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
            faker.lorem().word(), // motor
            faker.lorem().word(), // version
            faker.number().randomNumber(), // modelId
            faker.number().randomNumber(), // categoryId
            faker.number().randomNumber(), // typeId
            faker.number().randomNumber(), // brandId
            propulsionId, // propulsionId
            faker.number().randomNumber(), // year
            null // dataRegisterAutonomy
        );

        // Simula que o propulsionId não existe
        when(propulsionRepository.existsById(propulsionId)).thenReturn(false);

        // Act & Assert
        ValidationException thrown = assertThrows(
            ValidationException.class,
            () -> validation.validate(data),
            "Expected ValidationException to be thrown when propulsionId does not exist"
        );

        // Assert
        assertEquals("The provided propulsion id does not exist", thrown.getMessage());
    }

    @Test
    @DisplayName("Should throw ValidationException when propulsionId exists but is disabled")
    void shouldThrowValidationExceptionWhenPropulsionIdExistsButIsDisabled() {
        // Arrange
        Long propulsionId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
            faker.lorem().word(), // motor
            faker.lorem().word(), // version
            faker.number().randomNumber(), // modelId
            faker.number().randomNumber(), // categoryId
            faker.number().randomNumber(), // typeId
            faker.number().randomNumber(), // brandId
            propulsionId, // propulsionId
            faker.number().randomNumber(), // year
            null // dataRegisterAutonomy
        );

        // Simula uma propulsão desativada
        Propulsion propulsion = new Propulsion();
        propulsion.setActivated(false);

        when(propulsionRepository.existsById(propulsionId)).thenReturn(true);
        when(propulsionRepository.getReferenceById(propulsionId)).thenReturn(propulsion);

        // Act & Assert
        ValidationException thrown = assertThrows(
            ValidationException.class,
            () -> validation.validate(data),
            "Expected ValidationException to be thrown when propulsion is disabled"
        );

        // Assert
        assertEquals("The provided propulsion id is disabled", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw exception when propulsionId exists and is enabled")
    void shouldNotThrowExceptionWhenPropulsionIdExistsAndIsEnabled() {
        // Arrange
        Long propulsionId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
            faker.lorem().word(), // motor
            faker.lorem().word(), // version
            faker.number().randomNumber(), // modelId
            faker.number().randomNumber(), // categoryId
            faker.number().randomNumber(), // typeId
            faker.number().randomNumber(), // brandId
            propulsionId, // propulsionId
            faker.number().randomNumber(), // year
            null // dataRegisterAutonomy
        );

        // Simula uma propulsão ativada
        Propulsion propulsion = new Propulsion();
        propulsion.setActivated(true);

        when(propulsionRepository.existsById(propulsionId)).thenReturn(true);
        when(propulsionRepository.getReferenceById(propulsionId)).thenReturn(propulsion);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
    }
}

