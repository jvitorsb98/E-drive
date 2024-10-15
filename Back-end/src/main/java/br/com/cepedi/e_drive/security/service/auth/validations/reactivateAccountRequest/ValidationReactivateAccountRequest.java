package br.com.cepedi.e_drive.security.service.auth.validations.reactivateAccountRequest;

import br.com.cepedi.e_drive.security.model.records.register.DataReactivateAccount;

public interface ValidationReactivateAccountRequest {


    public void validate(DataReactivateAccount dataReactivateAccount);
}
