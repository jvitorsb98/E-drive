package br.com.cepedi.e_drive.service.vehicle.validations.disabled;


import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationDisabledVehicle_NotDisabled implements ValidationDisabledVehicle{

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public void validate(Long id) {
        if (vehicleRepository.existsById(id)) {
            Vehicle vehicle = vehicleRepository.getReferenceById(id);
            if(!vehicle.isActivated()){
                throw new ValidationException("The provided vehicle already disabled ");
            }
        }
    }
}
