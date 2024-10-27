package br.com.cepedi.e_drive.service.address;

import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.model.records.address.details.DataAddressDetails;
import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.repository.AddressRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.service.address.validations.disabled.ValidationDisabledAddress;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("AddressService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AddressServiceTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

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
        MockitoAnnotations.openMocks(this);  // Inicializa os mocks

        // Crie um objeto de DataRegisterAddress com valores fictícios
        DataRegisterAddress dataRegisterAddress = new DataRegisterAddress(
                "Brasil", "12345-678", "SP", "São Paulo", "Centro",
                123, "Rua Principal", null, true
        );

        // Inicializa o usuário mock
        user = mock(User.class);
        when(user.getId()).thenReturn(1L);  // Suponha que o ID do usuário seja 1

        // Inicializa o endereço com os dados do DataRegisterAddress e o usuário
        address = new Address(dataRegisterAddress, user);
        user = new User();
        user.setId(1L); // Defina um ID para o usuário
        user.setEmail("usuario@example.com"); 
    }

   
    @Test
    @DisplayName("Test register throws EntityNotFoundException for non-existing user")
    void register_NonExistingUser_EntityNotFoundException() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenThrow(new EntityNotFoundException("User not found"));

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            addressService.register(dataRegisterAddress, "nonexistentuser@example.com");
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

    @Test
    @DisplayName("Test update with valid data")
    void update_ValidData_AddressUpdated() {
        // Arrange
        // Crie um objeto DataUpdateAddress com todos os parâmetros necessários
        DataUpdateAddress dataUpdateAddress = new DataUpdateAddress(
            "Brasil",        // país
            "12345-678",    // código postal
            "SP",           // estado
            "São Paulo",    // cidade
            "Centro",       // bairro
            123,            // número
            "Rua Principal",// rua
            "Apto 45",      // complemento (se necessário)
            true            // plugin (indica se tem estação de carregamento)
        );
    
        when(addressRepository.getReferenceById(anyLong())).thenReturn(address);
        when(addressRepository.save(any(Address.class))).thenReturn(address);
    
        // Act
        DataAddressDetails result = addressService.update(dataUpdateAddress, 1L); // Passando o objeto correto
    
        // Assert
        verify(addressRepository, times(1)).getReferenceById(1L);
        assertNotNull(result, () -> "Result should not be null");
        assertEquals(address.getCountry(), result.country(), () -> "Country should match");
    }
    
    @Test
    @DisplayName("Test register with valid data")
    void register_ValidData_AddressRegistered() {
        // Arrange
        DataRegisterAddress dataRegisterAddress = new DataRegisterAddress(
            "Brasil",        // país
            "12345-678",    // código postal
            "SP",           // estado
            "São Paulo",    // cidade
            "Centro",       // bairro
            Integer.valueOf(123), // número
            "Rua Principal",// rua
            "Apto 45",      // complemento (se necessário)
            null            // plugin (se não aplicável)
        );
    
        when(userRepository.findByEmail(anyString())).thenReturn(user);
        when(addressRepository.save(any(Address.class))).thenReturn(address);
    
        // Act
        DataAddressDetails result = addressService.register(dataRegisterAddress, user.getEmail());
    
        // Assert
        verify(addressRepository, times(1)).save(any(Address.class));
        assertNotNull(result, () -> "Result should not be null");
        assertEquals(address.getCountry(), result.country(), () -> "Country should match");
    }
    
    

    
}
