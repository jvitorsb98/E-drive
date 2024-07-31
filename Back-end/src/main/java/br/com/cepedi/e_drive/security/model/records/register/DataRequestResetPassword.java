package br.com.cepedi.e_drive.security.model.records.register;

import jakarta.validation.constraints.NotBlank;

public record DataRequestResetPassword(

        @NotBlank
        String email

) {
}
