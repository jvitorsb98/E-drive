package br.com.cepedi.e_drive.model.records.brand.input;

import jakarta.validation.constraints.NotBlank;

/**
 * Record que encapsula os dados necessários para registrar uma nova marca.
 * Utilizado para transferir informações ao criar uma nova instância de marca.
 *
 * @param name Nome da marca. Não pode estar em branco.
 */
public record DataRegisterBrand(

        @NotBlank(message = "Name cannot be blank")
        String name

) {
}
