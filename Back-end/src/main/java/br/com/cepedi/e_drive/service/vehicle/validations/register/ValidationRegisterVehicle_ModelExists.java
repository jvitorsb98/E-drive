package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se o modelo associado ao veículo existe durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_ModelExists implements ValidationRegisterVehicle {

    @Autowired
    private ModelRepository modelRepository;

    /**
     * Verifica se o modelo associado ao veículo existe.
     *
     * @param data Dados do veículo a serem validados.
     * @throws ValidationException Se o modelo associado não existir.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (!modelRepository.existsById(data.modelId())) {
            throw new ValidationException("The provided model id does not exist.");
        }
    }
}
