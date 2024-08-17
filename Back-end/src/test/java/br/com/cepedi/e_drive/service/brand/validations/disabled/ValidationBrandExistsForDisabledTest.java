package br.com.cepedi.e_drive.service.brand.validations.disabled;

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

public class ValidationBrandExistsForDisabledTest {

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private ValidationBrandExistsForDisabled validationBrand;

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
    	Long brandId = faker.number().randomNumber();
    	when(brandRepository.existsById(brandId)).thenReturn(false);

    	// Act & Assert
    	assertThrows(ValidationException.class, () -> validationBrand.validation(brandId),
    			() ->"Expected validation() to throw ValidationException when brand does not exist");
    }

    @Test
    @DisplayName("Validation - Brand Exists - No Exception Thrown")
    void validation_BrandExists_NoExceptionThrown() {
    	// Arrange
    	Long brandId = faker.number().randomNumber();
    	when(brandRepository.existsById(brandId)).thenReturn(true);

    	// Act & Assert
    	validationBrand.validation(brandId); 
    }
}
