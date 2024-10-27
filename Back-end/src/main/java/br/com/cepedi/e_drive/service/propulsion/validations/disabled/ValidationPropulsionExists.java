package br.com.cepedi.e_drive.service.propulsion.validations.disabled;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import br.com.cepedi.e_drive.repository.PropulsionRepository;

import java.util.Locale;

/**
 * Implementação de {@link PropulsionValidatorDisabled} para validar a existência de uma propulsão.
 *
 * Esta classe verifica se uma propulsão com um determinado ID existe antes de permitir qualquer operação
 * que envolva essa propulsão.
 */
@Component
public class ValidationPropulsionExists implements PropulsionValidatorDisabled {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Autowired
    private MessageSource messageSource; // Injeção de MessageSource para internacionalização

    /**
     * Valida se a propulsão com o ID especificado existe.
     *
     * @param id ID da propulsão a ser verificada.
     * @throws IllegalArgumentException Se a propulsão com o ID especificado não existir.
     */
    @Override
    public void validate(Long id) {
        if (!propulsionRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "propulsion.not.found", // Chave da mensagem
                    new Object[]{id}, // Parâmetros da mensagem
                    Locale.getDefault() // Locale padrão
            );
            throw new IllegalArgumentException(errorMessage);
        }
    }
}
