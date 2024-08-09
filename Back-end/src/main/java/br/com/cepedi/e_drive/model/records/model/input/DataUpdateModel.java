package br.com.cepedi.e_drive.model.records.model.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateModel(
        @NotNull(message = "{notnull.model.id}")
        Long id,

        @NotNull(message = "{notnull.model.name}")
        @NotBlank(message = "{notblank.model.name}")
        @Size(max = 100, message = "{size.model.name}")
        String name
) {
}
