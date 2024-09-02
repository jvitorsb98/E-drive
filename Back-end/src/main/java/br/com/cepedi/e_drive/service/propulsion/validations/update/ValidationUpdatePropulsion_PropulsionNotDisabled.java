package br.com.cepedi.e_drive.service.propulsion.validations.update;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se uma propulsão está desativada antes de realizar operações de atualização.
 *
 * Esta implementação da interface {@link ValidationUpdatePropulsion} verifica se a propulsão com o ID
 * especificado está ativada. Se a propulsão estiver ativada, uma exceção será lançada, indicando que a
 * propulsão não pode ser atualizada.
 */
@Component
public class ValidationUpdatePropulsion_PropulsionNotDisabled implements ValidationUpdatePropulsion {

    @Autowired
    private PropulsionRepository propulsionRepository;

    /**
     * Valida se a propulsão com o ID especificado está desativada.
     *
     * @param id ID da propulsão a ser verificada.
     * @throws ValidationException Se a propulsão com o ID fornecido estiver ativada.
     */
    @Override
    public void validate(Long id) {
        if (propulsionRepository.existsById(id)) {
            Propulsion propulsion = propulsionRepository.getReferenceById(id);
            if (propulsion.getActivated()) {
                throw new ValidationException("The required propulsion is activated");
            }
        }
    }
}
