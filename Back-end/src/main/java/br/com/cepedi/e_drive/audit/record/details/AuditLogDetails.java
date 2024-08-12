package br.com.cepedi.e_drive.audit.record.details;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;

import java.util.Date;

public record AuditLogDetails(
        String eventName,
        String eventDescription,
        Date timestamp,
        Long userId,
        String affectedResource,
        String origin
) {

    public AuditLogDetails(AuditLog auditLog){
        this(auditLog.getEventName(),auditLog.getEventDescription(),auditLog.getTimestamp(),auditLog.getUser().getId(),auditLog.getAffectedResource(),auditLog.getOrigin());
    }


}


