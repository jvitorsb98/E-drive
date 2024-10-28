package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ValidationRegisterModel_BrandExistsTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private MessageSource messageSource; // Mock do MessageSource

    @InjectMocks
    private ValidationRegisterModel_BrandExists validationRegisterModel_BrandExists;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validation - Brand Does Not Exist - Throws ValidationException")
    void validation_BrandDoesNotExist_ThrowsValidationException() {
        // Arrange
        Long brandId = Math.abs(faker.number().randomNumber()); // Garantir que o ID é positivo
        DataRegisterModel dataRegisterModel = new DataRegisterModel(faker.lorem().word(), brandId);

        when(brandRepository.existsById(brandId)).thenReturn(false);

        // Mockando a mensagem do MessageSource
        when(messageSource.getMessage("model.register.brand.not.found", null, Locale.getDefault()))
                .thenReturn("The required brand does not exist");

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationRegisterModel_BrandExists.validation(dataRegisterModel),
                "Expected validation() to throw ValidationException when the brand does not exist");

        // Verificar a mensagem da exceção
        assertEquals("The required brand does not exist", thrownException.getMessage());
    }

    @Test
    @DisplayName("Validation - Brand Exists - No Exception Thrown")
    void validation_BrandExists_NoExceptionThrown() {
        // Arrange
        Long brandId = Math.abs(faker.number().randomNumber()); // Garantir que o ID é positivo
        DataRegisterModel dataRegisterModel = new DataRegisterModel(faker.lorem().word(), brandId);

        when(brandRepository.existsById(brandId)).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validationRegisterModel_BrandExists.validation(dataRegisterModel));
    }
}
