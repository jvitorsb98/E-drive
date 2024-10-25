package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateAutonomy;
import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Representa a associação entre um usuário e um veículo no sistema,
 * incluindo detalhes sobre a autonomia e consumo energético do veículo.
 * Esta entidade é mapeada para a tabela "vehicle_users" no banco de dados.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "vehicle_users")
public class VehicleUser {

    /**
     * Identificador único da associação entre usuário e veículo. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Usuário associado a este veículo.
     * Este campo não pode ser nulo.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Veículo associado a este usuário.
     * Este campo não pode ser nulo.
     */
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    /**
     * Quilometragem por litro na estrada.
     * Este campo é obrigatório.
     */
    @Column(name = "mileage_per_liter_road", nullable = false)
    private BigDecimal mileagePerLiterRoad;

    /**
     * Quilometragem por litro na cidade.
     * Este campo é obrigatório.
     */
    @Column(name = "mileage_per_liter_city", nullable = false)
    private BigDecimal mileagePerLiterCity;

    /**
     * Consumo energético do veículo.
     * Este campo é obrigatório.
     */
    @Column(name = "consumption_energetic", nullable = false)
    private BigDecimal consumptionEnergetic;

    /**
     * Autonomia do veículo no modo elétrico.
     * Este campo é obrigatório.
     */
    @Column(name = "autonomy_electric_mode", nullable = false)
    private BigDecimal autonomyElectricMode;

    /**
     * Capacidade da bateria do veículo.
     */
    @Column(name = "battery_capacity")
    private BigDecimal batteryCapacity;

    /**
     * Indica se a associação entre usuário e veículo está ativada.
     * Este campo é obrigatório.
     */
    @Column(name = "activated", nullable = false)
    private boolean activated;

    /**
     * Construtor que cria uma nova instância de VehicleUser com base nos dados fornecidos.
     *
     * @param user                O usuário associado a este veículo.
     * @param vehicle             O veículo associado a este usuário.
     * @param dataRegisterAutonomy Objeto contendo os dados de autonomia do veículo.
     */
    public VehicleUser(User user, Vehicle vehicle, DataRegisterAutonomy dataRegisterAutonomy) {
        this.user = user;
        this.vehicle = vehicle;
        this.mileagePerLiterRoad = dataRegisterAutonomy.mileagePerLiterRoad();
        this.mileagePerLiterCity = dataRegisterAutonomy.mileagePerLiterCity();
        this.consumptionEnergetic = dataRegisterAutonomy.consumptionEnergetic();
        this.autonomyElectricMode = dataRegisterAutonomy.autonomyElectricMode();
        this.batteryCapacity = dataRegisterAutonomy.batteryCapacity();
        this.activated = true;
    }

    /**
     * Desativa a associação entre o usuário e o veículo.
     */
    public void disable() {
        this.activated = false;
    }

    /**
     * Ativa a associação entre o usuário e o veículo.
     */
    public void enable() {
        this.activated = true;
    }

    /**
     * Atualiza os dados de autonomia e consumo do veículo associado ao usuário.
     *
     * @param data Objeto contendo os dados atualizados de autonomia e consumo do veículo.
     */
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

        if (data.batteryCapacity() != null) {
            this.batteryCapacity = data.batteryCapacity();
        }
    }
}
