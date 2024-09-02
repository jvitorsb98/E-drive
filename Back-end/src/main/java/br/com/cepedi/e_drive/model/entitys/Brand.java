package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa uma marca no sistema. Esta entidade é mapeada para a tabela "brand" no banco de dados.
 * Contém informações sobre o nome da marca e se ela está ativada ou não.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "brand")
public class Brand {

    /**
     * Identificador único da marca. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome da marca. Este campo é obrigatório.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Indica se a marca está ativada. Este campo é obrigatório.
     */
    @Column(name = "activated", nullable = false)
    private Boolean activated;

    /**
     * Construtor que cria uma nova instância de Brand com base nos dados fornecidos em {@link DataRegisterBrand}.
     *
     * @param dataRegisterBrand Objeto contendo os dados para registrar uma nova marca.
     */
    public Brand(DataRegisterBrand dataRegisterBrand) {
        this.name = dataRegisterBrand.name();
        this.activated = true;
    }

    /**
     * Atualiza os dados da marca com base nas informações fornecidas em {@link DataUpdateBrand}.
     *
     * @param data Objeto contendo os dados atualizados da marca.
     */
    public void updateDataBrand(DataUpdateBrand data) {
        if (data.name() != null) {
            this.name = data.name();
        }
    }

    /**
     * Ativa a marca, definindo o campo {@code activated} como {@code true}.
     */
    public void activated() {
        this.activated = true;
    }

    /**
     * Desativa a marca, definindo o campo {@code activated} como {@code false}.
     */
    public void deactivated() {
        this.activated = false;
    }
}
