package br.com.cepedi.e_drive.security.model.records.register;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record DataRegisterToken(

        @NotBlank
        String token,

        @NotNull
        Long user_id,

        @NotNull
        @Future
        Instant expireDate

) {
}
