package br.com.cepedi.e_drive.service.category.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Classe de validação que verifica se uma categoria já está desativada.
 * Implementa a interface {@link CategoryValidatorDisabled} para fornecer
 * uma validação específica antes da desativação de uma categoria.
 */
@Component
public class ValidationAlreadyDisabled implements CategoryValidatorDisabled {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Valida se a categoria já está desativada.
     *
     * @param id ID da categoria a ser validada.
     * @throws IllegalArgumentException se a categoria não existir ou já estiver desativada.
     */
    @Override
    public void validate(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category does not exist."));
        if (!category.getActivated()) {
            throw new IllegalArgumentException("Category is already disabled.");
        }
    }
}
