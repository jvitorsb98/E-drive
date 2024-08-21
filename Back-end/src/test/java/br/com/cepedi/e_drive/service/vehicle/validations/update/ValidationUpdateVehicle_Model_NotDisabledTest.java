package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ValidationUpdateVehicle_Model_NotDisabledTest {

    @Mock
    private ModelRepository modelRepository;

    @InjectMocks
    private ValidationUpdateVehicle_Model_NotDisabled validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker(); // Inicializa Faker para gerar dados fictícios
    }

    @Test
    @DisplayName("Should throw ValidationException when model is disabled")
    void shouldThrowWhenModelIsDisabled() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateVehicle data = mock(DataUpdateVehicle.class);
        Model model = mock(Model.class);

        when(data.modelId()).thenReturn(modelId);
        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);
        when(model.getActivated()).thenReturn(false);

        // Act & Assert
        ValidationException thrown = assertThrows(
            ValidationException.class,
            () -> validation.validate(data),
            "Expected ValidationException to be thrown when model is disabled"
        );

        // Assert
        assertEquals("The provided model id is disabled", thrown.getMessage());
        verify(modelRepository).existsById(modelId);
        verify(modelRepository).getReferenceById(modelId);
    }

    @Test
    @DisplayName("Should not throw ValidationException when model is enabled")
    void shouldNotThrowWhenModelIsEnabled() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateVehicle data = mock(DataUpdateVehicle.class);
        Model model = mock(Model.class);

        when(data.modelId()).thenReturn(modelId);
        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);
        when(model.getActivated()).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data));

        // Assert
        verify(modelRepository).existsById(modelId);
        verify(modelRepository).getReferenceById(modelId);
    }
}

