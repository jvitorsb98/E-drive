package br.com.cepedi.e_drive.service.vehicleUser.validations.register;

import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação de {@link ValidationRegisterVehicleUser} que valida se o veículo
 * associado ao usuário existe no repositório de veículos.
 */
@Component
public class ValidationRegisterVehicleUser_VehicleExists implements ValidationRegisterVehicleUser {

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Valida se o veículo com o ID fornecido existe no repositório.
     *
     * @param data Dados de registro do usuário de veículo contendo o ID do veículo.
     * @throws ValidationException se o ID do veículo fornecido não existir no repositório.
     */
    @Override
    public void validate(DataRegisterVehicleUser data) {
        if (!vehicleRepository.existsById(data.vehicleId())) {
            throw new ValidationException("The provided vehicle id does not exist");
        }
    }
}
