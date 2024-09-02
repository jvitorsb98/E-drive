package br.com.cepedi.e_drive.security.model.entitys;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import jakarta.persistence.*;
import lombok.*;

/**
 * Representa um email na aplicação. Esta classe é mapeada para a tabela "mail" no banco de dados.
 * Contém informações sobre o remetente, destinatário, conteúdo e assunto do email.
 */
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "mail")
public class Mail {

    /**
     * Identificador único do email, gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Remetente do email.
     */
    @Column(name = "sender")
    private String from;

    /**
     * Destinatário do email.
     */
    @Column(name = "recipient")
    private String to;

    /**
     * Conteúdo do email.
     */
    private String content;

    /**
     * Assunto do email.
     */
    private String subject;

    /**
     * Constrói uma nova instância de {@link Mail} com base nos dados fornecidos.
     *
     * @param data Os dados necessários para criar um email.
     */
    public Mail(DataRegisterMail data){
        this.from = data.from();
        this.to = data.to();
        this.content = data.content();
        this.subject = data.subject();
    }
}
