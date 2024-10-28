package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import com.github.javafaker.Faker;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ValidationRegisterVehicle_Propulsion_NotDisabledTest {

    @Mock
    private PropulsionRepository propulsionRepository;

    @Mock
    private MessageSource messageSource; // Mock do MessageSource

    @InjectMocks
    private ValidationRegisterVehicle_Propulsion_NotDisabled validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should throw ValidationException when propulsion is disabled")
    void shouldThrowExceptionWhenPropulsionIsDisabled() {
        // Arrange
        Long propulsionId = faker.number().randomNumber();
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.commerce().productName(),
                faker.lorem().word(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                propulsionId,
                faker.number().randomNumber(),
                null
        );

        Propulsion propulsion = mock(Propulsion.class);
        when(propulsionRepository.existsById(propulsionId)).thenReturn(true);
        when(propulsionRepository.getReferenceById(propulsionId)).thenReturn(propulsion);
        when(propulsion.getActivated()).thenReturn(false);

        // Mock do retorno da mensagem
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("The provided propulsion id is disabled");

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(data));
        verify(propulsionRepository).existsById(propulsionId);
        verify(propulsionRepository).getReferenceById(propulsionId);
        assertEquals("The provided propulsion id is disabled", exception.getMessage());
    }

    @Test
    @DisplayName("Should not throw any exception when propulsion is enabled")
    void shouldNotThrowExceptionWhenPropulsionIsEnabled() {
        // Arrange
        Long propulsionId = faker.number().randomNumber();
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.commerce().productName(),
                faker.lorem().word(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                propulsionId,
                faker.number().randomNumber(),
                null
        );

        Propulsion propulsion = mock(Propulsion.class);
        when(propulsionRepository.existsById(propulsionId)).thenReturn(true);
        when(propulsionRepository.getReferenceById(propulsionId)).thenReturn(propulsion);
        when(propulsion.getActivated()).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
        verify(propulsionRepository).existsById(propulsionId);
        verify(propulsionRepository).getReferenceById(propulsionId);
    }

    @Test
    @DisplayName("Should not throw any exception when propulsion does not exist")
    void shouldNotThrowExceptionWhenPropulsionDoesNotExist() {
        // Arrange
        Long propulsionId = faker.number().randomNumber();
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.commerce().productName(),
                faker.lorem().word(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                propulsionId,
                faker.number().randomNumber(),
                null
        );

        when(propulsionRepository.existsById(propulsionId)).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
        verify(propulsionRepository).existsById(propulsionId);
    }
}
