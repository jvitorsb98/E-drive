package br.com.cepedi.e_drive.service.vehicleType.validations.disabled;

import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Validação para garantir que um tipo de veículo exista antes de realizar operações de desativação.
 * Esta validação é usada para verificar se o tipo de veículo necessário está presente no repositório antes de desativá-lo.
 */
@Component
public class ValidationVehicleTypeExistsForDisabled implements VehicleTypeValidatorDisabled {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    /**
     * Valida se o tipo de veículo com o ID fornecido existe no repositório.
     *
     * @param id ID do tipo de veículo a ser validado.
     * @throws ValidationException Se o tipo de veículo com o ID fornecido não existir.
     */
    @Override
    public void validation(Long id) {
        if (!vehicleTypeRepository.existsById(id)) {
            throw new ValidationException("The required vehicle type does not exist");
        }
    }
}
