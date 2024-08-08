package br.com.cepedi.e_drive.service.address.validations.register;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.service.address.validations.register.ValidationRegisterAddress;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationRegisterAddress_UserExists implements ValidationRegisterAddress {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void validate(DataRegisterAddress data) {
        if(!userRepository.existsById(data.userId())){
            throw new ValidationException("The provided user id does not exist");
        }
    }
}
