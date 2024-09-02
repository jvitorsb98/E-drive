package br.com.cepedi.e_drive.service.vehicleType.validations.update;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationUpdateVehicleType} para validação de tipos de veículos
 * durante processos de atualização. Verifica se o tipo de veículo existe e está ativado.
 */
@Component
public class ValidationUpdateVehicleType_VehicleTypeExists implements ValidationUpdateVehicleType {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    /**
     * Valida se o tipo de veículo com o ID fornecido existe e está ativado.
     *
     * @param id ID do tipo de veículo a ser validado.
     * @throws ValidationException Se o tipo de veículo não existir ou estiver desativado.
     */
    @Override
    public void validation(Long id) {
        if (vehicleTypeRepository.existsById(id)) {
            VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
            if (!vehicleType.isActivated()) {
                throw new ValidationException("The required vehicle type is disabled");
            }
        } else {
            throw new ValidationException("The required vehicle type does not exist");
        }
    }
}
