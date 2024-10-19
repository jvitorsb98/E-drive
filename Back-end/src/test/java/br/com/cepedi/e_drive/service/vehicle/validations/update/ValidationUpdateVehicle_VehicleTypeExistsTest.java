package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import com.github.javafaker.Faker;
import java.util.Locale;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationUpdateVehicle_VehicleTypeExistsTest {

    @Mock
    private VehicleTypeRepository vehicleTypeRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateVehicle_VehicleTypeExists validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should throw ValidationException when vehicleTypeId does not exist")
    void shouldThrowValidationExceptionWhenVehicleTypeIdDoesNotExist() {
        // Arrange
        Long typeId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
            faker.lorem().word(), // motor
            faker.lorem().word(), // version
            faker.number().randomNumber(), // modelId
            faker.number().randomNumber(), // categoryId
            typeId, // typeId
            faker.number().randomNumber(), // brandId
            faker.number().randomNumber(), // propulsionId
            faker.number().randomNumber(), // year
            null // dataRegisterAutonomy
        );

        // Simula que o typeId não existe
        when(vehicleTypeRepository.existsById(typeId)).thenReturn(false);
        when(messageSource.getMessage("vehicle.update.type.not.found", null, Locale.getDefault()))
        .thenReturn("The provided vehicle type id does not exist.");


        // Act & Assert
        ValidationException thrown = assertThrows(
            ValidationException.class,
            () -> validation.validate(data, typeId),
            "Expected ValidationException to be thrown when vehicleTypeId does not exist"
        );

        // Assert
        assertEquals("The provided vehicle type id does not exist.", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw exception when vehicleTypeId exists")
    void shouldNotThrowExceptionWhenVehicleTypeIdExists() {
        // Arrange
        Long typeId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
            faker.lorem().word(), // motor
            faker.lorem().word(), // version
            faker.number().randomNumber(), // modelId
            faker.number().randomNumber(), // categoryId
            typeId, // typeId
            faker.number().randomNumber(), // brandId
            faker.number().randomNumber(), // propulsionId
            faker.number().randomNumber(), // year
            null // dataRegisterAutonomy
        );

        // Simula que o typeId existe
        when(vehicleTypeRepository.existsById(typeId)).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data, typeId));
    }
}
