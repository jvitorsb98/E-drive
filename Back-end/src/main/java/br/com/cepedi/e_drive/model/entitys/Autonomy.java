package br.com.cepedi.e_drive.model.entitys;
import java.math.BigDecimal;
import java.util.List;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Autonomy")
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

    @OneToMany(mappedBy = "autonomy")
    private List<Vehicle> vehicles;

}
