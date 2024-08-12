package br.com.cepedi.e_drive.model.records.model.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateModel(

        @Size(max = 100, message = "{size.model.name}")
        String name,

        Long idBrand


) {
}
