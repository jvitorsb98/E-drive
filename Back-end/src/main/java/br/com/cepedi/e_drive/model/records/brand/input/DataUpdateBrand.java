package br.com.cepedi.e_drive.model.records.brand.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateBrand(
        @NotNull(message = "{notnull.brand.id}")
        Long id,

        @NotNull(message = "{notnull.brand.name}")
        @NotBlank(message = "{notblank.brand.name}")
        @Size(max = 100, message = "{size.brand.name}")
        String name
) {
}
