package br.com.cepedi.e_drive.security.service.user.validations.update;

import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;

/**
 * Interface para validação de atualizações de usuário.
 * <p>
 * Define o contrato para classes que implementam a lógica de validação para atualizações de usuário.
 * A validação deve ser realizada com base nos dados de atualização fornecidos e no e-mail do usuário autenticado.
 * </p>
 */
public interface UserValidationUpdate {

    /**
     * Valida os dados de atualização do usuário.
     * <p>
     * A implementação deve verificar se os dados de atualização são válidos para o usuário identificado
     * pelo e-mail autenticado. Se a validação falhar, uma exceção apropriada deve ser lançada.
     * </p>
     *
     * @param data Os dados de atualização do usuário que precisam ser validados.
     * @param authenticatedEmail O e-mail do usuário autenticado que está realizando a atualização.
     */
    void validate(DataUpdateUser data, String authenticatedEmail);
}
