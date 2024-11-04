package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Category;
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

class ValidationRegisterVehicle_Category_NotDisabledTest {

    @InjectMocks
    private ValidationRegisterVehicle_Category_NotDisabled validation;

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
    @DisplayName("Does not throw exception when category is enabled")
    void validate_DoesNotThrow_WhenCategoryIsActive() {
        // Configura o mock para retornar uma categoria ativa
        Category activeCategory = new Category();
        activeCategory.setActivated(true);

        when(categoryRepository.existsById(data.categoryId())).thenReturn(true);
        when(categoryRepository.getReferenceById(data.categoryId())).thenReturn(activeCategory);

        // Verifica que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validation.validate(data));
    }

    @Test
    @DisplayName("Should throw exception when category is disabled")
    void validate_ShouldThrowException_WhenCategoryIsDisabled() {
        // Simulação do repositório e mensagem de erro
        Category category = new Category();
        category.setActivated(false);
        when(categoryRepository.existsById(data.categoryId())).thenReturn(true);
        when(categoryRepository.getReferenceById(data.categoryId())).thenReturn(category);
        when(messageSource.getMessage("vehicle.register.category.disabled", null, Locale.getDefault()))
            .thenReturn("Category is disabled");

        // Validação e verificação de exceção
        assertThrows(ValidationException.class, () -> validation.validate(data));
    }
    
    @Test
    @DisplayName("Does not throw exception when category does not exist")
    void validate_DoesNotThrow_WhenCategoryDoesNotExist() {
        // Configura o mock para que a categoria não exista
        when(categoryRepository.existsById(data.categoryId())).thenReturn(false);

        // Verifica que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validation.validate(data));
    }
}
