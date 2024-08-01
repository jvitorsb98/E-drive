package br.com.cepedi.e_drive.service.propulsion.validations.register;

import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import org.springframework.stereotype.Component;

@Component
public class ValidationNameNotNull implements PropulsionValidatorRegister {
	
	@Override
    public void validate(DataRegisterPropulsion data) {
        if (data.name() == null) {
            throw new IllegalArgumentException("Name cannot be null");
        }
    }
}
