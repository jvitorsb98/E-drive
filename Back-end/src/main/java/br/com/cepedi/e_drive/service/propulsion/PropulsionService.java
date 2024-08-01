package br.com.cepedi.e_drive.service.propulsion;


import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import br.com.cepedi.e_drive.service.propulsion.validations.disabled.PropulsionValidatorDisabled;
import br.com.cepedi.e_drive.service.propulsion.validations.register.PropulsionValidatorRegister;
import br.com.cepedi.e_drive.service.propulsion.validations.update.PropulsionValidatorUpdate;
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
    private PropulsionValidatorRegister propulsionValidatorRegister;
    
    @Autowired
    private List<PropulsionValidatorDisabled> propulsionValidatorDisabledList;

    @Autowired
    private List<PropulsionValidatorUpdate> propulsionValidatorUpdateList;

    @Transactional
    public DataPropulsionDetails registerPropulsion(DataRegisterPropulsion data) {
    	propulsionValidatorRegister.validate(data);
        Propulsion propulsion = new Propulsion();
        propulsion.setName(data.name());
        propulsion.setActivated(data.activated());
        propulsion = propulsionRepository.save(propulsion);
        return new DataPropulsionDetails(propulsion);
    }
    
    @Cacheable(value = "allPropulsions", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listAllPropulsions(Pageable pageable) {
        return propulsionRepository.findAll(pageable)
                .map(DataPropulsionDetails::new);
    }
    
    @Cacheable(value = "deactivatedPropulsions", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listAllDeactivatedPropulsions(Pageable pageable) {
        return propulsionRepository.findAllByActivatedFalse(pageable)
                .map(DataPropulsionDetails::new);
    }
    
    @Cacheable(value = "propulsionsByName", key = "#name + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataPropulsionDetails> listPropulsionsByName(String name, Pageable pageable) {
        return propulsionRepository.findByNameContaining(name, pageable)
                .map(DataPropulsionDetails::new);
    }
    
    @Cacheable(value = "propulsionById", key = "#id")
    public DataPropulsionDetails getPropulsionById(Long id) {
        Propulsion propulsion = propulsionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Propulsion not found"));
        return new DataPropulsionDetails(propulsion);
    }

    @Transactional
    public DataPropulsionDetails updatePropulsion(DataUpdatePropulsion data) {
        propulsionValidatorUpdateList.forEach(v -> v.validate(data));
        Propulsion propulsion = propulsionRepository.getReferenceById(data.id());
        propulsion.setName(data.name());
        propulsion.setActivated(data.activated());
        propulsion = propulsionRepository.save(propulsion);
        return new DataPropulsionDetails(propulsion);
    }

    @Transactional
    public void disablePropulsion(Long id) {
        propulsionValidatorDisabledList.forEach(v -> v.validate(id));
        Propulsion propulsion = propulsionRepository.getReferenceById(id);
        propulsion.setActivated(false);
        propulsionRepository.save(propulsion);
    }
    
}

