package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.util.Locale;

class ValidationRegisterVehicle_VehicleTypeExistsTest {

    @InjectMocks
    private ValidationRegisterVehicle_VehicleTypeExists validation;

    @Mock
    private VehicleTypeRepository vehicleTypeRepository;

    @Mock
    private MessageSource messageSource;

    private DataRegisterVehicle data;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Inicializa data com valores padrão
        data = new DataRegisterVehicle("motor", "version", 1L, 1L, 1L, 1L, 2023L, null);
    }

    @Test
    @DisplayName("Throws exception when vehicle type does not exist")
    void validate_ShouldThrowException_WhenVehicleTypeDoesNotExist() {
        // Configura o mock para que o tipo de veículo não exista
        Long vehicleTypeId = 1L;
        when(vehicleTypeRepository.existsById(vehicleTypeId)).thenReturn(false);
        when(messageSource.getMessage("vehicle.register.type.not.found",
                new Object[]{vehicleTypeId}, Locale.getDefault()))
                .thenReturn("Vehicle type not found");

        // Verifica que a exceção é lançada
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(data));
        assert(exception.getMessage().contains("Vehicle type not found"));
    }

    @Test
    @DisplayName("Does not throw exception when vehicle type exists")
    void validate_DoesNotThrow_WhenVehicleTypeExists() {
        // Configura o mock para que o tipo de veículo exista
        Long vehicleTypeId = 1L;
        when(vehicleTypeRepository.existsById(vehicleTypeId)).thenReturn(true);

        // Verifica que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validation.validate(data));
    }
}
