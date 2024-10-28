package br.com.cepedi.e_drive.service.vehicle.validations.update;

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

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Locale;

public class ValidationUpdateVehicle_CategoryExistsTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateVehicle_CategoryExists validation;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should throw ValidationException when categoryId does not exist")
    void shouldThrowValidationExceptionWhenCategoryIdDoesNotExist() {
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

        // Simula que a categoria não existe
        when(categoryRepository.existsById(categoryId)).thenReturn(false);

        // Mock da mensagem de erro
        when(messageSource.getMessage("vehicle.update.category.not.found", null, Locale.getDefault()))
                .thenReturn("The provided category id does not exist");

        // Act & Assert
        ValidationException thrown = assertThrows(
                ValidationException.class,
                () -> validation.validate(data, categoryId),
                "Expected ValidationException to be thrown when categoryId does not exist"
        );

        // Assert
        assertEquals("The provided category id does not exist", thrown.getMessage());
    }

    @Test
    @DisplayName("Should not throw exception when categoryId exists")
    void shouldNotThrowExceptionWhenCategoryIdExists() {
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

        // Simula que a categoria existe
        when(categoryRepository.existsById(categoryId)).thenReturn(true);

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
