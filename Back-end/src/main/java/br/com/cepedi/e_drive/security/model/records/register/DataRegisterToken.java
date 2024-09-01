package br.com.cepedi.e_drive.security.model.records.register;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

/**
 * Record que encapsula os dados para o registro de um token.
 * <p>
 * Esta classe record é utilizada para armazenar as informações necessárias para o gerenciamento de um token,
 * incluindo o valor do token, o identificador do usuário associado e a data de expiração do token.
 * </p>
 *
 * @param token        O valor do token. Não pode estar em branco.
 * @param user_id      O identificador do usuário associado ao token. Não pode ser nulo.
 * @param expireDate   A data e hora de expiração do token. Deve ser uma data futura e não pode ser nula.
 */
public record DataRegisterToken(

        @NotBlank
        String token,

        @NotNull
        Long user_id,

        @NotNull
        @Future
        Instant expireDate

) {
}
