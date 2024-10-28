package br.com.cepedi.e_drive.service.model.validations.update;

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

public class ValidationModelUpdate_BrandExistsTest {

	@Mock
	private BrandRepository brandRepository;

	@Mock
	private MessageSource messageSource; // Mock para MessageSource

	@InjectMocks
	private ValidationModelUpdate_BrandExists validationModelUpdate_BrandExists;

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
		DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), brandId);

		when(brandRepository.existsById(brandId)).thenReturn(false);
		when(messageSource.getMessage("model.update.brand.not.found", new Object[]{brandId}, Locale.getDefault()))
				.thenReturn("The required brand does not exist"); // Mockando a mensagem de erro

		// Act & Assert
		ValidationException thrownException = assertThrows(ValidationException.class,
				() -> validationModelUpdate_BrandExists.validation(dataUpdateModel, brandId),
				"Expected validation() to throw ValidationException when the brand does not exist");

		assertEquals("The required brand does not exist", thrownException.getMessage());
	}

	@Test
	@DisplayName("Validation - Brand Exists - No Exception Thrown")
	void validation_BrandExists_NoExceptionThrown() {
		// Arrange
		Long brandId = faker.number().randomNumber();
		DataUpdateModel dataUpdateModel = new DataUpdateModel(faker.lorem().word(), brandId);

		when(brandRepository.existsById(brandId)).thenReturn(true);

		// Act & Assert
		assertDoesNotThrow(() -> validationModelUpdate_BrandExists.validation(dataUpdateModel, brandId));
	}
}
