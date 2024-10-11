package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se a propulsão associada ao veículo existe durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_PropulsionExists implements ValidationRegisterVehicle {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Verifica se a propulsão associada ao veículo existe.
     *
     * @param data Dados do veículo a serem validados, incluindo o ID da propulsão.
     * @throws ValidationException Se a propulsão associada não existir.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (!propulsionRepository.existsById(data.propulsionId())) {
            String errorMessage = messageSource.getMessage(
                    "vehicle.register.propulsion.not.found",
                    new Object[]{data.propulsionId()},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
