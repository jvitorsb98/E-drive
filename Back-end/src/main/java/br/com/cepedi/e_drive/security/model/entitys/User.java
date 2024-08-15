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
    private LocalDate birth; // Adicionado
    private String cellphone; // Adicionado
    private Boolean activated;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    public User(DataRegisterUser dataRegisterUser, PasswordEncoder passwordEncoder) {
        this.email = dataRegisterUser.email();
        this.name = dataRegisterUser.name();
        this.password = passwordEncoder.encode(dataRegisterUser.password());
        this.activated = false;
        this.birth = dataRegisterUser.birth(); // Adicionado
        this.cellphone = dataRegisterUser.cellPhone(); // Adicionado
    }

    public void activate() {
        this.activated = true;
    }

    public void disabled() {
        this.activated = false;
    }

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Alterado para email
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activated; // Alterado para refletir o estado de ativação
    }

    public void setAuthorities(Set<SimpleGrantedAuthority> roleUser) {
    }

    public void setPassword(String encode) {
    }
}
