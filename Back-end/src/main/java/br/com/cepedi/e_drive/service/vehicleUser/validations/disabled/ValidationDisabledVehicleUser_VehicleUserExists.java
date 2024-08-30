package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;

import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationDisabledVehicleUser} para validar a existência de um usuário de veículo.
 */
@Component
public class ValidationDisabledVehicleUser_VehicleUserExists implements ValidationDisabledVehicleUser {

    @Autowired
    private VehicleUserRepository vehicleUserRepository;

    /**
     * Valida se o usuário de veículo com o ID fornecido existe.
     *
     * @param id ID do usuário de veículo a ser validado.
     * @throws ValidationException se o usuário de veículo não existir.
     */
    @Override
    public void validate(Long id) {
        if (!vehicleUserRepository.existsById(id)) {
            throw new ValidationException("The provided vehicleUser id does not exist");
        }
    }
}
