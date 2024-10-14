package br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest;

import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;

public interface ValidationResetPasswordRequest {

    public void validate(DataRequestResetPassword dataRequestResetPassword);

}
