package br.com.cepedi.e_drive.model.records.autonomy.register;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record DataRegisterAutonomy(

        @NotNull(message = "Mileage per liter (road) cannot be null.")
        BigDecimal mileagePerLiterRoad,

        @NotNull(message = "Mileage per liter (city) cannot be null.")
        BigDecimal mileagePerLiterCity,

        @NotNull(message = "Consumption energetic cannot be null.")
        BigDecimal consumptionEnergetic,

        @NotNull(message = "Autonomy electric mode cannot be null.")
        BigDecimal autonomyElectricMode
) {
}
