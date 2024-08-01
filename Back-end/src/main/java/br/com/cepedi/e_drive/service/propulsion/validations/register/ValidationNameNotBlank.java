package br.com.cepedi.e_drive.service.propulsion.validations.register;

import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import org.springframework.stereotype.Component;

@Component
public class ValidationNameNotBlank implements PropulsionValidatorRegister{
	@Override
    public void validate(DataRegisterPropulsion data) {
        if (data.name().isBlank()) {
            throw new IllegalArgumentException("Name cannot be Blank");
        }
    }

}
