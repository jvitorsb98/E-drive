package br.com.cepedi.e_drive.security.service.auth.validations.reactivated;

import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ValidationTokenValidForReactivated implements ValidationReactivate {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void validate(String token) {
        if (!tokenService.isValidToken(token)) {
            String errorMessage = messageSource.getMessage(
                    "auth.reactivated.token.invalid",
                    null,
                    LocaleContextHolder.getLocale()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
