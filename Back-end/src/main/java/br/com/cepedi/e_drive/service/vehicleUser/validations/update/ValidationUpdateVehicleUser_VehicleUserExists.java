package br.com.cepedi.e_drive.service.vehicleUser.validations.update;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateVehicleUser_VehicleUserExists implements ValidationUpdateVehicleUser{

    @Autowired
    private VehicleUserRepository vehicleUserRepository;


    @Override
    public void validate(Long id) {
        if(!vehicleUserRepository.existsById(id)){
            throw new ValidationException("The provided vehicleUser id does not exist");
        }
    }
}
