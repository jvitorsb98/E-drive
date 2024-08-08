package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;


import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationDisabledVehicleUser_VehicleUserExists implements ValidationDisabledVehicleUser{
    @Autowired
    private VehicleUserRepository vehicleUserRepository;


    @Override
    public void validate(Long id) {
        if(!vehicleUserRepository.existsById(id)){
            throw new ValidationException("The provided vehicleUser id does not exist");
        }
    }
}
