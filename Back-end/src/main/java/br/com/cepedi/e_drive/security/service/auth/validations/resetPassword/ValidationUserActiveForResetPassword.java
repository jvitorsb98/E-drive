package br.com.cepedi.e_drive.security.service.auth.validations.resetPassword;

import br.com.cepedi.e_drive.security.model.records.register.DataResetPassword;
import org.springframework.stereotype.Component;

@Component
public class ValidationUserActiveForResetPassword implements ValidationResetPassword{
    @Override
    public void validate(DataResetPassword dataResetPassword) {

    }
}
