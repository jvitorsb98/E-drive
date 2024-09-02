package br.com.cepedi.e_drive.service.category.validations.disabled;

import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Classe de validação que verifica se uma categoria existe.
 * Implementa a interface {@link CategoryValidatorDisabled} para fornecer
 * uma validação específica antes de desativar uma categoria.
 */
@Component
public class ValidationCategoryExists implements CategoryValidatorDisabled {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Valida se a categoria existe.
     *
     * @param id ID da categoria a ser validada.
     * @throws IllegalArgumentException se a categoria não existir.
     */
    @Override
    public void validate(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category does not exist.");
        }
    }
}
