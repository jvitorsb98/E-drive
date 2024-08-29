package br.com.cepedi.e_drive.model.records.propulsion.input;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os dados necessários para registrar um novo sistema de propulsão.
 * Utilizado para transferir dados de entrada para a criação de um sistema de propulsão.
 *
 * @param name Nome do sistema de propulsão. Não pode ser nulo e deve ter entre 1 e 100 caracteres.
 */
public record DataRegisterPropulsion(

		/**
		 * Nome do sistema de propulsão.
		 *
		 * <p>Este campo não pode ser nulo e deve ter entre 1 e 100 caracteres.</p>
		 *
		 * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
		 * @throws jakarta.validation.constraints.Size se o valor estiver fora do intervalo especificado.
		 */
		@NotNull(message = "Name cannot be null.")
		@Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
		String name

) {
}
