package br.com.cepedi.e_drive.security.model.records.register;

import br.com.cepedi.e_drive.security.model.records.validations.Password;
import jakarta.validation.constraints.NotBlank;

public record DataResetPassword(

        @NotBlank
        String token,

        @Password
        String password

) {
}
