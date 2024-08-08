package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;


import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationDisabledVehicleUser_VehicleUserNotDisabled implements ValidationDisabledVehicleUser{
    @Autowired
    private VehicleUserRepository vehicleUserRepository;

    @Override
    public void validate(Long id) {
        if (vehicleUserRepository.existsById(id)) {
            VehicleUser vehicleUser  = vehicleUserRepository.getReferenceById(id);
            if(!vehicleUser.isActivated()){
                throw new ValidationException("The provided vehicle user id is disabled");
            }
        }
    }
}
