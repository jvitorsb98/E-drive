package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.Locale;

class ValidationUpdateVehicle_ModelExistsTest {

    @Mock
    private ModelRepository modelRepository;
    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateVehicle_ModelExists validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker(); 
    }

    @Test
    @DisplayName("Should throw ValidationException when model does not exist")
    void shouldThrowWhenModelDoesNotExist() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateVehicle data = mock(DataUpdateVehicle.class);

        when(data.modelId()).thenReturn(modelId);
        when(modelRepository.existsById(modelId)).thenReturn(false);
         when(messageSource.getMessage("vehicle.update.model.not.found", null, Locale.getDefault()))
        .thenReturn("The provided model ID does not exist.");

        // Act & Assert
        ValidationException thrown = assertThrows(
            ValidationException.class,
            () -> validation.validate(data, modelId),
            "Expected ValidationException to be thrown when model does not exist"
        );

        // Assert
        assertEquals("The provided model ID does not exist.", thrown.getMessage());
        verify(modelRepository).existsById(modelId);
    }

    @Test
    @DisplayName("Should not throw ValidationException when model exists")
    void shouldNotThrowWhenModelExists() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateVehicle data = mock(DataUpdateVehicle.class);

        when(data.modelId()).thenReturn(modelId);
        when(modelRepository.existsById(modelId)).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data, modelId));

        // Assert
        verify(modelRepository).existsById(modelId);
    }
}
