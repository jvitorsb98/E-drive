package br.com.cepedi.e_drive.service.category.validations.update;

import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.github.javafaker.Faker;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class ValidationExistsForUpdateTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MessageSource messageSource; // Mock para MessageSource

    @InjectMocks
    private ValidationExistsForUpdate validationExistsForUpdate;

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
        assertDoesNotThrow(() -> validationExistsForUpdate.validate(categoryId),
                "Expected validate() to not throw an exception when category exists");
    }

    @Test
    @DisplayName("Validate - Category Does Not Exist - Throws ValidationException")
    void validate_CategoryDoesNotExist_ThrowsValidationException() {
        // Arrange
        Long categoryId = faker.number().randomNumber();

        when(categoryRepository.existsById(categoryId)).thenReturn(false);
        when(messageSource.getMessage("category.update.not.found", new Object[]{categoryId}, Locale.getDefault()))
                .thenReturn("Category not found with ID: " + categoryId); // Simular a mensagem de erro

        // Act & Assert
        ValidationException thrownException = assertThrows(ValidationException.class,
                () -> validationExistsForUpdate.validate(categoryId),
                "Expected validate() to throw ValidationException when category does not exist");

        assertEquals("Category not found with ID: " + categoryId, thrownException.getMessage());
    }
}
