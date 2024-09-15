package br.com.cepedi.e_drive.service.model.validations.activated;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface `ValidationModelActivated` para verificar se um modelo já está desativado.
 */
@Component
public class ValidationModelAlreadyDisabledForActivated implements ValidationModelActivated {

    @Autowired
    private ModelRepository modelRepository;

    /**
     * Valida se o modelo já está desativado.
     *
     * @param id O ID do modelo a ser validado.
     * @throws ValidationException se o modelo já estiver desativado.
     */
    @Override
    public void validation(Long id) {
        if (modelRepository.existsById(id)) {
            Model model = modelRepository.getReferenceById(id);
            if (model.getActivated()) {  // Corrigi a lógica para verificar se está desativado.
                throw new ValidationException("The model is already activated");
            }
        }
    }
}
