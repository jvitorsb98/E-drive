package br.com.cepedi.e_drive.model.records.model.input;

import jakarta.validation.constraints.NotBlank;

public record DataRegisterModel(
        @NotBlank(message = "Name cannot be blank")
        String name,

        Boolean activated
) {
}
