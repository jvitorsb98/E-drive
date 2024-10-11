package br.com.cepedi.e_drive.service.model.validations.activated;

import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface `ValidationModelActivated` para verificar se o modelo existe.
 */
@Component
public class ValidationModelExistsForActivated implements ValidationModelActivated {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o modelo com o ID fornecido existe no repositório.
     *
     * @param id O ID do modelo a ser validado.
     * @throws ValidationException se o modelo não existir.
     */
    @Override
    public void validation(Long id) {
        if (!modelRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "model.activated.not.found",
                    null,
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
