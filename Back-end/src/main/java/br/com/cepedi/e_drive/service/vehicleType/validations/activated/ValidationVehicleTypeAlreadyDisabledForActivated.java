package br.com.cepedi.e_drive.service.vehicleType.validations.activated;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Validação para verificar se um tipo de veículo já está desativado.
 * Esta validação é usada para garantir que um tipo de veículo não possa ser ativado se já estiver desativado.
 */
@Component
public class ValidationVehicleTypeAlreadyDisabledForActivated implements ValidationVehicleTypeActivated {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o tipo de veículo com o ID fornecido já está desativado.
     *
     * @param id ID do tipo de veículo a ser validado.
     * @throws ValidationException Se o tipo de veículo já estiver desativado.
     */
    @Override
    public void validation(Long id) {
        if (vehicleTypeRepository.existsById(id)) {
            VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
            if (!vehicleType.isActivated()) {
                String errorMessage = messageSource.getMessage(
                        "vehicleType.activated.alreadyDisabled", // Chave da mensagem
                        new Object[]{id}, // Parâmetro da mensagem
                        Locale.getDefault() // Locale padrão
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
