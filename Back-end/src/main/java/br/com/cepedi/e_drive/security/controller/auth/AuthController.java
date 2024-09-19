package br.com.cepedi.e_drive.security.controller.auth;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DadosTokenJWT;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;
import br.com.cepedi.e_drive.security.model.records.register.DataResetPassword;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável pelas operações de autenticação e gerenciamento de usuários.
 * <p>
 * Este controlador expõe endpoints para login, registro de usuário, redefinição de senha, ativação de conta e logout.
 * </p>
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Login User", description = "Auth messages")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

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
            @ApiResponse(responseCode = "400", description = "Invalid credentials", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<Object> efetuarLogin(@RequestBody @Valid DataAuth data) {
        User user = userService.getUserActivatedByEmail(data.login());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not registered");
        }
        if (!user.getActivated()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not activated");
        }
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(data.login(), data.password());
            Authentication authentication = manager.authenticate(authenticationToken);

            var tokenJWT = tokenService.generateToken(user);
            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email or password");
        }
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
    public ResponseEntity<String> resetPasswordRequest(@RequestBody @Validated DataRequestResetPassword dataResetPassword) {
        User user = userService.getUserActivatedByEmail(dataResetPassword.email());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("E-mail not found");
        }

        String token = tokenService.generateTokenRecoverPassword(user);

        try {
            emailService.sendResetPasswordEmailAsync(user.getName(), dataResetPassword.email(), token);
            String responseMessage = "A password reset email has been sent to " + dataResetPassword.email();
            return ResponseEntity.ok(responseMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
        }
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
        if (tokenService.isValidToken(dataResetPassword.token())) {
            String email = tokenService.getEmailByToken(dataResetPassword.token());
            userService.updatePassword(email, dataResetPassword.password());
            tokenService.revokeToken(dataResetPassword.token());
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
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
    public ResponseEntity<String> registerUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "User data to be registered", required = true)
            @RequestBody @Valid DataRegisterUser data) throws MessagingException {
        DataDetailsRegisterUser dataDetailsRegisterUser = authService.register(data);
        String tokenForActivate = dataDetailsRegisterUser.confirmationToken();

        emailService.sendActivationEmailAsync(data.name(), data.email(), tokenForActivate);

        return ResponseEntity.ok("User registered successfully. Activation email sent.");
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
        try {
            if (!tokenService.isValidToken(token)) {
                return ResponseEntity.badRequest().body("Token invalid");
            }
            authService.activateUser(token);
            tokenService.revokeToken(token);
            return ResponseEntity.ok("User account activated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to activate user account.");
        }
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
        try {
            authService.logout(token);
            return ResponseEntity.ok("Logout successful");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
