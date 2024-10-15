package br.com.cepedi.e_drive.security.service.auth.validations.login;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe responsável por validar se o usuário está ativo no sistema durante o processo de login.
 * <p>
 * Esta classe implementa a validação que verifica se o usuário existe e se está ativo.
 */
@Component
public class ValidationLoginUserActive implements ValidationsLogin {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o usuário está ativo no sistema.
     * <p>
     * Se o usuário estiver inativo, uma exceção será lançada.
     *
     * @param dataAuth Dados de autenticação fornecidos pelo usuário.
     * @throws ValidationException Se o usuário estiver inativo ou não existir.
     */
    @Override
    public void validate(DataAuth dataAuth) {
        String email = dataAuth.login().trim();

        User user = userRepository.findByEmail(email);
        System.out.println(user);

        if (user != null && !user.isActive()) {
            String errorMessage = messageSource.getMessage(
                    "auth.login.notactive",
                    new Object[]{email},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
