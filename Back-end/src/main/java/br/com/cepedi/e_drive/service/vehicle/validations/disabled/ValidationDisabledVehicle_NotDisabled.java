package br.com.cepedi.e_drive.service.vehicle.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se um veículo já está desativado antes de realizar operações de desativação.
 *
 * Esta implementação da interface {@link ValidationDisabledVehicle} garante que um veículo
 * com o ID fornecido não esteja já desativado. Se o veículo já estiver desativado, uma exceção
 * de validação é lançada.
 */
@Component
public class ValidationDisabledVehicle_NotDisabled implements ValidationDisabledVehicle {

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Valida se o veículo com o ID fornecido não está desativado.
     *
     * @param id ID do veículo a ser validado.
     * @throws ValidationException Se o veículo com o ID fornecido já estiver desativado.
     */
    @Override
    public void validate(Long id) {
        if (vehicleRepository.existsById(id)) {
            Vehicle vehicle = vehicleRepository.getReferenceById(id);
            if (!vehicle.isActivated()) {
                throw new ValidationException("The provided vehicle is already disabled.");
            }
        }
    }
}
