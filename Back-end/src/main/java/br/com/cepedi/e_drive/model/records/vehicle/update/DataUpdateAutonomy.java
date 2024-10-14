package br.com.cepedi.e_drive.model.records.vehicle.update;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

/**
 * Record que encapsula os dados necessários para atualizar as informações de autonomia de um veículo.
 * Utilizado para atualizar as propriedades de autonomia de um veículo existente no sistema.
 *
 * @param mileagePerLiterRoad Consumo de combustível em milhas por litro na estrada.
 * @param mileagePerLiterCity Consumo de combustível em milhas por litro na cidade.
 * @param consumptionEnergetic Consumo energético do veículo.
 * @param autonomyElectricMode Autonomia em modo elétrico do veículo.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record DataUpdateAutonomy(

        /**
         * Consumo de combustível em milhas por litro na estrada.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Consumo de combustível na estrada.
         */
        BigDecimal mileagePerLiterRoad,

        /**
         * Consumo de combustível em milhas por litro na cidade.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Consumo de combustível na cidade.
         */
        BigDecimal mileagePerLiterCity,

        /**
         * Consumo energético do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Consumo energético do veículo.
         */
        BigDecimal consumptionEnergetic,

        /**
         * Autonomia em modo elétrico do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Autonomia em modo elétrico.
         */
        BigDecimal autonomyElectricMode,

        BigDecimal batteryCapacity

) {
}
