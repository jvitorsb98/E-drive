package br.com.cepedi.e_drive.service.model.validations.activated;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface `ValidationModelActivated` para verificar se um modelo já está ativado.
 */
@Component
public class ValidationModelAlreadyDisabledForActivated implements ValidationModelActivated {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o modelo já está ativado.
     *
     * @param id O ID do modelo a ser validado.
     * @throws ValidationException se o modelo já estiver ativado.
     */
    @Override
    public void validation(Long id) {
        if (modelRepository.existsById(id)) {
            Model model = modelRepository.getReferenceById(id);
            if (model.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "model.activated.already.active",
                        null,
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
