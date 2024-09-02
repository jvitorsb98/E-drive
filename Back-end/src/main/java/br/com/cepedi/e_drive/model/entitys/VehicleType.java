package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa um tipo de veículo no sistema.
 * Esta entidade é mapeada para a tabela "vehicle_type" no banco de dados.
 * Contém informações sobre o nome do tipo de veículo e se ele está ativado ou não.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicle_type")
public class VehicleType {

    /**
     * Identificador único do tipo de veículo. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome do tipo de veículo. Este campo é obrigatório.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Indica se o tipo de veículo está ativado. Este campo é obrigatório.
     */
    @Column(name = "activated", nullable = false)
    private boolean activated;

    /**
     * Construtor que cria uma nova instância de VehicleType com base nos dados fornecidos em {@link DataRegisterVehicleType}.
     *
     * @param dataRegisterVehicleType Objeto contendo os dados para registrar um novo tipo de veículo.
     */
    public VehicleType(DataRegisterVehicleType dataRegisterVehicleType) {
        this.name = dataRegisterVehicleType.name();
        this.activated = true;
    }

    /**
     * Atualiza os dados do tipo de veículo com base nas informações fornecidas em {@link DataUpdateVehicleType}.
     *
     * @param data Objeto contendo os dados atualizados do tipo de veículo.
     */
    public void updateDataVehicleType(DataUpdateVehicleType data) {
        if (data.name() != null) {
            this.name = data.name();
        }
    }

    /**
     * Ativa o tipo de veículo, definindo o campo {@code activated} como {@code true}.
     */
    public void activated() {
        this.activated = true;
    }

    /**
     * Desativa o tipo de veículo, definindo o campo {@code activated} como {@code false}.
     */
    public void disabled() {
        this.activated = false;
    }
}
