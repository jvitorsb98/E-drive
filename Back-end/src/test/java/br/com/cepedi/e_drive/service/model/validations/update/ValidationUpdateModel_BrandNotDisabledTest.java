package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
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

public class ValidationUpdateModel_BrandNotDisabledTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private MessageSource messageSource; // Mock do MessageSource

    @InjectMocks
    private ValidationUpdateModel_BrandNotDisabled validationUpdateModel_BrandNotDisabled;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validation - Brand Exists and is Not Activated - Throws ValidationException")
    void validation_BrandExistsAndIsNotActivated_ThrowsValidationException() {
        // Arrange
        Long brandId = Math.abs(faker.number().randomNumber()); // Garantir que o ID é positivo
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), brandId);

        Brand brand = new Brand();
        brand.setActivated(false); // Deve ser false para lançar a exceção
        brand.setName(faker.lorem().word()); // Simulando o nome da marca

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);
        when(messageSource.getMessage("model.update.brand.disabled", new Object[]{brand.getName()}, Locale.getDefault()))
                .thenReturn("The required brand " + brand.getName() + " is disabled");

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationUpdateModel_BrandNotDisabled.validation(dataUpdateModel, brandId),
                "Expected validation() to throw ValidationException when the brand is not activated");

        // Verificar a mensagem da exceção
        assertEquals("The required brand " + brand.getName() + " is disabled", thrownException.getMessage());
    }

    @Test
    @DisplayName("Validation - Brand Exists and is Activated - No Exception Thrown")
    void validation_BrandExistsAndIsActivated_NoExceptionThrown() {
        // Arrange
        Long brandId = Math.abs(faker.number().randomNumber()); // Garantir que o ID é positivo
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), brandId);

        Brand brand = new Brand();
        brand.setActivated(true); // Deve ser true para não lançar exceção

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);

        // Act & Assert
        assertDoesNotThrow(() -> validationUpdateModel_BrandNotDisabled.validation(dataUpdateModel, brandId));
    }

    @Test
    @DisplayName("Validation - Brand Does Not Exist - No Exception Thrown")
    void validation_BrandDoesNotExist_NoExceptionThrown() {
        // Arrange
        Long brandId = Math.abs(faker.number().randomNumber()); // Garantir que o ID é positivo
        DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), brandId);

        when(brandRepository.existsById(brandId)).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validationUpdateModel_BrandNotDisabled.validation(dataUpdateModel, brandId));
    }
}
