package br.com.cepedi.e_drive.service.model.validations.disabled;

import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Validação para garantir que um modelo existe antes de tentar desativá-lo.
 */
@Component
public class ValidationModelExistsForDisabled implements ModelValidatorDisabled {

    @Autowired
    private ModelRepository modelRepository;

    @Override
    public void validation(Long id) {
        if (!modelRepository.existsById(id)) {
            throw new ValidationException("The required model does not exist");
        }
    }
}
