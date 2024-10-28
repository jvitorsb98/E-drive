package br.com.cepedi.e_drive.controller.address;

import br.com.cepedi.e_drive.model.records.address.details.DataAddressDetails;
import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.service.address.AddressService;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AddressControllerTest {

    @Mock
    private AddressService addressService;

    @InjectMocks
    private AddressController addressController;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should register a new address and return its details")
    void register_ShouldRegisterNewAddressAndReturnDetails() {
        DataRegisterAddress data = new DataRegisterAddress(
                "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 100, "Rua A", "Apto 10", true
        );
        
        UserDetails userDetails = User.withUsername(faker.internet().emailAddress()).password("password").authorities("USER").build();
        DataAddressDetails expectedAddressDetails = new DataAddressDetails(
                1L, "Brazil", "12345-678", "SP", "São Paulo", 
                "Centro", 100, "Rua A", 1L, true, "Apto 10", true
        );
        
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();

        when(addressService.register(data, userDetails.getUsername())).thenReturn(expectedAddressDetails);

        ResponseEntity<DataAddressDetails> response = addressController.register(data, uriBuilder, userDetails);

        URI expectedUri = URI.create("/api/v1/address/1");
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedUri, response.getHeaders().getLocation());
        assertEquals(expectedAddressDetails, response.getBody());
        verify(addressService, times(1)).register(data, userDetails.getUsername());
    }

    @Test
    @DisplayName("Should retrieve an address by ID")
    void getById_ShouldRetrieveAddressById() {
        Long addressId = 1L;
        DataAddressDetails expectedAddressDetails = new DataAddressDetails(
                addressId, "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 100, "Rua A", 1L, true, "Apto 10", true
        );

        when(addressService.getById(addressId)).thenReturn(expectedAddressDetails);

        ResponseEntity<DataAddressDetails> response = addressController.getById(addressId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAddressDetails, response.getBody());
        verify(addressService, times(1)).getById(addressId);
    }

    @Test
    @DisplayName("Should retrieve a paginated list of addresses by user ID")
    void getByUserId_ShouldRetrievePaginatedAddressesByUserId() {
        UserDetails userDetails = User.withUsername(faker.internet().emailAddress()).password("password").authorities("USER").build();
        PageRequest pageable = PageRequest.of(0, 10);
        DataAddressDetails address1 = new DataAddressDetails(
                1L, "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 100, "Rua A", 1L, true, "Apto 10", true
        );
        DataAddressDetails address2 = new DataAddressDetails(
                2L, "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 200, "Rua B", 1L, false, "Apto 20", true
        );
        Page<DataAddressDetails> expectedPage = new PageImpl<>(List.of(address1, address2), pageable, 2);

        when(addressService.getByUserId(userDetails.getUsername(), pageable)).thenReturn(expectedPage);

        ResponseEntity<Page<DataAddressDetails>> response = addressController.getByUserId(userDetails, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedPage, response.getBody());
        verify(addressService, times(1)).getByUserId(userDetails.getUsername(), pageable);
    }

    @Test
    @DisplayName("Should retrieve a paginated list of all addresses")
    void listAllAddresses_ShouldRetrievePaginatedListOfAllAddresses() {
        PageRequest pageable = PageRequest.of(0, 10);
        DataAddressDetails address1 = new DataAddressDetails(
                1L, "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 100, "Rua A", 1L, true, "Apto 10", true
        );
        DataAddressDetails address2 = new DataAddressDetails(
                2L, "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 200, "Rua B", 1L, false, "Apto 20", true
        );
        Page<DataAddressDetails> expectedPage = new PageImpl<>(List.of(address1, address2), pageable, 2);

        when(addressService.getAll(pageable)).thenReturn(expectedPage);

        ResponseEntity<Page<DataAddressDetails>> response = addressController.listAllAddresses(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedPage, response.getBody());
        verify(addressService, times(1)).getAll(pageable);
    }

    @Test
    @DisplayName("Should update an existing address and return its updated details")
    void update_ShouldUpdateAddressAndReturnUpdatedDetails() {
        Long addressId = 1L;
        DataUpdateAddress updateData = new DataUpdateAddress(
                "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 200, "Rua B", "Apto 20", false
        );
        
        DataAddressDetails updatedAddressDetails = new DataAddressDetails(
                addressId, "Brazil", "12345-678", "SP", "São Paulo",
                "Centro", 200, "Rua B", 1L, false, "Apto 20", true
        );

        when(addressService.update(updateData, addressId)).thenReturn(updatedAddressDetails);

        ResponseEntity<DataAddressDetails> response = addressController.update(updateData, addressId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedAddressDetails, response.getBody());
        verify(addressService, times(1)).update(updateData, addressId);
    }

    @Test
    @DisplayName("Should disable an address by ID")
    void disabled_ShouldDisableAddressById() {
        Long addressId = 1L;

        ResponseEntity<Void> response = addressController.disabled(addressId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(addressService, times(1)).disable(addressId);
    }

    @Test
    @DisplayName("Should enable an address by ID")
    void enableAddress_ShouldEnableAddressById() {
        Long addressId = 1L;

        ResponseEntity<Void> response = addressController.enableAddress(addressId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(addressService, times(1)).enable(addressId);
    }
}
