package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.model.entitys.Brand;
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

public class ValidationRegisterModel_BrandNotDisabledTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

    @InjectMocks
    private ValidationRegisterModel_BrandNotDisabled validationRegisterModel_BrandNotDisabled;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validation - Brand Exists and is Disabled - Throws ValidationException")
    void validation_BrandExistsAndIsDisabled_ThrowsValidationException() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        DataRegisterModel dataRegisterModel = new DataRegisterModel(faker.lorem().word(), brandId);

        Brand brand = new Brand();
        brand.setActivated(false);
        brand.setName(faker.company().name());

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);
        when(messageSource.getMessage("model.register.brand.disabled", new Object[]{brand.getName()}, Locale.getDefault()))
                .thenReturn("The required brand " + brand.getName() + " is disabled"); // Mockando a mensagem de erro

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationRegisterModel_BrandNotDisabled.validation(dataRegisterModel),
                "Expected validation() to throw ValidationException when the brand is disabled");

        assertEquals("The required brand " + brand.getName() + " is disabled", thrownException.getMessage());
    }


    @Test
    @DisplayName("Validation - Brand Exists and is Activated - No Exception Thrown")
    void validation_BrandExistsAndIsActivated_NoExceptionThrown() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        DataRegisterModel dataRegisterModel = new DataRegisterModel(faker.lorem().word(), brandId);

        Brand brand = new Brand();
        brand.setActivated(true);
        brand.setName(faker.company().name()); // Adicionando o nome da marca

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);

        // Act & Assert
        assertDoesNotThrow(() -> validationRegisterModel_BrandNotDisabled.validation(dataRegisterModel));
    }

    @Test
    @DisplayName("Validation - Brand Does Not Exist - No Exception Thrown")
    void validation_BrandDoesNotExist_NoExceptionThrown() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        DataRegisterModel dataRegisterModel = new DataRegisterModel(faker.lorem().word(), brandId);

        when(brandRepository.existsById(brandId)).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validationRegisterModel_BrandNotDisabled.validation(dataRegisterModel));
    }
}
