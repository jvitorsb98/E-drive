package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ValidationRegisterVehicle_CategoryExists implements ValidationRegisterVehicle{

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void validate(DataRegisterVehicle data) {
        if(!categoryRepository.existsById(data.modelId())){
            throw new ValidationException("The provided category id does not exist");
        }
    }
}
