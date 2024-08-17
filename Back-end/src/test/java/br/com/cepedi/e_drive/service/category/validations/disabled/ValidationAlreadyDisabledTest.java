package br.com.cepedi.e_drive.service.category.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationAlreadyDisabledTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ValidationAlreadyDisabled validationAlreadyDisabled;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validate - Category Already Disabled - Throws IllegalArgumentException")
    void validate_CategoryAlreadyDisabled_ThrowsIllegalArgumentException() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        Category category = new Category();
        category.setActivated(false); // Category is disabled

        when(categoryRepository.findById(categoryId)).thenReturn(java.util.Optional.of(category));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> validationAlreadyDisabled.validate(categoryId),
        		() ->"Expected validate() to throw IllegalArgumentException when category is already disabled");
    }

    @Test
    @DisplayName("Validate - Category Exists and Enabled - No Exception Thrown")
    void validate_CategoryExistsAndEnabled_NoExceptionThrown() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        Category category = new Category();
        category.setActivated(true); 

        when(categoryRepository.findById(categoryId)).thenReturn(java.util.Optional.of(category));

        // Act & Assert
        validationAlreadyDisabled.validate(categoryId); 
    }

    @Test
    @DisplayName("Validate - Category Does Not Exist - Throws IllegalArgumentException")
    void validate_CategoryDoesNotExist_ThrowsIllegalArgumentException() {
        // Arrange
        Long categoryId = faker.number().randomNumber();

        when(categoryRepository.findById(categoryId)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> validationAlreadyDisabled.validate(categoryId),
        		() -> "Expected validate() to throw IllegalArgumentException when category does not exist");
    }
}
