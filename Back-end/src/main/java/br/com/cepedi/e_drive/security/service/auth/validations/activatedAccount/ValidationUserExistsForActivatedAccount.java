package br.com.cepedi.e_drive.security.service.auth.validations.activatedAccount;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import com.auth0.jwt.JWT;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class ValidationUserExistsForActivatedAccount implements ValidationsActivatedAccount {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource; // Injeção de MessageSource para internacionalização

    @Override
    public void validate(String token) {

        String email = JWT.decode(token).getClaim("email").asString();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            String errorMessage = messageSource.getMessage(
                    "auth.activated.account.notfound",
                    new Object[]{email},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
