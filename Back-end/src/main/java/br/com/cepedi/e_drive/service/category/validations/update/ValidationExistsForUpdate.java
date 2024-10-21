package br.com.cepedi.e_drive.service.category.validations.update;

import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe de validação que verifica se uma categoria existe antes de permitir uma atualização.
 * Implementa a interface {@link CategoryValidatorUpdate} para garantir que a lógica de validação seja aplicada
 * antes de atualizar uma categoria no sistema.
 */
@Component
public class ValidationExistsForUpdate implements CategoryValidatorUpdate {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MessageSource messageSource; // Injeção de MessageSource para internacionalização

    /**
     * Valida se a categoria com o ID fornecido existe.
     * Se a categoria não existir, lança uma {@link ValidationException}.
     *
     * @param id O ID da categoria a ser validada.
     * @throws ValidationException se a categoria não existir.
     */
    @Override
    public void validate(Long id) {
        if (!categoryRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "category.update.not.found",
                    new Object[]{id},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
