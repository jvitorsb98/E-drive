package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa o sistema de propulsão de um veículo no sistema.
 * Esta entidade é mapeada para a tabela "propulsion" no banco de dados.
 * Contém informações sobre o nome da propulsão e se ela está ativada ou não.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "propulsion")
public class Propulsion {

    /**
     * Identificador único da propulsão. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome da propulsão. Pode ser nulo.
     */
    @Column(name = "name")
    private String name;

    /**
     * Indica se a propulsão está ativada. Pode ser nulo.
     */
    @Column(name = "activated")
    private Boolean activated;

    /**
     * Construtor que cria uma nova instância de Propulsion com base nos dados fornecidos em {@link DataRegisterPropulsion}.
     *
     * @param data Objeto contendo os dados para registrar uma nova propulsão.
     */
    public Propulsion(DataRegisterPropulsion data) {
        this.name = data.name();
        this.activated = true;
    }

    /**
     * Atualiza os dados da propulsão com base nas informações fornecidas em {@link DataUpdatePropulsion}.
     *
     * @param data Objeto contendo os dados atualizados da propulsão.
     */
    public void update(DataUpdatePropulsion data) {
        if (data.name() != null) {
            this.name = data.name();
        }
    }

    /**
     * Ativa a propulsão, definindo o campo {@code activated} como {@code true}.
     */
    public void activated() {
        this.activated = true;
    }

    /**
     * Desativa a propulsão, definindo o campo {@code activated} como {@code false}.
     */
    public void deactivated() {
        this.activated = false;
    }
}
