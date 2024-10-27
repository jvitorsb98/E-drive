package br.com.cepedi.e_drive.security.service.auth.validations.reactivated;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.service.user.UserService;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ValidationUserNotFoundDataReactivateAccount implements ValidationReactivate {

    @Autowired
    private UserService userService;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void validate(String token) {
        User user = userService.getUserByToken(token);

        if (user == null) {
            String errorMessage = messageSource.getMessage(
                    "auth.reactivated.user.not.found",
                    new Object[]{token},
                    LocaleContextHolder.getLocale()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
