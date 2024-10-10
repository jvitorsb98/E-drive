package br.com.cepedi.e_drive.service.model.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Validação para verificar se um modelo já está desativado antes de tentar desativá-lo novamente.
 */
@Component
public class ValidationModelAlreadyDisabledForDisabled implements ModelValidatorDisabled {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o modelo com o ID especificado já está desativado.
     *
     * @param id O ID do modelo a ser validado.
     * @throws ValidationException Se o modelo já estiver desativado.
     */
    @Override
    public void validation(Long id) {
        if (modelRepository.existsById(id)) {
            Model model = modelRepository.getReferenceById(id);
            if (!model.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "model.disabled.already.disabled",
                        null,
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
