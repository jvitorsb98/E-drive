package br.com.cepedi.e_drive.security.model.entitys;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterToken;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Table(name = "tokens")
@Entity
@Getter
@NoArgsConstructor
@Setter
@EqualsAndHashCode(of = "id")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    Instant expireDate;

    private Boolean disabled;


    public Token(DataRegisterToken dataRegisterToken, User user){
        this.token = dataRegisterToken.token();
        this.user = user;
        this.expireDate = dataRegisterToken.expireDate();
        this.disabled = false;
    }

    public void disabled(){
        this.disabled = true;
    }




}
