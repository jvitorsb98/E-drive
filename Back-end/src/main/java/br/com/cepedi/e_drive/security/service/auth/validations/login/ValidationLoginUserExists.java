package br.com.cepedi.e_drive.security.service.auth.validations.login;

import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe responsável por validar se o usuário existe no sistema durante o processo de login.
 * <p>
 * Esta classe implementa a validação que verifica a existência de um usuário com o email fornecido.
 */
@Component
public class ValidationLoginUserExists implements ValidationsLogin {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o email fornecido no login existe no sistema.
     * <p>
     * Se o email fornecido para login não existir, uma exceção será lançada.
     *
     * @param dataAuth Dados de autenticação fornecidos pelo usuário.
     * @throws ValidationException Se o email do usuário não existir no sistema.
     */
    @Override
    public void validate(DataAuth dataAuth) {
        String email = dataAuth.login().trim();

        boolean exists = userRepository.existsByEmail(email);

        if (!exists) {
            String errorMessage = messageSource.getMessage(
                    "auth.login.invalid.credentials",
                    new Object[]{email},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
