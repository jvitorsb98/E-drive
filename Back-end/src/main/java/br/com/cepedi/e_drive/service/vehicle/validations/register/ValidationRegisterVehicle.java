package br.com.cepedi.e_drive.service.vehicle.validations.register;


import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;

public interface ValidationRegisterVehicle {

    void validate(DataRegisterVehicle data);

}
