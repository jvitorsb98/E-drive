package br.com.cepedi.e_drive.service.vehicle.validations.activated;

import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

class ValidationActivatedVehicle_ExistsTest {

    @InjectMocks
    private ValidationActivatedVehicle_Exists validationActivatedVehicle;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void validate_ThrowsValidationException_WhenVehicleDoesNotExist() {
        Long nonExistentVehicleId = 1L;

        // Simulando que o veículo com o ID fornecido não existe
        when(vehicleRepository.existsById(nonExistentVehicleId)).thenReturn(false);
        when(messageSource.getMessage("vehicle.activate.not.exist", new Object[]{nonExistentVehicleId}, Locale.getDefault()))
                .thenReturn("Vehicle with ID " + nonExistentVehicleId + " does not exist.");

        // Verifica se a exceção de validação é lançada com a mensagem correta
        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            validationActivatedVehicle.validate(nonExistentVehicleId);
        });

        // Confirma que a mensagem da exceção está correta
        assertEquals("Vehicle with ID " + nonExistentVehicleId + " does not exist.", thrown.getMessage());
    }

    @Test
    void validate_DoesNotThrow_WhenVehicleExists() {
        Long existingVehicleId = 2L;

        // Simulando que o veículo com o ID fornecido existe
        when(vehicleRepository.existsById(existingVehicleId)).thenReturn(true);

        // Chamando o método `validate` e confirmando que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validationActivatedVehicle.validate(existingVehicleId));
    }
}
