package br.com.cepedi.e_drive.service.category.validations.disabled;

import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

public class ValidationCategoryExistsTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ValidationCategoryExists validationCategoryExists;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Validate - Category Exists - No Exception Thrown")
    void validate_CategoryExists_NoExceptionThrown() {
        // Arrange
        Long categoryId = faker.number().randomNumber();

        when(categoryRepository.existsById(categoryId)).thenReturn(true);

        // Act & Assert
        assertDoesNotThrow(() -> validationCategoryExists.validate(categoryId),
        		() ->"Expected validate() to not throw an exception when category exists");
    }

    @Test
    @DisplayName("Validate - Category Does Not Exist - Throws IllegalArgumentException")
    void validate_CategoryDoesNotExist_ThrowsIllegalArgumentException() {
        // Arrange
        Long categoryId = faker.number().randomNumber();

        when(categoryRepository.existsById(categoryId)).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> validationCategoryExists.validate(categoryId),
        		() -> "Expected validate() to throw IllegalArgumentException when category does not exist");
    }
}
