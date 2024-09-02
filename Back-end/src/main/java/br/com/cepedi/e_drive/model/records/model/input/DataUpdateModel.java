package br.com.cepedi.e_drive.model.records.model.input;

import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os dados necessários para atualizar um modelo de veículo existente.
 * Utilizado para transferir informações quando um modelo é atualizado no sistema.
 *
 * @param name Nome do modelo de veículo a ser atualizado. Pode ser nulo se não houver alteração no nome.
 * @param idBrand Identificador da marca associada ao modelo. Pode ser nulo se não houver alteração na marca.
 */
public record DataUpdateModel(

        /**
         * Nome do modelo de veículo a ser atualizado.
         *
         * <p>O nome do modelo deve ter no máximo 100 caracteres.</p>
         *
         * @throws jakarta.validation.constraints.Size se o valor exceder o limite de 100 caracteres.
         */
        @Size(max = 100, message = "{size.model.name}")
        String name,

        /**
         * Identificador da marca associada ao modelo.
         *
         * <p>O identificador da marca pode ser nulo se não houver alteração na marca.</p>
         */
        Long idBrand

) {
}
