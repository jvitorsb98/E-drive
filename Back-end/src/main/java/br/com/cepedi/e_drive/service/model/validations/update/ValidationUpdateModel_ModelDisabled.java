package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se o modelo está ativado durante a atualização do modelo.
 */
@Component
public class ValidationUpdateModel_ModelDisabled implements ValidationModelUpdate {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o modelo a ser atualizado está ativado.
     *
     * @param data Os dados do modelo que estão sendo atualizados.
     * @param id   O ID do modelo que está sendo atualizado.
     * @throws ValidationException Se o modelo não estiver ativado.
     */
    @Override
    public void validation(DataUpdateModel data, Long id) {
        if (modelRepository.existsById(id)) {
            Model model = modelRepository.getReferenceById(id);
            if (!model.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "model.update.disabled",
                        new Object[]{model.getName()},
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
