package br.com.cepedi.e_drive.service.model.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Validação para verificar se um modelo já está desativado antes de tentar desativá-lo novamente.
 */
@Component
public class ValidationModelAlreadyDisabledForDisabled implements ModelValidatorDisabled {

    @Autowired
    private ModelRepository modelRepository;

    @Override
    public void validation(Long id) {
        if (modelRepository.existsById(id)) {
            Model model = modelRepository.getReferenceById(id);
            if (!model.getActivated()) {
                throw new ValidationException("The model is already disabled");
            }
        }
    }
}
