package br.com.cepedi.e_drive.audit.record.details;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;

import java.util.Date;

/**
 * Representa os detalhes de um log de auditoria.
 * <p>
 * A classe {@link AuditLogDetails} é um registro que encapsula as informações relacionadas a um log de auditoria,
 * incluindo o nome do evento, a descrição, o timestamp, o ID do usuário, o recurso afetado e a origem do evento.
 * </p>
 *
 * @param eventName         O nome do evento registrado no log de auditoria.
 * @param eventDescription  A descrição do evento registrado.
 * @param timestamp         O timestamp em que o evento ocorreu.
 * @param userId            O ID do usuário associado ao evento, se disponível.
 * @param affectedResource  O recurso afetado pelo evento.
 * @param origin            A origem do evento (por exemplo, o endereço IP do cliente).
 */
public record AuditLogDetails(
        String eventName,
        String eventDescription,
        Date timestamp,
        Long userId,
        String affectedResource,
        String origin
) {

    /**
     * Constrói uma instância de {@link AuditLogDetails} a partir de um {@link AuditLog}.
     *
     * @param auditLog O log de auditoria a partir do qual os detalhes são extraídos.
     */
    public AuditLogDetails(AuditLog auditLog) {
        this(auditLog.getEventName(), auditLog.getEventDescription(), auditLog.getTimestamp(),
                auditLog.getUser() != null ? auditLog.getUser().getId() : null,
                auditLog.getAffectedResource(), auditLog.getOrigin());
    }
}
