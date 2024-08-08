package br.com.cepedi.e_drive.model.records.vehicle.update;

import java.math.BigDecimal;

public record DataUpdateAutonomy(

        BigDecimal mileagePerLiterRoad,

        BigDecimal mileagePerLiterCity,

        BigDecimal consumptionEnergetic,

        BigDecimal autonomyElectricMode

) {



}
