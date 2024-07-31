package br.com.cepedi.e_drive.security.model.records.details;

import br.com.cepedi.e_drive.security.model.entitys.Mail;

public record DataDetailsMail(
        Long id,
        String from,
        String to,
        String content,
        String subject
) {
    public DataDetailsMail(Mail mail) {
        this( mail.getId(), mail.getFrom(), mail.getTo(), mail.getContent(), mail.getSubject());
    }
}