package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import com.github.javafaker.Faker;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationRegisterVehicle_Model_NotDisabledTest {

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

    @InjectMocks
    private ValidationRegisterVehicle_Model_NotDisabled validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should throw ValidationException when model is disabled")
    void shouldThrowExceptionWhenModelIsDisabled() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.commerce().productName(),
                faker.lorem().word(),
                modelId,
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                null
        );

        Model model = mock(Model.class);
        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);
        when(model.getActivated()).thenReturn(false);
        when(model.getName()).thenReturn(faker.commerce().productName()); // Adicionando nome do modelo

        // Mockando a mensagem de erro
        when(messageSource.getMessage("vehicle.register.model.disabled", new Object[]{model.getName()}, Locale.getDefault()))
                .thenReturn("The provided model id is disabled");

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(data));
        verify(modelRepository).existsById(modelId);
        verify(modelRepository).getReferenceById(modelId);
        assertEquals("The provided model id is disabled", exception.getMessage());
    }

    @Test
    @DisplayName("Should not throw any exception when model is enabled")
    void shouldNotThrowExceptionWhenModelIsEnabled() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.commerce().productName(),
                faker.lorem().word(),
                modelId,
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                null
        );

        Model model = mock(Model.class);
        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);
        when(model.getActivated()).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
        verify(modelRepository).existsById(modelId);
        verify(modelRepository).getReferenceById(modelId);
    }

    @Test
    @DisplayName("Should not throw any exception when model does not exist")
    void shouldNotThrowExceptionWhenModelDoesNotExist() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataRegisterVehicle data = new DataRegisterVehicle(
                faker.commerce().productName(),
                faker.lorem().word(),
                modelId,
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                faker.number().randomNumber(),
                null
        );

        when(modelRepository.existsById(modelId)).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));
        verify(modelRepository).existsById(modelId);
    }
}
