package br.com.cepedi.e_drive.service.address.validations.register;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;

public interface ValidationRegisterAddress {

    void validate(DataRegisterAddress data);

}
