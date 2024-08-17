package br.com.cepedi.e_drive.service.address.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Address;
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

public class ValidationDisabledAddress_AddressNotDisabledTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private ValidationDisabledAddress_AddressNotDisabled validationDisabledAddress;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validate - Address Is Disabled - Throws ValidationException")
    void validate_AddressIsDisabled_ThrowsValidationException() {
        // Arrange
        Long id = faker.number().randomNumber();
        Address address = new Address();
        address.setActivated(false); 

        when(addressRepository.existsById(id)).thenReturn(true);
        when(addressRepository.getReferenceById(id)).thenReturn(address);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationDisabledAddress.validate(id), 
        		() -> "Expected validate() to throw ValidationException when address is disabled");
    }

    @Test
    @DisplayName("Validate - Address Is Not Disabled - No Exception Thrown")
    void validate_AddressIsNotDisabled_NoExceptionThrown() {
        // Arrange
        Long id = faker.number().randomNumber();
        Address address = new Address();
        address.setActivated(true); 

        when(addressRepository.existsById(id)).thenReturn(true);
        when(addressRepository.getReferenceById(id)).thenReturn(address);

        // Act & Assert
        validationDisabledAddress.validate(id); 
    }
}
