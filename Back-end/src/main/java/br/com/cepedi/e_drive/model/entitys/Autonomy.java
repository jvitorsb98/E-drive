package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Representa a autonomia de um veículo no sistema. Esta entidade é mapeada para a tabela "autonomy" no banco de dados.
 * Contém informações sobre a quilometragem por litro na estrada e na cidade, consumo energético e autonomia em modo elétrico.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "autonomy")
public class Autonomy {

    /**
     * Identificador único da autonomia. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Quilometragem por litro na estrada. Pode ser nulo.
     */
    @Column(name = "mileage_per_liter_road")
    private BigDecimal mileagePerLiterRoad;

    /**
     * Quilometragem por litro na cidade. Pode ser nulo.
     */
    @Column(name = "mileage_per_liter_city")
    private BigDecimal mileagePerLiterCity;

    /**
     * Consumo energético do veículo. Pode ser nulo.
     */
    @Column(name = "consumption_energetic")
    private BigDecimal consumptionEnergetic;

    /**
     * Autonomia em modo elétrico do veículo. Pode ser nulo.
     */
    @Column(name = "autonomy_electric_mode")
    private BigDecimal autonomyElectricMode;


    /**
     * Construtor que cria uma nova instância de Autonomy com base nos dados fornecidos em {@link DataRegisterAutonomy}.
     *
     * @param dataRegisterAutonomy Objeto contendo os dados para registrar uma nova autonomia.
     */
    public Autonomy(DataRegisterAutonomy dataRegisterAutonomy) {
        this.mileagePerLiterRoad = dataRegisterAutonomy.mileagePerLiterRoad();
        this.mileagePerLiterCity = dataRegisterAutonomy.mileagePerLiterCity();
        this.consumptionEnergetic = dataRegisterAutonomy.consumptionEnergetic();
        this.autonomyElectricMode = dataRegisterAutonomy.autonomyElectricMode();
    }
}
