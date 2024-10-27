    package br.com.cepedi.e_drive.security.service.auth.validations.resetPasswordRequest;

    import br.com.cepedi.e_drive.security.model.entitys.User;
    import br.com.cepedi.e_drive.security.model.records.register.DataRequestResetPassword;
    import br.com.cepedi.e_drive.security.repository.UserRepository;
    import jakarta.validation.ValidationException;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.context.MessageSource;
    import org.springframework.stereotype.Component;

    import java.util.Locale;

    /**
     * Classe responsável por validar se o usuário está ativo no sistema durante a solicitação de redefinição de senha.
     * <p>
     * Esta classe implementa a validação que verifica se um usuário com o email fornecido está ativo.
     */
    @Component
    public class ValidationUserActiveForRequestResetPassword implements ValidationResetPasswordRequest {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se o usuário com o email fornecido está ativo.
     * <p>
     * Se o usuário não estiver ativo, uma exceção será lançada.
     *
     * @param dataRequestResetPassword Dados da solicitação de redefinição de senha fornecidos pelo usuário.
     * @throws ValidationException Se o usuário não estiver ativo no sistema.
     */
    @Override
    public void validate(DataRequestResetPassword dataRequestResetPassword) {
        String email = dataRequestResetPassword.email().trim();
        User user = userRepository.findByEmail(email);
        if(user != null && !user.isActive()){
            String errorMessage = messageSource.getMessage(
                    "auth.request.reset.password.inactive",
                    new Object[]{email},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
