package br.com.cepedi.e_drive.model.records.propulsion.update;

import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os dados necessários para atualizar um sistema de propulsão existente.
 * Utilizado para transferir dados de entrada para a atualização de um sistema de propulsão.
 *
 * @param name Nome do sistema de propulsão. Deve ter entre 1 e 100 caracteres.
 */
public record DataUpdatePropulsion(

		/**
		 * Nome do sistema de propulsão.
		 *
		 * <p>Este campo deve ter entre 1 e 100 caracteres. Se o valor fornecido estiver fora deste intervalo,
		 * uma mensagem de erro será gerada.</p>
		 *
		 * @throws jakarta.validation.constraints.Size se o valor estiver fora do intervalo especificado.
		 */
		@Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
		String name

) {
}
