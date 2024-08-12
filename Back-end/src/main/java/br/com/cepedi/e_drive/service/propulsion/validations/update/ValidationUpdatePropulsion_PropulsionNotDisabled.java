package br.com.cepedi.e_drive.service.propulsion.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;


@Component
public class ValidationUpdatePropulsion_PropulsionNotDisabled implements ValidationUpdatePropulsion {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Override
    public void validate(Long id) {
        if (propulsionRepository.existsById(id)) {
            Propulsion propulsion = propulsionRepository.getReferenceById(id);
            if (propulsion.getActivated()) {
                throw new ValidationException("The required propulsion is activated");
            }
        }
    }
}

