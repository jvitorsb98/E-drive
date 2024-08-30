package br.com.cepedi.e_drive.service.propulsion.validations.disabled;

import br.com.cepedi.e_drive.repository.PropulsionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação de {@link PropulsionValidatorDisabled} para validar se uma propulsão já está desativada.
 *
 * Esta classe verifica se uma propulsão com um determinado ID já está desativada antes de permitir
 * qualquer operação que tente desativá-la novamente.
 */
@Component
public class ValidationPropulsionAlreadyDisabled implements PropulsionValidatorDisabled {

    @Autowired
    private PropulsionRepository propulsionRepository;

    /**
     * Valida se a propulsão com o ID especificado já está desativada.
     *
     * @param id ID da propulsão a ser verificada.
     * @throws IllegalArgumentException Se a propulsão com o ID especificado não existir.
     * @throws IllegalStateException Se a propulsão com o ID especificado já estiver desativada.
     */
    @Override
    public void validate(Long id) {
        boolean isDeactivated = propulsionRepository.findById(id)
                .map(propulsion -> !propulsion.getActivated())
                .orElseThrow(() -> new IllegalArgumentException("Propulsion with ID " + id + " does not exist."));

        if (isDeactivated) {
            throw new IllegalStateException("Propulsion with ID " + id + " is already disabled.");
        }
    }
}
