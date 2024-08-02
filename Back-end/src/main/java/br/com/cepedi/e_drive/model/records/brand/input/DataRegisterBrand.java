package br.com.cepedi.e_drive.model.records.brand.input;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import br.com.cepedi.e_drive.model.entitys.Vehicle;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataRegisterBrand(
        @NotBlank(message = "Name cannot be blank")
        String name,

        Boolean activated
) {
}
