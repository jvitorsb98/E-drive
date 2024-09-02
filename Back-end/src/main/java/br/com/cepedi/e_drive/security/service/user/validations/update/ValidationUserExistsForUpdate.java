package br.com.cepedi.e_drive.security.service.user.validations.update;

import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da validação para garantir que o usuário exista antes de realizar uma atualização.
 * <p>
 * Esta classe implementa a interface {@link UserValidationUpdate} e fornece a lógica para verificar se o usuário,
 * identificado pelo e-mail autenticado, existe no repositório. Se o usuário não existir, uma exceção é lançada.
 * </p>
 */
@Component
public class ValidationUserExistsForUpdate implements UserValidationUpdate {

    @Autowired
    private UserRepository userRepository;

    /**
     * Valida se o usuário identificado pelo e-mail autenticado existe no sistema.
     * <p>
     * Se o usuário não existir, uma exceção é lançada indicando que o usuário não foi encontrado.
     * </p>
     *
     * @param data Os dados de atualização do usuário, não utilizados nesta validação.
     * @param authenticatedEmail O e-mail do usuário autenticado que está sendo atualizado.
     * @throws RuntimeException Se o usuário não existir no repositório.
     */
    @Override
    public void validate(DataUpdateUser data, String authenticatedEmail) {
        boolean userExists = userRepository.existsByEmail(authenticatedEmail);
        if (!userExists) {
            throw new RuntimeException("User does not exist");
        }
    }
}
