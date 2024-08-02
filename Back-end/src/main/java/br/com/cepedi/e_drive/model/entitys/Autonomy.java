package br.com.cepedi.e_drive.model.entitys;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
}
