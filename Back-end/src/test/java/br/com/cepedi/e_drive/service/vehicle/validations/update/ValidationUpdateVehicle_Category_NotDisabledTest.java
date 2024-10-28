package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import java.util.Locale;

public class ValidationUpdateVehicle_Category_NotDisabledTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateVehicle_Category_NotDisabled validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();

        when(messageSource.getMessage("vehicle.update.category.disabled", null, Locale.getDefault()))
                .thenReturn("The provided category ID is disabled");
    }

    @Test
    @DisplayName("Should throw ValidationException when categoryId exists but is disabled")
    void shouldThrowValidationExceptionWhenCategoryIdExistsButIsDisabled() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
                faker.lorem().word(), // motor
                faker.lorem().word(), // version
                faker.number().randomNumber(), // modelId
                categoryId, // categoryId
                faker.number().randomNumber(), // typeId
                faker.number().randomNumber(), // brandId
                faker.number().randomNumber(), // propulsionId
                faker.number().randomNumber(), // year
                null // dataRegisterAutonomy
        );

        Category category = new Category();
        category.setActivated(false);

        // Simula que a categoria existe e está desativada
        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.getReferenceById(categoryId)).thenReturn(category);

        // Act & Assert
        ValidationException thrown = assertThrows(
                ValidationException.class,
                () -> validation.validate(data, categoryId),
                "Expected ValidationException to be thrown when category is disabled"
        );

        // Verifica a mensagem da exceção
        assertEquals("The provided category ID is disabled", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw ValidationException when categoryId exists and is enabled")
    void shouldNotThrowExceptionWhenCategoryIdExistsAndIsEnabled() {
        // Arrange
        Long categoryId = faker.number().randomNumber();
        DataUpdateVehicle data = new DataUpdateVehicle(
                faker.lorem().word(), // motor
                faker.lorem().word(), // version
                faker.number().randomNumber(), // modelId
                categoryId, // categoryId
                faker.number().randomNumber(), // typeId
                faker.number().randomNumber(), // brandId
                faker.number().randomNumber(), // propulsionId
                faker.number().randomNumber(), // year
                null // dataRegisterAutonomy
        );

        Category category = new Category();
        category.setActivated(true);

        // Simula que a categoria existe e está ativada
        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.getReferenceById(categoryId)).thenReturn(category);

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data, categoryId));
    }

    @Test
    @DisplayName("Should not throw exception when categoryId is null")
    void shouldNotThrowExceptionWhenCategoryIdIsNull() {
        // Arrange
        DataUpdateVehicle data = new DataUpdateVehicle(
                faker.lorem().word(), // motor
                faker.lorem().word(), // version
                faker.number().randomNumber(), // modelId
                null, // categoryId
                faker.number().randomNumber(), // typeId
                faker.number().randomNumber(), // brandId
                faker.number().randomNumber(), // propulsionId
                faker.number().randomNumber(), // year
                null // dataRegisterAutonomy
        );

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data, null));
    }
}
