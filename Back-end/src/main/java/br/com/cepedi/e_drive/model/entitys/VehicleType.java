package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
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
@Table(name = "vehicle_type")
public class VehicleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "activated", nullable = false)
    private Boolean activated;

    @Column(name = "disabled", nullable = false)
    private Boolean disabled;

    public VehicleType(DataRegisterVehicleType dataRegisterVehicleType) {
        this.name = dataRegisterVehicleType.name();
        this.activated = dataRegisterVehicleType.activated() != null ? dataRegisterVehicleType.activated() : false;
    }

    public void updateDataVehicleType(DataUpdateVehicleType data) {
        if (data.name() != null) {
            this.name = data.name();
        }
    }

    public void activated() {
        this.activated = true;
    }

    public void deactivated() {
        this.activated = false;
    }

    public void disable() {
        this.disabled = true;
    }

    public void enable() {
        this.disabled = false;
    }
}
