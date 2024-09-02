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
 */
public record DataRegisterAudit(

        /**
         * O nome do evento a ser registrado.
         * <p>
         * Este campo é obrigatório e não pode ser nulo.
         * </p>
         */
        @NotNull
        String eventName,

        /**
         * A descrição do evento.
         * <p>
         * Este campo é opcional e pode ser nulo.
         * </p>
         */
        String eventDescription,

        /**
         * O recurso que foi afetado pelo evento.
         * <p>
         * Este campo é opcional e pode ser nulo.
         * </p>
         */
        String affectedResource,

        /**
         * A origem do evento, que deve ser um valor positivo.
         * <p>
         * Este campo é obrigatório e não pode ser nulo.
         * </p>
         */
        @NotNull
        @Positive
        String origin

) {
}
