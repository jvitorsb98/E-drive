package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ValidationRegisterVehicle_Category_NotDisabled implements ValidationRegisterVehicle{

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void validate(DataRegisterVehicle data) {
        if (categoryRepository.existsById(data.categoryId())) {
            Category category = categoryRepository.getReferenceById(data.categoryId());
            if(!category.getActivated()){
                throw new ValidationException("The provided category id is disabled");
            }
        }
    }
}
