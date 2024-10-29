package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationDisabledVehicleUser} para verificar se um usuário de veículo não está desativado.
 */
@Component
public class ValidationDisabledVehicleUser_VehicleUserNotDisabled implements ValidationDisabledVehicleUser {

    @Autowired
    private VehicleUserRepository vehicleUserRepository;

    /**
     * Valida se o usuário de veículo com o ID fornecido está ativado.
     *
     * @param id ID do usuário de veículo a ser validado.
     * @throws ValidationException se o usuário de veículo estiver desativado.
     */
    @Override
    public void validate(Long id) {
        if (vehicleUserRepository.existsById(id)) {
            VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
            if (!vehicleUser.isActivated()) {
                throw new ValidationException("The provided vehicle user id is disabled");
            }
        }
    }
}
