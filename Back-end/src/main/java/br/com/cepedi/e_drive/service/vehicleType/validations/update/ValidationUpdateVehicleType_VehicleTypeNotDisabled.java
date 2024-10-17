package br.com.cepedi.e_drive.service.vehicleType.validations.update;

import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface {@link ValidationUpdateVehicleType} para validação de tipos de veículos
 * durante processos de atualização. Verifica se o tipo de veículo existe.
 */
@Component
public class ValidationUpdateVehicleType_VehicleTypeNotDisabled implements ValidationUpdateVehicleType {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o tipo de veículo com o ID fornecido existe.
     *
     * @param id ID do tipo de veículo a ser validado.
     * @throws ValidationException Se o tipo de veículo não existir.
     */
    @Override
    public void validation(Long id) {
        if (!vehicleTypeRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "vehicleType.update.notExist_1", // Chave da mensagem para veículo inexistente
                    new Object[]{id}, // Parâmetro da mensagem (ID)
                    Locale.getDefault() // Locale padrão
            );
            throw new ValidationException(errorMessage);
        }
    }
}
