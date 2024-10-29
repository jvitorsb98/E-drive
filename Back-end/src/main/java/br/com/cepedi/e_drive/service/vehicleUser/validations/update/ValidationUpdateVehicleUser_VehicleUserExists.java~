package br.com.cepedi.e_drive.service.vehicleUser.validations.update;

import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationUpdateVehicleUser} para validar se um
 * usuário de veículo existe antes de realizar uma atualização.
 * <p>
 * Esta classe verifica se um usuário de veículo com o ID fornecido existe no repositório.
 * Caso contrário, lança uma exceção {@link ValidationException}.
 * </p>
 */
@Component
public class ValidationUpdateVehicleUser_VehicleUserExists implements ValidationUpdateVehicleUser {

    @Autowired
    private VehicleUserRepository vehicleUserRepository;

    /**
     * Valida se um usuário de veículo com o ID fornecido existe.
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
