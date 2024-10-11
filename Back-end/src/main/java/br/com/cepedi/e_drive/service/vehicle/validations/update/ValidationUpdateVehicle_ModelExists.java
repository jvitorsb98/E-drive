package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se o modelo associado ao veículo existe durante a atualização do veículo.
 */
@Component
public class ValidationUpdateVehicle_ModelExists implements ValidationUpdateVehicle {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o modelo associado ao veículo existe.
     *
     * @param data Dados de atualização do veículo a serem validados.
     * @throws ValidationException Se o modelo associado não existir.
     */
    @Override
    public void validate(DataUpdateVehicle data, Long id) {
        if (data.modelId() != null && !modelRepository.existsById(data.modelId())) {
            String errorMessage = messageSource.getMessage(
                    "vehicle.update.model.not.found",
                    null,
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
