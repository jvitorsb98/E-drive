package br.com.cepedi.e_drive.service.category.validations.disabled;


import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationCategoryExists implements CategoryValidatorDisabled {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void validate(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category does not exist.");
        }
    }
}

