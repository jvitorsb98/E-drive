package br.com.cepedi.e_drive.service.propulsion.validations.disabled;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.cepedi.e_drive.repository.PropulsionRepository;

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

    /**
     * Valida se a propulsão com o ID especificado existe.
     *
     * @param id ID da propulsão a ser verificada.
     * @throws IllegalArgumentException Se a propulsão com o ID especificado não existir.
     */
    @Override
    public void validate(Long id) {
        if (!propulsionRepository.existsById(id)) {
            throw new IllegalArgumentException("Propulsion with ID " + id + " does not exist.");
        }
    }
}
