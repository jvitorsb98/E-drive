package br.com.cepedi.e_drive.security.model.records.register;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Record que encapsula os dados para o registro de um e-mail.
 * <p>
 * Esta classe record é utilizada para armazenar as informações necessárias para o envio de um e-mail,
 * incluindo remetente, destinatário, conteúdo e assunto.
 * </p>
 *
 * @param from    O endereço de e-mail do remetente. Deve ser um e-mail válido e não pode estar em branco.
 * @param to      O endereço de e-mail do destinatário. Deve ser um e-mail válido e não pode estar em branco.
 * @param content O conteúdo do e-mail. Não pode estar em branco.
 * @param subject O assunto do e-mail.
 */
public record DataRegisterMail(

        @Email(message = "{invalid.email.from}")
        @NotBlank(message = "{notblank.email.from}")
        String from,

        @Email(message = "{invalid.email.to}")
        @NotBlank(message = "{notblank.email.to}")
        String to,

        @NotBlank(message = "{notblank.email.content}")
        String content,

        String subject
) {

}
