package br.com.cepedi.e_drive.model.records.model.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DataRegisterModel(
        @NotBlank(message = "Name cannot be blank")
        String name,

        @NotNull
        Long idBrand

) {
}
