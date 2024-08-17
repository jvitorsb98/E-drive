package br.com.cepedi.e_drive.security.controller;


import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DadosTokenJWT;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;
import br.com.cepedi.e_drive.security.model.records.register.DataResetPassword;
import br.com.cepedi.e_drive.security.service.AuthService;
import br.com.cepedi.e_drive.security.service.EmailService;
import br.com.cepedi.e_drive.security.service.TokenService;
import br.com.cepedi.e_drive.security.service.UserService;
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

    @PostMapping("/login")
    @Transactional
    @Operation(summary = "User login", description = "Authenticates the user and generates an authentication token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "User is not activated",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Object> efetuarLogin(@RequestBody @Valid DataAuth data) {
        // Primeiro, tente encontrar o usuário pelo email
        User user = userService.getUserActivatedByEmail(data.login());

        // Verifique se o usuário foi encontrado
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        // Verifique se o usuário está ativado
        if (!user.getActivated()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not activated");
        }

        // Autentique o usuário se ele estiver ativado
        var authenticationToken = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        Authentication authentication = manager.authenticate(authenticationToken);

        // Gera o token JWT se a autenticação for bem-sucedida
        var tokenJWT = tokenService.generateToken(user);
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }


    @PutMapping("/reset-password/request")
    @Transactional
    @Operation(summary = "Request password reset",
            method = "PUT",
            description = "Sends a password reset email to the user with instructions on how to reset their password.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset email sent successfully"),
            @ApiResponse(responseCode = "400", description = "Email not found",
                    content = {@Content(mediaType = "text/plain")}),
            @ApiResponse(responseCode = "500", description = "Failed to send email",
                    content = {@Content(mediaType = "text/plain")})
    })
    public ResponseEntity<String> resetPasswordRequest(@RequestBody @Validated DataRequestResetPassword dataResetPassword) {
        User user = userService.getUserActivatedByEmail(dataResetPassword.email());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("E-mail not found");
        }

        String token = tokenService.generateTokenRecoverPassword(user);

        try {
            emailService.sendResetPasswordEmail(user.getName(), dataResetPassword.email(), token);
            String responseMessage = "A password reset email has been sent to " + dataResetPassword.email();
            return ResponseEntity.ok(responseMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
        }
    }

    @PutMapping("/reset-password/reset")
    @Transactional
    @Operation(summary = "Reset password",
            method = "PUT",
            description = "Resets the user's password based on the token provided in the reset password email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token",
                    content = {@Content(mediaType = "text/plain")})
    })
    public ResponseEntity<String> resetPassword(@RequestBody @Validated DataResetPassword dataResetPassword) {
        if (tokenService.isValidToken(dataResetPassword.token())) {
            String email = tokenService.getEmailByToken(dataResetPassword.token());
            userService.updatePassword(email, dataResetPassword.password());
            tokenService.revokeToken(dataResetPassword.token());  // Invalida o token após redefinição da senha
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }

    @PostMapping("/register")
    @Transactional
    @Operation(summary = "Register a new user", method = "POST", description = "Registers a new user and sends an activation email.")
    @ApiResponse(responseCode = "200", description = "User registered successfully. Activation email sent.",
            content = @Content(mediaType = "string"))
    @ApiResponse(responseCode = "400", description = "Invalid input data.",
            content = @Content)
    @ApiResponse(responseCode = "500", description = "Internal server error.",
            content = @Content)
    public ResponseEntity<String> registerUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "User data to be registered", required = true)
            @RequestBody @Valid DataRegisterUser data) throws MessagingException {
        DataDetailsRegisterUser dataDetailsRegisterUser = authService.register(data);
        String tokenForActivate = dataDetailsRegisterUser.confirmationToken(); // Obtém o token do retorno

        emailService.sendActivationEmailAsync(data.name(), data.email(), tokenForActivate);

        return ResponseEntity.ok("User registered successfully. Activation email sent.");
    }

    @GetMapping("/activate")
    @Transactional
    @Operation(summary = "Activate a user", method = "POST", description = "Activates a user account using a provided token.")
    @ApiResponse(responseCode = "200", description = "User activated successfully.",
            content = @Content(mediaType = "text/plain"))
    @ApiResponse(responseCode = "400", description = "Invalid token or user not found.",
            content = @Content)
    @ApiResponse(responseCode = "500", description = "Internal server error.",
            content = @Content)
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

}
