package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
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

    @Column(name = "activated", nullable = false)
    private Boolean activated;

    public Model(DataRegisterModel dataRegisterModel) {
        this.name = dataRegisterModel.name();
        this.activated = dataRegisterModel.activated() != null ? dataRegisterModel.activated() : false;
    }

    public void activated() {
        this.activated = true;
    }

    public void deactivated() {
        this.activated = false;
    }

}
