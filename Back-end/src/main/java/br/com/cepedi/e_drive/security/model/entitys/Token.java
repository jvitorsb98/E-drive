package br.com.cepedi.e_drive.security.model.entitys;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterToken;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Representa um token de autenticação no sistema, associado a um usuário específico.
 */
@Table(name = "tokens")
@Entity
@Getter
@NoArgsConstructor
@Setter
@EqualsAndHashCode(of = "id")
public class Token {

    /**
     * Identificador único do token, gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    /**
     * String que representa o token de autenticação.
     */
    String token;

    /**
     * O usuário ao qual este token está associado.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Data e hora em que o token expira.
     */
    Instant expireDate;

    /**
     * Indica se o token está desativado.
     */
    private Boolean disabled;

    /**
     * Constrói uma nova instância de {@link Token} com base nos dados fornecidos.
     *
     * @param dataRegisterToken Os dados para registrar o token.
     * @param user O usuário ao qual o token está associado.
     */
    public Token(DataRegisterToken dataRegisterToken, User user) {
        this.token = dataRegisterToken.token();
        this.user = user;
        this.expireDate = dataRegisterToken.expireDate();
        this.disabled = false;
    }

    /**
     * Desativa o token, marcando-o como desativado.
     */
    public void disabled() {
        this.disabled = true;
    }
}
