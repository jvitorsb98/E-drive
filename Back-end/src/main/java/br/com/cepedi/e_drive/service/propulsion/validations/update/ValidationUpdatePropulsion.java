package br.com.cepedi.e_drive.service.propulsion.validations.update;

/**
 * Interface para validação de propulsões durante operações de atualização.
 *
 * Esta interface define o contrato para validar uma propulsão com base em um ID antes de realizar
 * operações de atualização. Implementações específicas desta interface devem fornecer a lógica de validação
 * necessária para garantir que a propulsão atenda aos critérios desejados para a atualização.
 */
public interface ValidationUpdatePropulsion {

	/**
	 * Valida uma propulsão com o ID especificado para operações de atualização.
	 *
	 * @param id ID da propulsão a ser validada.
	 * @throws ValidationException Se a propulsão não atender aos critérios de validação para atualização.
	 */
	void validate(Long id);
}
