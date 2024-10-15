package br.com.cepedi.e_drive.security.service.auth.validations.activatedAccount;


import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import com.auth0.jwt.JWT;
import jakarta.validation.ValidationException;
import org.apache.logging.log4j.message.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class ValidationUserDisabledForActivatedAccount implements ValidationsActivatedAccount{


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void validate(String token) {

        String email = JWT.decode(token).getClaim("email").asString();
        User user = userRepository.findByEmail(email);

        if(user != null && user.getActivated()){

            String errorMessage = messageSource.getMessage(
                    "auth.activated.account.already.activated",
                    new Object[]{email},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }

    }
}
