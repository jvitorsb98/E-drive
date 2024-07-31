package br.com.cepedi.e_drive.security.model.records.register;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DataRegisterMail(

        @Email(message = "{invalid.email.from}")
        @NotBlank(message = "{notblank.email.from}")
        String from,

        @Email(message = "{invalid.email.to}")
        @NotBlank(message = "{notblank.email.to}")
        String to,

        @NotBlank(message = "{notblank.email.content}")
        String content,

        String subject
) {

}