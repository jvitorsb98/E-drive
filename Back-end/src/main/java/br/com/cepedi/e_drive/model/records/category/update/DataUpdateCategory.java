package br.com.cepedi.e_drive.model.records.category.update;

/**
 * Record que encapsula os dados necessários para atualizar uma categoria existente.
 * Utilizado para transferir informações ao modificar uma instância existente de categoria.
 *
 * @param name Novo nome da categoria. Pode ser nulo se não houver alteração desejada.
 */
public record DataUpdateCategory(

		String name

) {
}
