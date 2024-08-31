package br.com.cepedi.e_drive.security.model.records.register;

import br.com.cepedi.e_drive.security.model.records.validations.Password;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record DataRegisterUser(

        @NotBlank(message = "{notblank.user.email}")
        @Email(message = "{email.user.email}")
        String email,

        @NotBlank(message = "{notblank.user.name}")
        String name,

        @NotBlank(message = "{notblank.user.password}")
        @Password(message = "{password.user.password}")
        String password,
        
        @NotNull(message = "{notnull.user.birth}")
        @Past(message = "{past.user.birth}")
        LocalDate birth, // Valida que é uma data passada

        @NotBlank(message = "{notblank.user.cellphone}")
        String cellPhone // Adicione o celular

) {}