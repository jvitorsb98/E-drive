package br.com.cepedi.e_drive.model.records.vehicleType.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateVehicleType(
        @NotNull(message = "{notnull.vehicleType.id}")
        Long id,

        @NotNull(message = "{notnull.vehicleType.name}")
        @NotBlank(message = "{notblank.vehicleType.name}")
        @Size(max = 100, message = "{size.vehicleType.name}")
        String name
) {
}
