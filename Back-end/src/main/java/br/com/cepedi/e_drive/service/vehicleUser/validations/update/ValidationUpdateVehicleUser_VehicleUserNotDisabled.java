package br.com.cepedi.e_drive.service.vehicleUser.validations.update;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationUpdateVehicleUser} para validar se um
 * usuário de veículo está ativado antes de realizar uma atualização.
 * <p>
 * Esta classe verifica se um usuário de veículo com o ID fornecido está ativado. Caso
 * contrário, lança uma exceção {@link ValidationException}.
 * </p>
 */
@Component
public class ValidationUpdateVehicleUser_VehicleUserNotDisabled implements ValidationUpdateVehicleUser {

	@Autowired
	private VehicleUserRepository vehicleUserRepository;

	/**
	 * Valida se um usuário de veículo com o ID fornecido está ativado.
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
