package br.com.cepedi.e_drive.controller.model;

import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.service.model.ModelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ModelControllerTest {

    @InjectMocks
    private ModelController modelController;

    @Mock
    private ModelService modelService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //Erro: java.lang.IllegalArgumentException: Not enough variable values available to expand 'id'

    
    


    @Test
    @DisplayName("Should retrieve model details by ID")
    void testGetById() {
        DataModelDetails modelDetails = new DataModelDetails(1L, null, "Model Name", true);

        when(modelService.getModelById(1L)).thenReturn(modelDetails);

        ResponseEntity<DataModelDetails> response = modelController.getById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(modelDetails, response.getBody());
        verify(modelService, times(1)).getModelById(1L);
    }

    @Test
    @DisplayName("Should list all models with pagination")
    void testListAll() {
        DataModelDetails model = new DataModelDetails(1L, null, "Model Name", true);
        Page<DataModelDetails> page = new PageImpl<>(List.of(model));

        when(modelService.listAllModels(any(Pageable.class))).thenReturn(page);

        Pageable pageable = PageRequest.of(0, 10);
        ResponseEntity<Page<DataModelDetails>> response = modelController.listAll(null,pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
        verify(modelService, times(1)).listAllModels(any(Pageable.class));
    }

    @Test
    @DisplayName("Should update an existing model and return updated details")
    void testUpdate() {
        DataUpdateModel updateData = new DataUpdateModel("Updated Model", 1L);
        DataModelDetails updatedModel = new DataModelDetails(1L, null, "Updated Model", true);

        when(modelService.update(any(DataUpdateModel.class), eq(1L))).thenReturn(updatedModel);

        ResponseEntity<DataModelDetails> response = modelController.update(1L, updateData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedModel, response.getBody());
        verify(modelService, times(1)).update(any(DataUpdateModel.class), eq(1L));
    }

    @Test
    @DisplayName("Should activate a model and return no content status")
    void testActivate() {
        ResponseEntity<Void> response = modelController.activate(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(modelService, times(1)).activated(1L);
    }

    @Test
    @DisplayName("Should disable a model and return no content status")
    void testDisable() {
        ResponseEntity<Void> response = modelController.disable(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(modelService, times(1)).disable(1L);
    }

    @Test
    @DisplayName("Should enable a model and return no content status")
    void testEnable() {
        DataUpdateModel enableData = new DataUpdateModel("Enabled Model", null);

        ResponseEntity<Void> response = modelController.enable(1L, enableData);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(modelService, times(1)).enable(1L);
    }
    @Test
    @DisplayName("Test retrieving models by brand ID")
    void testListModelsByBrand() {
        Long brandId = 1L;
        Pageable pageable = Pageable.ofSize(10);
        Page<DataModelDetails> page = new PageImpl<>(Collections.singletonList(new DataModelDetails(1L, null, "Test Model", true)));
        
        when(modelService.listAllModelsByBrand(eq(brandId), any(Pageable.class))).thenReturn(page);
        
        ResponseEntity<Page<DataModelDetails>> response = modelController.listByBrand(brandId, pageable);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
    }
    
  


}
