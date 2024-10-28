package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;

import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationRegisterVehicle_ModelExistsTest {

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

    @InjectMocks
    private ValidationRegisterVehicle_ModelExists validation;

    public ValidationRegisterVehicle_ModelExistsTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw ValidationException if model does not exist")
    void testModelDoesNotExist() {
        // Arrange
        DataRegisterVehicle data = new DataRegisterVehicle(
                Faker.instance().lorem().word(),  // motor
                Faker.instance().lorem().word(),  // version
                Faker.instance().number().randomNumber(),  // modelId
                Faker.instance().number().randomNumber(),  // categoryId
                Faker.instance().number().randomNumber(),  // typeId
                Faker.instance().number().randomNumber(),  // propulsionId
                Faker.instance().number().randomNumber(),  // year
                null  // dataRegisterAutonomy
        );
        when(modelRepository.existsById(data.modelId())).thenReturn(false);
        // Mock do retorno do MessageSource
        when(messageSource.getMessage(eq("vehicle.register.model.not.found"), any(), any())).thenReturn("The provided model id does not exist");

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class, () -> validation.validate(data));
        assertEquals("The provided model id does not exist", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException if model exists")
    void testModelExists() {
        // Arrange
        DataRegisterVehicle data = new DataRegisterVehicle(
                Faker.instance().lorem().word(),  // motor
                Faker.instance().lorem().word(),  // version
                Faker.instance().number().randomNumber(),  // modelId
                Faker.instance().number().randomNumber(),  // categoryId
                Faker.instance().number().randomNumber(),  // typeId
                Faker.instance().number().randomNumber(),  // propulsionId
                Faker.instance().number().randomNumber(),  // year
                null  // dataRegisterAutonomy
        );
        when(modelRepository.existsById(data.modelId())).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
    }
}
