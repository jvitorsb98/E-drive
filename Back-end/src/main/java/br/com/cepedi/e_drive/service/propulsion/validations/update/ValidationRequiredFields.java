package br.com.cepedi.e_drive.service.propulsion.validations.update;

import org.springframework.stereotype.Component;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;


@Component
public class ValidationRequiredFields implements PropulsionValidatorUpdate {
    @Override
    public void validate(DataUpdatePropulsion data) {
        if (data.name() == null || data.name().isBlank()) {
            throw new IllegalArgumentException("Name cannot be null or blank");
        }
        if (data.activated() == null) {
            throw new IllegalArgumentException("Activated status cannot be null");
        }
    }
}

