package br.com.cepedi.e_drive.service.model.validations.update;

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
import org.springframework.context.MessageSource;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ValidationUpdateModel_ModelExistsTest {

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private MessageSource messageSource; // Mock do MessageSource

    @InjectMocks
    private ValidationUpdateModel_ModelExists validationUpdateModel_ModelExists;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validation - Model Does Not Exist - Throws ValidationException")
    void validation_ModelDoesNotExist_ThrowsValidationException() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), modelId);

        // Define o comportamento do mock do ModelRepository
        when(modelRepository.existsById(modelId)).thenReturn(false);
        // Define o comportamento do mock do MessageSource
        when(messageSource.getMessage("model.update.not.found", null, java.util.Locale.getDefault()))
                .thenReturn("The required model does not exist");

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationUpdateModel_ModelExists.validation(dataUpdateModel, modelId),
                "Expected validation() to throw ValidationException when the model does not exist");

        assertEquals("The required model does not exist", thrownException.getMessage());
    }

    @Test
    @DisplayName("Validation - Model Exists - No Exception Thrown")
    void validation_ModelExists_NoExceptionThrown() {
        // Arrange
        Long modelId = faker.number().randomNumber();
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), modelId);

        when(modelRepository.existsById(modelId)).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validationUpdateModel_ModelExists.validation(dataUpdateModel, modelId));
    }
}
