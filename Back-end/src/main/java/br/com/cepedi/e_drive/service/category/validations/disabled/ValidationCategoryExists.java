package br.com.cepedi.e_drive.service.category.validations.disabled;

import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe de validação que verifica se uma categoria existe.
 * Implementa a interface {@link CategoryValidatorDisabled} para fornecer
 * uma validação específica antes de desativar uma categoria.
 */
@Component
public class ValidationCategoryExists implements CategoryValidatorDisabled {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MessageSource messageSource; // Injeção de MessageSource para internacionalização

    /**
     * Valida se a categoria existe.
     *
     * @param id ID da categoria a ser validada.
     * @throws IllegalArgumentException se a categoria não existir.
     */
    @Override
    public void validate(Long id) {
        if (!categoryRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "category.disabled.not.found_2", // Chave da mensagem
                    new Object[]{id}, // Parâmetros da mensagem
                    Locale.getDefault() // Locale padrão
            );
            throw new IllegalArgumentException(errorMessage);
        }
    }
}
