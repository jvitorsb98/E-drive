package br.com.cepedi.e_drive.model.records.category.register;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os dados necessários para registrar uma nova categoria.
 * Utilizado para transferir informações ao criar uma nova instância de categoria.
 *
 * @param name Nome da categoria. Não pode ser nulo e deve ter entre 1 e 100 caracteres.
 */
public record DataRegisterCategory(

		@NotNull(message = "Name cannot be null.")
		@Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
		String name

) {
}
