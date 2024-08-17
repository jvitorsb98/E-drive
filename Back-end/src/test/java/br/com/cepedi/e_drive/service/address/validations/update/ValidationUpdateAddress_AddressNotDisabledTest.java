package br.com.cepedi.e_drive.service.address.validations.update;

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

public class ValidationUpdateAddress_AddressNotDisabledTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private ValidationUpdateAddress_AddressNotDisabled validationUpdateAddress;

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
        Long addressId = faker.number().randomNumber();
        Address address = new Address();
        address.setActivated(false); 

        when(addressRepository.existsById(addressId)).thenReturn(true);
        when(addressRepository.getReferenceById(addressId)).thenReturn(address);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationUpdateAddress.validate(addressId),
        		() ->"Expected validate() to throw ValidationException when address is disabled");
    }

    @Test
    @DisplayName("Validate - Address Is Not Disabled - No Exception Thrown")
    void validate_AddressIsNotDisabled_NoExceptionThrown() {
        // Arrange
        Long addressId = faker.number().randomNumber();
        Address address = new Address();
        address.setActivated(true); 

        when(addressRepository.existsById(addressId)).thenReturn(true);
        when(addressRepository.getReferenceById(addressId)).thenReturn(address);

        // Act & Assert
        validationUpdateAddress.validate(addressId); 
    }
}
