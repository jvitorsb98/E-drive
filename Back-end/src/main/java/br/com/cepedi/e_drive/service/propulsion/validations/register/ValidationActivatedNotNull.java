package br.com.cepedi.e_drive.service.propulsion.validations.register;

import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Primary
@Component("validationActivatedNotNull")
public class ValidationActivatedNotNull implements PropulsionValidatorRegister{
	
	@Override
    public void validate(DataRegisterPropulsion data) {
        if (data.activated() == null) {
            throw new IllegalArgumentException("Activated status cannot be null");
        }
    }
}
