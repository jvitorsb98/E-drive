package br.com.cepedi.e_drive.service.category.validations.update;

/**
 * Interface para validação de categorias durante operações de atualização.
 * Implementações desta interface devem definir uma lógica de validação que
 * será executada antes de permitir a atualização de uma categoria.
 */
public interface CategoryValidatorUpdate {

	/**
	 * Valida a categoria com base no ID fornecido.
	 *
	 * @param id ID da categoria a ser validada.
	 * @throws IllegalArgumentException se a validação falhar.
	 */
	void validate(Long id);
}