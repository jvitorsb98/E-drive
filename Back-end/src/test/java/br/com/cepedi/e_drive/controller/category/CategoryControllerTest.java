package br.com.cepedi.e_drive.controller.category;

import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.category.register.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import br.com.cepedi.e_drive.service.category.CategoryService;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CategoryControllerTest {

    @InjectMocks
    private CategoryController categoryController;

    @Mock
    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Register a new category")
    void testRegister() {
        DataRegisterCategory registerData = new DataRegisterCategory("Category Name");
        DataCategoryDetails categoryDetails = new DataCategoryDetails(1L, "Category Name", true);

        when(categoryService.register(any(DataRegisterCategory.class))).thenReturn(categoryDetails);
        
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();
        ResponseEntity<DataCategoryDetails> response = categoryController.register(registerData, uriBuilder);

        assertEquals(HttpStatus.CREATED, response.getStatusCode(), "Expected status code to be CREATED");
        assertEquals(categoryDetails, response.getBody(), "Expected response body to match the created category details");
        verify(categoryService, times(1)).register(any(DataRegisterCategory.class));
    }

    @Test
    @DisplayName("List all categories")
    void testListAll() {
        DataCategoryDetails category = new DataCategoryDetails(1L, "Category", true);
        Page<DataCategoryDetails> page = new PageImpl<>(List.of(category));

        when(categoryService.listAll(any(Pageable.class))).thenReturn(page);

        Pageable pageable = PageRequest.of(0, 10);
        ResponseEntity<Page<DataCategoryDetails>> response = categoryController.listAll(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Expected status code to be OK");
        assertEquals(page, response.getBody(), "Expected response body to match the list of categories");
        verify(categoryService, times(1)).listAll(any(Pageable.class));
    }

    @Test
    @DisplayName("List all deactivated categories")
    void testListAllDeactivated() {
        DataCategoryDetails category = new DataCategoryDetails(1L, "Category", false);
        Page<DataCategoryDetails> page = new PageImpl<>(List.of(category));

        when(categoryService.listAllDeactivated(any(Pageable.class))).thenReturn(page);

        Pageable pageable = PageRequest.of(0, 10);
        ResponseEntity<Page<DataCategoryDetails>> response = categoryController.listAllDeactivated(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Expected status code to be OK");
        assertEquals(page, response.getBody(), "Expected response body to match the list of deactivated categories");
        verify(categoryService, times(1)).listAllDeactivated(any(Pageable.class));
    }

    @Test
    @DisplayName("List categories by name")
    void testListByName() {
        DataCategoryDetails category = new DataCategoryDetails(1L, "Category", true);
        Page<DataCategoryDetails> page = new PageImpl<>(List.of(category));

        when(categoryService.listByName(anyString(), any(Pageable.class))).thenReturn(page);

        Pageable pageable = PageRequest.of(0, 10);
        ResponseEntity<Page<DataCategoryDetails>> response = categoryController.listByName("Category", pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Expected status code to be OK");
        assertEquals(page, response.getBody(), "Expected response body to match the list of categories by name");
        verify(categoryService, times(1)).listByName(anyString(), any(Pageable.class));
    }

    @Test
    @DisplayName("Get category by ID")
    void testGetById() {
        DataCategoryDetails categoryDetails = new DataCategoryDetails(1L, "Category", true);

        when(categoryService.getById(1L)).thenReturn(categoryDetails);

        ResponseEntity<DataCategoryDetails> response = categoryController.getById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Expected status code to be OK");
        assertEquals(categoryDetails, response.getBody(), "Expected response body to match the category details");
        verify(categoryService, times(1)).getById(1L);
    }

    @Test
    @DisplayName("Update existing category")
    void testUpdate() {
        DataUpdateCategory updateData = new DataUpdateCategory("Updated Category");
        DataCategoryDetails updatedCategory = new DataCategoryDetails(1L, "Updated Category", true);

        when(categoryService.update(any(DataUpdateCategory.class), eq(1L))).thenReturn(updatedCategory);

        ResponseEntity<DataCategoryDetails> response = categoryController.update(1L, updateData);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Expected status code to be OK");
        assertEquals(updatedCategory, response.getBody(), "Expected response body to match the updated category details");
        verify(categoryService, times(1)).update(any(DataUpdateCategory.class), eq(1L));
    }

    @Test
    @DisplayName("Disable a category")
    void testDisable() {
        ResponseEntity<Void> response = categoryController.disabled(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode(), "Expected status code to be NO CONTENT");
        verify(categoryService, times(1)).disabled(1L);
    }
}
