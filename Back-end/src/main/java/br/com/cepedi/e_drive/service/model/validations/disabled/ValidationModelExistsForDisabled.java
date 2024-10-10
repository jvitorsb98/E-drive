package br.com.cepedi.e_drive.service.model.validations.disabled;

import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Validação para garantir que um modelo existe antes de tentar desativá-lo.
 */
@Component
public class ValidationModelExistsForDisabled implements ModelValidatorDisabled {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se um modelo com o ID especificado existe.
     *
     * @param id O ID do modelo a ser validado.
     * @throws ValidationException Se o modelo não existir.
     */
    @Override
    public void validation(Long id) {
        if (!modelRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "model.disabled.not.found",
                    null,
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
