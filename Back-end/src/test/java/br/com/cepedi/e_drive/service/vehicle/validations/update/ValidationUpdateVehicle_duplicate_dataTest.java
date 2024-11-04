package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ValidationUpdateVehicle_duplicate_dataTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ValidationUpdateVehicle_duplicate_data validationUpdateVehicle;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void validate_ThrowsValidationException_WhenDuplicateVehicleExists() {
        // Arrange
        Long modelId = 1L;
        Long vehicleId = 2L;
        String version = "1.0";
        String motor = "V8";
        Long year = (long) 2021;
        
        // Aqui você pode passar null para os parâmetros que não são necessários
        DataUpdateVehicle data = new DataUpdateVehicle(motor, version, modelId, null, null, null, null, year, null);

        Model model = new Model();
        Brand brand = new Brand();
        brand.setName("TestBrand");
        model.setBrand(brand);
        model.setName("TestModel");

        when(vehicleRepository.existsByModelIdAndVersionIgnoreCaseAndIdNot(modelId, version, vehicleId)).thenReturn(true);
        when(modelRepository.getReferenceById(modelId)).thenReturn(model);
        when(messageSource.getMessage(anyString(), any(), eq(Locale.getDefault()))).thenReturn("Duplicate version error message");

        // Act & Assert
        assertThrows(ValidationException.class, () -> validationUpdateVehicle.validate(data, vehicleId));

        // Verify interactions
        verify(vehicleRepository).existsByModelIdAndVersionIgnoreCaseAndIdNot(modelId, version, vehicleId);
        verify(messageSource).getMessage("vehicle.update.version.duplicate", new Object[]{"TestBrand", "TestModel", version}, Locale.getDefault());
    }


    @Test
    void validate_DoesNotThrowException_WhenNoDuplicateVehicleExists() {
        // Arrange
        Long modelId = 1L;
        Long vehicleId = 2L;
        String version = "1.0";
        String motor = "V8";
        Long year = (long) 2021;

        // Aqui você pode passar null para os parâmetros que não são necessários
        DataUpdateVehicle data = new DataUpdateVehicle(motor, version, modelId, null, null, null, null, year, null);

        when(vehicleRepository.existsByModelIdAndVersionIgnoreCaseAndIdNot(modelId, version, vehicleId)).thenReturn(false);

        // Act & Assert
        assertDoesNotThrow(() -> validationUpdateVehicle.validate(data, vehicleId));

        // Verify that messageSource was not called
        verify(messageSource, never()).getMessage(anyString(), any(), any(Locale.class));
    }

}
