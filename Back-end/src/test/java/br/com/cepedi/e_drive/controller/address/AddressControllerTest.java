package br.com.cepedi.e_drive.controller.address;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import br.com.cepedi.e_drive.model.records.address.details.DataAddressDetails;
import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.service.address.AddressService;
import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.github.javafaker.Faker;

class AddressControllerTest {

	@Mock
	private AddressService addressService;

	@InjectMocks
	private AddressController addressController;

	private MockMvc mockMvc;

	private Faker faker;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(addressController).build();
		faker = new Faker();
	}




	@Test
	@DisplayName("Test getById returns address details")
	void getById_ExistingId_ReturnsAddressDetails() throws Exception {
		// Arrange
		when(addressService.getById(1L)).thenReturn(new DataAddressDetails(1L, "Brazil", "12345", "SP", "São Paulo", "Bairro", 123, "Rua", 1L, false, "Apto 10", true));

		// Act & Assert
		mockMvc.perform(get("/api/v1/address/1")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.city").value("São Paulo"));

		// Verificação da interação com o serviço
		verify(addressService, times(1)).getById(1L);
	}

	@Test
	@DisplayName("Test update address successfully")
	void updateAddress_ValidData_ReturnsUpdatedAddress() throws Exception {
		// Arrange
		DataUpdateAddress updateAddress = new DataUpdateAddress("Brazil", "12345", "SP", "São Paulo", "Bairro", 123, "Rua", false);

		when(addressService.update(any(DataUpdateAddress.class), anyLong())).thenReturn(new DataAddressDetails(1L, "Brazil", "12345", "SP", "São Paulo", "Bairro", 123, "Rua", 1L, false, "Apto 10", true));

		// Act & Assert
		mockMvc.perform(put("/api/v1/address/1")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"country\":\"Brazil\",\"zipCode\":\"12345\",\"state\":\"SP\",\"city\":\"São Paulo\",\"neighborhood\":\"Bairro\",\"number\":123,\"street\":\"Rua\",\"complement\":\"Apto 10\",\"hasChargingStation\":false}"))
				.andExpect(status().isOk());

		// Verificação da interação com o serviço
		verify(addressService, times(1)).update(any(DataUpdateAddress.class), eq(1L));
	}

	@Test
	void testGetById_Success() {
		// Mock data
		Long id = 1L;
		DataAddressDetails addressDetails = new DataAddressDetails(id, "Rua ABC", "12345-678", "Cidade", "Estado", "País", null, null, id, true, null, null);

		// Mock behavior
		Mockito.when(addressService.getById(id)).thenReturn(addressDetails);

		// Call the method
		ResponseEntity<DataAddressDetails> response = addressController.getById(id);

		// Verify and assert
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(addressDetails, response.getBody());
	}

	@Test
	void testGetById_NotFound() {
		// Mock data
		Long id = 1L;

		// Mock behavior
		Mockito.when(addressService.getById(id)).thenThrow(new EntityNotFoundException("Address not found"));

		// Call the method and verify exception
		EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
			addressController.getById(id);
		});

		assertEquals("Address not found", exception.getMessage());
	}

	@Test
	void testDisableAddress_Success() {
		// Mock data
		Long id = 1L;

		// Call the method
		ResponseEntity<Void> response = addressController.disabled(id);

		// Verify and assert
		assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

		// Verify that the service method was called
		Mockito.verify(addressService).disable(id);
	}

	@Test
	void testUpdateAddress_Success() {
		// Mock data
		Long id = 1L;
		DataUpdateAddress updateAddress = new DataUpdateAddress(null, null, null, null, null, null, null, null/* atributos */);
		DataAddressDetails updatedAddress = new DataAddressDetails(id, "Rua XYZ", "98765-432", "Cidade Nova", "Estado", "País", null, null, id, true, null, null);

		// Mock behavior
		Mockito.when(addressService.update(updateAddress, id)).thenReturn(updatedAddress);

		// Call the method
		ResponseEntity<DataAddressDetails> response = addressController.update(updateAddress, id);

		// Verify and assert
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(updatedAddress, response.getBody());
	}



}
