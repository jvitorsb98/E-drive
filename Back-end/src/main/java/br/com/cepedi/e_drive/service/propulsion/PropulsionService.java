package br.com.cepedi.e_drive.service.propulsion;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import br.com.cepedi.e_drive.service.propulsion.validations.disabled.PropulsionValidatorDisabled;
import br.com.cepedi.e_drive.service.propulsion.validations.update.ValidationUpdatePropulsion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Serviço para gerenciar operações relacionadas a propulsões.
 *
 * Este serviço fornece métodos para registrar, atualizar, listar e desativar propulsões.
 * Ele utiliza validações para garantir a integridade dos dados antes de realizar operações.
 */
@Service
public class PropulsionService {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Autowired
    private List<PropulsionValidatorDisabled> propulsionValidatorDisabledList;

    @Autowired
    private List<ValidationUpdatePropulsion> propulsionValidatorUpdateList;

    /**
     * Registra uma nova propulsão.
     *
     * @param data Dados da propulsão a ser registrada.
     * @return Detalhes da propulsão registrada.
     */
    @Transactional
    public DataPropulsionDetails register(DataRegisterPropulsion data) {
        Propulsion propulsion = new Propulsion(data);
        propulsion = propulsionRepository.save(propulsion);
        return new DataPropulsionDetails(propulsion);
    }

    /**
     * Lista todas as propulsões com paginação e cache.
     *
     * @param pageable Informações de paginação.
     * @return Página com detalhes de todas as propulsões.
     */
    @Cacheable(value = "allPropulsions", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listAll(Pageable pageable) {
        return propulsionRepository.findAll(pageable)
                .map(DataPropulsionDetails::new);
    }

    /**
     * Lista todas as propulsões desativadas com paginação e cache.
     *
     * @param pageable Informações de paginação.
     * @return Página com detalhes das propulsões desativadas.
     */
    @Cacheable(value = "deactivatedPropulsions", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listAllDeactivated(Pageable pageable) {
        return propulsionRepository.findAllByActivatedFalse(pageable)
                .map(DataPropulsionDetails::new);
    }

    /**
     * Lista todas as propulsões filtradas pelo nome com paginação e cache.
     *
     * @param name Nome para filtragem.
     * @param pageable Informações de paginação.
     * @return Página com detalhes das propulsões que contêm o nome fornecido.
     */
    @Cacheable(value = "propulsionsByName", key = "#name + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listByName(String name, Pageable pageable) {
        return propulsionRepository.findByNameContaining(name, pageable)
                .map(DataPropulsionDetails::new);
    }

    /**
     * Obtém os detalhes de uma propulsão pelo ID com cache.
     *
     * @param id ID da propulsão a ser recuperada.
     * @return Detalhes da propulsão com o ID fornecido.
     * @throws RuntimeException Se a propulsão com o ID fornecido não for encontrada.
     */
    @Cacheable(value = "propulsionById", key = "#id")
    public DataPropulsionDetails getById(Long id) {
        Propulsion propulsion = propulsionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Propulsion not found"));
        return new DataPropulsionDetails(propulsion);
    }

    /**
     * Atualiza os detalhes de uma propulsão existente.
     *
     * @param data Dados de atualização da propulsão.
     * @param id ID da propulsão a ser atualizada.
     * @return Detalhes da propulsão atualizada.
     * @throws IllegalArgumentException Se a propulsão não existir ou não puder ser atualizada.
     */
    @Transactional
    public DataPropulsionDetails update(DataUpdatePropulsion data, Long id) {
        propulsionValidatorUpdateList.forEach(v -> v.validate(id));
        Propulsion propulsion = propulsionRepository.getReferenceById(id);
        propulsion.update(data);
        propulsion = propulsionRepository.save(propulsion);
        return new DataPropulsionDetails(propulsion);
    }

    /**
     * Desativa uma propulsão existente.
     *
     * @param id ID da propulsão a ser desativada.
     * @throws IllegalArgumentException Se a propulsão não existir ou não puder ser desativada.
     */
    @Transactional
    public void disabled(Long id) {
        propulsionValidatorDisabledList.forEach(v -> v.validate(id));
        Propulsion propulsion = propulsionRepository.getReferenceById(id);
        propulsion.deactivated();
        propulsionRepository.save(propulsion);
    }
}
