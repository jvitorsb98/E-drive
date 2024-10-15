package br.com.cepedi.e_drive.security.service.auth.validations.reactivated;

import br.com.cepedi.e_drive.security.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ValidationTokenValidForReactivated implements ValidationReactivate {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void validate(String token) {
        if (!tokenService.isValidToken(token)) {
            String errorMessage = messageSource.getMessage(
                    "auth.reactivated.token.invalid",  // Chave da mensagem no arquivo de mensagens
                    null,  // Não há parâmetros adicionais para a mensagem
                    LocaleContextHolder.getLocale()  // Idioma atual
            );
            throw new IllegalArgumentException(errorMessage);
        }
    }
}
