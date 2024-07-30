package br.com.cepedi.e_drive.model.entitys;
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
@Table(name = "Propulsion")
public class Propulsion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "activated")
    private Boolean activated;

    @OneToMany(mappedBy = "propulsion")
    private List<Vehicle> vehicles;

}
