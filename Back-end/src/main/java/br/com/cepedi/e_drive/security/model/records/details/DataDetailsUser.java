package br.com.cepedi.e_drive.security.model.records.details;

import br.com.cepedi.e_drive.security.model.entitys.Role;
import br.com.cepedi.e_drive.security.model.entitys.User;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Record que encapsula os detalhes de um usuário.
 * <p>
 * Esta classe record é usada para representar as informações detalhadas de um usuário,
 * incluindo ID, e-mail, nome, data de nascimento, número de celular, estado de ativação
 * e as roles associadas.
 * </p>
 *
 * @param id         O identificador único do usuário.
 * @param email      O e-mail do usuário.
 * @param name       O nome do usuário.
 * @param birth      A data de nascimento do usuário.
 * @param cellPhone  O número de telefone celular do usuário.
 * @param activated  Indica se o usuário está ativado.
 * @param roles      O conjunto de roles associadas ao usuário.
 */
public record DataDetailsUser(
        Long id,
        String email,
        String name,
        LocalDate birth,
        String cellPhone,
        Boolean activated,
        Set<DataDetailsRole> roles
) {
    /**
     * Construtor que cria um record `DataDetailsUser` a partir de uma entidade `User`.
     *
     * @param user A entidade `User` da qual os detalhes serão extraídos.
     */
    public DataDetailsUser(User user) {
        this(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getBirth(),
                user.getCellphone(),
                user.getActivated(),
                user.getRoles().stream()
                        .map(DataDetailsRole::new) // Converte Role para DataDetailsRole
                        .collect(Collectors.toSet())
        );
    }
}
