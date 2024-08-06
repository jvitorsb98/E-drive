package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationRegisterVehicle_Model_NotDisabled implements ValidationRegisterVehicle{

    @Autowired
    private ModelRepository modelRepository;

    @Override
    public void validate(DataRegisterVehicle data) {
        if (modelRepository.existsById(data.modelId())) {
            Model model = modelRepository.getReferenceById(data.modelId());
            if(!model.getActivated()){
                throw new ValidationException("The provided model id is disabled");
            }
        }
    }

}
