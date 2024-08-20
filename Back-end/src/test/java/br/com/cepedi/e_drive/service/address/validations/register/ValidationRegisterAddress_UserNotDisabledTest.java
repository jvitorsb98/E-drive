package br.com.cepedi.e_drive.service.address.validations.register;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.security.model.entitys.User;
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

public class ValidationRegisterAddress_UserNotDisabledTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private ValidationRegisterAddress_UserNotDisabled validationRegisterAddress;

	private Faker faker;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		faker = new Faker();
	}

	@Test
	@DisplayName("Validate - User Is Disabled - Throws ValidationException")
	void validate_UserIsDisabled_ThrowsValidationException() {
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
		User user = new User();
		user.setActivated(false); 

		when(userRepository.existsById(userId)).thenReturn(true);
		when(userRepository.getReferenceById(userId)).thenReturn(user);

		// Act & Assert
		assertThrows(ValidationException.class, () -> validationRegisterAddress.validate(data),
				() ->"Expected validate() to throw ValidationException when user is disabled");
	}

	@Test
	@DisplayName("Validate - User Is Not Disabled - No Exception Thrown")
	void validate_UserIsNotDisabled_NoExceptionThrown() {
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
		User user = new User();
		user.setActivated(true);

		when(userRepository.existsById(userId)).thenReturn(true);
		when(userRepository.getReferenceById(userId)).thenReturn(user);

		// Act & Assert
		validationRegisterAddress.validate(data); 
	}
}
