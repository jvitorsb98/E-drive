package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ValidationUpdateModel_ModelNotDisabledTest {

    @Mock
    private ModelRepository modelRepository;

    @InjectMocks
    private ValidationUpdateModel_ModelNotDisabled validationUpdateModel_ModelNotDisabled;

    private Faker faker;

    @BeforeEach
    void setUp() {
    	MockitoAnnotations.openMocks(this);
    	faker = new Faker();
    }


    @Test
    @DisplayName("Validation - Model Exists and is Not Activated - Throws ValidationException")
    void validation_ModelExistsAndIsNotActivated_ThrowsValidationException() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), modelId);

        Model model = new Model();
        model.setActivated(false);

        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationUpdateModel_ModelNotDisabled.validation(dataUpdateModel, modelId),
                () -> "Expected validation() to throw ValidationException when the model is not activated");

        assertEquals("The required model is not activated", thrownException.getMessage());
    }

    @Test
    @DisplayName("Validation - Model Exists and is Activated - No Exception Thrown")
    void validation_ModelExistsAndIsActivated_NoExceptionThrown() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), modelId);

        Model model = new Model();
        model.setActivated(true); 

        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);

        // Act & Assert
        assertDoesNotThrow(() -> validationUpdateModel_ModelNotDisabled.validation(dataUpdateModel, modelId));
    }

    @Test
    @DisplayName("Validation - Model Does Not Exist - Throws ValidationException")
    void validation_ModelDoesNotExist_ThrowsValidationException() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), modelId);

        when(modelRepository.existsById(modelId)).thenReturn(false);

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationUpdateModel_ModelNotDisabled.validation(dataUpdateModel, modelId),
                () -> "Expected validation() to throw ValidationException when the model is not found");

        assertEquals("Model not found", thrownException.getMessage());
    }
}


