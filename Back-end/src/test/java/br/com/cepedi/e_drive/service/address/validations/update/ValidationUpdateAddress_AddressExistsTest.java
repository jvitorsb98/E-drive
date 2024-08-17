package br.com.cepedi.e_drive.service.address.validations.update;

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

public class ValidationUpdateAddress_AddressExistsTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private ValidationUpdateAddress_AddressExists validationUpdateAddress;

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
        Long addressId = faker.number().randomNumber();
        when(addressRepository.existsById(addressId)).thenReturn(false);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationUpdateAddress.validate(addressId),
        		() ->"Expected validate() to throw ValidationException when address does not exist");
    }

    @Test
    @DisplayName("Validate - Address Exists - No Exception Thrown")
    void validate_AddressExists_NoExceptionThrown() {
        // Arrange
        Long addressId = faker.number().randomNumber();
        when(addressRepository.existsById(addressId)).thenReturn(true);

        // Act & Assert
        validationUpdateAddress.validate(addressId); 
    }
}
