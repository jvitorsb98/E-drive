package br.com.cepedi.e_drive.model.records.category.details;

import br.com.cepedi.e_drive.model.entitys.Category;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os detalhes de uma categoria.
 * Utilizado para transferir dados detalhados sobre uma categoria específica.
 *
 * @param id        Identificador único da categoria. Não pode ser nulo.
 * @param name      Nome da categoria. Deve ter entre 1 e 100 caracteres. Não pode ser nulo.
 * @param activated Indicador se a categoria está ativada ou não. Não pode ser nulo.
 */
public record DataCategoryDetails(

        @NotNull(message = "Identifier cannot be null.")
        Long id,

        @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
        String name,

        @NotNull(message = "Activation status must be specified.")
        Boolean activated

) {
    /**
     * Construtor que cria uma instância de {@code DataCategoryDetails} com base em um objeto {@link Category}.
     *
     * @param category Instância de {@link Category} a partir da qual os detalhes da categoria serão extraídos.
     */
    public DataCategoryDetails(Category category) {
        this(category.getId(), category.getName(), category.getActivated());
    }
}
