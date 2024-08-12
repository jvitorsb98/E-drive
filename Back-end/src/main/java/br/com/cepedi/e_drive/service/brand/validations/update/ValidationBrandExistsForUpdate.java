package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationBrandExistsForUpdate implements ValidationBrandUpdate {

    @Autowired
    private BrandRepository brandRepository;


    @Override
    public void validation(Long id) {
        if(!brandRepository.existsById(id)){
            throw new ValidationException("The required branch does not exists");
        }
    }
}
