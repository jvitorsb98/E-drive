package br.com.cepedi.e_drive.service.propulsion.validations.update;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;

@Component
public class ValidationExistenceUpdate implements PropulsionValidatorUpdate {
	
    @Autowired
    private PropulsionRepository propulsionRepository;

    @Override
    public void validate(DataUpdatePropulsion data) {
        if (!propulsionRepository.existsById(data.id())) {
            throw new IllegalArgumentException("Propulsion with the given ID does not exist");
        }
    }
}

