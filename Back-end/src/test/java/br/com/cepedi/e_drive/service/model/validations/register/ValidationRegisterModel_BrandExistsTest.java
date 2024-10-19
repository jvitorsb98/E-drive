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

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ValidationRegisterModel_BrandExistsTest {

    @Mock
    private BrandRepository brandRepository;

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
    	Long brandId = faker.number().randomNumber();
    	DataRegisterModel dataRegisterModel = new DataRegisterModel(faker.lorem().word(), brandId);

    	when(brandRepository.existsById(brandId)).thenReturn(false);

    	// Act & Assert
    	ValidationException thrownException = assertThrows(ValidationException.class,
    			() -> validationRegisterModel_BrandExists.validation(dataRegisterModel),
    			() ->"Expected validation() to throw ValidationException when the brand does not exist");

    	assertEquals("The required branch does not exists", thrownException.getMessage());
    }

    @Test
    @DisplayName("Validation - Brand Exists - No Exception Thrown")
    void validation_BrandExists_NoExceptionThrown() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        DataRegisterModel dataRegisterModel = new DataRegisterModel(faker.lorem().word(), brandId);

        when(brandRepository.existsById(brandId)).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validationRegisterModel_BrandExists.validation(dataRegisterModel));
    }
}
