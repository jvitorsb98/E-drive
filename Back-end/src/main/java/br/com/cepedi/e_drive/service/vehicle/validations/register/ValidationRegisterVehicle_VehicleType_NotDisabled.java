package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se o tipo de veículo associado ao veículo não está desativado durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_VehicleType_NotDisabled implements ValidationRegisterVehicle {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    /**
     * Verifica se o tipo de veículo associado ao veículo está ativado.
     *
     * @param data Dados do veículo a serem validados, incluindo o ID do tipo de veículo.
     * @throws ValidationException Se o tipo de veículo associado estiver desativado.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (vehicleTypeRepository.existsById(data.typeId())) {
            VehicleType vehicleType = vehicleTypeRepository.getReferenceById(data.typeId());
            if (!vehicleType.isActivated()) {
                throw new ValidationException("The provided vehicle type id is disabled.");
            }
        }
    }
}
