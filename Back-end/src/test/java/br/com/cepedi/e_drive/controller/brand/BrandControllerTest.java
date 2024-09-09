package br.com.cepedi.e_drive.controller.brand;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.net.URI;
import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.service.brand.BrandService;

class BrandControllerTest {

    @InjectMocks
    private BrandController brandController;

    @Mock
    private BrandService brandService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister() {
        DataRegisterBrand dataRegisterBrand = new DataRegisterBrand("Test Brand");
        DataBrandDetails dataBrandDetails = new DataBrandDetails(1L, "Test Brand", false);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();

        when(brandService.register(any(DataRegisterBrand.class))).thenReturn(dataBrandDetails);

        ResponseEntity<DataBrandDetails> response = brandController.register(dataRegisterBrand, uriBuilder);

        assertEquals(ResponseEntity.created(URI.create("/api/v1/brands/1")).body(dataBrandDetails), response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(dataBrandDetails, response.getBody());
        verify(brandService, times(1)).register(dataRegisterBrand);
    }

    @Test
    void testUpdate() {
        Long id = 1L;
        DataUpdateBrand dataUpdateBrand = new DataUpdateBrand("Updated Brand");
        DataBrandDetails updatedBrandDetails = new DataBrandDetails(id, "Updated Brand", false);

        when(brandService.update(any(DataUpdateBrand.class), any(Long.class))).thenReturn(updatedBrandDetails);

        ResponseEntity<DataBrandDetails> response = brandController.update(id, dataUpdateBrand);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedBrandDetails, response.getBody());
        verify(brandService, times(1)).update(dataUpdateBrand, id);
    }


    @Test
    void testGetBrandById() {
        Long id = 1L;
        DataBrandDetails dataBrandDetails = new DataBrandDetails(id, "Test Brand", false);

        when(brandService.getById(id)).thenReturn(dataBrandDetails);

        ResponseEntity<DataBrandDetails> response = brandController.getById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dataBrandDetails, response.getBody());
        verify(brandService, times(1)).getById(id);
    }
    
    @Test
    void testListAllBrands() {
        PageRequest pageable = PageRequest.of(0, 10);
        DataBrandDetails dataBrandDetails1 = new DataBrandDetails(1L, "Test Brand 1", false);
        DataBrandDetails dataBrandDetails2 = new DataBrandDetails(2L, "Test Brand 2", false);
        Page<DataBrandDetails> page = new PageImpl<>(Arrays.asList(dataBrandDetails1, dataBrandDetails2));

        when(brandService.listAll(pageable)).thenReturn(page);

        ResponseEntity<Page<DataBrandDetails>> response = brandController.listAll(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());
        verify(brandService, times(1)).listAll(pageable);
    }
    
   
    
    @Test
    void testDisable() {
        Long id = 1L;

        ResponseEntity<Void> response = brandController.disable(id);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(brandService, times(1)).disabled(id);
    }
}
