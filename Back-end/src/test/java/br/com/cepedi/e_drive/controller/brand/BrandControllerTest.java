package br.com.cepedi.e_drive.controller.brand;

import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.service.brand.BrandService;
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
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class BrandControllerTest {

    @Mock
    private BrandService brandService;

    @InjectMocks
    private BrandController brandController;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should register a new brand and return its details")
    void register_ShouldRegisterNewBrandAndReturnDetails() {
        DataRegisterBrand data = new DataRegisterBrand(faker.company().name());
        DataBrandDetails expectedBrandDetails = new DataBrandDetails(1L, data.name(), true);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();

        when(brandService.register(data)).thenReturn(expectedBrandDetails);

        ResponseEntity<DataBrandDetails> response = brandController.register(data, uriBuilder);

        URI expectedUri = URI.create("/api/v1/brands/1");
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedUri, response.getHeaders().getLocation());
        assertEquals(expectedBrandDetails, response.getBody());
        verify(brandService, times(1)).register(data);
    }

    @Test
    @DisplayName("Should retrieve a brand by ID")
    void getById_ShouldRetrieveBrandById() {
        Long brandId = 1L;
        DataBrandDetails expectedBrandDetails = new DataBrandDetails(brandId, faker.company().name(), true);

        when(brandService.getById(brandId)).thenReturn(expectedBrandDetails);

        ResponseEntity<DataBrandDetails> response = brandController.getById(brandId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedBrandDetails, response.getBody());
        verify(brandService, times(1)).getById(brandId);
    }

    @Test
    @DisplayName("Should retrieve a paginated list of all brands")
    void listAll_ShouldRetrievePaginatedListOfAllBrands() {
        // Arrange
        PageRequest pageable = PageRequest.of(0, 10);
        DataBrandDetails brand1 = new DataBrandDetails(1L, faker.company().name(), true);
        DataBrandDetails brand2 = new DataBrandDetails(2L, faker.company().name(), true);
        List<DataBrandDetails> brandsList = List.of(brand1, brand2);
        Page<DataBrandDetails> expectedPage = new PageImpl<>(brandsList, pageable, brandsList.size());

        when(brandService.listAll(pageable)).thenReturn(expectedPage);

        // Act
        ResponseEntity<Page<DataBrandDetails>> response = brandController.listAll(null, pageable);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedPage.getContent(), response.getBody().getContent());
        assertEquals(expectedPage.getTotalElements(), response.getBody().getTotalElements());
        assertEquals(expectedPage.getTotalPages(), response.getBody().getTotalPages());
        verify(brandService, times(1)).listAll(pageable);
    }


    @Test
    @DisplayName("Should update a brand and return its updated details")
    void update_ShouldUpdateBrandAndReturnUpdatedDetails() {
        Long brandId = 1L;
        DataUpdateBrand updateData = new DataUpdateBrand(faker.company().name());
        DataBrandDetails updatedBrandDetails = new DataBrandDetails(brandId, updateData.name(), true);

        when(brandService.update(updateData, brandId)).thenReturn(updatedBrandDetails);

        ResponseEntity<DataBrandDetails> response = brandController.update(brandId, updateData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedBrandDetails, response.getBody());
        verify(brandService, times(1)).update(updateData, brandId);
    }

    @Test
    @DisplayName("Should activate a brand by ID")
    void activate_ShouldActivateBrandById() {
        Long brandId = 1L;

        ResponseEntity<Void> response = brandController.activate(brandId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(brandService, times(1)).activated(brandId);
    }

    @Test
    @DisplayName("Should disable a brand by ID")
    void disable_ShouldDisableBrandById() {
        Long brandId = 1L;

        ResponseEntity<Void> response = brandController.disable(brandId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(brandService, times(1)).disabled(brandId);
    }
}
