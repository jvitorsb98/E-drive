package br.com.cepedi.e_drive.security.model.records.update;

import java.time.LocalDate;

/**
 * Record que encapsula os dados necessários para atualizar as informações de um usuário.
 * <p>
 * Esta classe record é usada para armazenar as informações que podem ser atualizadas para um usuário,
 * incluindo o nome, o telefone celular e a data de nascimento. Todos os campos são opcionais e podem
 * ser fornecidos individualmente conforme necessário.
 * </p>
 *
 * @param name O nome do usuário. Pode ser nulo se não for fornecido.
 * @param cellPhone O telefone celular do usuário. Pode ser nulo se não for fornecido.
 * @param birth A data de nascimento do usuário. Pode ser nulo se não for fornecida.
 */
public record DataUpdateUser(
        String name,
        String cellPhone,
        LocalDate birth
) {
}
