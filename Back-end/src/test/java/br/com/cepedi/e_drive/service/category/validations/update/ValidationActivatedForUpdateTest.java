package br.com.cepedi.e_drive.service.category.validations.update;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationActivatedForUpdateTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ValidationActivatedForUpdate validationActivatedForUpdate;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validate - Category is Not Activated - Throws ValidationException")
    void validate_CategoryNotActivated_ThrowsValidationException() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        Category category = new Category();
        category.setActivated(false); 

        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.getReferenceById(categoryId)).thenReturn(category);

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationActivatedForUpdate.validate(categoryId),
        		() ->"Expected validate() to throw ValidationException when category is not activated");
    }

    @Test
    @DisplayName("Validate - Category is Activated - No Exception Thrown")
    void validate_CategoryActivated_NoExceptionThrown() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        Category category = new Category();
        category.setActivated(true); // Category is activated

        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.getReferenceById(categoryId)).thenReturn(category);

        // Act & Assert
        validationActivatedForUpdate.validate(categoryId); 
    }

    @Test
    @DisplayName("Validate - Category Is Not Activated - Throws ValidationException")
    void validate_CategoryIsNotActivated_ThrowsValidationException() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        Category category = new Category();
        category.setActivated(false);

        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.getReferenceById(categoryId)).thenReturn(category);

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
            () -> validationActivatedForUpdate.validate(categoryId),
            "Expected validate() to throw ValidationException when category is not activated");
        
        assertEquals("The required category is not activated.", thrownException.getMessage());
    }
}
