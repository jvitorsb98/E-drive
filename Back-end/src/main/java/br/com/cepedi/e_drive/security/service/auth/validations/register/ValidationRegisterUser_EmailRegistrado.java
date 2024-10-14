package br.com.cepedi.e_drive.security.service.auth.validations.register;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * Implementação da interface {@link ValidationRegisterUser} para validar se o e-mail fornecido já está registrado.
 * <p>
 * Esta implementação verifica se o e-mail fornecido no processo de registro já está presente no banco de dados.
 * Se o e-mail já estiver registrado, uma exceção {@link ValidationException} será lançada.
 * </p>
 */
@Component
public class ValidationRegisterUser_EmailRegistrado implements ValidationRegisterUser {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o e-mail fornecido no {@link DataRegisterUser} já está registrado no sistema.
     *
     * @param dataRegisterUser Os dados do usuário a serem validados, incluindo o e-mail.
     * @throws ValidationException Se o e-mail já estiver registrado no banco de dados.
     */
    @Override
    public void validation(DataRegisterUser dataRegisterUser) {
        if (dataRegisterUser.email() != null) {
            if (userRepository.findByEmail(dataRegisterUser.email()) != null) {
                String errorMessage = messageSource.getMessage(
                        "auth.register.email.exists",
                        new Object[]{dataRegisterUser.email()},
                        LocaleContextHolder.getLocale()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
