package br.com.cepedi.e_drive.service.model.validations.activated;

import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationModelExistsForActivatedTest {

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

    @InjectMocks
    private ValidationModelExistsForActivated validationModelExistsForActivated;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Validation - Model Does Not Exist - Throws ValidationException")
    void validation_ModelDoesNotExist_ThrowsValidationException() {
        // Arrange
        Long modelId = 1L;

        when(modelRepository.existsById(modelId)).thenReturn(false);
        when(messageSource.getMessage("model.activated.not.found", null, Locale.getDefault()))
                .thenReturn("The required model does not exist"); // Simular a mensagem de erro

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationModelExistsForActivated.validation(modelId),
                "Expected validation() to throw ValidationException when the model does not exist");

        assertEquals("The required model does not exist", thrownException.getMessage());
    }

    @Test
    @DisplayName("Validation - Model Exists - No Exception Thrown")
    void validation_ModelExists_NoExceptionThrown() {
        // Arrange
        Long modelId = 1L;

        when(modelRepository.existsById(modelId)).thenReturn(true);

        // Act & Assert
        // No exception should be thrown
        validationModelExistsForActivated.validation(modelId);
    }
}
