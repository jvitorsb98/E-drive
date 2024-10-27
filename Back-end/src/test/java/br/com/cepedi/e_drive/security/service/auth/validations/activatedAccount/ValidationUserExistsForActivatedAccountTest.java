package br.com.cepedi.e_drive.security.service.auth.validations.activatedAccount;


import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidationUserExistsForActivatedAccountTest {

    @InjectMocks
    private ValidationUserExistsForActivatedAccount validation;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Deve lançar ValidationException se o usuário não existir")
    void testValidate_UserNotFound() {
        // Definindo um algoritmo de assinatura
        Algorithm algorithm = Algorithm.HMAC256("secret"); // Substitua "secret" pela sua chave

        // Criando um token válido
        String token = JWT.create()
                .withClaim("email", "test@example.com")
                .sign(algorithm);

        when(userRepository.findByEmail("test@example.com")).thenReturn(null); // Usuário não encontrado
        when(messageSource.getMessage(anyString(), any(), any())).thenReturn("User not found");

        ValidationException exception = assertThrows(ValidationException.class, () -> {
            validation.validate(token);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Não deve lançar exceção se o usuário existir")
    void testValidate_UserExists() {
        // Definindo um algoritmo de assinatura
        Algorithm algorithm = Algorithm.HMAC256("secret"); // Substitua "secret" pela sua chave

        // Criando um token válido
        String token = JWT.create()
                .withClaim("email", "test@example.com")
                .sign(algorithm);

        User user = new User();
        user.setActivated(false); // O estado de ativação não importa neste teste

        when(userRepository.findByEmail("test@example.com")).thenReturn(user);

        // Não deve lançar exceção
        validation.validate(token);

        verify(userRepository, times(1)).findByEmail("test@example.com");
    }
}

