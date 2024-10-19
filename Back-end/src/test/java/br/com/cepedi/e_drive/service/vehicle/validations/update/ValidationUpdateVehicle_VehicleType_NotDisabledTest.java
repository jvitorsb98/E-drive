package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
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
import java.util.Locale;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationUpdateVehicle_VehicleType_NotDisabledTest {

    @Mock
    private VehicleTypeRepository vehicleTypeRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateVehicle_VehicleType_NotDisabled validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker(); // Inicializa Faker para gerar dados fictícios
    }
    @Test
    @DisplayName("Should throw ValidationException when vehicleTypeId exists but is disabled")
    void shouldThrowValidationExceptionWhenVehicleTypeIdExistsButIsDisabled() {
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

        // Simula um tipo de veículo desativado
        VehicleType vehicleType = new VehicleType();
        vehicleType.setActivated(false);

        when(vehicleTypeRepository.existsById(typeId)).thenReturn(true);
        when(vehicleTypeRepository.getReferenceById(typeId)).thenReturn(vehicleType);
        when(messageSource.getMessage("vehicle.update.type.disabled", null, Locale.getDefault()))
            .thenReturn("The provided vehicle type ID is disabled.");

        // Act & Assert
        ValidationException thrown = assertThrows(
            ValidationException.class,
            () -> validation.validate(data, typeId),
            "Expected ValidationException to be thrown when vehicle type is disabled"
        );

        // Assert
        assertEquals("The provided vehicle type ID is disabled.", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw exception when vehicleTypeId exists and is enabled")
    void shouldNotThrowExceptionWhenVehicleTypeIdExistsAndIsEnabled() {
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

        // Simula um tipo de veículo ativado
        VehicleType vehicleType = new VehicleType();
        vehicleType.setActivated(true);

        when(vehicleTypeRepository.existsById(typeId)).thenReturn(true);
        when(vehicleTypeRepository.getReferenceById(typeId)).thenReturn(vehicleType);

        // Act & Assert
        try {
            validation.validate(data, typeId);
        } catch (ValidationException e) {
            // Se chegar aqui, significa que a exceção foi lançada indevidamente
            assertEquals("Should not throw exception when vehicleTypeId exists and is enabled", e.getMessage());
        }
    }
}