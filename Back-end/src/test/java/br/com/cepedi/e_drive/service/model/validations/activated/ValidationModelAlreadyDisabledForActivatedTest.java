package br.com.cepedi.e_drive.service.model.validations.activated;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.service.model.validations.activated.ValidationModelAlreadyDisabledForActivated;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationModelAlreadyDisabledForActivatedTest {

    @Mock
    private ModelRepository modelRepository;

    @InjectMocks
    private ValidationModelAlreadyDisabledForActivated validationModelAlreadyDisabledForActivated;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Validation - Model Exists and is Activated - Throws ValidationException")
    void validation_ModelExistsAndIsActivated_ThrowsValidationException() {
        // Arrange
        Long modelId = 1L;
        Model model = new Model();
        model.setActivated(true);

        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
            () -> validationModelAlreadyDisabledForActivated.validation(modelId),
            "Expected validation() to throw ValidationException when the model is activated");
        
        assertEquals("The model is already disabled", thrownException.getMessage());
    }

    @Test
    @DisplayName("Validation - Model Does Not Exist - No Exception Thrown")
    void validation_ModelDoesNotExist_NoExceptionThrown() {
        // Arrange
        Long modelId = 1L;

        when(modelRepository.existsById(modelId)).thenReturn(false);

        // Act & Assert
        // No exception should be thrown
        validationModelAlreadyDisabledForActivated.validation(modelId);
    }

    @Test
    @DisplayName("Validation - Model Exists and is Disabled - No Exception Thrown")
    void validation_ModelExistsAndIsDisabled_NoExceptionThrown() {
        // Arrange
        Long modelId = 1L;
        Model model = new Model();
        model.setActivated(false);

        when(modelRepository.existsById(modelId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);

        // Act & Assert
        // No exception should be thrown
        validationModelAlreadyDisabledForActivated.validation(modelId);
    }
}

