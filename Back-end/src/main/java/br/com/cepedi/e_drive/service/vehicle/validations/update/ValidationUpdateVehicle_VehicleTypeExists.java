package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateVehicle_VehicleTypeExists implements ValidationUpdateVehicle{

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Override
    public void validate(DataUpdateVehicle data) {
        if(data.typeId()!=null){
            if(!vehicleTypeRepository.existsById(data.typeId())){
                throw new ValidationException("The provided vehicle type id does not exist");
            }
        }
    }
}
