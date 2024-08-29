package br.com.cepedi.e_drive.model.records.model.details;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;

/**
 * Record que encapsula os detalhes de um modelo de veículo.
 * Utilizado para transferir informações detalhadas sobre um modelo específico de veículo.
 *
 * @param id Identificador único do modelo.
 * @param brand Detalhes da marca associada ao modelo. Representado pelo record {@link DataBrandDetails}.
 * @param name Nome do modelo.
 * @param activated Status de ativação do modelo.
 */
public record DataModelDetails(

        Long id,

        DataBrandDetails brand,

        String name,

        Boolean activated

) {
    /**
     * Construtor que inicializa o record com base em uma instância da entidade {@link Model}.
     *
     * @param model Instância da entidade {@link Model} utilizada para preencher os dados do record.
     */
    public DataModelDetails(Model model) {
        this(model.getId(), new DataBrandDetails(model.getBrand()), model.getName(), model.getActivated());
    }
}
