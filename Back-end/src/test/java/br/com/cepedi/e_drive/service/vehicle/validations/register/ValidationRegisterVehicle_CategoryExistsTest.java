package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import java.math.BigDecimal;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ValidationRegisterVehicle_CategoryExistsTest {

    @InjectMocks
    private ValidationRegisterVehicle_CategoryExists validation;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MessageSource messageSource;

    private DataRegisterVehicle data;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Inicializa data com valores padrão
        DataRegisterAutonomy autonomy = new DataRegisterAutonomy(
                BigDecimal.valueOf(10), BigDecimal.valueOf(20), BigDecimal.valueOf(30), BigDecimal.valueOf(40), BigDecimal.valueOf(50)
        );
        data = new DataRegisterVehicle("motor", "version", 1L, 1L, 1L, 1L, 2023L, autonomy);
    }

    @Test
    @DisplayName("Lança exceção quando a categoria não existe")
    void validate_ShouldThrowException_WhenCategoryDoesNotExist() {
        // Configura o mock para que a categoria não exista
        when(categoryRepository.existsById(data.categoryId())).thenReturn(false);
        when(messageSource.getMessage("vehicle.register.category.not.found", null, Locale.getDefault()))
                .thenReturn("Category not found");

        // Verifica que a exceção é lançada com a mensagem esperada
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(data));
        verify(messageSource).getMessage("vehicle.register.category.not.found", null, Locale.getDefault());
        assert(exception.getMessage().contains("Category not found"));
    }

    @Test
    @DisplayName("Não lança exceção quando a categoria existe")
    void validate_DoesNotThrow_WhenCategoryExists() {
        // Configura o mock para que a categoria exista
        when(categoryRepository.existsById(data.categoryId())).thenReturn(true);

        // Verifica que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validation.validate(data));
    }
}
