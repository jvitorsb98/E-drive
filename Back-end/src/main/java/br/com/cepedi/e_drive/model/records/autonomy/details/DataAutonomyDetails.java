package br.com.cepedi.e_drive.model.records.autonomy.details;

import br.com.cepedi.e_drive.model.entitys.Autonomy;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DataAutonomyDetails(

        @NotNull(message = "Identifier cannot be null.")
        Long id,

        BigDecimal mileagePerLiterRoad,

        BigDecimal mileagePerLiterCity,

        BigDecimal consumptionEnergetic,

        BigDecimal autonomyElectricMode

) {
    public DataAutonomyDetails(Autonomy autonomy) {
        this(
                autonomy.getId(),
                autonomy.getMileagePerLiterRoad(),
                autonomy.getMileagePerLiterCity(),
                autonomy.getConsumptionEnergetic(),
                autonomy.getAutonomyElectricMode()
        );
    }
}
