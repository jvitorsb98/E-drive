package br.com.cepedi.e_drive.security.model.records.register;

import jakarta.validation.constraints.Email;

public record DataReactivateAccount(

        @Email
        String email
) {
}
