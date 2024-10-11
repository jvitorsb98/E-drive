package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe responsável por validar se já existe uma marca com o mesmo nome durante o processo de atualização.
 * Ignora a duplicidade de nomes se for a própria marca que está sendo alterada.
 */
@Component
public class ValidationUpdateBrand_duplicate_data implements ValidationBrandUpdate {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MessageSource messageSource;

    /**
     * Valida se já existe uma marca com o mesmo nome ao tentar atualizar, excluindo a marca com o ID fornecido.
     *
     * @param id O ID da marca que está sendo atualizada.
     * @param dataUpdateBrand Os dados da marca que estão sendo atualizados.
     * @throws ValidationException Se o nome da marca já estiver cadastrado no sistema por outra marca.
     */
    @Override
    public void validation(Long id, DataUpdateBrand dataUpdateBrand) {
        // Removendo espaços no início e no fim do nome
        String trimmedName = dataUpdateBrand.name().trim();

        // Obtém o nome atual da marca a partir do repositório
        String currentName = brandRepository.getReferenceById(id).getName().trim();

        // Se o nome novo for o mesmo que o atual, não há necessidade de validação adicional
        if (!currentName.equalsIgnoreCase(trimmedName)) {
            // Verifica se já existe outra marca com o mesmo nome, ignorando a marca com o ID atual
            boolean exists = brandRepository.existsByNameIgnoreCaseAndIdNot(trimmedName, id);

            if (exists) {
                String errorMessage = messageSource.getMessage(
                        "brand.update.duplicate",
                        new Object[]{trimmedName},
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
