package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationRegisterVehicle_VehicleTypeExists implements ValidationRegisterVehicle{

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Override
    public void validate(DataRegisterVehicle data) {
        if(!vehicleTypeRepository.existsById(data.typeId())){
            throw new ValidationException("The provided vehicle type id does not exist");
        }
    }
}
