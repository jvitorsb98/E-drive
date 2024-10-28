package br.com.cepedi.e_drive.model.records.autonomy.details;

import br.com.cepedi.e_drive.model.entitys.Autonomy;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * Record que encapsula os detalhes de uma autonomia.
 * Utilizado para transferir dados detalhados sobre a autonomia de veículos.
 *
 * @param id                      Identificador único da autonomia. Não pode ser nulo.
 * @param mileagePerLiterRoad     Milhagem por litro em estrada. Pode ser nulo.
 * @param mileagePerLiterCity     Milhagem por litro em cidade. Pode ser nulo.
 * @param consumptionEnergetic    Consumo energético. Pode ser nulo.
 * @param autonomyElectricMode    Autonomia no modo elétrico. Pode ser nulo.
 */
public record DataAutonomyDetails(

        @NotNull(message = "Identifier cannot be null.")
        Long id,

        BigDecimal mileagePerLiterRoad,

        BigDecimal mileagePerLiterCity,

        BigDecimal consumptionEnergetic,

        BigDecimal autonomyElectricMode
){

    /**
     * Construtor que cria uma instância de {@code DataAutonomyDetails} com base em um objeto {@link Autonomy}.
     *
     * @param autonomy Instância de {@link Autonomy} a partir da qual os detalhes da autonomia serão extraídos.
     */
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

