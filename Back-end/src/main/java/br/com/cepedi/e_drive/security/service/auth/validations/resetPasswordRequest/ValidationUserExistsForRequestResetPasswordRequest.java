package br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest;

import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;
import br.com.cepedi.e_drive.security.repository.UserRepository; // Adicionada a importação do repositório de usuários
import jakarta.validation.ValidationException; // Exceção para validações
import org.springframework.beans.factory.annotation.Autowired; // Importação para injeção de dependências
import org.springframework.context.MessageSource; // Importação para internacionalização
import org.springframework.stereotype.Component; // Anotação para indicar que é um componente do Spring

import java.util.Locale; // Para manipulação de locais

/**
 * Classe responsável por validar se o usuário existe no sistema durante a solicitação de redefinição de senha.
 * <p>
 * Esta classe implementa a validação que verifica a existência de um usuário com o email fornecido para a redefinição de senha.
 */
@Component
public class ValidationUserExistsForRequestResetPasswordRequest implements ValidationResetPasswordRequest {

    @Autowired
    private UserRepository userRepository; // Injeção do repositório de usuários para verificar a existência do usuário

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o email fornecido para a redefinição de senha existe no sistema.
     * <p>
     * Se o email fornecido não existir, uma exceção será lançada.
     *
     * @param dataRequestResetPassword Dados da solicitação de redefinição de senha fornecidos pelo usuário.
     * @throws ValidationException Se o email do usuário não existir no sistema.
     */
    @Override
    public void validate(DataRequestResetPassword dataRequestResetPassword) {
        String email = dataRequestResetPassword.email().trim();

        boolean exists = userRepository.existsByEmail(email);

        if (!exists) {
            String errorMessage = messageSource.getMessage(
                    "auth.request.reset.password.notfound",
                    new Object[]{email},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
