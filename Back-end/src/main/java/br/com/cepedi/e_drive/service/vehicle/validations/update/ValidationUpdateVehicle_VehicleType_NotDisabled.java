package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateVehicle_VehicleType_NotDisabled implements ValidationUpdateVehicle{

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;


    @Override
    public void validate(DataUpdateVehicle data) {
        if(data.typeId()!=null){
            if (vehicleTypeRepository.existsById(data.modelId())) {
                VehicleType vehicleType = vehicleTypeRepository.getReferenceById(data.modelId());
                if(!vehicleType.isActivated()){
                    throw new ValidationException("The provided vehicle type id is disabled");
                }
            }
        }
    }
}
