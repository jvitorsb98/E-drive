package br.com.cepedi.e_drive.model.entitys;


import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateAutonomy;
import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "vehicle_users")
public class VehicleUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "mileage_per_liter_road", nullable = false)
    private BigDecimal mileagePerLiterRoad;

    @Column(name = "mileage_per_liter_city", nullable = false)
    private BigDecimal mileagePerLiterCity;

    @Column(name = "consumption_energetic", nullable = false)
    private BigDecimal consumptionEnergetic;

    @Column(name = "autonomy_electric_mode", nullable = false)
    private BigDecimal autonomyElectricMode;

    @Column(name = "activated", nullable = false)
    private boolean activated;

    public VehicleUser(User user, Vehicle vehicle, DataRegisterAutonomy dataRegisterAutonomy) {
        this.user = user;
        this.vehicle = vehicle;
        this.mileagePerLiterRoad = dataRegisterAutonomy.mileagePerLiterRoad();
        this.mileagePerLiterCity = dataRegisterAutonomy.mileagePerLiterCity();
        this.consumptionEnergetic = dataRegisterAutonomy.consumptionEnergetic();
        this.autonomyElectricMode = dataRegisterAutonomy.autonomyElectricMode();
        this.activated = true;
    }

    public void disable() {
        this.activated = false;
    }

    public void enable() {
        this.activated = true;
    }

    public void updateData(DataUpdateAutonomy data) {
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
