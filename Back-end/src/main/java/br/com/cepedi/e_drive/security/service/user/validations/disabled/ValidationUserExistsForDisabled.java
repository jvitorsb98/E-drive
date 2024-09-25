package br.com.cepedi.e_drive.security.service.user.validations.disabled;

import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Classe de validação que verifica se um usuário existe antes de desativá-lo.
 *
 * Esta classe implementa a interface {@link ValidationDisabledUser} e fornece
 * a lógica para validar a existência de um usuário com base em seu ID.
 */
@Component
public class ValidationUserExistsForDisabled implements ValidationDisabledUser {

    @Autowired
    private UserRepository userRepository;

    /**
     * Valida se o usuário com o ID fornecido existe no repositório.
     *
     * @param id O ID do usuário a ser verificado.
     * @throws ValidationException Se o usuário não existir.
     */
    public void validation(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ValidationException("The user does not exist");
        }
    }
}
