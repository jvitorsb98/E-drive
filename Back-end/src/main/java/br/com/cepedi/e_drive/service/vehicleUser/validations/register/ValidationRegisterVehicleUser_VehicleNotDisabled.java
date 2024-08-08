package br.com.cepedi.e_drive.service.vehicleUser.validations.register;


import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationRegisterVehicleUser_VehicleNotDisabled implements ValidationRegisterVehicleUser{

    @Autowired
    private VehicleRepository vehicleRepository;


    @Override
    public void validate(DataRegisterVehicleUser data) {
        if (vehicleRepository.existsById(data.vehicleId())) {
            Vehicle vehicle = vehicleRepository.getReferenceById(data.vehicleId());
            if(!vehicle.isActivated()){
                throw new ValidationException("The provided vehicle id is disabled");
            }
        }
    }
}
