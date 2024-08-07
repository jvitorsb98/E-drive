package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateVehicle_Propulsion_NotDisabled implements ValidationUpdateVehicle{

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Override
    public void validate(DataUpdateVehicle data) {
        if(data.propulsionId()!=null){
            if (propulsionRepository.existsById(data.modelId())) {
                Propulsion propulsion = propulsionRepository.getReferenceById(data.modelId());
                if(!propulsion.getActivated()){
                    throw new ValidationException("The provided propulsion id is disabled");
                }
            }
        }
    }
}
