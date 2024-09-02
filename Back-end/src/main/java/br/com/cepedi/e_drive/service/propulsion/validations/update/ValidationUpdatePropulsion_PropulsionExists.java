package br.com.cepedi.e_drive.service.propulsion.validations.update;

import br.com.cepedi.e_drive.repository.PropulsionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida a existência de uma propulsão antes de realizar operações de atualização.
 *
 * Esta implementação da interface {@link ValidationUpdatePropulsion} verifica se a propulsão com o ID
 * especificado existe no repositório. Se a propulsão não for encontrada, uma exceção será lançada.
 */
@Component
public class ValidationUpdatePropulsion_PropulsionExists implements ValidationUpdatePropulsion {

    @Autowired
    private PropulsionRepository propulsionRepository;

    /**
     * Valida se a propulsão com o ID especificado existe no repositório.
     *
     * @param id ID da propulsão a ser verificada.
     * @throws IllegalArgumentException Se a propulsão com o ID fornecido não existir.
     */
    @Override
    public void validate(Long id) {
        if (!propulsionRepository.existsById(id)) {
            throw new IllegalArgumentException("Propulsion with the given ID does not exist");
        }
    }
}
