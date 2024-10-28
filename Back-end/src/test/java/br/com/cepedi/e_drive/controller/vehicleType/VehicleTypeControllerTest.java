package br.com.cepedi.e_drive.controller.vehicleType;

import br.com.cepedi.e_drive.model.records.vehicleType.details.DataVehicleTypeDetails;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import br.com.cepedi.e_drive.service.vehicleType.VehicleTypeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class VehicleTypeControllerTest {

    @InjectMocks
    private VehicleTypeController vehicleTypeController;

    @Mock
    private VehicleTypeService vehicleTypeService;

    private DataVehicleTypeDetails vehicleTypeDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        vehicleTypeDetails = new DataVehicleTypeDetails(1L, "Test Vehicle Type", true);
    }

    @Test
    @DisplayName("Should register a new vehicle type")
    void testRegister() {
        DataRegisterVehicleType registerData = new DataRegisterVehicleType("Test Vehicle Type");
        when(vehicleTypeService.register(any(DataRegisterVehicleType.class))).thenReturn(vehicleTypeDetails);

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();
        ResponseEntity<DataVehicleTypeDetails> response = vehicleTypeController.register(registerData, uriBuilder);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(vehicleTypeDetails, response.getBody());
        assertNotNull(response.getHeaders().getLocation());
    }

    @Test
    @DisplayName("Should retrieve vehicle type by ID")
    void testGetById() {
        when(vehicleTypeService.getById(1L)).thenReturn(vehicleTypeDetails);

        ResponseEntity<DataVehicleTypeDetails> response = vehicleTypeController.getById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicleTypeDetails, response.getBody());
    }

    @Test
    @DisplayName("Should retrieve all vehicle types")
    void testListAll() {
        Page<DataVehicleTypeDetails> page = new PageImpl<>(Collections.singletonList(vehicleTypeDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleTypeService.listAll(pageable)).thenReturn(page);

        ResponseEntity<Page<DataVehicleTypeDetails>> response = vehicleTypeController.listAll(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    @Test
    @DisplayName("Should update vehicle type details")
    void testUpdate() {
        DataUpdateVehicleType updateData = new DataUpdateVehicleType("Updated Vehicle Type");
        when(vehicleTypeService.update(any(DataUpdateVehicleType.class), eq(1L))).thenReturn(vehicleTypeDetails);

        ResponseEntity<DataVehicleTypeDetails> response = vehicleTypeController.update(1L, updateData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicleTypeDetails, response.getBody());
    }

    @Test
    @DisplayName("Should activate vehicle type by ID")
    void testActivate() {
        doNothing().when(vehicleTypeService).activated(1L);

        ResponseEntity<Void> response = vehicleTypeController.activated(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(vehicleTypeService, times(1)).activated(1L);
    }

    @Test
    @DisplayName("Should disable vehicle type by ID")
    void testDisable() {
        doNothing().when(vehicleTypeService).disabled(1L);

        ResponseEntity<Void> response = vehicleTypeController.disable(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(vehicleTypeService, times(1)).disabled(1L);
    }
}
