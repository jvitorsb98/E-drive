package br.com.cepedi.e_drive.service.vehicle.validations.register;


import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ValidationRegisterVehicle_VehicleType_NotDisabled implements ValidationRegisterVehicle{

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;


    @Override
    public void validate(DataRegisterVehicle data) {
        if (vehicleTypeRepository.existsById(data.typeId())) {
            VehicleType vehicleType = vehicleTypeRepository.getReferenceById(data.typeId());
            if(!vehicleType.isActivated()){
                throw new ValidationException("The provided vehicle type id is disabled");
            }
        }
    }

}
