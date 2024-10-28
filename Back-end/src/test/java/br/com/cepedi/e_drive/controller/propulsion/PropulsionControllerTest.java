package br.com.cepedi.e_drive.controller.propulsion;

import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.service.propulsion.PropulsionService;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class PropulsionControllerTest {

    @InjectMocks
    private PropulsionController propulsionController;

    @Mock
    private PropulsionService propulsionService;

    private DataPropulsionDetails propulsionDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        propulsionDetails = new DataPropulsionDetails(1L, "Test Propulsion", true);
    }

    @Test
    @DisplayName("Should register a new propulsion system")
    void testRegister() {
        DataRegisterPropulsion registerData = new DataRegisterPropulsion("Test Propulsion");
        when(propulsionService.register(any(DataRegisterPropulsion.class))).thenReturn(propulsionDetails);
        
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();

        ResponseEntity<DataPropulsionDetails> response = propulsionController.register(registerData, uriBuilder);
        
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(propulsionDetails, response.getBody());
        assertNotNull(response.getHeaders().getLocation());
    }

    @Test
    @DisplayName("Should list all propulsion systems")
    void testListAll() {
        Page<DataPropulsionDetails> page = new PageImpl<>(Collections.singletonList(propulsionDetails));
        Pageable pageable = Pageable.ofSize(10);
        
        when(propulsionService.listAll(pageable)).thenReturn(page);

        ResponseEntity<Page<DataPropulsionDetails>> response = propulsionController.listAll(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    @Test
    @DisplayName("Should get propulsion system by ID")
    void testGetById() {
        when(propulsionService.getById(1L)).thenReturn(propulsionDetails);

        ResponseEntity<DataPropulsionDetails> response = propulsionController.getById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(propulsionDetails, response.getBody());
    }

    @Test
    @DisplayName("Should update an existing propulsion system")
    void testUpdate() {
        DataUpdatePropulsion updateData = new DataUpdatePropulsion("Updated Propulsion");
        when(propulsionService.update(any(DataUpdatePropulsion.class), eq(1L))).thenReturn(propulsionDetails);

        ResponseEntity<DataPropulsionDetails> response = propulsionController.update(1L, updateData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(propulsionDetails, response.getBody());
    }

    @Test
    @DisplayName("Should disable a propulsion system")
    void testDisabled() {
        doNothing().when(propulsionService).disabled(1L);

        ResponseEntity<Void> response = propulsionController.disabled(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(propulsionService, times(1)).disabled(1L);
    }
    
    @Test
    @DisplayName("Should search propulsion systems by name")
    void testListByName() {
        String name = "Test Propulsion";
        Page<DataPropulsionDetails> page = new PageImpl<>(Collections.singletonList(propulsionDetails));
        Pageable pageable = Pageable.ofSize(10);
        
        when(propulsionService.listByName(name, pageable)).thenReturn(page);
    
        ResponseEntity<Page<DataPropulsionDetails>> response = propulsionController.listByName(name, pageable);
    
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    @Test
    @DisplayName("Should list all deactivated propulsion systems")
    void testListAllDeactivated() {
        Page<DataPropulsionDetails> page = new PageImpl<>(Collections.singletonList(propulsionDetails));
        Pageable pageable = Pageable.ofSize(10);
        
        when(propulsionService.listAllDeactivated(pageable)).thenReturn(page);
    
        ResponseEntity<Page<DataPropulsionDetails>> response = propulsionController.listAllDeactivated(pageable);
    
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }

    
    @Test
    @DisplayName("Should return 404 when no propulsion systems found by name")
    void testListByNameNotFound() {
        String name = "Non-existent Propulsion";
        Pageable pageable = Pageable.ofSize(10);
        
        when(propulsionService.listByName(name, pageable)).thenReturn(new PageImpl<>(Collections.emptyList()));
    
        ResponseEntity<Page<DataPropulsionDetails>> response = propulsionController.listByName(name, pageable);
    
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    
    @Test
    @DisplayName("Should return empty list when no deactivated propulsion systems found")
    void testListAllDeactivatedNotFound() {
        Pageable pageable = Pageable.ofSize(10);
        
        when(propulsionService.listAllDeactivated(pageable)).thenReturn(new PageImpl<>(Collections.emptyList()));
    
        ResponseEntity<Page<DataPropulsionDetails>> response = propulsionController.listAllDeactivated(pageable);
    
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }
    
    
}
