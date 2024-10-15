package br.com.cepedi.e_drive.security.service.auth.validations.reactivateAccountRequest;

import br.com.cepedi.e_drive.security.model.records.register.DataReactivateAccount;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ValidationUserNotFoundDataReactivateAccountRequest implements ValidationReactivateAccountRequest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void validate(DataReactivateAccount dataReactivateAccount) {
        if (!userRepository.existsByEmail(dataReactivateAccount.email())) {
            String errorMessage = messageSource.getMessage(
                    "auth.request.reactivated.user.not.found",
                    new Object[]{dataReactivateAccount.email()},
                    LocaleContextHolder.getLocale()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
