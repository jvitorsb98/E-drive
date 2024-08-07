package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;

public interface ValidationUpdateVehicle {

    void validate(DataUpdateVehicle data);

}
