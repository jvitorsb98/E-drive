package br.com.cepedi.e_drive.service.category;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.category.register.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import br.com.cepedi.e_drive.service.category.validations.disabled.CategoryValidatorDisabled;
import br.com.cepedi.e_drive.service.category.validations.update.CategoryValidatorUpdate;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@DisplayName("CategoryService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CategoryServiceTest {

    @InjectMocks
    private CategoryService categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private List<CategoryValidatorDisabled> categoryValidatorDisabledList;

    @Mock
    private List<CategoryValidatorUpdate> categoryValidatorUpdateList;

    private Faker faker;
    private DataRegisterCategory dataRegisterCategory;
    private DataUpdateCategory dataUpdateCategory;
    private Category category;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();

        // Arrange: Initialize test data
        dataRegisterCategory = new DataRegisterCategory(faker.commerce().department());
        dataUpdateCategory = new DataUpdateCategory(faker.commerce().department());

        category = new Category(dataRegisterCategory);
        category.setId(faker.number().randomNumber());
        category.setActivated(true);
    }

    @Test
    @DisplayName("Should register a category successfully")
    void register_ValidData_CategoryRegistered() {
        // Arrange
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        // Act
        DataCategoryDetails result = categoryService.register(dataRegisterCategory);

        // Assert
        ArgumentCaptor<Category> categoryCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository).save(categoryCaptor.capture());
        Category capturedCategory = categoryCaptor.getValue();

        assertAll("Category registration",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(dataRegisterCategory.name(), capturedCategory.getName(), 
                () -> "Category name should match the input data"),
            () -> verify(categoryRepository, times(1)).save(any(Category.class))
        );
    }

    @Test
    @DisplayName("Should list all categories")
    void listAll_CategoriesReturned() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<Category> categoryPage = new PageImpl<>(List.of(category));
        when(categoryRepository.findAll(pageRequest)).thenReturn(categoryPage);

        // Act
        Page<DataCategoryDetails> result = categoryService.listAll(pageRequest);

        // Assert
        assertAll("List all categories",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(1, result.getTotalElements(), 
                () -> "Total elements should match the expected number of categories"),
            () -> verify(categoryRepository, times(1)).findAll(pageRequest)
        );
    }

    @Test
    @DisplayName("Should list all deactivated categories")
    void listAllDeactivated_CategoriesReturned() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<Category> categoryPage = new PageImpl<>(List.of(category));
        when(categoryRepository.findAllByActivatedFalse(pageRequest)).thenReturn(categoryPage);

        // Act
        Page<DataCategoryDetails> result = categoryService.listAllDeactivated(pageRequest);

        // Assert
        assertAll("List all deactivated categories",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(1, result.getTotalElements(), 
                () -> "Total elements should match the expected number of deactivated categories"),
            () -> verify(categoryRepository, times(1)).findAllByActivatedFalse(pageRequest)
        );
    }

    @Test
    @DisplayName("Should list categories by name")
    void listByName_CategoriesReturned() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<Category> categoryPage = new PageImpl<>(List.of(category));
        when(categoryRepository.findByNameContaining(anyString(), eq(pageRequest))).thenReturn(categoryPage);

        // Act
        Page<DataCategoryDetails> result = categoryService.listByName(category.getName(), pageRequest);

        // Assert
        assertAll("List categories by name",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(1, result.getTotalElements(), 
                () -> "Total elements should match the expected number of categories by name"),
            () -> verify(categoryRepository, times(1)).findByNameContaining(anyString(), eq(pageRequest))
        );
    }

    @Test
    @DisplayName("Should get category by ID successfully")
    void getById_ExistingId_CategoryReturned() {
        // Arrange
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));

        // Act
        DataCategoryDetails result = categoryService.getById(category.getId());

        // Assert
        assertAll("Get category by ID",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(category.getName(), result.name(), 
                () -> "Returned category name should match the expected name"),
            () -> verify(categoryRepository, times(1)).findById(anyLong())
        );
    }

    @Test
    @DisplayName("Should throw exception when category not found by ID")
    void getById_NonExistingId_ThrowsException() {
        // Arrange
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> categoryService.getById(category.getId()), 
            () -> "Expected an exception to be thrown when category is not found"
        );
        verify(categoryRepository, times(1)).findById(anyLong());
    }

    @Test
    @DisplayName("Should update a category successfully")
    void update_ValidData_CategoryUpdated() {
        // Arrange
        when(categoryRepository.getReferenceById(anyLong())).thenReturn(category);

        // Act
        DataCategoryDetails result = categoryService.update(dataUpdateCategory, category.getId());

        // Assert
        assertAll("Category update",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(dataUpdateCategory.name(), result.name(), 
                () -> "Updated category name should match the input data"),
            () -> verify(categoryValidatorUpdateList, times(1)).forEach(any()),
            () -> verify(categoryRepository, times(1)).getReferenceById(anyLong())
        );
    }

    @Test
    @DisplayName("Should disable a category successfully")
    void disable_ValidId_CategoryDisabled() {
        // Arrange
        when(categoryRepository.getReferenceById(anyLong())).thenReturn(category);

        // Act
        categoryService.disabled(category.getId());

        // Assert
        assertAll("Disable category",
            () -> verify(categoryValidatorDisabledList, times(1)).forEach(any()),
            () -> verify(categoryRepository, times(1)).getReferenceById(anyLong()),
            () -> assertFalse(category.getActivated(), "Category should be deactivated")
        );
    }
}
