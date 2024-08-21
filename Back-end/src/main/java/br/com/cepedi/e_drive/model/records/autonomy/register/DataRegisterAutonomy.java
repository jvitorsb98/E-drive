package br.com.cepedi.e_drive.model.records.autonomy.register;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record DataRegisterAutonomy(

        BigDecimal mileagePerLiterRoad,

        BigDecimal mileagePerLiterCity,

        BigDecimal consumptionEnergetic,

        BigDecimal autonomyElectricMode
) {
}
