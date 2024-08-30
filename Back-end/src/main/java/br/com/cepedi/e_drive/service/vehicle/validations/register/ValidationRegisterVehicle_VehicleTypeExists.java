package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se o tipo de veículo associado ao veículo existe durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_VehicleTypeExists implements ValidationRegisterVehicle {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    /**
     * Verifica se o tipo de veículo associado ao veículo existe.
     *
     * @param data Dados do veículo a serem validados, incluindo o ID do tipo de veículo.
     * @throws ValidationException Se o tipo de veículo associado não existir.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (!vehicleTypeRepository.existsById(data.typeId())) {
            throw new ValidationException("The provided vehicle type id does not exist.");
        }
    }
}
