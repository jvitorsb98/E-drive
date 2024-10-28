package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationRegisterVehicle_PropulsionExistsTest {

    @Mock
    private PropulsionRepository propulsionRepository;

    @Mock
    private MessageSource messageSource; // Mock do MessageSource

    @InjectMocks
    private ValidationRegisterVehicle_PropulsionExists validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should throw ValidationException if propulsion does not exist")
    void testPropulsionDoesNotExist() {
        // Arrange
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.lorem().word(),  // motor
                faker.lorem().word(),  // version
                faker.number().randomNumber(),  // modelId
                faker.number().randomNumber(),  // categoryId
                faker.number().randomNumber(),  // typeId
                faker.number().randomNumber(),  // propulsionId
                faker.number().randomNumber(),  // year
                null  // dataRegisterAutonomy
        );

        when(propulsionRepository.existsById(data.propulsionId())).thenReturn(false);

        // Mock do retorno da mensagem
        when(messageSource.getMessage(eq("vehicle.register.propulsion.not.found"), any(), any(Locale.class)))
                .thenReturn("The provided propulsion id does not exist");

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class, () -> validation.validate(data));
        assertEquals("The provided propulsion id does not exist", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException if propulsion exists")
    void testPropulsionExists() {
        // Arrange
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.lorem().word(),  // motor
                faker.lorem().word(),  // version
                faker.number().randomNumber(),  // modelId
                faker.number().randomNumber(),  // categoryId
                faker.number().randomNumber(),  // typeId
                faker.number().randomNumber(),  // propulsionId
                faker.number().randomNumber(),  // year
                null  // dataRegisterAutonomy
        );

        when(propulsionRepository.existsById(data.propulsionId())).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
    }
}
