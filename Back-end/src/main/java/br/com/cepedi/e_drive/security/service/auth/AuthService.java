package br.com.cepedi.e_drive.security.service.auth;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.validations.register.ValidationRegisterUser;
import com.auth0.jwt.JWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável pela autenticação e gerenciamento de usuários.
 * <p>
 * Esta classe implementa {@link UserDetailsService} para fornecer detalhes do usuário
 * e gerenciar as operações relacionadas ao registro, ativação e logout de usuários.
 * </p>
 */
@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private List<ValidationRegisterUser> validationRegisterUserList;

    /**
     * Carrega um {@link UserDetails} com base no email fornecido.
     *
     * @param email O email do usuário a ser carregado.
     * @return Os detalhes do usuário correspondente ao email fornecido.
     * @throws UsernameNotFoundException Se nenhum usuário for encontrado com o email fornecido.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails user = repository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return user;
    }

    /**
     * Registra um novo usuário com base nos dados fornecidos.
     *
     * @param dataRegisterUser Os dados do usuário a ser registrado.
     * @return Um {@link DataDetailsRegisterUser} contendo os detalhes do usuário registrado e o token de confirmação.
     */
    public DataDetailsRegisterUser register(DataRegisterUser dataRegisterUser) {
        validationRegisterUserList.forEach(v -> v.validation(dataRegisterUser));
        User user = new User(dataRegisterUser, passwordEncoder);
        repository.save(user);
        String confirmationToken = tokenService.generateTokenForActivatedEmail(user);
        return new DataDetailsRegisterUser(user, confirmationToken);
    }

    /**
     * Ativa um usuário com base no token fornecido.
     *
     * @param token O token de confirmação de ativação do usuário.
     * @throws UsernameNotFoundException Se nenhum usuário for encontrado com o email associado ao token.
     */
    public void activateUser(String token) {
        String email = JWT.decode(token).getClaim("email").asString();
        User user = repository.findByEmail(email);

        if (user != null) {
            user.activate();
            repository.save(user);
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }

    /**
     * Realiza o logout do usuário com base no token fornecido.
     *
     * @param token O token de logout.
     * @throws IllegalArgumentException Se o token for inválido ou expirado.
     */
    public void logout(String token) {
        String tokenWithoutBearer = token.replace("Bearer ", "");
        if (tokenService.isValidToken(tokenWithoutBearer)) {
            tokenService.revokeToken(tokenWithoutBearer);
        } else {
            throw new IllegalArgumentException("Invalid or expired token.");
        }
    }
}
