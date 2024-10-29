package br.com.cepedi.e_drive.service.vehicleUser.validations.update;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

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

	private final VehicleUserRepository vehicleUserRepository;
	private final MessageSource messageSource;

	/**
	 * Construtor que injeta o repositório de usuários de veículos e o MessageSource.
	 *
	 * @param vehicleUserRepository o repositório de usuários de veículos a ser injetado.
	 * @param messageSource o MessageSource para suporte a internacionalização.
	 */
	@Autowired
	public ValidationUpdateVehicleUser_VehicleUserNotDisabled(VehicleUserRepository vehicleUserRepository, MessageSource messageSource) {
		this.vehicleUserRepository = vehicleUserRepository;
		this.messageSource = messageSource;
	}

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
				String errorMessage = messageSource.getMessage(
						"vehicleUser.disabled_1",       // Chave da mensagem para usuário desativado
						new Object[]{id},             // Parâmetro da mensagem (ID do usuário de veículo)
						Locale.getDefault()           // Locale padrão
				);
				throw new ValidationException(errorMessage);
			}
		}
	}
}
