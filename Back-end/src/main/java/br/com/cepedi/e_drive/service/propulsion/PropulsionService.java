package br.com.cepedi.e_drive.service.propulsion;


import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import br.com.cepedi.e_drive.service.propulsion.validations.disabled.PropulsionValidatorDisabled;
import br.com.cepedi.e_drive.service.propulsion.validations.update.ValidationUpdatePropulsion;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class PropulsionService {

    @Autowired
    private PropulsionRepository propulsionRepository;

    
    @Autowired
    private List<PropulsionValidatorDisabled> propulsionValidatorDisabledList;

    @Autowired
    private List<ValidationUpdatePropulsion> propulsionValidatorUpdateList;

    @Transactional
    public DataPropulsionDetails register(DataRegisterPropulsion data) {
        Propulsion propulsion = new Propulsion(data);
        propulsion = propulsionRepository.save(propulsion);
        return new DataPropulsionDetails(propulsion);
    }
    
    @Cacheable(value = "allPropulsions", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listAll(Pageable pageable) {
        return propulsionRepository.findAll(pageable)
                .map(DataPropulsionDetails::new);
    }
    
    @Cacheable(value = "deactivatedPropulsions", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listAllDeactivated(Pageable pageable) {
        return propulsionRepository.findAllByActivatedFalse(pageable)
                .map(DataPropulsionDetails::new);
    }
    
    @Cacheable(value = "propulsionsByName", key = "#name + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listByName(String name, Pageable pageable) {
        return propulsionRepository.findByNameContaining(name, pageable)
                .map(DataPropulsionDetails::new);
    }
    
    @Cacheable(value = "propulsionById", key = "#id")
    public DataPropulsionDetails getById(Long id) {
        Propulsion propulsion = propulsionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Propulsion not found"));
        return new DataPropulsionDetails(propulsion);
    }

    @Transactional
    public DataPropulsionDetails update(DataUpdatePropulsion data, Long id) {
        propulsionValidatorUpdateList.forEach(v -> v.validate(id));
        Propulsion propulsion = propulsionRepository.getReferenceById(id);
        propulsion.update(data);
        propulsion = propulsionRepository.save(propulsion);
        return new DataPropulsionDetails(propulsion);
    }

    @Transactional
    public void disabled(Long id) {
        propulsionValidatorDisabledList.forEach(v -> v.validate(id));
        Propulsion propulsion = propulsionRepository.getReferenceById(id);
        propulsion.deactivated();
        propulsionRepository.save(propulsion);
    }
    
}

