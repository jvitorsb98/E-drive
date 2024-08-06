package br.com.cepedi.e_drive.model.records.vehicle.register;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataRegisterVehicle(

        @NotNull(message = "Motor cannot be null.")
        @Size(min = 1, max = 100, message = "Motor must be between 1 and 100 characters.")
        String motor,

        @NotNull(message = "Version cannot be null.")
        @Size(min = 1, max = 100, message = "Version must be between 1 and 100 characters.")
        String version,

        @NotNull(message = "Model cannot be null.")
        Long modelId,

        @NotNull(message = "Category cannot be null.")
        Long categoryId,

        @NotNull(message = "Type cannot be null.")
        Long typeId,

        @NotNull(message = "Brand cannot be null.")
        Long brandId,

        @NotNull(message = "Propulsion cannot be null.")
        Long propulsionId,

        @NotNull(message = "autonomy cannot be null.")
        DataRegisterAutonomy dataRegisterAutonomy

) {
}
