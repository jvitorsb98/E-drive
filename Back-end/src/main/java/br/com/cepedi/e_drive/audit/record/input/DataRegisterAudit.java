package br.com.cepedi.e_drive.audit.record.input;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Representa os dados necessários para registrar um evento de auditoria.
 * <p>
 * A classe {@link DataRegisterAudit} é um registro que encapsula as informações essenciais para criar um log de auditoria,
 * incluindo o nome do evento, a descrição, o recurso afetado e a origem do evento.
 * </p>
 *
 * @param eventName         O nome do evento a ser registrado. Este campo não pode ser nulo.
 * @param eventDescription  A descrição do evento. Este campo pode ser nulo.
 * @param affectedResource  O recurso que foi afetado pelo evento. Este campo pode ser nulo.
 * @param origin            A origem do evento, que deve ser um valor positivo. Este campo não pode ser nulo.
 */import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DataRegisterAudit(

        @NotNull
        String eventName,

        String eventDescription,

        @NotNull
        Long userId,

        @NotNull
        String userName,

        String affectedResource,

        @NotNull
        String origin


) {
}