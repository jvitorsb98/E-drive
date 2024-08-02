package br.com.cepedi.e_drive.service.category.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationAlreadyDisabled implements CategoryValidatorDisabled {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void validate(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category does not exist."));
        if (!category.getActivated()) {
            throw new IllegalArgumentException("Category is already disabled.");
        }
    }
}

