package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se o modelo associado ao veículo existe durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_ModelExists implements ValidationRegisterVehicle {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Verifica se o modelo associado ao veículo existe.
     *
     * @param data Dados do veículo a serem validados.
     * @throws ValidationException Se o modelo associado não existir.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (!modelRepository.existsById(data.modelId())) {
            String errorMessage = messageSource.getMessage(
                    "vehicle.register.model.not.found",
                    new Object[]{data.modelId()},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
