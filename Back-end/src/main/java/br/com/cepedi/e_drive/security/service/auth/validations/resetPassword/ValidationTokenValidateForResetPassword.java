package br.com.cepedi.e_drive.security.service.auth.validations.resetPassword;

import br.com.cepedi.e_drive.security.model.records.register.DataResetPassword;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe responsável por validar se o token fornecido para redefinição de senha é válido.
 * <p>
 * Esta classe implementa a validação que verifica a validade do token fornecido.
 */
@Component
public class ValidationTokenValidateForResetPassword implements ValidationResetPassword {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o token fornecido para redefinição de senha é válido.
     * <p>
     * Se o token não for válido, uma exceção será lançada.
     *
     * @param dataResetPassword Dados de redefinição de senha fornecidos pelo usuário.
     * @throws ValidationException Se o token não for válido.
     */
    @Override
    public void validate(DataResetPassword dataResetPassword) {
        if (!tokenService.isValidToken(dataResetPassword.token())) {
            String errorMessage = messageSource.getMessage(
                    "auth.reset.password.token.invalid",
                    null,
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
