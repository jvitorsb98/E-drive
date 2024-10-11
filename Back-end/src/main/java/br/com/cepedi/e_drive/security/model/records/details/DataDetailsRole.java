package br.com.cepedi.e_drive.security.model.records.details;

import br.com.cepedi.e_drive.security.model.entitys.Role;

/**
 * Record para encapsular os detalhes de uma função (role).
 * <p>
 * Esta classe record é usada para representar os detalhes de uma função no sistema,
 * encapsulando as informações principais como identificador e nome.
 * </p>
 *
 * @param id   O identificador único da função.
 * @param name O nome da função.
 */
public record DataDetailsRole(
        Long id,
        String name
) {
    /**
     * Construtor que cria um record `DataDetailsRole` a partir de uma entidade `Role`.
     *
     * @param role A entidade `Role` da qual os detalhes serão extraídos.
     */
    public DataDetailsRole(Role role) {
        this(role.getId(), role.getName());
    }
}
