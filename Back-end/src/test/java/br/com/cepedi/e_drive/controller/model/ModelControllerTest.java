package br.com.cepedi.e_drive.controller.model;

import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.service.model.ModelService;
import org.junit.jupiter.api.BeforeEach;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ModelControllerTest {

    @Mock
    private ModelService modelService;

    @InjectMocks
    private ModelController modelController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterModel() {
        // Arrange
        DataRegisterModel data = new DataRegisterModel("ModelName", 1L);
        DataModelDetails modelDetails = new DataModelDetails(1L, null, "ModelName", true);
        when(modelService.register(any(DataRegisterModel.class))).thenReturn(modelDetails);

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();

        // Act
        ResponseEntity<DataModelDetails> response = modelController.register(data, uriBuilder);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(modelDetails, response.getBody());
        verify(modelService).register(data);
    }

    @Test
    void testGetModelById() {
        // Arrange
        Long id = 1L;
        DataModelDetails modelDetails = new DataModelDetails(id, null, "ModelName", true);
        when(modelService.getModelById(id)).thenReturn(modelDetails);

        // Act
        ResponseEntity<DataModelDetails> response = modelController.getById(id);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(modelDetails, response.getBody());
        verify(modelService).getModelById(id);
    }

    @Test
    void testListAllModels() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        DataModelDetails modelDetails = new DataModelDetails(1L, null, "ModelName", true);
        Page<DataModelDetails> page = new PageImpl<>(Collections.singletonList(modelDetails), pageable, 1);
        when(modelService.listAllModels(pageable)).thenReturn(page);

        // Act
        ResponseEntity<Page<DataModelDetails>> response = modelController.listAll(pageable);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
        verify(modelService).listAllModels(pageable);
    }

    @Test
    void testUpdateModel() {
        // Arrange
        Long id = 1L;
        DataUpdateModel data = new DataUpdateModel("UpdatedModelName", id);
        DataModelDetails updatedModel = new DataModelDetails(id, null, "UpdatedModelName", true);
        when(modelService.update(data, id)).thenReturn(updatedModel);

        // Act
        ResponseEntity<DataModelDetails> response = modelController.update(id, data);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedModel, response.getBody());
        verify(modelService).update(data, id);
    }

    @Test
    void testListModelsByBrand() {
        // Arrange
        Long brandId = 1L;
        Pageable pageable = PageRequest.of(0, 10);
        DataModelDetails modelDetails = new DataModelDetails(1L, null, "ModelName", true);
        Page<DataModelDetails> page = new PageImpl<>(Collections.singletonList(modelDetails), pageable, 1);
        when(modelService.listAllModelsByBrand(brandId, pageable)).thenReturn(page);

        // Act
        ResponseEntity<Page<DataModelDetails>> response = modelController.listByBrand(brandId, pageable);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
        verify(modelService).listAllModelsByBrand(brandId, pageable);
    }

    @Test
    void testActivateModel() {
        // Arrange
        Long id = 1L;
        doNothing().when(modelService).activated(id);

        // Act
        ResponseEntity<Void> response = modelController.activate(id);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(modelService).activated(id);
    }

    @Test
    void testDisableModel() {
        // Arrange
        Long id = 1L;
        doNothing().when(modelService).disable(id);

        // Act
        ResponseEntity<Void> response = modelController.disable(id);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(modelService).disable(id);
    }
}
