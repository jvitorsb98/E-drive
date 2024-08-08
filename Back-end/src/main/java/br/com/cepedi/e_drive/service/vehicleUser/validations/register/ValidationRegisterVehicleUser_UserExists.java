package br.com.cepedi.e_drive.service.vehicleUser.validations.register;

import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationRegisterVehicleUser_UserExists implements ValidationRegisterVehicleUser{

    @Autowired
    private UserRepository userRepository;

    @Override
    public void validate(DataRegisterVehicleUser data) {
        if(!userRepository.existsById(data.userId())){
            throw new ValidationException("The provided user id does not exist");
        }
    }
}
