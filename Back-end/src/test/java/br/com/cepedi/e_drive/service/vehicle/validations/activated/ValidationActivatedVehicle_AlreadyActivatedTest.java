package br.com.cepedi.e_drive.service.vehicle.validations.activated;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
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

class ValidationActivatedVehicle_AlreadyActivatedTest {

    @InjectMocks
    private ValidationActivatedVehicle_AlreadyActivated validationActivatedVehicle;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void validate_ThrowsValidationException_WhenVehicleIsAlreadyActivated() {
        Long vehicleId = 1L;
        Vehicle activatedVehicle = new Vehicle();
        activatedVehicle.setId(vehicleId);
        activatedVehicle.setActivated(true);

        // Simula a existência e o estado ativado do veículo
        when(vehicleRepository.existsById(vehicleId)).thenReturn(true);
        when(vehicleRepository.getReferenceById(vehicleId)).thenReturn(activatedVehicle);
        when(messageSource.getMessage("vehicle.activate.already.activated", new Object[]{vehicleId}, Locale.getDefault()))
                .thenReturn("Vehicle with ID " + vehicleId + " is already activated.");

        // Verifica se a exceção é lançada com a mensagem correta
        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            validationActivatedVehicle.validate(vehicleId);
        });

        assertEquals("Vehicle with ID " + vehicleId + " is already activated.", thrown.getMessage());
    }

    @Test
    void validate_DoesNotThrow_WhenVehicleIsNotActivated() {
        Long vehicleId = 2L;
        Vehicle nonActivatedVehicle = new Vehicle();
        nonActivatedVehicle.setId(vehicleId);
        nonActivatedVehicle.setActivated(false);

        // Simula a existência e o estado não ativado do veículo
        when(vehicleRepository.existsById(vehicleId)).thenReturn(true);
        when(vehicleRepository.getReferenceById(vehicleId)).thenReturn(nonActivatedVehicle);

        // Verifica que nenhuma exceção é lançada quando o veículo não está ativado
        assertDoesNotThrow(() -> validationActivatedVehicle.validate(vehicleId));
    }

    @Test
    void validate_DoesNotThrow_WhenVehicleDoesNotExist() {
        Long nonExistentVehicleId = 3L;

        // Simula que o veículo com o ID fornecido não existe
        when(vehicleRepository.existsById(nonExistentVehicleId)).thenReturn(false);

        // Verifica que nenhuma exceção é lançada quando o veículo não existe
        assertDoesNotThrow(() -> validationActivatedVehicle.validate(nonExistentVehicleId));
    }
}
