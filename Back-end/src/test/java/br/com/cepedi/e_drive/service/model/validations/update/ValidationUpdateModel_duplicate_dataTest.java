package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ValidationUpdateModel_duplicate_dataTest {

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateModel_duplicate_data validation;

    private DataUpdateModel dataUpdateModel;

    @BeforeEach
    void setUp() {
        dataUpdateModel = new DataUpdateModel("Novo Modelo", 1L); // Supondo que idBrand seja 1L
    }

    @Test
    @DisplayName("Should throw ValidationException when a duplicate model is found")
    void shouldThrowValidationExceptionWhenDuplicateModelIsFound() {
        String errorMessage = "Modelo 'Novo Modelo' já existe para a marca 'Marca Teste'.";

        when(modelRepository.existsByNameIgnoreCaseAndBrandId("novo modelo", 1L)).thenReturn(true);
        when(brandRepository.findBrandNameById(1L)).thenReturn("Marca Teste");
        when(messageSource.getMessage(
                eq("model.update.duplicate"),
                any(Object[].class),
                eq(Locale.getDefault()))
        ).thenReturn(errorMessage);

        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validation(dataUpdateModel, 2L));

        verify(modelRepository).existsByNameIgnoreCaseAndBrandId("novo modelo", 1L);
        verify(brandRepository).findBrandNameById(1L);
        verify(messageSource).getMessage(
                eq("model.update.duplicate"),
                eq(new Object[]{"Novo Modelo", "Marca Teste"}),
                eq(Locale.getDefault())
        );

        // Verifica a mensagem de erro
        assert exception.getMessage().contains("Modelo 'Novo Modelo' já existe para a marca 'Marca Teste'.");
    }

    @Test
    @DisplayName("Should not throw exception when there is no duplication")
    void shouldNotThrowExceptionWhenNoDuplicateIsFound() {
        when(modelRepository.existsByNameIgnoreCaseAndBrandId("novo modelo", 1L)).thenReturn(false);

        assertDoesNotThrow(() -> validation.validation(dataUpdateModel, 2L));

        verify(modelRepository).existsByNameIgnoreCaseAndBrandId("novo modelo", 1L);
        verify(brandRepository, never()).findBrandNameById(any());
        verify(messageSource, never()).getMessage(anyString(), any(), any());
    }


}
