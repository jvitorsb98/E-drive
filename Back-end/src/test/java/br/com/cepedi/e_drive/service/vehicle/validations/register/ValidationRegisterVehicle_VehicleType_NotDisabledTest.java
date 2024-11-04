package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
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

class ValidationRegisterVehicle_VehicleType_NotDisabledTest {

    @InjectMocks
    private ValidationRegisterVehicle_VehicleType_NotDisabled validation;

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
    @DisplayName("Throws exception when vehicle type is disabled")
    void validate_ShouldThrowException_WhenVehicleTypeIsDisabled() {
        // Configura o mock para que o tipo de veículo esteja desativado
        Long vehicleTypeId = 1L;
        VehicleType vehicleType = new VehicleType();
        vehicleType.setActivated(false);
        
        when(vehicleTypeRepository.existsById(vehicleTypeId)).thenReturn(true);
        when(vehicleTypeRepository.getReferenceById(vehicleTypeId)).thenReturn(vehicleType);
        when(messageSource.getMessage("vehicle.register.type.disabled", 
                new Object[]{vehicleTypeId}, Locale.getDefault()))
                .thenReturn("Vehicle type is disabled");

        // Verifica que a exceção é lançada
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(data));
        assert(exception.getMessage().contains("Vehicle type is disabled"));
    }

    @Test
    @DisplayName("Does not throw exception when vehicle type is enabled")
    void validate_DoesNotThrow_WhenVehicleTypeIsActive() {
        // Configura o mock para que o tipo de veículo esteja ativado
        Long vehicleTypeId = 1L;
        VehicleType vehicleType = new VehicleType();
        vehicleType.setActivated(true);
        
        when(vehicleTypeRepository.existsById(vehicleTypeId)).thenReturn(true);
        when(vehicleTypeRepository.getReferenceById(vehicleTypeId)).thenReturn(vehicleType);

        // Verifica que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validation.validate(data));
    }

    @Test
    @DisplayName("Does not throw exception when vehicle type does not exist")
    void validate_DoesNotThrow_WhenVehicleTypeDoesNotExist() {
        // Configura o mock para que o tipo de veículo não exista
        when(vehicleTypeRepository.existsById(data.typeId())).thenReturn(false);

        // Verifica que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validation.validate(data));
    }
}
