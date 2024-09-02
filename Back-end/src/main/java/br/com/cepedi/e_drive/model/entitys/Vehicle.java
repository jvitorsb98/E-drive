package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "vehicle")
public class Vehicle {

	/**
	 * Identificador único do veículo. Gerado automaticamente.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Descrição do motor do veículo.
	 */
	@Column(name = "motor")
	private String motor;

	/**
	 * Versão do modelo do veículo.
	 */
	@Column(name = "version")
	private String version;

	/**
	 * Modelo ao qual este veículo pertence.
	 * Mapeado como uma chave estrangeira para a tabela de Model.
	 */
	@ManyToOne
	@JoinColumn(name = "model_id")
	private Model model;

	/**
	 * Categoria à qual este veículo pertence.
	 * Mapeado como uma chave estrangeira para a tabela de Category.
	 */
	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	/**
	 * Tipo de veículo (por exemplo, SUV, Sedan).
	 * Mapeado como uma chave estrangeira para a tabela de VehicleType.
	 */
	@ManyToOne
	@JoinColumn(name = "type_id")
	private VehicleType type;

	/**
	 * Propulsão do veículo (por exemplo, elétrica, híbrida).
	 * Mapeado como uma chave estrangeira para a tabela de Propulsion.
	 */
	@ManyToOne
	@JoinColumn(name = "propulsion_id")
	private Propulsion propulsion;

	/**
	 * Autonomia do veículo (por exemplo, alcance elétrico).
	 * Mapeado como uma chave estrangeira para a tabela de Autonomy.
	 */
	@ManyToOne
	@JoinColumn(name = "autonomy_id")
	private Autonomy autonomy;

	/**
	 * Indica se o veículo está ativado.
	 */
	@Column(name = "activated")
	private boolean activated;

	/**
	 * Ano de fabricação do veículo.
	 */
	@Column(name = "year")
	private Long year;

	/**
	 * Construtor que cria uma nova instância de Vehicle com os parâmetros especificados.
	 *
	 * @param motor      Descrição do motor do veículo.
	 * @param version    Versão do modelo do veículo.
	 * @param model      Modelo ao qual este veículo pertence.
	 * @param category   Categoria à qual este veículo pertence.
	 * @param type       Tipo de veículo.
	 * @param propulsion Propulsão do veículo.
	 * @param autonomy   Autonomia do veículo.
	 * @param year       Ano de fabricação do veículo.
	 */
	public Vehicle(String motor, String version, Model model, Category category, VehicleType type, Propulsion propulsion, Autonomy autonomy, Long year) {
		this.motor = motor;
		this.version = version;
		this.model = model;
		this.category = category;
		this.type = type;
		this.propulsion = propulsion;
		this.autonomy = autonomy;
		this.year = year;
		this.activated = true;
	}

	/**
	 * Desativa o veículo, definindo o campo 'activated' como false.
	 */
	public void disable() {
		this.activated = false;
	}

	/**
	 * Ativa o veículo, definindo o campo 'activated' como true.
	 */
	public void enable() {
		this.activated = true;
	}

	/**
	 * Atualiza os dados do veículo com as informações fornecidas.
	 *
	 * @param data       Objeto contendo os dados atualizados do veículo.
	 * @param model      Novo modelo do veículo.
	 * @param category   Nova categoria do veículo.
	 * @param type       Novo tipo de veículo.
	 * @param propulsion Nova propulsão do veículo.
	 */
	public void updateDataVehicle(DataUpdateVehicle data, Model model, Category category, VehicleType type, Propulsion propulsion) {
		if (data.motor() != null) {
			this.motor = data.motor();
		}
		if (data.version() != null) {
			this.version = data.version();
		}
		if (data.year() != null) {
			this.year = data.year();
		}
		if (model != null) {
			this.model = model;
		}
		if (category != null) {
			this.category = category;
		}
		if (type != null) {
			this.type = type;
		}
		if (propulsion != null) {
			this.propulsion = propulsion;
		}
	}
}
