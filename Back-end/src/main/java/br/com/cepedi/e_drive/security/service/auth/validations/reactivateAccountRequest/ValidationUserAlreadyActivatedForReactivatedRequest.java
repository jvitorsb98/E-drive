package br.com.cepedi.e_drive.security.service.auth.validations.reactivateAccountRequest;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.register.DataReactivateAccount;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ValidationUserAlreadyActivatedForReactivatedRequest implements ValidationReactivateAccountRequest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void validate(DataReactivateAccount dataReactivateAccount) {
        User user = userRepository.findByEmail(dataReactivateAccount.email());

        if (user.isActive()) {
            String errorMessage = messageSource.getMessage(
                    "auth.request.reactivated.user.already.active",
                    new Object[]{user.getName()},
                    LocaleContextHolder.getLocale()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
