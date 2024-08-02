package br.com.cepedi.e_drive.model.records.vehicleType.input;

import jakarta.validation.constraints.NotBlank;

public record DataRegisterVehicleType(
        @NotBlank(message = "Name cannot be blank")
        String name,

        Boolean activated
) {
}
