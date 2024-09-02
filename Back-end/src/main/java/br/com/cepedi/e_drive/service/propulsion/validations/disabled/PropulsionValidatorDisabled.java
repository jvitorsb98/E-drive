package br.com.cepedi.e_drive.service.propulsion.validations.disabled;

/**
 * Interface para validação de propulsões que estão desativadas.
 *
 * Implementações desta interface devem verificar se uma propulsão pode ser considerada
 * como desativada com base no ID fornecido.
 */
public interface PropulsionValidatorDisabled {

	/**
	 * Valida se uma propulsão com o ID especificado está desativada.
	 *
	 * @param id ID da propulsão a ser verificada.
	 * @throws ValidationException Se a validação falhar (por exemplo, se a propulsão não estiver desativada).
	 */
	void validate(Long id);
}
