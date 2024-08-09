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

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "activated", nullable = false)
    private Boolean activated;

    @Column(name = "disabled", nullable = false)
    private Boolean disabled;

    public Brand(DataRegisterBrand dataRegisterBrand) {
        this.name = dataRegisterBrand.name();
        this.activated = dataRegisterBrand.activated() != null ? dataRegisterBrand.activated() : false;
    }

    public void updateDataBrand(DataUpdateBrand data) {
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
