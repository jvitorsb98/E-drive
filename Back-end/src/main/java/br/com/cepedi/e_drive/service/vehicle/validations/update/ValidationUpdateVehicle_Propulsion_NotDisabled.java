package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se a propulsão associada ao veículo não está desativada durante a atualização do veículo.
 */
@Component
public class ValidationUpdateVehicle_Propulsion_NotDisabled implements ValidationUpdateVehicle {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se a propulsão associada ao veículo não está desativada.
     *
     * @param data Dados de atualização do veículo a serem validados.
     * @throws ValidationException Se a propulsão associada estiver desativada ou não existir.
     */
    @Override
    public void validate(DataUpdateVehicle data, Long id) {
        if (data.propulsionId() != null) {
            if (propulsionRepository.existsById(data.propulsionId())) {
                Propulsion propulsion = propulsionRepository.getReferenceById(data.propulsionId());
                if (!propulsion.getActivated()) {
                    String errorMessage = messageSource.getMessage(
                            "vehicle.update.propulsion.disabled",
                            null,
                            Locale.getDefault()
                    );
                    throw new ValidationException(errorMessage);
                }
            }
        }
    }
}
