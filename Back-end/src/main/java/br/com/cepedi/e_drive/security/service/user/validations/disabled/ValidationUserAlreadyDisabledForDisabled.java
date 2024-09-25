package br.com.cepedi.e_drive.security.service.user.validations.disabled;

import br.com.cepedi.e_drive.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Validação que verifica se um usuário já está desativado.
 *
 * Esta classe implementa a interface {@link ValidationDisabledUser} e é responsável por garantir
 * que um usuário não seja desativado se já estiver desativado. Se o usuário já estiver desativado,
 * uma exceção {@link IllegalArgumentException} é lançada.
 */
@Component
public class ValidationUserAlreadyDisabledForDisabled implements ValidationDisabledUser {

    @Autowired
    private UserRepository userRepository;

    /**
     * Valida se o usuário com o ID fornecido está ativado.
     *
     * @param id O ID do usuário a ser verificado.
     * @throws IllegalArgumentException Se o usuário já estiver desativado.
     */
    public void validation(Long id) {
        if (userRepository.existsById(id)) {
            boolean isActivated = userRepository.getReferenceById(id).getActivated();

            if (!isActivated) {
                throw new IllegalArgumentException("The user is already deactivated");
            }
        }
    }
}
