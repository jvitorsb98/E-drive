package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se o tipo de veículo associado ao veículo a ser atualizado existe.
 * Se o tipo de veículo não existir, uma exceção é lançada.
 */
@Component
public class ValidationUpdateVehicle_VehicleTypeExists implements ValidationUpdateVehicle {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    /**
     * Valida se o tipo de veículo associado ao veículo existe.
     *
     * @param data Dados de atualização do veículo a serem validados.
     * @throws ValidationException Se o tipo de veículo não existir.
     */
    @Override
    public void validate(DataUpdateVehicle data) {
        if (data.typeId() != null) {
            if (!vehicleTypeRepository.existsById(data.typeId())) {
                throw new ValidationException("The provided vehicle type id does not exist");
            }
        }
    }
}
