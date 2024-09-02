package br.com.cepedi.e_drive.service.category.validations.update;


import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationActivatedForUpdate implements CategoryValidatorUpdate {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void validate(Long id) {
        if (categoryRepository.existsById(id)) {
            Category category = categoryRepository.getReferenceById(id);
            if (!category.getActivated()) {
                throw new ValidationException("The required category is not activated.");
            }
        }
    }
}
