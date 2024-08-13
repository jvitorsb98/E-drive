package br.com.cepedi.e_drive.security.controller;


import br.com.cepedi.e_drive.controller.address.AddressController;
import br.com.cepedi.e_drive.security.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.service.AuthService;
import br.com.cepedi.e_drive.security.service.EmailService;

@RestController
@RequestMapping("/auth")
@Tag(name = "Register User", description = "Register User messages")
public class RegisterController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TokenService tokenService;

    private static final Logger LOGGER = LoggerFactory.getLogger(AddressController.class);



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
