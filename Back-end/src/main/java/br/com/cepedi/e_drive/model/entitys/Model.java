package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
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
@Table(name = "model")
public class Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "activated", nullable = false)
    private Boolean activated;


    public Model(DataRegisterModel dataRegisterModel, Brand brand) {
        this.name = dataRegisterModel.name();
        this.brand = brand;
        this.activated =  true;
    }

    public void update(DataUpdateModel data) {
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

}
