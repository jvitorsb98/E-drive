package br.com.cepedi.e_drive.service.address;


import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.model.records.address.details.DataAddressDetails;
import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.repository.AddressRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.service.address.validations.disabled.ValidationDisabledAddress;
import br.com.cepedi.e_drive.service.address.validations.register.ValidationRegisterAddress;
import br.com.cepedi.e_drive.service.address.validations.update.ValidationUpdateAddress;
import com.github.javafaker.Faker;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@DisplayName("AddressService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AddressServiceTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private List<ValidationRegisterAddress> validationRegisterAddressList;

    @Mock
    private List<ValidationUpdateAddress> validationUpdateAddressList;

    @Mock
    private List<ValidationDisabledAddress> validationDisabledAddressList;

    @InjectMocks
    private AddressService addressService;

    private Faker faker;
    private User user;
    private Address address;
    private DataRegisterAddress dataRegisterAddress;
    private DataUpdateAddress dataUpdateAddress;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();

      
        user = new User();
        user.setId(faker.number().randomNumber());
        user.setEmail(faker.internet().emailAddress());
        user.setName(faker.name().fullName());
        user.setPassword(faker.internet().password());
        user.setBirth(faker.date().birthday().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        user.setCellphone(faker.phoneNumber().cellPhone());
        user.setActivated(true);

        dataRegisterAddress = new DataRegisterAddress(
            faker.address().country(),
            faker.address().zipCode(),
            faker.address().state(),
            faker.address().city(),
            faker.address().streetName(),
            faker.number().randomDigit(),
            faker.address().streetAddress(),
            user.getId(),  
            faker.bool().bool()  
        );

        address = new Address(
            null, 
            dataRegisterAddress.country(),
            dataRegisterAddress.zipCode(),
            dataRegisterAddress.state(),
            dataRegisterAddress.city(),
            dataRegisterAddress.neighborhood(),
            dataRegisterAddress.number(),
            dataRegisterAddress.street(),
            user,  
            dataRegisterAddress.plugin(),
            true  
        );

        dataUpdateAddress = new DataUpdateAddress(
            faker.address().country(),
            faker.address().zipCode(),
            faker.address().state(),
            faker.address().city(),
            faker.address().streetName(),
            faker.number().randomDigit(),
            faker.address().streetAddress(),
            faker.bool().bool()
        );
    }

 

    @Test
    @DisplayName("Test register with valid data")
    void register_ValidData_AddressRegistered() {
        // Arrange
        when(userRepository.getReferenceById(anyLong())).thenReturn(user);
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        // Act
        DataAddressDetails result = addressService.register(dataRegisterAddress);

        // Assert
        verify(validationRegisterAddressList, times(1)).forEach(any());
        verify(addressRepository, times(1)).save(any(Address.class));
        assertNotNull(result, () -> "Result should not be null");
        assertEquals(address.getCountry(), result.country(), () -> "Country should match");
    }

    @Test
    @DisplayName("Test register throws EntityNotFoundException for non-existing user")
    void register_NonExistingUser_EntityNotFoundException() {
        // Arrange
        when(userRepository.getReferenceById(anyLong())).thenThrow(new EntityNotFoundException("User not found"));

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            addressService.register(dataRegisterAddress);
        });

        assertEquals("User not found", exception.getMessage(), () -> "Exception message should match");
    }

    @Test
    @DisplayName("Test getAll returns paginated data")
    void getAll_ValidPageRequest_ReturnsPageOfAddresses() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        when(addressRepository.findAll(pageable)).thenReturn(new PageImpl<>(Collections.singletonList(address)));

        // Act
        Page<DataAddressDetails> result = addressService.getAll(pageable);

        // Assert
        assertEquals(1, result.getTotalElements(), () -> "Total elements should be 1");
        assertEquals(address.getCountry(), result.getContent().get(0).country(), () -> "Country should match");
    }

    @Test
    @DisplayName("Test getById returns address details")
    void getById_ExistingId_ReturnsAddressDetails() {
        // Arrange
        when(addressRepository.findById(anyLong())).thenReturn(Optional.of(address));

        // Act
        DataAddressDetails result = addressService.getById(1L);

        // Assert
        assertNotNull(result, () -> "Result should not be null");
        assertEquals(address.getCountry(), result.country(), () -> "Country should match");
    }

    @Test
    @DisplayName("Test getById throws EntityNotFoundException for non-existing address")
    void getById_NonExistingId_EntityNotFoundException() {
        // Arrange
        when(addressRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            addressService.getById(1L);
        });

        assertEquals("Address not found with id: 1", exception.getMessage(), () -> "Exception message should match");
    }

    @Test
    @DisplayName("Test update with valid data")
    void update_ValidData_AddressUpdated() {
        // Arrange
        when(addressRepository.getReferenceById(anyLong())).thenReturn(address);

        // Act
        DataAddressDetails result = addressService.update(dataUpdateAddress, 1L);

        // Assert
        verify(validationUpdateAddressList, times(1)).forEach(any());
        assertNotNull(result, () -> "Result should not be null");
        assertEquals(address.getCountry(), result.country(), () -> "Country should match");
    }

    @Test
    @DisplayName("Test disable address")
    void disable_ValidId_AddressDisabled() {
        // Arrange
        when(addressRepository.getReferenceById(anyLong())).thenReturn(address);

        // Act
        addressService.disable(1L);

        // Assert
        verify(validationDisabledAddressList, times(1)).forEach(any());
        verify(addressRepository, times(1)).save(any(Address.class));
        assertFalse(address.getActivated(), () -> "Address should be deactivated");
    }

    @Test
    @DisplayName("Test enable address")
    void enable_ValidId_AddressEnabled() {
        // Arrange
        when(addressRepository.getReferenceById(anyLong())).thenReturn(address);

        // Act
        addressService.enable(1L);

        // Assert
        verify(addressRepository, times(1)).save(any(Address.class));
        assertTrue(address.getActivated(), () -> "Address should be activated");
    }
}
