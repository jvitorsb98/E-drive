package br.com.cepedi.e_drive.service.vehicleType.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import com.github.javafaker.Faker;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValidationVehicleTypeAlreadyDisabledForDisabledTest {

    @Mock
    private VehicleTypeRepository vehicleTypeRepository;

    @Mock
    private MessageSource messageSource; // Mock do MessageSource

    @InjectMocks
    private ValidationVehicleTypeAlreadyDisabledForDisabled validation;

    private final Faker faker = new Faker();

    @Test
    @DisplayName("Should throw ValidationException when VehicleType is already disabled")
    void testValidationAlreadyDisabled_ThrowsException() {
        // Arrange
        Long vehicleTypeId = Math.abs(faker.number().randomNumber()); // Garantir que o ID é positivo
        VehicleType vehicleType = new VehicleType();
        vehicleType.setActivated(false); // O veículo já está desativado

        when(vehicleTypeRepository.existsById(vehicleTypeId)).thenReturn(true);
        when(vehicleTypeRepository.getReferenceById(vehicleTypeId)).thenReturn(vehicleType);

        // Mockando a mensagem do MessageSource
        when(messageSource.getMessage("vehicleType.disabled.alreadyDisabled", new Object[]{vehicleTypeId}, Locale.getDefault()))
                .thenReturn("O tipo de veículo com ID " + vehicleTypeId + " já está desativado.");

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class,
                () -> validation.validation(vehicleTypeId)
        );

        // Verificar a mensagem da exceção
        assertEquals("O tipo de veículo com ID " + vehicleTypeId + " já está desativado.", thrown.getMessage());
    }
}
