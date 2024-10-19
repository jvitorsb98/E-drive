package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.repository.BrandRepository;
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
import static org.mockito.Mockito.when;

public class ValidationBrandIsActivatedForUpdateTest {

    @Mock
    private BrandRepository brandRepository;
    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationBrandIsActivatedForUpdate validationBrand;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validation - Brand Is Disabled - Throws ValidationException")
    void validation_BrandIsDisabled_ThrowsValidationException() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        Brand brand = new Brand();
        brand.setActivated(false); 

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationBrand.validation(brandId, null),
        		() ->"Expected validation() to throw ValidationException when brand is disabled");
    }

    @Test
    @DisplayName("Validation - Brand Is Activated - No Exception Thrown")
    void validation_BrandIsActivated_NoExceptionThrown() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        Brand brand = new Brand();
        brand.setActivated(true); 

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);

        // Act & Assert
        validationBrand.validation(brandId, null); 
    }
}
