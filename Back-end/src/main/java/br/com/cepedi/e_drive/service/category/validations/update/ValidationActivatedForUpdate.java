package br.com.cepedi.e_drive.service.category.validations.update;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class ValidationActivatedForUpdate implements CategoryValidatorUpdate {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MessageSource messageSource; // Injeção de MessageSource para internacionalização

    @Override
    public void validate(Long id) {
        if (categoryRepository.existsById(id)) {
            Category category = categoryRepository.getReferenceById(id);
            if (!category.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "category.update.not.activated",
                        new Object[]{id},
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
