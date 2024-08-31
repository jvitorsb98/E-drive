package br.com.cepedi.e_drive.security.service.user.validations.update;

import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;

public interface UserValidationUpdate {
    void validate(DataUpdateUser data, String authenticatedEmail);
}
