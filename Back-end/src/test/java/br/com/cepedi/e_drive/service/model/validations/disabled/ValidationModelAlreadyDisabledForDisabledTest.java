package br.com.cepedi.e_drive.service.model.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Model;
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

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ValidationModelAlreadyDisabledForDisabledTest {

	@Mock
	private ModelRepository modelRepository;

	@Mock
	private MessageSource messageSource; // Mock para MessageSource

	@InjectMocks
	private ValidationModelAlreadyDisabledForDisabled validationModelAlreadyDisabledForDisabled;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	@DisplayName("Validation - Model Exists and is Already Disabled - Throws ValidationException")
	void validation_ModelExistsAndIsAlreadyDisabled_ThrowsValidationException() {
		// Arrange
		Long modelId = 1L;
		Model model = new Model();
		model.setActivated(false);

		when(modelRepository.existsById(modelId)).thenReturn(true);
		when(modelRepository.getReferenceById(modelId)).thenReturn(model);
		when(messageSource.getMessage("model.disabled.already.disabled", null, Locale.getDefault()))
				.thenReturn("The model is already disabled"); // Simular a mensagem de erro

		// Act & Assert
		ValidationException thrownException = assertThrows(ValidationException.class,
				() -> validationModelAlreadyDisabledForDisabled.validation(modelId),
				"Expected validation() to throw ValidationException when the model is already disabled");

		assertEquals("The model is already disabled", thrownException.getMessage());
	}

	@Test
	@DisplayName("Validation - Model Exists and is Activated - No Exception Thrown")
	void validation_ModelExistsAndIsActivated_NoExceptionThrown() {
		// Arrange
		Long modelId = 1L;
		Model model = new Model();
		model.setActivated(true);

		when(modelRepository.existsById(modelId)).thenReturn(true);
		when(modelRepository.getReferenceById(modelId)).thenReturn(model);

		// Act & Assert
		assertDoesNotThrow(() -> validationModelAlreadyDisabledForDisabled.validation(modelId));
	}

	@Test
	@DisplayName("Validation - Model Does Not Exist - No Exception Thrown")
	void validation_ModelDoesNotExist_NoExceptionThrown() {
		// Arrange
		Long modelId = 1L;

		when(modelRepository.existsById(modelId)).thenReturn(false);

		// Act & Assert
		assertDoesNotThrow(() -> validationModelAlreadyDisabledForDisabled.validation(modelId));
	}
}
