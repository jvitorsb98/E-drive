package br.com.cepedi.e_drive.controller.category;


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

import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.category.register.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import br.com.cepedi.e_drive.service.category.CategoryService;

import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
    void testRegister() {
        DataRegisterCategory data = new DataRegisterCategory("Category Name");
        DataCategoryDetails details = new DataCategoryDetails(1L, "Category Name", true);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();

        when(categoryService.register(data)).thenReturn(details);

        ResponseEntity<DataCategoryDetails> response = categoryController.register(data, uriBuilder);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(details, response.getBody());
        verify(categoryService, times(1)).register(data);
    }

    @Test
    void testGetCategoryById() {
        Long id = 1L;
        DataCategoryDetails categoryDetails = new DataCategoryDetails(id, "Category Name", true);

        when(categoryService.getById(id)).thenReturn(categoryDetails);

        ResponseEntity<DataCategoryDetails> response = categoryController.getById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(categoryDetails, response.getBody());
        verify(categoryService, times(1)).getById(id);
    }

    @Test
    void testDisable() {
        Long id = 1L;

        ResponseEntity<Void> response = categoryController.disabled(id);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(categoryService, times(1)).disabled(id);
    }

    @Test
    void testUpdate() {
        Long id = 1L;
        DataUpdateCategory data = new DataUpdateCategory("Updated Category Name");
        DataCategoryDetails updatedCategory = new DataCategoryDetails(id, "Updated Category Name", true);

        when(categoryService.update(data, id)).thenReturn(updatedCategory);

        ResponseEntity<DataCategoryDetails> response = categoryController.update(id, data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedCategory, response.getBody());
        verify(categoryService, times(1)).update(data, id);
    }

    @Test
    void testListAllCategories() {
        Page<DataCategoryDetails> categoryPage = new PageImpl<>(List.of(
                new DataCategoryDetails(1L, "Category 1", true),
                new DataCategoryDetails(2L, "Category 2", false)
        ));

        Pageable pageable = PageRequest.of(0, 10);

        when(categoryService.listAll(pageable)).thenReturn(categoryPage);

        ResponseEntity<Page<DataCategoryDetails>> response = categoryController.listAll(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(categoryPage, response.getBody());
        assertEquals(2, response.getBody().getTotalElements());
        assertEquals("Category 1", response.getBody().getContent().get(0).name());

        verify(categoryService, times(1)).listAll(pageable);
    }

    @Test
    void testListCategoriesByName() {
        String name = "Category";
        Page<DataCategoryDetails> categoryPage = new PageImpl<>(List.of(
                new DataCategoryDetails(1L, "Category 1", true),
                new DataCategoryDetails(2L, "Category 2", false)
        ));

        Pageable pageable = PageRequest.of(0, 10);

        when(categoryService.listByName(name, pageable)).thenReturn(categoryPage);

        ResponseEntity<Page<DataCategoryDetails>> response = categoryController.listByName(name, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(categoryPage, response.getBody());
        assertEquals(2, response.getBody().getTotalElements());
        assertEquals("Category 1", response.getBody().getContent().get(0).name());

        verify(categoryService, times(1)).listByName(name, pageable);
    }
}
