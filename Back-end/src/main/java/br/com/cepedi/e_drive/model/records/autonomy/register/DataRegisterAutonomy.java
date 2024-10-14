package br.com.cepedi.e_drive.model.records.autonomy.register;

import java.math.BigDecimal;

/**
 * Record que encapsula os dados necessários para registrar uma nova autonomia.
 * Utilizado para transferir informações ao criar uma nova instância de autonomia.
 *
 * @param mileagePerLiterRoad     Milhagem por litro em estrada. Pode ser nulo.
 * @param mileagePerLiterCity     Milhagem por litro em cidade. Pode ser nulo.
 * @param consumptionEnergetic    Consumo energético. Pode ser nulo.
 * @param autonomyElectricMode    Autonomia no modo elétrico. Pode ser nulo.
 */
public record DataRegisterAutonomy(

        BigDecimal mileagePerLiterRoad,

        BigDecimal mileagePerLiterCity,

        BigDecimal consumptionEnergetic,

        BigDecimal autonomyElectricMode,

        BigDecimal batteryCapacity

) {
}
