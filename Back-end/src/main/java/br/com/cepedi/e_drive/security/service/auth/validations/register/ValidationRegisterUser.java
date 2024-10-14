package br.com.cepedi.e_drive.security.service.auth.validations.register;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;

/**
 * Interface para validação de dados de registro de usuário.
 * <p>
 * Implementações desta interface são responsáveis por validar as informações fornecidas durante o registro de um novo usuário.
 * </p>
 */
public interface ValidationRegisterUser {

    /**
     * Valida os dados de registro de um usuário.
     *
     * @param dataRegisterUser Os dados do usuário a serem validados.
     * @throws IllegalArgumentException Se os dados fornecidos forem inválidos.
     */
    void validation(DataRegisterUser dataRegisterUser);
}
