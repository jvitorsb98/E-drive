package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ValidationRegisterModel_duplicate_dataTest {

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationRegisterModel_duplicate_data validationRegisterModelDuplicateData;

    private DataRegisterModel dataRegisterModel;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        dataRegisterModel = new DataRegisterModel("Novo Modelo", 1L);
    }

    @Test
    @DisplayName("Should throw ValidationException when model name already exists for the same brand")
    void shouldThrowValidationExceptionWhenModelNameExistsForSameBrand() {
        when(modelRepository.existsByNameIgnoreCaseAndBrandId("novo modelo", 1L)).thenReturn(true);
        when(brandRepository.findBrandNameById(1L)).thenReturn("Marca Teste");
        when(messageSource.getMessage(
                eq("model.register.duplicate"),
                eq(new Object[]{"Novo Modelo", "Marca Teste"}),
                eq(Locale.getDefault()))
        ).thenReturn("Modelo duplicado para a marca especificada.");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validationRegisterModelDuplicateData.validation(dataRegisterModel);
        });

        assert exception.getMessage().contains("Modelo duplicado para a marca especificada.");
        verify(modelRepository).existsByNameIgnoreCaseAndBrandId("novo modelo", 1L);
        verify(messageSource).getMessage("model.register.duplicate", new Object[]{"Novo Modelo", "Marca Teste"}, Locale.getDefault());
    }

    @Test
    @DisplayName("Should not throw exception for a model with unique name")
    void shouldNotThrowExceptionForUniqueModelName() {
        when(modelRepository.existsByNameIgnoreCaseAndBrandId("novo modelo", 1L)).thenReturn(false);

        assertDoesNotThrow(() -> validationRegisterModelDuplicateData.validation(dataRegisterModel));
        verify(modelRepository).existsByNameIgnoreCaseAndBrandId("novo modelo", 1L);
        verify(messageSource, never()).getMessage(anyString(), any(), any());
    }

    @Test
    @DisplayName("Should throw ValidationException when tag ID is not found")
    void shouldThrowValidationExceptionWhenBrandIdIsNotFound() {
        when(modelRepository.existsByNameIgnoreCaseAndBrandId("novo modelo", 1L)).thenReturn(true);
        when(brandRepository.findBrandNameById(1L)).thenReturn(null);
        when(messageSource.getMessage(
                eq("model.register.duplicate"),
                eq(new Object[]{"Novo Modelo", null}),
                eq(Locale.getDefault()))
        ).thenReturn("Marca não encontrada para o modelo duplicado.");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validationRegisterModelDuplicateData.validation(dataRegisterModel);
        });

        assert exception.getMessage().contains("Marca não encontrada para o modelo duplicado.");
        verify(modelRepository).existsByNameIgnoreCaseAndBrandId("novo modelo", 1L);
        verify(messageSource).getMessage("model.register.duplicate", new Object[]{"Novo Modelo", null}, Locale.getDefault());
    }
}
