package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ValidationRegisterVehicle_PropulsionExistsTest {

    @Mock
    private PropulsionRepository propulsionRepository;

    @InjectMocks
    private ValidationRegisterVehicle_PropulsionExists validation;

    public ValidationRegisterVehicle_PropulsionExistsTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw ValidationException if propulsion does not exist")
    void testPropulsionDoesNotExist() {
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
        when(propulsionRepository.existsById(data.propulsionId())).thenReturn(false);

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class, () -> validation.validate(data));
        assertEquals("The provided propulsion id does not exist", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException if propulsion exists")
    void testPropulsionExists() {
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
        when(propulsionRepository.existsById(data.propulsionId())).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
    }
}

