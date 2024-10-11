package br.com.cepedi.e_drive.service.vehicle.validations.disabled;

import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação de {@link ValidationDisabledVehicle} que valida a existência do veículo
 * antes de desativá-lo.
 *
 * Esta classe garante que o veículo com o ID fornecido exista no repositório antes de
 * proceder com a desativação. Se o veículo não existir, uma exceção de validação é lançada.
 */
@Component
public class ValidationDisabledVehicle_Exists implements ValidationDisabledVehicle {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o veículo com o ID fornecido existe.
     *
     * @param id ID do veículo a ser validado.
     * @throws ValidationException Se o veículo com o ID fornecido não existir.
     */
    @Override
    public void validate(Long id) {
        if (!vehicleRepository.existsById(id)) {
            String message = messageSource.getMessage(
                    "vehicle.disable.not.exists", // Chave da mensagem de erro
                    new Object[]{id}, // Parâmetros da mensagem
                    Locale.getDefault()
            );
            throw new ValidationException(message);
        }
    }
}
