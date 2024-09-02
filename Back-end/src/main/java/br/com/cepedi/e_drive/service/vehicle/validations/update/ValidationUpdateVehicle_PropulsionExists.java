package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida a existência da propulsão associada ao veículo durante a atualização do veículo.
 */
@Component
public class ValidationUpdateVehicle_PropulsionExists implements ValidationUpdateVehicle {

    @Autowired
    private PropulsionRepository propulsionRepository;

    /**
     * Valida se a propulsão associada ao veículo existe.
     *
     * @param data Dados de atualização do veículo a serem validados.
     * @throws ValidationException Se a propulsão associada não existir.
     */
    @Override
    public void validate(DataUpdateVehicle data) {
        if (data.propulsionId() != null) {
            if (!propulsionRepository.existsById(data.propulsionId())) {
                throw new ValidationException("The provided propulsion id does not exist");
            }
        }
    }
}
