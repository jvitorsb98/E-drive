package br.com.cepedi.e_drive.security.model.records.details;

import br.com.cepedi.e_drive.security.model.entitys.Mail;

/**
 * Record para encapsular os detalhes de um e-mail.
 * <p>
 * Esta classe record é usada para representar os detalhes de um e-mail enviado ou recebido,
 * encapsulando as informações principais como remetente, destinatário, conteúdo e assunto.
 * </p>
 *
 * @param id      O identificador único do e-mail.
 * @param from    O remetente do e-mail.
 * @param to      O destinatário do e-mail.
 * @param content O conteúdo do e-mail.
 * @param subject O assunto do e-mail.
 */
public record DataDetailsMail(
        Long id,
        String from,
        String to,
        String content,
        String subject
) {
    /**
     * Construtor que cria um record `DataDetailsMail` a partir de uma entidade `Mail`.
     *
     * @param mail A entidade `Mail` da qual os detalhes serão extraídos.
     */
    public DataDetailsMail(Mail mail) {
        this(mail.getId(), mail.getFrom(), mail.getTo(), mail.getContent(), mail.getSubject());
    }
}
