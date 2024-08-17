package br.com.cepedi.e_drive.service.address.validations.register;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.security.repository.UserRepository;
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

public class ValidationRegisterAddress_UserExistsTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private ValidationRegisterAddress_UserExists validationRegisterAddress;

	private Faker faker;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		faker = new Faker();
	}

	@Test
	@DisplayName("Validate - User Does Not Exist - Throws ValidationException")
	void validate_UserDoesNotExist_ThrowsValidationException() {
		// Arrange
		Long userId = faker.number().randomNumber();
		DataRegisterAddress data = new DataRegisterAddress(
				faker.address().country(),
				faker.address().zipCode(),
				faker.address().state(),
				faker.address().city(),
				faker.address().buildingNumber(),
				faker.number().numberBetween(1, 1000),
				faker.address().streetName(),
				userId,
				faker.bool().bool()
				);
		when(userRepository.existsById(userId)).thenReturn(false);

		// Act & Assert
		assertThrows(ValidationException.class, () -> validationRegisterAddress.validate(data),
				() -> "Expected validate() to throw ValidationException when user does not exist");
	}

	@Test
	@DisplayName("Validate - User Exists - No Exception Thrown")
	void validate_UserExists_NoExceptionThrown() {
		// Arrange
		Long userId = faker.number().randomNumber();
		DataRegisterAddress data = new DataRegisterAddress(
				faker.address().country(),
				faker.address().zipCode(),
				faker.address().state(),
				faker.address().city(),
				faker.address().buildingNumber(),
				faker.number().numberBetween(1, 1000),
				faker.address().streetName(),
				userId,
				faker.bool().bool()
				);
		when(userRepository.existsById(userId)).thenReturn(true);

		// Act & Assert
		validationRegisterAddress.validate(data); 
	}
}

