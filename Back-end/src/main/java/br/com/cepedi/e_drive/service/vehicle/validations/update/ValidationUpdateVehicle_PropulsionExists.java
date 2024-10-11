package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida a existência da propulsão associada ao veículo durante a atualização do veículo.
 */
@Component
public class ValidationUpdateVehicle_PropulsionExists implements ValidationUpdateVehicle {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se a propulsão associada ao veículo existe.
     *
     * @param data Dados de atualização do veículo a serem validados.
     * @throws ValidationException Se a propulsão associada não existir.
     */
    @Override
    public void validate(DataUpdateVehicle data, Long id) {
        if (data.propulsionId() != null && !propulsionRepository.existsById(data.propulsionId())) {
            String errorMessage = messageSource.getMessage(
                    "vehicle.update.propulsion.not.found",
                    null,
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
