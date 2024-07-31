package br.com.cepedi.e_drive.security.model.entitys;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import jakarta.persistence.*;
import lombok.*;



@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "mail")
public class Mail {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

    @Column(name = "sender")
    private String from;
    @Column(name = "recipient")
    private String to;
    private String content;
    private String subject;


    public Mail(DataRegisterMail data){
        this.from = data.from();
        this.to = data.to();
        this.content = data.content();
        this.subject = data.subject();
    }
}
