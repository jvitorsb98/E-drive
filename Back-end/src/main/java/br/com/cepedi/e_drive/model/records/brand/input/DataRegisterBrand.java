package br.com.cepedi.e_drive.model.records.brand.input;

import jakarta.validation.constraints.NotBlank;

public record DataRegisterBrand(
        @NotBlank(message = "Name cannot be blank")
        String name,

        Boolean activated
) {
}
