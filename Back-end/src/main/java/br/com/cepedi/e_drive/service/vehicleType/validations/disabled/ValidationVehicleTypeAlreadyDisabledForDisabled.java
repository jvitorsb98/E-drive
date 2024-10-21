package br.com.cepedi.e_drive.service.vehicleType.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Validação para garantir que um tipo de veículo não esteja já desativado antes de realizar operações de desativação.
 * Esta validação é usada para verificar se o tipo de veículo já está desativado antes de tentar desativá-lo novamente.
 */
@Component
public class ValidationVehicleTypeAlreadyDisabledForDisabled implements VehicleTypeValidatorDisabled {

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
                        "vehicleType.disabled.alreadyDisabled", // Chave da mensagem
                        new Object[]{id}, // Parâmetros da mensagem
                        Locale.getDefault() // Locale padrão
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
