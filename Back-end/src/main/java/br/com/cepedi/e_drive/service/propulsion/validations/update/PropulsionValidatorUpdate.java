package br.com.cepedi.e_drive.service.propulsion.validations.update;

import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;

public interface PropulsionValidatorUpdate {
	void validate(DataUpdatePropulsion data);
}
