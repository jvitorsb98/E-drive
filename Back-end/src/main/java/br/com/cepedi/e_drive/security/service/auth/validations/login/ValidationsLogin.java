package br.com.cepedi.e_drive.security.service.auth.validations.login;


import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import org.springframework.stereotype.Component;

public interface ValidationsLogin {


    void validate(DataAuth dataAuth);
}
