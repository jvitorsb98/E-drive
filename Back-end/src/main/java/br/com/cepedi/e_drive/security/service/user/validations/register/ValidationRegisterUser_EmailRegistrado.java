package br.com.cepedi.e_drive.security.service.user.validations.register;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ValidationRegisterUser_EmailRegistrado implements ValidationRegisterUser{

    @Autowired
    private UserRepository userRepository;

    @Override
    public void validation(DataRegisterUser dataRegisterUser) {
        if(dataRegisterUser.email() != null){
            if(userRepository.findByEmail(dataRegisterUser.email()) != null){
                throw new ValidationException("O email " + dataRegisterUser.email() + " já está cadastrado em nosso sistema.");
            }
        }
    }
}
