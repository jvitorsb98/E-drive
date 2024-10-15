package br.com.cepedi.e_drive.security.service.auth.validations.logout;

import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class ValidationTokenValidLogout implements ValidationLogout {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void validate(String token) {
        if (!tokenService.isValidToken(token)) {
            String errorMessage = messageSource.getMessage(
                    "auth.logout.invalid.token",
                    new Object[]{token},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
