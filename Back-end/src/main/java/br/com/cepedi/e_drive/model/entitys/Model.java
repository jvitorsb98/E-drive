package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa um modelo de veículo no sistema. Esta entidade é mapeada para a tabela "model" no banco de dados.
 * Contém informações sobre o nome do modelo, a marca associada e se o modelo está ativado ou não.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "model")
public class Model {

    /**
     * Identificador único do modelo. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome do modelo. Este campo é obrigatório.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Marca associada ao modelo. É uma relação muitos-para-um com a entidade {@link Brand}.
     */
    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    /**
     * Indica se o modelo está ativado. Este campo é obrigatório.
     */
    @Column(name = "activated", nullable = false)
    private Boolean activated;

    /**
     * Construtor que cria uma nova instância de Model com base nos dados fornecidos em {@link DataRegisterModel}
     * e associa o modelo a uma marca específica.
     *
     * @param dataRegisterModel Objeto contendo os dados para registrar um novo modelo.
     * @param brand             Marca à qual o modelo está associado.
     */
    public Model(DataRegisterModel dataRegisterModel, Brand brand) {
        this.name = dataRegisterModel.name();
        this.brand = brand;
        this.activated = true;
    }

    /**
     * Atualiza os dados do modelo com base nas informações fornecidas em {@link DataUpdateModel}.
     *
     * @param data Objeto contendo os dados atualizados do modelo.
     */
    public void update(DataUpdateModel data) {
        if (data.name() != null) {
            this.name = data.name();
        }
    }

    /**
     * Ativa o modelo, definindo o campo {@code activated} como {@code true}.
     */
    public void activated() {
        this.activated = true;
    }

    /**
     * Desativa o modelo, definindo o campo {@code activated} como {@code false}.
     */
    public void deactivated() {
        this.activated = false;
    }

}
