package br.com.cepedi.e_drive.model.records.vehicleType.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateVehicleType(

        @Size(max = 100, message = "{size.vehicleType.name}")
        String name
) {
}
