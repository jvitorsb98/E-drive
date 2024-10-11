package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se o modelo associado ao veículo não está desativado durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_Model_NotDisabled implements ValidationRegisterVehicle {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o modelo associado ao veículo está ativado.
     *
     * @param data Dados do veículo a serem validados.
     * @throws ValidationException Se o modelo associado estiver desativado.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (modelRepository.existsById(data.modelId())) {
            Model model = modelRepository.getReferenceById(data.modelId());
            if (!model.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "vehicle.register.model.disabled",
                        new Object[]{model.getName()},
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
