package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateVehicle_Model_NotDisabled implements ValidationUpdateVehicle{

    @Autowired
    private ModelRepository modelRepository;

    @Override
    public void validate(DataUpdateVehicle data) {
        if(data.modelId()!= null){
            if (modelRepository.existsById(data.modelId())) {
                Model model = modelRepository.getReferenceById(data.modelId());
                if(!model.getActivated()){
                    throw new ValidationException("The provided model id is disabled");
                }
            }
        }
    }
}
