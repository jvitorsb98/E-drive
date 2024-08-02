package br.com.cepedi.e_drive.service.vehicleType.validations.activated;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationVehicleTypeAlreadyDisabledForActivated implements ValidationVehicleTypeActivated {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Override
    public void validation(Long id) {
        if(vehicleTypeRepository.existsById(id)){
            VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
            if(vehicleType.getActivated()){
                throw new ValidationException("The vehicle type is already disabled");
            }
        }
    }
}
