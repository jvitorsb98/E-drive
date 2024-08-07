package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateVehicle_CategoryExists implements ValidationUpdateVehicle{

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void validate(DataUpdateVehicle data) {
        if(data.categoryId()!= null){
            if(!categoryRepository.existsById(data.modelId())){
                throw new ValidationException("The provided category id does not exist");
            }
        }
    }
}
