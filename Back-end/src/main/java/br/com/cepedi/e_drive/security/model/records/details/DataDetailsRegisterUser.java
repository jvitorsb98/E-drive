package br.com.cepedi.e_drive.security.model.records.details;

import br.com.cepedi.e_drive.security.model.entitys.User;
import java.time.LocalDate;

/**
 * Record para encapsular os detalhes de registro de um usuário.
 * <p>
 * Esta classe record é usada para representar as informações de um usuário registrado,
 * incluindo nome, e-mail, data de nascimento, telefone celular, estado de ativação e
 * o token de confirmação.
 * </p>
 *
 * @param name              O nome do usuário.
 * @param email             O e-mail do usuário.
 * @param birth             A data de nascimento do usuário.
 * @param cellphone         O número de telefone celular do usuário.
 * @param activated         Indica se o usuário está ativado.
 * @param confirmationToken O token de confirmação usado para ativar a conta do usuário.
 */
public record DataDetailsRegisterUser(
        String name,
        String email,
        LocalDate birth,
        String cellphone,
        Boolean activated,
        String confirmationToken,

        String successMessage
) {
    /**
     * Construtor que cria um record `DataDetailsRegisterUser` a partir de uma entidade `User`
     * e um token de confirmação.
     *
     * @param user              A entidade `User` da qual os detalhes serão extraídos.
     * @param confirmationToken O token de confirmação associado ao usuário.
     */
    public DataDetailsRegisterUser(User user, String confirmationToken, String successMessage) {
        this(user.getName(), user.getEmail(), user.getBirth(), user.getCellphone(), user.getActivated(), confirmationToken, successMessage);
    }
}
