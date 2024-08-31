package br.com.cepedi.e_drive.security.service.user.validations.update;

import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUserExistsForUpdate implements UserValidationUpdate {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void validate(DataUpdateUser data, String authenticatedEmail) {

        boolean userExists = userRepository.existsByEmail(authenticatedEmail);
        if (!userExists) {
            throw new RuntimeException("User does not exist");
        }
    }
}
