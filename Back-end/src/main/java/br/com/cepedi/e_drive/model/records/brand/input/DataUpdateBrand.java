package br.com.cepedi.e_drive.model.records.brand.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateBrand(


        @Size(max = 100, message = "{size.brand.name}")
        String name
) {
}
