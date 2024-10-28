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
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class ValidationAlreadyDisabledTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

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

        // Simular a mensagem de erro que será lançada
        when(messageSource.getMessage("category.disabled.already.disabled", new Object[]{categoryId}, Locale.getDefault()))
                .thenReturn("Category is already disabled");

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> validationAlreadyDisabled.validate(categoryId),
                () -> "Expected validate() to throw IllegalArgumentException when category is already disabled");
    }

    @Test
    @DisplayName("Validate - Category Exists and Enabled - No Exception Thrown")
    void validate_CategoryExistsAndEnabled_NoExceptionThrown() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        Category category = new Category();
        category.setActivated(true); // Category is enabled

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

        // Simular a mensagem de erro que será lançada
        when(messageSource.getMessage("category.disabled.not.found", new Object[]{categoryId}, Locale.getDefault()))
                .thenReturn("Category not found");

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> validationAlreadyDisabled.validate(categoryId),
                () -> "Expected validate() to throw IllegalArgumentException when category does not exist");
    }
}
