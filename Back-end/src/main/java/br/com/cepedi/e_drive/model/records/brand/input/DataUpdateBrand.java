package br.com.cepedi.e_drive.model.records.brand.input;

import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os dados necessários para atualizar uma marca existente.
 * Utilizado para transferir informações ao atualizar uma instância de marca.
 *
 * @param name Nome da marca. Deve ter no máximo 100 caracteres. Pode ser nulo.
 */
public record DataUpdateBrand(

        @Size(max = 100, message = "{size.brand.name}")
        String name

) {
}
