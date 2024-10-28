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
import org.springframework.context.MessageSource;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Locale;

public class ValidationUpdateVehicle_Propulsion_NotDisabledTest {

    @Mock
    private PropulsionRepository propulsionRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateVehicle_Propulsion_NotDisabled validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should throw ValidationException when propulsionId exists but is disabled")
    void shouldThrowValidationExceptionWhenPropulsionIdExistsButIsDisabled() {
        Long propulsionId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
                faker.lorem().word(),
                faker.lorem().word(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                propulsionId,
                faker.number().randomNumber(),
                null
        );

        // Criando um Propulsion que está desativado
        Propulsion propulsion = new Propulsion();
        propulsion.setActivated(false);

        // Mockando o comportamento do repositório
        when(propulsionRepository.existsById(propulsionId)).thenReturn(true);
        when(propulsionRepository.getReferenceById(propulsionId)).thenReturn(propulsion);

        // Ajustando a chamada para getMessage
        when(messageSource.getMessage("vehicle.update.propulsion.disabled", null, Locale.getDefault()))
                .thenReturn("The provided propulsion ID is disabled."); // Use null para args se não houver

        // Executando o teste
        ValidationException thrown = assertThrows(
                ValidationException.class,
                () -> validation.validate(data, null), // Passando null como ID
                "Expected ValidationException to be thrown when propulsion is disabled"
        );

        // Verificando a mensagem da exceção
        assertEquals("The provided propulsion ID is disabled.", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw exception when propulsionId exists and is enabled")
    void shouldNotThrowExceptionWhenPropulsionIdExistsAndIsEnabled() {
        Long propulsionId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
                faker.lorem().word(),
                faker.lorem().word(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                propulsionId,
                faker.number().randomNumber(),
                null
        );

        Propulsion propulsion = new Propulsion();
        propulsion.setActivated(true);

        when(propulsionRepository.existsById(propulsionId)).thenReturn(true);
        when(propulsionRepository.getReferenceById(propulsionId)).thenReturn(propulsion);

        assertDoesNotThrow(() -> validation.validate(data, null)); // Passando null como ID
    }
}
