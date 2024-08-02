package br.com.cepedi.e_drive.service.propulsion.validations.register;

import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;


public interface PropulsionValidatorRegister {
	void validate(DataRegisterPropulsion data);
}
