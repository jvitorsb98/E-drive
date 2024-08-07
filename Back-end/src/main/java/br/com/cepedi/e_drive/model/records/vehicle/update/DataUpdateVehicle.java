package br.com.cepedi.e_drive.model.records.vehicle.update;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateVehicle(




        String motor,


        String version,

        Long modelId,

        Long categoryId,

        Long typeId,

        Long brandId,

        Long propulsionId,

        Long year,

        DataRegisterAutonomy dataRegisterAutonomy

) {
}
