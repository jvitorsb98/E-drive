package br.com.cepedi.e_drive.model.records.brand.input;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record DataUpdateBrand(
        @NotNull(message = "{notnull.brand.id}")
        Long id,

        @NotBlank(message = "{notblank.brand.name}")
        @Size(max = 100, message = "{size.brand.name}")
        String name,

        @NotNull(message = "{notnull.brand.vehicles}")
        @Size(min = 1, message = "{size.brand.vehicles}")
        List<Vehicle> vehicles
) {
}
