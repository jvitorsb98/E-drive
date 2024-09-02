package br.com.cepedi.e_drive.service.category.validations.disabled;

/**
 * Interface para validação da desativação de categorias.
 * Implementações desta interface são responsáveis por validar
 * se uma categoria pode ser desativada.
 */
public interface CategoryValidatorDisabled {

	/**
	 * Valida se uma categoria pode ser desativada com base no ID fornecido.
	 *
	 * @param id ID da categoria a ser validada.
	 */
	void validate(Long id);
}
