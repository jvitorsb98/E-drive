package br.com.cepedi.e_drive.security.service.auth.validations.resetPassword;


import br.com.cepedi.e_drive.security.model.records.register.DataResetPassword;

public interface ValidationResetPassword {

    public void validate(DataResetPassword dataResetPassword);

}
