package br.com.cepedi.e_drive.service.brand.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationBrandAlreadyDisabledForDisabledTest {

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private ValidationBrandAlreadyDisabledForDisabled validationBrand;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validation - Brand Is Already Disabled - Throws ValidationException")
    void validation_BrandIsAlreadyDisabled_ThrowsValidationException() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        Brand brand = new Brand();
        brand.setActivated(false); 

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationBrand.validation(brandId),
        		() ->"Expected validation() to throw ValidationException when brand is already disabled");
    }

    @Test
    @DisplayName("Validation - Brand Is Not Disabled - No Exception Thrown")
    void validation_BrandIsNotDisabled_NoExceptionThrown() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        Brand brand = new Brand();
        brand.setActivated(true); // Brand is not disabled

        when(brandRepository.existsById(brandId)).thenReturn(true);
        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);

        // Act & Assert
        validationBrand.validation(brandId);
    }
}
