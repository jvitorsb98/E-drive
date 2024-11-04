package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ValidationUpdateBrand_duplicate_dataTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateBrand_duplicate_data validationUpdateBrand;

    private final Long brandId = 1L;
    private final String existingBrandName = "Existing Brand";
    private final String updatedBrandName = "Updated Brand";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw ValidationException when updating brand with an existing name")
    void shouldThrowExceptionWhenUpdatingBrandWithExistingName() {
        DataUpdateBrand dataUpdateBrand = new DataUpdateBrand(updatedBrandName);
        
        // Mocking
        when(brandRepository.getReferenceById(brandId)).thenReturn(new Brand(brandId, existingBrandName, true));
        when(brandRepository.existsByNameIgnoreCaseAndIdNot(updatedBrandName.trim(), brandId)).thenReturn(true);
        when(messageSource.getMessage("brand.update.duplicate", new Object[]{updatedBrandName}, Locale.getDefault()))
            .thenReturn("Brand name already exists.");

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validationUpdateBrand.validation(brandId, dataUpdateBrand);
        });
        assertEquals("Brand name already exists.", exception.getMessage());

        verify(brandRepository).existsByNameIgnoreCaseAndIdNot(updatedBrandName.trim(), brandId);
    }

    @Test
    @DisplayName("Should not throw exception when updating brand with the same name")
    void shouldNotThrowExceptionWhenUpdatingBrandWithSameName() {
        DataUpdateBrand dataUpdateBrand = new DataUpdateBrand(existingBrandName);

        // Mocking
        when(brandRepository.getReferenceById(brandId)).thenReturn(new Brand(brandId, existingBrandName, true));

        // Act & Assert
        assertDoesNotThrow(() -> validationUpdateBrand.validation(brandId, dataUpdateBrand));

        verify(brandRepository, never()).existsByNameIgnoreCaseAndIdNot(anyString(), anyLong());
    }

    @Test
    @DisplayName("Should not throw exception when updating brand with a unique name")
    void shouldNotThrowExceptionWhenUpdatingBrandWithUniqueName() {
        DataUpdateBrand dataUpdateBrand = new DataUpdateBrand(updatedBrandName);

        // Mocking
        when(brandRepository.getReferenceById(brandId)).thenReturn(new Brand(brandId, existingBrandName, true));
        when(brandRepository.existsByNameIgnoreCaseAndIdNot(updatedBrandName.trim(), brandId)).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validationUpdateBrand.validation(brandId, dataUpdateBrand));

        verify(brandRepository).existsByNameIgnoreCaseAndIdNot(updatedBrandName.trim(), brandId);
    }
}
