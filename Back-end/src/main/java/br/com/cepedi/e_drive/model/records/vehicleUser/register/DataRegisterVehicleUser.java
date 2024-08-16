package br.com.cepedi.e_drive.model.records.vehicleUser.register;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public record DataRegisterVehicleUser(


        @NotNull(message = "Vehicle ID cannot be null.")
        Long vehicleId,

        @NotNull
        DataRegisterAutonomy dataRegisterAutonomy

) {
}
