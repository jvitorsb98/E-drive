package br.com.cepedi.e_drive.security.service.auth;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DadosTokenJWT;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.register.*;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.auth.validations.activatedAccount.ValidationsActivatedAccount;
import br.com.cepedi.e_drive.security.service.auth.validations.login.ValidationsLogin;
import br.com.cepedi.e_drive.security.service.auth.validations.logout.ValidationLogout;
import br.com.cepedi.e_drive.security.service.auth.validations.reactivateAccountRequest.ValidationReactivateAccountRequest;
import br.com.cepedi.e_drive.security.service.auth.validations.reactivated.ValidationReactivate;
import br.com.cepedi.e_drive.security.service.auth.validations.resetPassword.ValidationResetPassword;
import br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest.ValidationResetPasswordRequest;
import br.com.cepedi.e_drive.security.service.email.EmailService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.UserService;
import br.com.cepedi.e_drive.security.service.user.validations.disabled.ValidationDisabledUser;
import br.com.cepedi.e_drive.security.service.auth.validations.register.ValidationRegisterUser;
import com.auth0.jwt.JWT;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

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

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private List<ValidationLogout> validationLogoutList;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private List<ValidationResetPasswordRequest> validationResetPasswordRequestList;


    @Autowired
    private List<ValidationRegisterUser> validationRegisterUserList;

    @Autowired
    private List<ValidationDisabledUser> validationDisabledUserList;

    @Autowired
    private List<ValidationsLogin> validationsLoginList;

    @Autowired
    private List<ValidationResetPassword> validationResetPasswords;

    @Autowired
    private List<ValidationsActivatedAccount> validationsActivatedAccountList;

    @Autowired
    private MessageSource messageSource;


    @Autowired
    private EmailService emailService;

    @Autowired
    private List<ValidationReactivateAccountRequest> validationReactivateAccountRequestList;

    @Autowired
    private List<ValidationReactivate> validationReactivateList;

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
        String successMessage = messageSource.getMessage(
                "auth.register.success",
                new Object[]{user.getName()},
                LocaleContextHolder.getLocale()
        );
        return new DataDetailsRegisterUser(user, confirmationToken,successMessage);
    }

    public UsernamePasswordAuthenticationToken login(DataAuth dataAuth) {
        validationsLoginList.forEach(v -> v.validate(dataAuth));
        User user = userService.getUserActivatedByEmail(dataAuth.login());
        return new UsernamePasswordAuthenticationToken(dataAuth.login(), dataAuth.password());

    }


    /**
     * Reativa um usuário com base no token fornecido.
     *
     * @param token O token de confirmação de ativação do usuário.
     * @throws UsernameNotFoundException Se nenhum usuário for encontrado com o email associado ao token.
     * @throws IllegalStateException     Se o usuário já estiver ativo.
     */



    /**
     * Realiza o logout do usuário com base no token fornecido.
     *
     * @param token O token de logout.
     * @throws IllegalArgumentException Se o token for inválido ou expirado.
     */
    public String logout(String token) {
        String tokenWithoutBearer = token.replace("Bearer ", "");
        validationLogoutList.forEach(v -> v.validate(tokenWithoutBearer));
        tokenService.revokeToken(tokenWithoutBearer);
        String successMessage = messageSource.getMessage(
                "auth.logout.success",
                null,
                Locale.getDefault()
        );

        return successMessage;
    }


    /**
     * Desativa um usuário com o ID fornecido.
     * <p>
     * Este método executa as validações definidas na lista de validações de usuários desativados
     * antes de desativar o usuário. Se todas as validações forem bem-sucedidas, o usuário será
     * marcado como desativado e salvo no repositório.
     *
     * @param id O ID do usuário a ser desativado.
     * @throws IllegalArgumentException Se alguma validação falhar, indicando que o usuário não pode ser desativado.
     * @throws EntityNotFoundException  Se não houver um usuário com o ID fornecido no repositório.
     */
    public void disableUser(Long id) {
        validationDisabledUserList.forEach(v -> v.validation(id));
        User user = repository.getReferenceById(id);
        user.disabled();
        repository.save(user);
    }


    /**
     * Recupera um usuário a partir de um token JWT fornecido.
     * <p>
     * Este método extrai o email associado ao token JWT, que é utilizado para buscar
     * o usuário correspondente no repositório.
     *
     *              Se o prefixo "Bearer " estiver presente, ele será removido antes de processar o token.
     * @return O {@link User} associado ao email extraído do token.
     * Se nenhum usuário for encontrado com o email extraído, este método retornará {@code null}.
     */


    public String resetPasswordRequest(DataRequestResetPassword dataResetPassword) {
        validationResetPasswordRequestList.forEach(v -> v.validate(dataResetPassword));


        User user = repository.findByEmail(dataResetPassword.email());
        String token = tokenService.generateTokenRecoverPassword(user);
        try {
            emailService.sendResetPasswordEmailAsync(user.getName(), dataResetPassword.email(), token);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        String successMessage = messageSource.getMessage(
                "auth.request.reset.password.success",
                new Object[]{dataResetPassword.email()},
                Locale.getDefault()
        );
        return successMessage;
    }

    public String resetPassword(DataResetPassword dataResetPassword) {
        validationResetPasswords.forEach(v -> v.validate(dataResetPassword));
        String email = tokenService.getEmailByToken(dataResetPassword.token());
        userService.updatePassword(email, dataResetPassword.password());
        tokenService.revokeToken(dataResetPassword.token());
        String successMessage = messageSource.getMessage(
                "auth.reset.password.success",
                new Object[]{email},
                Locale.getDefault()
        );

        return successMessage;

    }

    public ResponseEntity<String> activateAccount(String token) {
        if (!tokenService.isValidToken(token)) {
            String redirectUrl = frontendUrl + "/e-driver/login?error=O+token+de+ativação+é+inválido+ou+expirou";
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(redirectUrl))
                    .build();
        }

        validationsActivatedAccountList.forEach(v -> v.validate(token));

        String email = JWT.decode(token).getClaim("email").asString();
        User user = repository.findByEmail(email);
        user.activate();
        tokenService.revokeToken(token);

        String redirectUrl = frontendUrl + "/e-driver/login?success=Conta+ativada+com+sucesso";
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }


    public String reactivateAccountRequest(DataReactivateAccount dataReactivateAccount) {
        validationReactivateAccountRequestList.forEach(v -> v.validate(dataReactivateAccount));
        User user = repository.findByEmail(dataReactivateAccount.email());
        String token = tokenService.generateTokenForReactivation(user);

        try {
            emailService.sendReactivationEmailAsync(user.getName(), dataReactivateAccount.email(), token);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        return messageSource.getMessage("auth.request.reactivated.success", new Object[]{user.getName()}, LocaleContextHolder.getLocale());
    }

    public String reactivateAccount(String token) {
        validationReactivateList.forEach(v -> v.validate(token));
        User user = userService.getUserByToken(token);
        user.activate();
        tokenService.revokeToken(token);

        return messageSource.getMessage(
                "auth.reactivated.success",
                new Object[]{user.getName()},
                LocaleContextHolder.getLocale()
        );

    }
}