package br.com.cepedi.e_drive.service.category.validations.update;


import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import br.com.cepedi.e_drive.repository.CategoryRepository;

@Component
public class ValidationActivatedForUpdate implements CategoryValidatorUpdate {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void validate(DataUpdateCategory dataUpdateCategory) {
        if (categoryRepository.existsById(dataUpdateCategory.id())) {
            Category category = categoryRepository.getReferenceById(dataUpdateCategory.id());
            if (!category.getActivated()) {
                throw new ValidationException("The required category is not activated.");
            }
        }
    }
}
