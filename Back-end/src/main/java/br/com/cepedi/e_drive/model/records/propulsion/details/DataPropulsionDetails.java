package br.com.cepedi.e_drive.model.records.propulsion.details;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os detalhes de um sistema de propulsão.
 * Utilizado para transferir informações sobre um sistema de propulsão no sistema.
 *
 * @param id Identificador único do sistema de propulsão. Não pode ser nulo.
 * @param name Nome do sistema de propulsão. Deve ter entre 1 e 100 caracteres.
 * @param activated Status de ativação do sistema de propulsão. Deve ser especificado.
 */
public record DataPropulsionDetails(

		/**
		 * Identificador único do sistema de propulsão.
		 *
		 * <p>Este campo não pode ser nulo.</p>
		 */
		@NotNull(message = "Identifier cannot be null.")
		Long id,

		/**
		 * Nome do sistema de propulsão.
		 *
		 * <p>O nome deve ter entre 1 e 100 caracteres.</p>
		 *
		 * @throws jakarta.validation.constraints.Size se o valor estiver fora do intervalo especificado.
		 */
		@Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
		String name,

		/**
		 * Status de ativação do sistema de propulsão.
		 *
		 * <p>Este campo deve ser especificado e não pode ser nulo.</p>
		 */
		@NotNull(message = "Activation status must be specified.")
		Boolean activated

) {

	/**
	 * Construtor para criar uma instância de {@code DataPropulsionDetails} a partir de uma entidade {@code Propulsion}.
	 *
	 * @param propulsion Entidade {@code Propulsion} da qual os detalhes serão extraídos.
	 */
	public DataPropulsionDetails(Propulsion propulsion) {
		this(propulsion.getId(), propulsion.getName(), propulsion.getActivated());
	}
}
