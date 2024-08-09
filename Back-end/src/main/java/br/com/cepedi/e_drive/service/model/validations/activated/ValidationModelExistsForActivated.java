package br.com.cepedi.e_drive.service.model.validations.activated;

import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationModelExistsForActivated implements ValidationModelActivated {

    @Autowired
    private ModelRepository modelRepository;

    @Override
    public void validation(Long id) {
        if (!modelRepository.existsById(id)) {
            throw new ValidationException("The required model does not exist");
        }
    }
}
