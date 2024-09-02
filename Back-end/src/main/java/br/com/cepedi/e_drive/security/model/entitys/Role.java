package br.com.cepedi.e_drive.security.model.entitys;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Representa uma função (role) no sistema. Cada role pode estar associada a múltiplos usuários.
 */
@Table(name = "roles")
@Entity
@Getter
@NoArgsConstructor
@Setter
@EqualsAndHashCode(of = "id")
public class Role {

    /**
     * Identificador único da função, gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    /**
     * Nome da função, deve ser único e não nulo.
     */
    @Column(unique = true, nullable = false)
    private String name;

    /**
     * Conjunto de usuários associados a esta função.
     */
    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();

    /**
     * Constrói uma nova instância de {@link Role} com base no nome fornecido.
     *
     * @param name Nome da função.
     */
    public Role(String name) {
        this.name = name;
    }
}
