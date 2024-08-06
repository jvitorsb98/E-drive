package br.com.cepedi.e_drive.security.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.util.Map;

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
@RequestMapping("auth")
@Tag(name = "Register User", description = "Register User messages")
public class RegisterController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

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
        emailService.sendActivationEmail(data.name(), data.email(), tokenForActivate);
        return ResponseEntity.ok("User registered successfully. Activation email sent.");
    }
    
    @PostMapping("/activate")
    @Transactional
    @Operation(summary = "Activate a user", method = "POST", description = "Activates a user account using a provided token.")
    @ApiResponse(responseCode = "200", description = "User activated successfully.",
            content = @Content(mediaType = "text/plain"))
    @ApiResponse(responseCode = "400", description = "Invalid token or user not found.",
            content = @Content)
    @ApiResponse(responseCode = "500", description = "Internal server error.",
            content = @Content)
    public ResponseEntity<String> activateUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Token used to activate the user", required = true)
            @RequestBody Map<String, String> body) {
        String token = body.get("token");

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Token is required.");
        }

        try {
            // Trim to remove any extra whitespace or new lines
            token = token.trim();
            authService.activateUser(token);
            return ResponseEntity.ok("User activated successfully.");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body("Invalid token or user not found.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error.");
        }
    }
}
