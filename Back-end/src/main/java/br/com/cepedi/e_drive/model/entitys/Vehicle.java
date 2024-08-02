package br.com.cepedi.e_drive.model.entitys;

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
@Table(name = "vehicle")
public class Vehicle {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "motor")
	private String motor;

	@Column(name = "version")
	private String version;

	@Column(name = "activated")
	private Boolean activated;

	@ManyToOne
	@JoinColumn(name = "category_id") // Chave estrangeira para Category
	private Category category;

	@ManyToOne
	@JoinColumn(name = "type_id") // Chave estrangeira para VehicleType
	private VehicleType type;

	@ManyToOne
	@JoinColumn(name = "brand_id") // Chave estrangeira para Brand
	private Brand brand;

	@ManyToOne
	@JoinColumn(name = "propulsion_id") // Chave estrangeira para Propulsion
	private Propulsion propulsion;

	@ManyToOne
	@JoinColumn(name = "autonomy_id") // Chave estrangeira para Autonomy
	private Autonomy autonomy;

}
