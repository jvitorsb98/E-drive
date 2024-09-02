package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.category.register.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa uma categoria no sistema. Esta entidade é mapeada para a tabela "category" no banco de dados.
 * Contém informações sobre o nome da categoria e se ela está ativada ou não.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "category")
public class Category {

    /**
     * Identificador único da categoria. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome da categoria. Este campo é obrigatório.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Indica se a categoria está ativada. Este campo é obrigatório.
     */
    @Column(name = "activated", nullable = false)
    private Boolean activated;

    /**
     * Construtor que cria uma nova instância de Category com base nos dados fornecidos em {@link DataRegisterCategory}.
     *
     * @param dataRegisterCategory Objeto contendo os dados para registrar uma nova categoria.
     */
    public Category(DataRegisterCategory dataRegisterCategory) {
        this.name = dataRegisterCategory.name();
        this.activated = true;
    }

    /**
     * Atualiza os dados da categoria com base nas informações fornecidas em {@link DataUpdateCategory}.
     *
     * @param data Objeto contendo os dados atualizados da categoria.
     */
    public void update(DataUpdateCategory data) {
        if (data.name() != null) {
            this.name = data.name();
        }
    }

    /**
     * Ativa a categoria, definindo o campo {@code activated} como {@code true}.
     */
    public void activated() {
        this.activated = true;
    }

    /**
     * Desativa a categoria, definindo o campo {@code activated} como {@code false}.
     */
    public void deactivated() {
        this.activated = false;
    }
}
