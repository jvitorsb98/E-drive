package br.com.cepedi.e_drive.audit.entitys;

import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;

/**
 * Entidade que representa um log de auditoria na aplicação.
 * <p>
 * A classe {@link AuditLog} é responsável por armazenar informações sobre eventos que ocorrem na aplicação.
 * Ela inclui detalhes sobre o evento, a data e hora em que ocorreu, o usuário associado, e outros detalhes
 * relevantes para auditoria e rastreamento.
 * </p>
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "audit_log")
public class AuditLog {

    /**
     * Identificador único do log de auditoria.
     * <p>
     * Este campo é gerado automaticamente pelo banco de dados.
     * </p>
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome do evento que gerou o log de auditoria.
     * <p>
     * Este campo não pode ser nulo e deve ser único na tabela.
     * </p>
     */
    @NotNull(message = "EventName must not be null")
    @Column(unique = true, nullable = false)
    private String eventName;

    /**
     * Descrição detalhada do evento que gerou o log.
     * <p>
     * Este campo é opcional e pode ser usado para fornecer mais informações sobre o evento.
     * </p>
     */
    private String eventDescription;

    /**
     * Data e hora em que o evento ocorreu.
     * <p>
     * Este campo é preenchido automaticamente com a data e hora atuais no momento da criação do log.
     * </p>
     */
    private Date timestamp;

    /**
     * Usuário associado ao evento registrado.
     * <p>
     * Este campo faz referência a um usuário existente na tabela {@link User}.
     * </p>
     */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Recurso afetado pelo evento.
     * <p>
     * Este campo é opcional e pode ser usado para especificar o recurso que foi afetado pelo evento.
     * </p>
     */
    private String affectedResource;

    /**
     * Origem do evento que gerou o log.
     * <p>
     * Este campo é opcional e pode ser usado para indicar a origem do evento.
     * </p>
     */
    private String origin;

    /**
     * Construtor da classe {@link AuditLog} que inicializa o log com os dados fornecidos e o usuário associado.
     *
     * @param data Os dados do evento para registrar no log.
     * @param user O usuário associado ao evento.
     */
    public AuditLog(DataRegisterAudit data, User user) {
        this.eventName = data.eventName();
        this.eventDescription = data.eventDescription();
        this.timestamp = new Date();
        this.user = user;
        this.affectedResource = data.affectedResource();
        this.origin = data.origin();
    }
}