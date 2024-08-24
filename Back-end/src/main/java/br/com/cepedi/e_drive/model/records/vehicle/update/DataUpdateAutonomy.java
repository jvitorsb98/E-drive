package br.com.cepedi.e_drive.model.records.vehicle.update;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties
public record DataUpdateAutonomy(

        BigDecimal mileagePerLiterRoad,

        BigDecimal mileagePerLiterCity,

        BigDecimal consumptionEnergetic,

        BigDecimal autonomyElectricMode

) {



}
