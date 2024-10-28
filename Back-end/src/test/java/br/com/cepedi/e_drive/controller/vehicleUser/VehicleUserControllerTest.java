package br.com.cepedi.e_drive.controller.vehicleUser;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateAutonomy;
import br.com.cepedi.e_drive.model.records.vehicleUser.details.DataVehicleUserDetails;
import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.model.records.vehicleUser.update.DataUpdateVehicleUser;
import br.com.cepedi.e_drive.service.vehicleUser.VehicleUserService;
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
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class VehicleUserControllerTest {

    @InjectMocks
    private VehicleUserController vehicleUserController;

    @Mock
    private VehicleUserService vehicleUserService;

    @Mock
    private UserDetails userDetails;

    private DataRegisterVehicleUser dataRegisterVehicleUser;
    private DataUpdateVehicleUser dataUpdateVehicleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup para os dados de registro
        dataRegisterVehicleUser = new DataRegisterVehicleUser(
            1L,
            new DataRegisterAutonomy(
                BigDecimal.valueOf(12.5), // mileagePerLiterRoad
                BigDecimal.valueOf(10.0), // mileagePerLiterCity
                BigDecimal.valueOf(15.0), // consumptionEnergetic
                BigDecimal.valueOf(50.0), // autonomyElectricMode
                BigDecimal.valueOf(75.0)
            )
        );

        // Setup para os dados de atualização
        dataUpdateVehicleUser = new DataUpdateVehicleUser(
            new DataUpdateAutonomy(
                BigDecimal.valueOf(12.5), // mileagePerLiterRoad
                BigDecimal.valueOf(10.0), // mileagePerLiterCity
                BigDecimal.valueOf(15.0), // consumptionEnergetic
                BigDecimal.valueOf(50.0), // autonomyElectricMode
                BigDecimal.valueOf(75.0)
            )
        );

        when(userDetails.getUsername()).thenReturn("user@example.com");
    }

    @Test
    @DisplayName("Should successfully register the association between a vehicle and a user")
    void testRegister() {
        DataVehicleUserDetails registeredUser = new DataVehicleUserDetails(
            1L, 1L, 1L,
            BigDecimal.valueOf(10), BigDecimal.valueOf(15),
            BigDecimal.valueOf(50), BigDecimal.valueOf(100),
            BigDecimal.valueOf(50), true
        );

        when(vehicleUserService.register(any(), any())).thenReturn(registeredUser);

        ResponseEntity<DataVehicleUserDetails> response = vehicleUserController.register(dataRegisterVehicleUser, userDetails);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(registeredUser, response.getBody());
    }

    @Test
    @DisplayName("Should return error when registering the association with invalid data")
    void testRegisterInvalidData() {
        when(vehicleUserService.register(any(), any())).thenThrow(new RuntimeException("Invalid data"));

        ResponseEntity<DataVehicleUserDetails> response = vehicleUserController.register(dataRegisterVehicleUser, userDetails);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    @DisplayName("Should return all activated vehicles associated with the user")
    void testGetAllActivatedVehicleUsers() {
        Page<DataVehicleUserDetails> vehicleUsers = new PageImpl<>(Collections.singletonList(new DataVehicleUserDetails(
            1L, 1L, 1L,
            BigDecimal.valueOf(10), BigDecimal.valueOf(15),
            BigDecimal.valueOf(50), BigDecimal.valueOf(100),
            BigDecimal.valueOf(50), true
        )));

        when(vehicleUserService.getAllVehicleUsersActivated(any(Pageable.class))).thenReturn(vehicleUsers);

        ResponseEntity<Page<DataVehicleUserDetails>> response = vehicleUserController.getAllActivatedVehicleUsers(Pageable.unpaged());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicleUsers, response.getBody());
    }

    @Test
    @DisplayName("Should successfully update the association between a vehicle and a user")
    void testUpdateVehicleUser() {
        DataVehicleUserDetails updatedUser = new DataVehicleUserDetails(
            1L, 1L, 1L,
            BigDecimal.valueOf(12), BigDecimal.valueOf(18),
            BigDecimal.valueOf(50), BigDecimal.valueOf(100),
            BigDecimal.valueOf(50), true
        );

        when(vehicleUserService.updateVehicleUser(any(), anyLong())).thenReturn(updatedUser);

        ResponseEntity<DataVehicleUserDetails> response = vehicleUserController.updateVehicleUser(dataUpdateVehicleUser, 1L, userDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedUser, response.getBody());
    }

    @Test
    @DisplayName("Should return error when updating a non-existent vehicle user")
    void testUpdateVehicleUserNotFound() {
        when(vehicleUserService.updateVehicleUser(any(), anyLong())).thenThrow(new RuntimeException("User not found"));

        ResponseEntity<DataVehicleUserDetails> response = vehicleUserController.updateVehicleUser(dataUpdateVehicleUser, 1L, userDetails);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    @DisplayName("Should successfully disable the association between a vehicle and a user")
    void testDisableVehicleUser() {
        doNothing().when(vehicleUserService).disableVehicleUser(1L);

        ResponseEntity<Void> response = vehicleUserController.disableVehicleUser(1L, userDetails);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(vehicleUserService, times(1)).disableVehicleUser(1L);
    }

    @Test
    @DisplayName("Should return error when disabling a non-existent vehicle user")
    void testDisableVehicleUserNotFound() {
        doThrow(new RuntimeException("User not found")).when(vehicleUserService).disableVehicleUser(1L);

        ResponseEntity<Void> response = vehicleUserController.disableVehicleUser(1L, userDetails);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    @DisplayName("Should successfully enable the association between a vehicle and a user")
    void testEnableVehicleUser() {
        doNothing().when(vehicleUserService).enableVehicleUser(1L);

        ResponseEntity<Void> response = vehicleUserController.enableVehicleUser(1L, userDetails);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(vehicleUserService, times(1)).enableVehicleUser(1L);
    }

    @Test
    @DisplayName("Should return error when enabling a non-existent vehicle user")
    void testEnableVehicleUserNotFound() {
        doThrow(new RuntimeException("User not found")).when(vehicleUserService).enableVehicleUser(1L);

        ResponseEntity<Void> response = vehicleUserController.enableVehicleUser(1L, userDetails);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    @DisplayName("Should return vehicle users associated with the authenticated user")
    void testGetVehicleUsersByUser() {
        Page<DataVehicleUserDetails> vehicleUsers = new PageImpl<>(Collections.singletonList(new DataVehicleUserDetails(
            1L, 1L, 1L,
            BigDecimal.valueOf(10), BigDecimal.valueOf(15),
            BigDecimal.valueOf(50), BigDecimal.valueOf(100),
            BigDecimal.valueOf(50), true
        )));

        when(vehicleUserService.getVehicleUsersByUser(any(String.class), any(Pageable.class))).thenReturn(vehicleUsers);

        ResponseEntity<Page<DataVehicleUserDetails>> response = vehicleUserController.getVehicleUsersByUser(Pageable.unpaged(), userDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicleUsers, response.getBody());
    }

    @Test
    @DisplayName("Should return vehicle users associated with a specific vehicle")
    void testGetVehicleUsersByVehicle() {
        Page<DataVehicleUserDetails> vehicleUsers = new PageImpl<>(Collections.singletonList(new DataVehicleUserDetails(
            1L, 1L, 1L,
            BigDecimal.valueOf(10), BigDecimal.valueOf(15),
            BigDecimal.valueOf(50), BigDecimal.valueOf(100),
            BigDecimal.valueOf(50), true
        )));

        when(vehicleUserService.getVehicleUsersByVehicle(anyLong(), any(Pageable.class))).thenReturn(vehicleUsers);

        ResponseEntity<Page<DataVehicleUserDetails>> response = vehicleUserController.getVehicleUsersByVehicle(1L, Pageable.unpaged(), userDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicleUsers, response.getBody());
    }
}
