package br.com.cepedi.e_drive.service.address.validations.disabled;

import br.com.cepedi.e_drive.repository.AddressRepository;
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

public class ValidationDisabledAddress_AddressExistsTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private ValidationDisabledAddress_AddressExists validationDisabledAddress;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validate - Address Does Not Exist - Throws ValidationException")
    void validate_AddressDoesNotExist_ThrowsValidationException() {
        // Arrange
        Long id = faker.number().randomNumber();
        when(addressRepository.existsById(id)).thenReturn(false);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationDisabledAddress.validate(id),
        		() -> "Expected validate() to throw ValidationException when address does not exist");
    }

    @Test
    @DisplayName("Validate - Address Exists - No Exception Thrown")
    void validate_AddressExists_NoExceptionThrown() {
        // Arrange
        Long id = faker.number().randomNumber();
        when(addressRepository.existsById(id)).thenReturn(true);

        // Act & Assert
        validationDisabledAddress.validate(id); 
    }
}


