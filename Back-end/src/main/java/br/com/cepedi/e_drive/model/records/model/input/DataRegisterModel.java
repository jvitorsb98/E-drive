package br.com.cepedi.e_drive.model.records.model.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Record que encapsula os dados necessários para o registro de um novo modelo de veículo.
 * Utilizado para transferir informações quando um novo modelo é registrado no sistema.
 *
 * @param name Nome do modelo de veículo.
 * @param idBrand Identificador da marca associada ao modelo. Deve corresponder a uma marca existente no sistema.
 */
public record DataRegisterModel(

        /**
         * Nome do modelo de veículo.
         *
         * @throws jakarta.validation.constraints.NotBlank se o valor for nulo ou uma string vazia.
         */
        @NotBlank(message = "Name cannot be blank")
        String name,

        /**
         * Identificador da marca associada ao modelo.
         *
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull
        Long idBrand

) {
}
