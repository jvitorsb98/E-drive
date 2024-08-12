package br.com.cepedi.e_drive.service.propulsion.validations.update;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.cepedi.e_drive.repository.PropulsionRepository;

@Component
public class ValidationUpdatePropulsion_PropulsionExists implements ValidationUpdatePropulsion {
	
    @Autowired
    private PropulsionRepository propulsionRepository;

    @Override
    public void validate(Long id) {
        if (!propulsionRepository.existsById(id)) {
            throw new IllegalArgumentException("Propulsion with the given ID does not exist");
        }
    }
}

