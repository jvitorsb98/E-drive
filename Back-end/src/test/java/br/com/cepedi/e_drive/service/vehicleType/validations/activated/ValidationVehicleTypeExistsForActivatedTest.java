package br.com.cepedi.e_drive.service.vehicleType.validations.activated;

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
class ValidationVehicleTypeExistsForActivatedTest {

    @Mock
    private VehicleTypeRepository vehicleTypeRepository;

    @Mock
    private MessageSource messageSource; // Mock do MessageSource

    @InjectMocks
    private ValidationVehicleTypeExistsForActivated validation;

    private final Faker faker = new Faker();

    @Test
    @DisplayName("Should throw ValidationException when VehicleType does not exist")
    void testValidationExists_ThrowsException() {
        // Arrange
        Long vehicleTypeId = Math.abs(faker.number().randomNumber()); // Garantir que o ID é positivo

        when(vehicleTypeRepository.existsById(vehicleTypeId)).thenReturn(false);

        // Mockando a mensagem do MessageSource
        when(messageSource.getMessage("vehicleType.activated.notExists", new Object[]{vehicleTypeId}, Locale.getDefault()))
                .thenReturn("O tipo de veículo com ID " + vehicleTypeId + " não existe.");

        // Act & Assert
        ValidationException thrown = assertThrows(ValidationException.class,
                () -> validation.validation(vehicleTypeId)
        );

        // Verificar a mensagem da exceção
        assertEquals("O tipo de veículo com ID " + vehicleTypeId + " não existe.", thrown.getMessage());
    }
}
