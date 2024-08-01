package br.com.cepedi.e_drive.model.entitys;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Vehicle")
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
	@JoinColumn(name = "category_id")
	private Category category;

	@ManyToOne
	@JoinColumn(name = "type")
	private VehicleType type;

	@ManyToOne
	@JoinColumn(name = "brand")
	private Brand brand;

	@ManyToOne
	@JoinColumn(name = "propulsion")
	private Propulsion propulsion;

	@ManyToOne
	@JoinColumn(name = "autonomy_id")
	private Autonomy autonomy;

}

