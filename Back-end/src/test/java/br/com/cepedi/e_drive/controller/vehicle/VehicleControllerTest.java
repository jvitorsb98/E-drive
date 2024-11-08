package br.com.cepedi.e_drive.controller.vehicle;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.details.DataVehicleDetails;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.service.vehicle.VehicleService;
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

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class VehicleControllerTest {

    @InjectMocks
    private VehicleController vehicleController;

    @Mock
    private VehicleService vehicleService;

    private DataVehicleDetails vehicleDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        vehicleDetails = new DataVehicleDetails(
                1L, 
                "Test Vehicle", 
                "1.0", // assuming version is part of the details
                null, // assuming model details can be null
                null, // assuming category details can be null
                null, // assuming type details can be null
                null, // assuming propulsion details can be null
                null, // assuming autonomy details can be null
                2024L, // assuming year
                true // assuming activated
        );
    }

    @Test
    @DisplayName("Test vehicle registration")
    void testRegister() {
        DataRegisterVehicle registerData = new DataRegisterVehicle(
                "Test Vehicle",
                "1.0",
                1L, // modelId
                1L, // categoryId
                1L, // typeId
                1L, // propulsionId
                2024L, // year
                new DataRegisterAutonomy(
                BigDecimal.valueOf(12.5), // mileagePerLiterRoad
                BigDecimal.valueOf(10.0), // mileagePerLiterCity
                BigDecimal.valueOf(15.0), // consumptionEnergetic
                BigDecimal.valueOf(50.0), // autonomyElectricMode
                BigDecimal.valueOf(75.0)  ) // assuming this is a proper constructor
        );
        
        when(vehicleService.register(any(DataRegisterVehicle.class))).thenReturn(vehicleDetails);

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();
        ResponseEntity<DataVehicleDetails> response = vehicleController.register(registerData, uriBuilder);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(vehicleDetails, response.getBody());
        assertNotNull(response.getHeaders().getLocation());
    }

    @Test
    @DisplayName("Test getting all vehicles")
    void testGetAllVehicles() {
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getAllVehicles(pageable)).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getAllVehicles(pageable, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    @Test
    @DisplayName("Test getting vehicle by ID")
    void testGetVehicleById() {
        when(vehicleService.getVehicleById(1L)).thenReturn(vehicleDetails);

        ResponseEntity<DataVehicleDetails> response = vehicleController.getVehicleById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicleDetails, response.getBody());
    }

    @Test
    @DisplayName("Test vehicle update")
    void testUpdateVehicle() {
        DataUpdateVehicle updateData = new DataUpdateVehicle(
                "Updated Vehicle",
                "2.0", // assuming new version
                1L, // modelId
                1L, // categoryId
                1L, // typeId
                1L, // brandId
                1L, // propulsionId
                2025L, // year
                new DataRegisterAutonomy(
                    BigDecimal.valueOf(12.5), // mileagePerLiterRoad
                    BigDecimal.valueOf(10.0), // mileagePerLiterCity
                    BigDecimal.valueOf(15.0), // consumptionEnergetic
                    BigDecimal.valueOf(50.0), // autonomyElectricMode
                    BigDecimal.valueOf(75.0)  ) // assuming this is a proper constructor
            );
        
        when(vehicleService.updateVehicle(any(DataUpdateVehicle.class), eq(1L))).thenReturn(vehicleDetails);

        ResponseEntity<DataVehicleDetails> response = vehicleController.updateVehicle(updateData, 1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicleDetails, response.getBody());
    }

    @Test
    @DisplayName("Test vehicle deactivation")
    void testDisableVehicle() {
        doNothing().when(vehicleService).disableVehicle(1L);

        ResponseEntity<Void> response = vehicleController.disableVehicle(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(vehicleService, times(1)).disableVehicle(1L);
    }

    @Test
    @DisplayName("Test vehicle activation")
    void testEnableVehicle() {
        doNothing().when(vehicleService).enableVehicle(1L);

        ResponseEntity<Void> response = vehicleController.enableVehicle(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(vehicleService, times(1)).enableVehicle(1L);
    }

    @Test
    @DisplayName("Test getting vehicles by version")
    void testGetVehiclesByVersion() {
        String version = "1.0";
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getVehiclesByVersion(eq(version), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getVehiclesByVersion(version, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    // Test to get vehicles by category
    @Test
    @DisplayName("Test getting vehicles by category")
    void testGetVehiclesByCategory() {
        Long categoryId = 1L;
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getVehiclesByCategory(eq(categoryId), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getVehiclesByCategory(categoryId, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    // Test to get vehicles by model
    @Test
    @DisplayName("Test getting vehicles by model")
    void testGetVehiclesByModel() {
        Long modelId = 1L;
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getVehiclesByModel(eq(modelId), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getVehiclesByModel(modelId, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    // Test to get vehicles by type
    @Test
    @DisplayName("Test getting vehicles by type")
    void testGetVehiclesByType() {
        Long typeId = 1L;
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getVehiclesByType(eq(typeId), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getVehiclesByType(typeId, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    // Test to get vehicles by brand
    @Test
    @DisplayName("Test getting vehicles by brand")
    void testGetVehiclesByBrand() {
        Long brandId = 1L;
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getVehiclesByBrand(eq(brandId), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getVehiclesByBrand(brandId, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    // Test to get vehicles by propulsion
    @Test
    @DisplayName("Test getting vehicles by propulsion")
    void testGetVehiclesByPropulsion() {
        Long propulsionId = 1L;
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getVehiclesByPropulsion(eq(propulsionId), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getVehiclesByPropulsion(propulsionId, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    // Test to get vehicles by autonomy
    @Test
    @DisplayName("Test getting vehicles by autonomy")
    void testGetVehiclesByAutonomy() {
        Long autonomyId = 1L;
        Page<DataVehicleDetails> page = new PageImpl<>(Collections.singletonList(vehicleDetails));
        Pageable pageable = Pageable.ofSize(10);
        when(vehicleService.getVehiclesByAutonomy(eq(autonomyId), any(Pageable.class))).thenReturn(page);

        ResponseEntity<Page<DataVehicleDetails>> response = vehicleController.getVehiclesByAutonomy(autonomyId, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }
}
