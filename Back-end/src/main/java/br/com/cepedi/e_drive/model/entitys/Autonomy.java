package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "autonomy")
public class Autonomy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mileage_per_liter_road")
    private BigDecimal mileagePerLiterRoad;

    @Column(name = "mileage_per_liter_city")
    private BigDecimal mileagePerLiterCity;

    @Column(name = "consumption_energetic")
    private BigDecimal consumptionEnergetic;

    @Column(name = "autonomy_electric_mode")
    private BigDecimal autonomyElectricMode;

    public Autonomy(DataRegisterAutonomy dataRegisterAutonomy) {
        this.mileagePerLiterRoad = dataRegisterAutonomy.mileagePerLiterRoad();
        this.mileagePerLiterCity = dataRegisterAutonomy.mileagePerLiterCity();
        this.consumptionEnergetic = dataRegisterAutonomy.consumptionEnergetic();
        this.autonomyElectricMode = dataRegisterAutonomy.autonomyElectricMode();
    }

    /**
     * Atualiza os dados da autonomia com as informações fornecidas.
     *
     * @param data Objeto contendo os dados atualizados da autonomia.
     */
    public void updateAutonomy(DataRegisterAutonomy data) {
        if (data.mileagePerLiterRoad() != null) {
            this.mileagePerLiterRoad = data.mileagePerLiterRoad();
        }
        if (data.mileagePerLiterCity() != null) {
            this.mileagePerLiterCity = data.mileagePerLiterCity();
        }
        if (data.consumptionEnergetic() != null) {
            this.consumptionEnergetic = data.consumptionEnergetic();
        }
        if (data.autonomyElectricMode() != null) {
            this.autonomyElectricMode = data.autonomyElectricMode();
        }
    }
}
