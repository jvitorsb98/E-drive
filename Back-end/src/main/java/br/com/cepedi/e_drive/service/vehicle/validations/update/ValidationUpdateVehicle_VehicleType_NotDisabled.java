package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se o tipo de veículo associado ao veículo a ser atualizado está ativado.
 * Se o tipo de veículo estiver desativado ou não existir, uma exceção é lançada.
 */
@Component
public class ValidationUpdateVehicle_VehicleType_NotDisabled implements ValidationUpdateVehicle {

	@Autowired
	private VehicleTypeRepository vehicleTypeRepository;

	@Autowired
	private MessageSource messageSource; // Injeção do MessageSource para internacionalização

	/**
	 * Valida se o tipo de veículo associado ao veículo está ativado.
	 *
	 * @param data Dados de atualização do veículo a serem validados.
	 * @throws ValidationException Se o tipo de veículo estiver desativado ou não existir.
	 */
	@Override
	public void validate(DataUpdateVehicle data, Long id) {
		if (data.typeId() != null) {
			if (vehicleTypeRepository.existsById(data.typeId())) {
				VehicleType vehicleType = vehicleTypeRepository.getReferenceById(data.typeId());
				if (!vehicleType.isActivated()) {
					String errorMessage = messageSource.getMessage(
							"vehicle.update.type.disabled",
							null,
							Locale.getDefault()
					);
					throw new ValidationException(errorMessage);
				}
			}
		}
	}
}
