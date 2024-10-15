package br.com.cepedi.e_drive.security.model.entitys;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Representa um usuário da aplicação, implementando a interface {@link UserDetails} para integração com o Spring Security.
 * A entidade está mapeada para a tabela "users" no banco de dados.
 */
@Table(name = "users")
@Entity
@Getter
@NoArgsConstructor
@Setter
@EqualsAndHashCode(of = "id")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String name;
    private String password;
    private LocalDate birth;
    private String cellphone;

    @Column(name = "activated")
    private Boolean activated;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    /**
     * Constrói uma nova instância de {@link User} com base nos dados fornecidos durante o registro.
     *
     * @param dataRegisterUser  Dados fornecidos pelo usuário no momento do registro.
     * @param passwordEncoder   Codificador de senha para armazenar a senha de forma segura.
     */
    public User(DataRegisterUser dataRegisterUser, PasswordEncoder passwordEncoder) {
        this.email = dataRegisterUser.email();
        this.name = dataRegisterUser.name();
        this.password = passwordEncoder.encode(dataRegisterUser.password());
        this.activated = false;
        this.birth = dataRegisterUser.birth();
        this.cellphone = dataRegisterUser.cellPhone();
    }

    /**
     * Ativa a conta do usuário.
     */
    public void activate() {
        this.activated = true;
    }

    /**
     * Desativa a conta do usuário.
     */
    public void disabled() {
        this.activated = false;
    }

    /**
     * Atualiza as informações do usuário com base nos dados fornecidos.
     *
     * @param dataUpdateUser  Dados fornecidos para a atualização do usuário.
     */
    public void update(DataUpdateUser dataUpdateUser) {
        if (dataUpdateUser.name() != null) {
            this.name = dataUpdateUser.name();
        }
        if (dataUpdateUser.cellPhone() != null) {
            this.cellphone = dataUpdateUser.cellPhone();
        }
        if (dataUpdateUser.birth() != null) {
            this.birth = dataUpdateUser.birth();
        }
    }

    /**
     * Retorna as autoridades (roles) concedidas ao usuário.
     *
     * @return Coleção de {@link GrantedAuthority} representando as roles do usuário.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
    }

    /**
     * Retorna a senha do usuário.
     *
     * @return A senha do usuário.
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Retorna o nome de usuário (neste caso, o email).
     *
     * @return O email do usuário.
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Indica se a conta do usuário está expirada.
     *
     * @return true, indicando que a conta não está expirada.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indica se a conta do usuário está bloqueada.
     *
     * @return true, indicando que a conta não está bloqueada.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indica se as credenciais do usuário (senha) estão expiradas.
     *
     * @return true, indicando que as credenciais não estão expiradas.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indica se a conta do usuário está ativada.
     *
     * @return true, se a conta estiver ativada; false caso contrário.
     */
    @Override
    public boolean isEnabled() {
        return activated;
    }

    /**
     * Define as autoridades (roles) do usuário.
     *
     * @param roleUser Coleção de {@link SimpleGrantedAuthority} representando as roles do usuário.
     */
    public void setAuthorities(Set<SimpleGrantedAuthority> roleUser) {
        // Método vazio
    }

    /**
     * Verifica se o usuário está ativo.
     *
     * @return true se o usuário estiver ativo, false caso contrário.
     */
    public boolean isActive() {
        return this.activated;
    }
}
