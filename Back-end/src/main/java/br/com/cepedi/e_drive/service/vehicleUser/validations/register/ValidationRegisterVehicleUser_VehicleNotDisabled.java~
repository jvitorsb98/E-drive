package br.com.cepedi.e_drive.service.vehicleUser.validations.register;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação de {@link ValidationRegisterVehicleUser} que valida se o veículo
 * associado ao usuário não está desativado.
 */
@Component
public class ValidationRegisterVehicleUser_VehicleNotDisabled implements ValidationRegisterVehicleUser {

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Valida se o veículo com o ID fornecido está ativado.
     *
     * @param data Dados de registro do usuário de veículo contendo o ID do veículo.
     * @throws ValidationException se o veículo com o ID fornecido estiver desativado.
     */
    @Override
    public void validate(DataRegisterVehicleUser data) {
        if (vehicleRepository.existsById(data.vehicleId())) {
            Vehicle vehicle = vehicleRepository.getReferenceById(data.vehicleId());
            if (!vehicle.isActivated()) {
                throw new ValidationException("The provided vehicle id is disabled");
            }
        }
    }
}
