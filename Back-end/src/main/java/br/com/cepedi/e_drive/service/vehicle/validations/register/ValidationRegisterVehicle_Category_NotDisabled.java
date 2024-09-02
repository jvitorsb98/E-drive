package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se a categoria associada ao veículo está ativada durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_Category_NotDisabled implements ValidationRegisterVehicle {

    @Autowired
    private CategoryRepository categoryRepository;

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
                throw new ValidationException("The provided category id is disabled.");
            }
        }
    }
}
