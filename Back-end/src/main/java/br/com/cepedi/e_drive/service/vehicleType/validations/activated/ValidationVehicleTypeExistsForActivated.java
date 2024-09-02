package br.com.cepedi.e_drive.service.vehicleType.validations.activated;

import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Validação para verificar se um tipo de veículo existe.
 * Esta validação é usada para garantir que o tipo de veículo especificado esteja presente no repositório antes de realizar outras operações.
 */
@Component
public class ValidationVehicleTypeExistsForActivated implements ValidationVehicleTypeActivated {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    /**
     * Valida se o tipo de veículo com o ID fornecido existe no repositório.
     *
     * @param id ID do tipo de veículo a ser validado.
     * @throws ValidationException Se o tipo de veículo não existir no repositório.
     */
    @Override
    public void validation(Long id) {
        if (!vehicleTypeRepository.existsById(id)) {
            throw new ValidationException("The required vehicle type does not exist");
        }
    }
}
