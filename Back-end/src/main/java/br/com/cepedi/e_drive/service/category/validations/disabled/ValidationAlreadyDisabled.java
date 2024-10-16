package br.com.cepedi.e_drive.service.category.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe de validação que verifica se uma categoria já está desativada.
 * Implementa a interface {@link CategoryValidatorDisabled} para fornecer
 * uma validação específica antes da desativação de uma categoria.
 */
@Component
public class ValidationAlreadyDisabled implements CategoryValidatorDisabled {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MessageSource messageSource; // Injeção de MessageSource para internacionalização

    /**
     * Valida se a categoria já está desativada.
     *
     * @param id ID da categoria a ser validada.
     * @throws IllegalArgumentException se a categoria não existir ou já estiver desativada.
     */
    @Override
    public void validate(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = messageSource.getMessage(
                            "category.disabled.not.found", // Chave da mensagem
                            new Object[]{id}, // Parâmetros da mensagem
                            Locale.getDefault() // Locale padrão
                    );
                    return new IllegalArgumentException(errorMessage);
                });

        if (!category.getActivated()) {
            String errorMessage = messageSource.getMessage(
                    "category.disabled.already.disabled", // Chave da mensagem
                    new Object[]{id}, // Parâmetros da mensagem
                    Locale.getDefault() // Locale padrão
            );
            throw new IllegalArgumentException(errorMessage);
        }
    }
}
