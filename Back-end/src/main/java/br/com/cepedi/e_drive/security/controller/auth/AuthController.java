package br.com.cepedi.e_drive.security.controller.auth;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DadosTokenJWT;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.register.*;
import br.com.cepedi.e_drive.security.service.auth.AuthService;
import br.com.cepedi.e_drive.security.service.email.EmailService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador responsável pelas operações de autenticação e gerenciamento de usuários.
 * <p>
 * Este controlador expõe endpoints para login, registro de usuário, redefinição de senha, ativação de conta e logout.
 * </p>
 * </p>
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Login User", description = "Auth messages")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthenticationManager manager;


    /**
     * Realiza o login do usuário e gera um token de autenticação.
     *
     * @param data Dados de autenticação fornecidos pelo usuário.
     * @return Uma resposta com o token JWT se o login for bem-sucedido.
     * @throws RuntimeException Se o usuário não estiver ativado ou não for encontrado.
     */
    @PostMapping("/login")
    @Transactional
    @Operation(summary = "User login", description = "Authenticates the user and generates an authentication token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<DadosTokenJWT> login(@RequestBody @Valid DataAuth data) {
        UsernamePasswordAuthenticationToken authenticationToken = authService.login(data);
        User user = userService.getUserActivatedByEmail(data.login());
        Authentication authentication = manager.authenticate(authenticationToken);
        String tokenJWT = tokenService.generateToken(user);
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }


    /**
     * Solicita a redefinição de senha enviando um e-mail para o usuário com instruções.
     *
     * @return Uma resposta indicando se o e-mail foi enviado com sucesso.
     * @throws MessagingException Se houver um erro ao enviar o e-mail.
     */
    @PutMapping("/reset-password/request")
    @Transactional
    @Operation(summary = "Request password reset", description = "Sends a password reset email to the user with instructions on how to reset their password.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset email sent successfully"),
            @ApiResponse(responseCode = "400", description = "Email not found", content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "500", description = "Failed to send email", content = @Content(mediaType = "text/plain"))
    })
    public ResponseEntity<String> resetPasswordRequest(@RequestBody @Valid DataRequestResetPassword dataResetPassword) {
        String response = authService.resetPasswordRequest(dataResetPassword);
        return ResponseEntity.ok(response);
    }


    /**
     * Redefine a senha do usuário com base no token fornecido.
     *
     * @return Uma resposta indicando se a senha foi atualizada com sucesso.
     */
    @PutMapping("/reset-password/reset")
    @Transactional
    @Operation(summary = "Reset password", description = "Resets the user's password based on the token provided in the reset password email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token", content = @Content(mediaType = "text/plain"))
    })
    public ResponseEntity<String> resetPassword(@RequestBody @Validated DataResetPassword dataResetPassword) {
        System.out.println(dataResetPassword.token());
        String response = authService.resetPassword(dataResetPassword);
        return ResponseEntity.ok(response);
    }

    /**
     * Registra um novo usuário e envia um e-mail de ativação.
     *
     * @param data Dados do usuário a ser registrado.
     * @return Uma resposta indicando se o usuário foi registrado com sucesso e se o e-mail de ativação foi enviado.
     * @throws MessagingException Se houver um erro ao enviar o e-mail de ativação.
     */
    @PostMapping("/register")
    @Transactional
    @Operation(summary = "Register a new user", description = "Registers a new user and sends an activation email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully. Activation email sent.", content = @Content(mediaType = "string")),
            @ApiResponse(responseCode = "400", description = "Invalid input data.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    public ResponseEntity<String> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "User data to be registered", required = true)
            @RequestBody @Valid DataRegisterUser data) throws MessagingException {
        DataDetailsRegisterUser dataDetailsRegisterUser = authService.register(data);
        String tokenForActivate = dataDetailsRegisterUser.confirmationToken();
        emailService.sendActivationEmailAsync(data.name(), data.email(), tokenForActivate);

        return ResponseEntity.ok(dataDetailsRegisterUser.successMessage());
    }

    /**
     * Ativa a conta do usuário usando o token fornecido.
     *
     * @param token O token de ativação recebido por e-mail.
     * @return Uma resposta indicando se a conta do usuário foi ativada com sucesso.
     */
    @GetMapping("/activate")
    @Transactional
    @Operation(summary = "Activate a user", description = "Activates a user account using a provided token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User activated successfully.", content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "400", description = "Invalid token or user not found.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    public ResponseEntity<String> activateAccount(
            @Parameter(description = "Activation token received by email", required = true)
            @RequestParam("token") String token
    ) {
            return authService.activateAccount(token);
    }

    /**
     * Realiza o logout do usuário revogando o token de autenticação.
     *
     * @param token O token de autenticação do usuário.
     * @return Uma resposta indicando se o logout foi bem-sucedido.
     */
    @PostMapping("/logout")
    @Transactional
    @Operation(summary = "User logout", description = "Logs out the user by revoking their authentication token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout successful"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token", content = @Content)
    })
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        String response = authService.logout(token);
        return ResponseEntity.ok(response);
    }

    /**
     * Desabilita um usuário com base no ID fornecido.
     *
     * Este método manipula uma solicitação DELETE para desativar um usuário.
     * Quando um usuário é desativado com sucesso, retorna um status 204 (No Content).
     *
     * @param id O ID do usuário a ser desativado. Este parâmetro é obrigatório.
     * @return Uma resposta HTTP com status 204 se o usuário foi desativado com sucesso.
     */
    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable user by ID", method = "DELETE", description = "Disables a user by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User disabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<Void> disableUser(
            @Parameter(description = "ID of the user to be disabled", required = true)
            @PathVariable Long id
    ) {
        authService.disableUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    /**
     * Endpoint para solicitar a reativação de uma conta de usuário.
     *
     * Este método envia um e-mail de reativação para o endereço de e-mail fornecido, contendo instruções
     * sobre como reativar a conta do usuário. Se o e-mail não estiver associado a uma conta desativada,
     * uma resposta de erro será retornada.
     *
     * @param dataReactivateAccount Objeto {@link DataDetailsUser} contendo os detalhes da solicitação de reativação, incluindo o e-mail do usuário.
     * @return Um {@link ResponseEntity} contendo uma mensagem de sucesso ou erro.
     *         <ul>
     *           <li>200 OK: E-mail de reativação enviado com sucesso.</li>
     *           <li>404 Not Found: Se o e-mail fornecido não for encontrado ou o usuário não estiver desativado.</li>
     *           <li>500 Internal Server Error: Se houver um erro no envio do e-mail.</li>
     *         </ul>
     */
    @PutMapping("/reactivate-account/request")
    @Transactional
    @Operation(summary = "Request account reactivation",
            description = "Sends an account reactivation email to the user with instructions on how to reactivate their account.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account reactivation email sent successfully"),
            @ApiResponse(responseCode = "404", description = "Email not found", content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "500", description = "Failed to send email", content = @Content(mediaType = "text/plain"))
    })
    public ResponseEntity<String> reactivateAccountRequest(
            @RequestBody @Validated DataReactivateAccount dataReactivateAccount) {
        String message = authService.reactivateAccountRequest(dataReactivateAccount);
        return ResponseEntity.ok(message);
    }



    /**
     * Reativa a conta de um usuário utilizando um token fornecido.
     *
     * Este método valida o token JWT fornecido, verifica se o usuário existe e se está desativado.
     * Se o token for válido e o usuário estiver desativado, o método reativa a conta e revoga o token.
     *
     * @param token O token de reativação fornecido como parâmetro de requisição.
     * @return {@link ResponseEntity} contendo uma mensagem de status, que pode ser:
     *         <ul>
     *           <li>200 OK: Conta do usuário reativada com sucesso.</li>
     *           <li>400 BAD_REQUEST: Token inválido ou expirado, ou usuário não encontrado.</li>
     *           <li>409 CONFLICT: O usuário já está ativo.</li>
     *           <li>500 INTERNAL_SERVER_ERROR: Falha ao reativar a conta do usuário.</li>
     *         </ul>
     */
    @PutMapping("/reactivate")
    @Transactional
    @Operation(summary = "Reactivate a user", description = "Reactivates a user account using a provided token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User reactivated successfully.", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Invalid token or user not found.", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "409", description = "User is already active.", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<String> reactivateAccount(@RequestParam String token) {
        String message = authService.reactivateAccount(token);
        return ResponseEntity.ok(message);
    }
}
