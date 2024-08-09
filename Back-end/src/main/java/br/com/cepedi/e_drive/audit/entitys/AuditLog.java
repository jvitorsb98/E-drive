package br.com.cepedi.e_drive.audit.entitys;

import java.util.Date;

import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "audit_log")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "EventName must not be null") // Validação no nível da aplicação
    @Column(unique = true, nullable = false)
    private String eventName;
    private String eventDescription;
    private Date timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String affectedResource;
    private String origin;

}