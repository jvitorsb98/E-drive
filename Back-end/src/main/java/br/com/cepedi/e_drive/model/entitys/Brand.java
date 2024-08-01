package br.com.cepedi.e_drive.model.entitys;

import java.util.List;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
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
@Table(name = "brand")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)  // nullable = false se o nome não pode ser nulo
    private String name;

    @Column(name = "activated", nullable = false)
    private Boolean activated;

    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehicle> vehicles;


    public Brand(DataRegisterBrand dataRegisterBrand) {
        this.name = dataRegisterBrand.name();
        this.activated = dataRegisterBrand.activated() != null ? dataRegisterBrand.activated() : false;
        this.vehicles = dataRegisterBrand.vehicles();
    }


    public void updateDataBrand(DataUpdateBrand data) {
        if (data.name() != null) {
            this.name = data.name();
        }
        if (data.vehicles() != null) {
            this.vehicles = data.vehicles();
        }
    }
    public void activated() {
        this.activated = true;
    }
    public void deactivated() {
        this.activated = false;
    }
}
