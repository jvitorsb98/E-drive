package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se a categoria associada ao veículo não está desativada durante a atualização do veículo.
 */
@Component
public class ValidationUpdateVehicle_Category_NotDisabled implements ValidationUpdateVehicle {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se a categoria associada ao veículo está ativada.
     *
     * @param data Dados de atualização do veículo a serem validados.
     * @throws ValidationException Se a categoria associada estiver desativada.
     */
    @Override
    public void validate(DataUpdateVehicle data, Long id) {
        if (data.categoryId() != null && categoryRepository.existsById(data.categoryId())) {
            Category category = categoryRepository.getReferenceById(data.categoryId());
            if (!category.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "vehicle.update.category.disabled",
                        null,
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
