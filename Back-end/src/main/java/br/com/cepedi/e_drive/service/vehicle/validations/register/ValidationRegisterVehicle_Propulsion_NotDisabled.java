package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se a propulsão associada ao veículo está ativada durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_Propulsion_NotDisabled implements ValidationRegisterVehicle {

    @Autowired
    private PropulsionRepository propulsionRepository;

    /**
     * Verifica se a propulsão associada ao veículo está ativada.
     *
     * @param data Dados do veículo a serem validados, incluindo o ID da propulsão.
     * @throws ValidationException Se a propulsão associada estiver desativada.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (propulsionRepository.existsById(data.propulsionId())) {
            Propulsion propulsion = propulsionRepository.getReferenceById(data.propulsionId());
            if (!propulsion.getActivated()) {
                throw new ValidationException("The provided propulsion id is disabled.");
            }
        }
    }
}
