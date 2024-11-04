package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.repository.VehicleRepository;
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

class ValidationRegisterVehicle_duplicate_dataTest {

    @InjectMocks
    private ValidationRegisterVehicle_duplicate_data validation;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private ModelRepository modelRepository;

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
    @DisplayName("Throws exception when there is already a registered vehicle with the same version")
    void validate_ShouldThrowException_WhenVehicleWithSameVersionExists() {
        // Configura o mock para que já exista um veículo com a mesma versão
        when(vehicleRepository.existsByModelIdAndVersionIgnoreCase(data.modelId(), data.version())).thenReturn(true);

        // Configura o mock do modelo para retornar um modelo válido
        Model model = new Model();
        model.setName("Model Name");
        Brand brand = new Brand();
        brand.setName("Brand Name");
        model.setBrand(brand);
        when(modelRepository.getReferenceById(data.modelId())).thenReturn(model);

        // Configura a mensagem de erro
        when(messageSource.getMessage("vehicle.register.version.duplicate", 
                new Object[]{brand.getName(), model.getName(), data.version()}, Locale.getDefault()))
                .thenReturn("A vehicle with the same version already exists.");

        // Verifica que a exceção é lançada com a mensagem esperada
        ValidationException exception = assertThrows(ValidationException.class, () -> validation.validate(data));
        assert(exception.getMessage().contains("A vehicle with the same version already exists."));
    }

    @Test
    @DisplayName("Does not throw exception when there is no vehicle with the same version")
    void validate_DoesNotThrow_WhenNoVehicleWithSameVersionExists() {
        // Configura o mock para que não exista um veículo com a mesma versão
        when(vehicleRepository.existsByModelIdAndVersionIgnoreCase(data.modelId(), data.version())).thenReturn(false);

        // Verifica que nenhuma exceção é lançada
        assertDoesNotThrow(() -> validation.validate(data));
    }
}
