package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se a categoria associada ao veículo está ativada durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_Category_NotDisabled implements ValidationRegisterVehicle {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se a categoria associada ao veículo está ativada.
     *
     * @param data Dados do veículo a serem validados.
     * @throws ValidationException Se a categoria associada estiver desativada.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (categoryRepository.existsById(data.categoryId())) {
            Category category = categoryRepository.getReferenceById(data.categoryId());
            if (!category.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "vehicle.register.category.disabled",
                        null,
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
