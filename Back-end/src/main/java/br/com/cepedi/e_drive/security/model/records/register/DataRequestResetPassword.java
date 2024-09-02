package br.com.cepedi.e_drive.security.model.records.register;

import jakarta.validation.constraints.NotBlank;

/**
 * Record que encapsula os dados necessários para uma solicitação de redefinição de senha.
 * <p>
 * Esta classe record é utilizada para armazenar o endereço de e-mail do usuário que está solicitando
 * a redefinição de senha. O e-mail deve ser fornecido e não pode estar em branco.
 * </p>
 *
 * @param email O endereço de e-mail do usuário. Não pode estar em branco.
 */
public record DataRequestResetPassword(

        @NotBlank(message = "{notblank.user.email}")
        String email

) {
}
