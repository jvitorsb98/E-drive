package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se o modelo associado ao veículo está ativado durante a atualização do veículo.
 */
@Component
public class ValidationUpdateVehicle_Model_NotDisabled implements ValidationUpdateVehicle {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o modelo associado ao veículo está ativado.
     *
     * @param data Dados de atualização do veículo a serem validados.
     * @throws ValidationException Se o modelo associado estiver desativado.
     */
    @Override
    public void validate(DataUpdateVehicle data, Long id) {
        if (data.modelId() != null && modelRepository.existsById(data.modelId())) {
            Model model = modelRepository.getReferenceById(data.modelId());
            if (!model.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "vehicle.update.model.disabled",
                        null,
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
