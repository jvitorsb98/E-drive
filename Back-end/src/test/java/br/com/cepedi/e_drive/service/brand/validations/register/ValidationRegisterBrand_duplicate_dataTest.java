package br.com.cepedi.e_drive.service.brand.validations.register;

import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValidationRegisterBrand_duplicate_dataTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationRegisterBrand_duplicate_data validationRegisterBrand;

    private DataRegisterBrand dataRegisterBrand;

    @BeforeEach
    void setUp() {
        // Configuração do DataRegisterBrand com um nome padrão
        dataRegisterBrand = new DataRegisterBrand("BrandName"); // Ajuste o construtor conforme necessário
    }

    @Test
    void validation_DoesNotThrow_WhenBrandDoesNotExist() {
        // Arrange
        when(brandRepository.existsByNameIgnoreCase("BrandName")).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validationRegisterBrand.validation(dataRegisterBrand));
    }

    @Test
    void validation_ThrowsValidationException_WhenBrandExists() {
        // Arrange
        when(brandRepository.existsByNameIgnoreCase("BrandName")).thenReturn(true);
        when(messageSource.getMessage("brand.register.duplicate", new Object[]{"BrandName"}, Locale.getDefault()))
                .thenReturn("A brand with this name already exists: BrandName");

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> 
            validationRegisterBrand.validation(dataRegisterBrand)
        );

        assertEquals("A brand with this name already exists: BrandName", exception.getMessage());
    }
}
