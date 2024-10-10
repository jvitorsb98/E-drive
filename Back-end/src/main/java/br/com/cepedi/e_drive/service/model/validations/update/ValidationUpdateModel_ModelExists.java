package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se o modelo existe durante a atualização do modelo.
 */
@Component
public class ValidationUpdateModel_ModelExists implements ValidationModelUpdate {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource;

    /**
     * Valida se o modelo a ser atualizado existe no repositório.
     *
     * @param data Os dados do modelo que estão sendo atualizados.
     * @param id   O ID do modelo que está sendo atualizado.
     * @throws ValidationException Se o modelo não existir no repositório.
     */
    @Override
    public void validation(DataUpdateModel data, Long id) {
        if (!modelRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "model.update.not.found", // Chave da mensagem
                    null,
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
