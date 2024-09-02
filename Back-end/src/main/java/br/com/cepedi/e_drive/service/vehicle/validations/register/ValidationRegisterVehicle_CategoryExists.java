package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se a categoria associada ao veículo existe durante o registro do veículo.
 */
@Component
public class ValidationRegisterVehicle_CategoryExists implements ValidationRegisterVehicle {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Valida se a categoria associada ao veículo existe.
     *
     * @param data Dados do veículo a serem validados.
     * @throws ValidationException Se a categoria associada não existir.
     */
    @Override
    public void validate(DataRegisterVehicle data) {
        if (!categoryRepository.existsById(data.categoryId())) {
            throw new ValidationException("The provided category id does not exist.");
        }
    }
}
