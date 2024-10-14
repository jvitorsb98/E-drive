package br.com.cepedi.e_drive.security.service.auth;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DadosTokenJWT;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.auth.validations.login.ValidationsLogin;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.UserService;
import br.com.cepedi.e_drive.security.service.user.validations.disabled.ValidationDisabledUser;
import br.com.cepedi.e_drive.security.service.auth.validations.register.ValidationRegisterUser;
import com.auth0.jwt.JWT;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    private UserService userService;

    @Autowired
    private List<ValidationRegisterUser> validationRegisterUserList;

    @Autowired
    private List<ValidationDisabledUser> validationDisabledUserList;

    @Autowired
    private List<ValidationsLogin> validationsLoginList;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private AuthenticationManager manager;


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



        return new DataDetailsRegisterUser(user,confirmationToken);
    }

    public DadosTokenJWT login(DataAuth dataAuth) {
        validationsLoginList.forEach(v -> v.validate(dataAuth));

        try {
            User user = userService.getUserActivatedByEmail(dataAuth.login());
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(dataAuth.login(), dataAuth.password());
            Authentication authentication = manager.authenticate(authenticationToken);
            String tokenJWT = tokenService.generateToken(user);
            return new DadosTokenJWT(tokenJWT);

        } catch (BadCredentialsException e) {
            String errorMessage = messageSource.getMessage(
                    "auth.login.invalid.credentials",
                    null,
                    LocaleContextHolder.getLocale()
            );
            throw new ValidationException(errorMessage);
        }
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
     * Reativa um usuário com base no token fornecido.
     *
     * @param token O token de confirmação de ativação do usuário.
     * @throws UsernameNotFoundException Se nenhum usuário for encontrado com o email associado ao token.
     * @throws IllegalStateException Se o usuário já estiver ativo.
     */
    public void reactivateUser(String token) {
        String email = JWT.decode(token).getClaim("email").asString();
        User user = repository.findByEmail(email);

        if (user != null) {
            if (!user.isActive()) {
                user.activate();
                repository.save(user);
            } else {
                throw new IllegalStateException("User is already active.");
            }
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


    /**
     * Desativa um usuário com o ID fornecido.
     *
     * Este método executa as validações definidas na lista de validações de usuários desativados
     * antes de desativar o usuário. Se todas as validações forem bem-sucedidas, o usuário será
     * marcado como desativado e salvo no repositório.
     *
     * @param id O ID do usuário a ser desativado.
     * @throws IllegalArgumentException Se alguma validação falhar, indicando que o usuário não pode ser desativado.
     * @throws EntityNotFoundException Se não houver um usuário com o ID fornecido no repositório.
     */
    public void disableUser(Long id) {
        validationDisabledUserList.forEach(v -> v.validation(id));
        User user = repository.getReferenceById(id);
        user.disabled();
        repository.save(user);
    }


    /**
     * Recupera um usuário a partir de um token JWT fornecido.
     *
     * Este método extrai o email associado ao token JWT, que é utilizado para buscar
     * o usuário correspondente no repositório.
     *
     * @param token O token JWT fornecido, que pode ou não conter o prefixo "Bearer ".
     *              Se o prefixo "Bearer " estiver presente, ele será removido antes de processar o token.
     * @return O {@link User} associado ao email extraído do token.
     *         Se nenhum usuário for encontrado com o email extraído, este método retornará {@code null}.
     */
    public User getUserByToken(String token) {
        String tokenWithoutBearer = token.replace("Bearer ", "");
        String email = tokenService.getEmailByToken(tokenWithoutBearer);

        return repository.findByEmail(email);
    }

}


