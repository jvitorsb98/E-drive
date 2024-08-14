package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.validations.register.ValidationRegisterUser;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private List<ValidationRegisterUser> validationRegisterUserList;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails user = repository.findByEmail(email); // Atualizado para buscar pelo email
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return user;
    }

    public DataDetailsRegisterUser register(DataRegisterUser dataRegisterUser) {
        validationRegisterUserList.forEach(v -> v.validation(dataRegisterUser));
        User user = new User(dataRegisterUser, passwordEncoder);
        repository.save(user);
        String confirmationToken = tokenService.generateTokenForActivatedEmail(user);
        return new DataDetailsRegisterUser(user, confirmationToken);
    }

    public void activateUser(String token) {
        String email = JWT.decode(token).getClaim("email").asString();
        User user = repository.findByEmail(email); // Certifique-se de que este método está correto

        if (user != null) {
            user.activate();
            repository.save(user);
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }
    
    
}
