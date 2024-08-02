package br.com.cepedi.e_drive.service.propulsion.validations.disabled;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.cepedi.e_drive.repository.PropulsionRepository;

@Component
public class ValidationPropulsionExists implements PropulsionValidatorDisabled {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Override
    public void validate(Long id) {
        if (!propulsionRepository.existsById(id)) {
            throw new IllegalArgumentException("Propulsion with ID " + id + " does not exist.");
        }
    }
}
